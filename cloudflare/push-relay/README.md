# Wrist Assistant Push Relay

Cloudflare Worker that holds the APNs private key and relays push notifications
for the public Wrist Assistant app.

## Secrets

Set these Worker secrets before deploying:

- `APNS_P8`
- `APNS_KEY_ID`
- `APNS_TEAM_ID`
- `APNS_TOPIC`
- `RELAY_SIGNING_SECRET`

Example:

```sh
wrangler secret put APNS_P8
wrangler secret put APNS_KEY_ID
wrangler secret put APNS_TEAM_ID
wrangler secret put APNS_TOPIC
wrangler secret put RELAY_SIGNING_SECRET
```

## Routes

- `GET /healthz`
- `POST /v1/register`
- `POST /v1/push/send`

Production hostname:

- `https://push.wrist-assistant.com`

`/v1/register` returns a signed relay token scoped to the submitted
`device_token` and `environment`.

`/v1/push/send` requires that relay token and uses the stored APNs credentials
to talk to Apple directly.

## Notes

- The Worker uses Web Crypto and `fetch()` only. Do not use Node `http2`
  packages in Workers for APNs.
- Relay tokens are stateless and bound to a hash of the device token, so the
  HACS integration can cache them locally without the Worker needing a database.
