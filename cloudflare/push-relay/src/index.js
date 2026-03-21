const textEncoder = new TextEncoder();

const DEFAULT_RELAY_TTL_SECONDS = 60 * 60 * 24 * 365;
const APNS_TOKEN_REFRESH_SECONDS = 60 * 45;
const INTERRUPTIONS = new Set(["passive", "active", "time-sensitive", "critical"]);

let cachedApnsToken = null;
let cachedApnsTokenExpiresAt = 0;
let cachedApnsKey = null;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/healthz") {
        return json({ status: "ok" });
      }

      if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405);
      }

      const payload = await parseJson(request);
      if (!payload) {
        return json({ error: "invalid_json" }, 400);
      }

      if (url.pathname === "/v1/register") {
        return handleRegister(payload, env);
      }

      if (url.pathname === "/v1/push/send") {
        return handleSend(payload, env);
      }

      return json({ error: "not_found" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      return json({ error: "server_error", message }, 500);
    }
  },
};

async function handleRegister(payload, env) {
  const deviceToken = asNonEmptyString(payload.device_token);
  if (!deviceToken) {
    return json({ error: "device_token_required" }, 400);
  }

  const watchId = asOptionalString(payload.watch_id) ?? "unknown";
  const environment = normalizeEnvironment(payload.environment);
  const now = Math.floor(Date.now() / 1000);
  const relayToken = await signRelayToken(
    {
      watch_id: watchId,
      token_sha256: await sha256Base64Url(deviceToken),
      environment,
      iat: now,
      exp: now + DEFAULT_RELAY_TTL_SECONDS,
    },
    env.RELAY_SIGNING_SECRET,
  );

  return json({
    relay_token: relayToken,
    environment,
    expires_in: DEFAULT_RELAY_TTL_SECONDS,
  });
}

async function handleSend(payload, env) {
  const relayToken = asNonEmptyString(payload.relay_token);
  const deviceToken = asNonEmptyString(payload.device_token);
  if (!relayToken || !deviceToken) {
    return json({ error: "relay_token_and_device_token_required" }, 400);
  }

  const relayClaims = await verifyRelayToken(relayToken, env.RELAY_SIGNING_SECRET);
  if (!relayClaims) {
    return json({ error: "invalid_relay_token" }, 401);
  }

  const tokenHash = await sha256Base64Url(deviceToken);
  if (relayClaims.token_sha256 !== tokenHash) {
    return json({ error: "device_token_mismatch" }, 401);
  }

  const notification = buildNotificationPayload(payload);
  const environment = normalizeEnvironment(relayClaims.environment);
  const authorization = await getApnsAuthorizationToken(env);

  const primary = await sendApnsRequest({
    env,
    deviceToken,
    environment,
    authorization,
    notification,
  });
  if (primary.ok) {
    return json(primary);
  }

  if (primary.reason === "BadDeviceToken") {
    const alternateEnvironment = environment === "development" ? "production" : "development";
    const fallback = await sendApnsRequest({
      env,
      deviceToken,
      environment: alternateEnvironment,
      authorization,
      notification,
    });
    if (fallback.ok) {
      return json({
        ...fallback,
        used_environment: alternateEnvironment,
      });
    }
  }

  return json(primary, primary.status_code ?? 502);
}

async function sendApnsRequest({ env, deviceToken, environment, authorization, notification }) {
  const host =
    environment === "development"
      ? "https://api.sandbox.push.apple.com"
      : "https://api.push.apple.com";
  const url = `${host}/3/device/${deviceToken}`;
  const response = await fetch(url, {
    method: "POST",
    headers: buildApnsHeaders(env, authorization, notification.headers),
    body: JSON.stringify(notification.body),
  });

  if (response.ok) {
    return {
      ok: true,
      reason: null,
      used_environment: environment,
    };
  }

  let reason = `HTTP ${response.status}`;
  try {
    const jsonBody = await response.json();
    if (typeof jsonBody?.reason === "string" && jsonBody.reason) {
      reason = jsonBody.reason;
    }
  } catch {
    // Keep fallback HTTP message.
  }

  return {
    ok: false,
    reason,
    used_environment: environment,
    status_code: response.status,
  };
}

function buildApnsHeaders(env, authorization, notificationHeaders) {
  const headers = new Headers({
    authorization: `Bearer ${authorization}`,
    "content-type": "application/json;charset=UTF-8",
    "apns-topic": env.APNS_TOPIC,
    "apns-push-type": notificationHeaders.pushType,
  });

  if (notificationHeaders.collapseId) {
    headers.set("apns-collapse-id", notificationHeaders.collapseId);
  }

  return headers;
}

function buildNotificationPayload(payload) {
  const title = asOptionalString(payload.title);
  const body = asOptionalString(payload.body ?? payload.message);
  const category = asOptionalString(payload.category);
  const sound = asOptionalString(payload.sound);
  const pushType = payload.push_type === "background" ? "background" : "alert";
  const extraData = isRecord(payload.data) ? { ...payload.data } : {};

  let alert = undefined;
  if (title || body) {
    alert = {};
    if (title) {
      alert.title = title;
    }
    if (body) {
      alert.body = body;
    }
  }

  const aps = {};
  if (alert) {
    aps.alert = alert;
  }
  if (sound) {
    aps.sound = sound;
  }
  if (category) {
    aps.category = category;
  }
  if (pushType === "background") {
    aps["content-available"] = 1;
  }

  const group = asOptionalString(extraData.group);
  if (group) {
    aps["thread-id"] = group;
  }
  delete extraData.group;

  let collapseId = asOptionalString(extraData.tag);
  delete extraData.tag;

  const priority = asOptionalString(extraData.priority);
  if (priority && INTERRUPTIONS.has(priority)) {
    aps["interruption-level"] = priority;
  }
  delete extraData.priority;

  const message = { aps };
  for (const [key, value] of Object.entries(extraData)) {
    message[key] = value;
  }

  if (!collapseId && category && pushType === "background") {
    collapseId = category;
  }

  return {
    body: message,
    headers: {
      collapseId,
      pushType,
    },
  };
}

async function getApnsAuthorizationToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedApnsToken && now < cachedApnsTokenExpiresAt) {
    return cachedApnsToken;
  }

  const header = {
    alg: "ES256",
    kid: env.APNS_KEY_ID,
    typ: "JWT",
  };
  const payload = {
    iss: env.APNS_TEAM_ID,
    iat: now,
  };
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const key = await importApnsKey(env.APNS_P8);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } },
    key,
    textEncoder.encode(signingInput),
  );
  cachedApnsToken = `${signingInput}.${arrayBufferToBase64Url(signature)}`;
  cachedApnsTokenExpiresAt = now + APNS_TOKEN_REFRESH_SECONDS;
  return cachedApnsToken;
}

async function importApnsKey(pem) {
  if (cachedApnsKey) {
    return cachedApnsKey;
  }

  cachedApnsKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToBinary(pem),
    { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );
  return cachedApnsKey;
}

async function signRelayToken(claims, secret) {
  const payload = base64UrlJson(claims);
  const signature = await signHmac(payload, secret);
  return `${payload}.${signature}`;
}

async function verifyRelayToken(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payload, signature] = parts;
  const expected = await signHmac(payload, secret);
  if (!timingSafeEqual(signature, expected)) {
    return null;
  }

  let claims;
  try {
    claims = JSON.parse(base64UrlToText(payload));
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp <= now) {
    return null;
  }

  return claims;
}

async function signHmac(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(message));
  return arrayBufferToBase64Url(signature);
}

async function sha256Base64Url(text) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(text));
  return arrayBufferToBase64Url(digest);
}

function normalizeEnvironment(value) {
  return value === "development" ? "development" : "production";
}

function asOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNonEmptyString(value) {
  return asOptionalString(value);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

function base64UrlJson(value) {
  return textToBase64Url(JSON.stringify(value));
}

function textToBase64Url(text) {
  const bytes = textEncoder.encode(text);
  return arrayBufferToBase64Url(bytes.buffer);
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToText(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

function pemToBinary(pem) {
  const base64 = pem.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}
