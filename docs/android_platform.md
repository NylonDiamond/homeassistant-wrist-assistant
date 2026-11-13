# Android phones and Wear OS watches

The integration and the panel know four device platforms: `ios`, `watchos`,
`android` and `wearos` (`custom_components/wrist_assistant/device_platform.py`,
`frontend/src/device-platform.ts`).

## The field

- A device's `kind` is unchanged. An Android phone pairs as the `iphone` kind
  and a Wear OS watch as the `watch` kind, so every rule keyed on the kind
  (phone pages, owned kinds, `not_for_iphone`, `not_an_iphone`) works as it is.
- `platform` is a second, optional field on `pair/start`, `pair/redeem`,
  `register_secret` and `update_metadata`. Absent means the kind's Apple
  platform, which is what every Apple app sends: nothing.
- Pairing refuses a platform that is not one of the four, or not the kind's
  (400, `invalid_platform`). `update_metadata` ignores such a value and keeps
  the stored one, as it ignores a field over the length cap.
- The secret store keeps `platform` only once a device said it, so an Apple
  device's entry is written exactly as before.
- The owners reply (`wrist_assistant/complications/owners`) carries
  `platform` on every device row (the resolved one, `ios` or `watchos` for an
  Apple device) and null on the Library and orphans. `pair/lookup` and
  `pair/offer_status` carry it too. `update_metadata` echoes it only to a
  device that said one.

## Names

| Platform | Registry model | Name before the app reports one |
| --- | --- | --- |
| `ios` | iPhone | iPhone 1a2b3c4d |
| `watchos` | Apple Watch | Watch 1a2b3c4d |
| `android` | Android phone | Android phone 1a2b3c4d |
| `wearos` | Wear OS watch | Wear OS watch 1a2b3c4d |

The Watch count and Phone count sensors count both models of their kind. The
`send_notification` target selector and the Watch Notification blueprint list
all four models.

## Push

- `notifications_register` takes `android` from a phone and `wearos` from a
  watch, filed under the signer's own id. The other device family's platform
  is refused (400). FCM has no sandbox, so the environment is always
  `production`.
- A token on the delta poll (`device_token`) is filed as `wearos` for a Wear
  OS watch and `watchos` for every other watch.
- Routing (`notifications.resolve_push_routes`) keeps the Apple rules and adds
  the Android family beside them. A watch's alert is mirrored through the
  phones of its user of the same family (`mirror_platform`): an Apple Watch
  through an iPhone's `ios` token, a Wear OS watch through an Android phone's
  `android` token. Never across: an iPhone cannot bridge to a Wear watch.
  `direct` uses the watch's own `watchos` or `wearos` token. A background
  push goes to a watch's own token of either platform.
- `pro_open_on_phone` from a Wear OS watch reaches the user's Android phones.
- The relay token is bound with the token's platform on `/v1/register`, which
  is how the relay picks APNs or FCM. An FCM send also names `platform` in
  the `/v1/push/send` body. An Apple send's body is unchanged.
- No sound is forced on an FCM push. The `sound: "default"` rule stays for an
  iPhone's mirrored alert only.
- `ComplicationPhonePush` sends an Android phone's background push to its own
  `android` token.

## Panel

- Nouns come from the platform: "iPhone" for an iPhone, "phone" for an
  Android phone, "watch" for either watch (`deviceNoun`, `nounFor`). Copy that
  is about no device in particular says "phone" and "watch".
- Version gates read `gateVersion(owner)`: an Apple device's own version, and
  `ANDROID_FEATURE_VERSION` (the Apple release whose features the Android apps
  draw) for an Android device. Raise it when the Android apps catch up with a
  later release.
- A square `screen_size` (dp) is a round Wear OS watch: the nearest of
  `WEAR_CASES` stands in, and its screen carries `round`, which draws the case
  round. An Android phone is drawn as a generic Android phone
  (`ANDROID_PHONE_MODELS`, punch hole camera, no Dynamic Island).
- The settings catalog's `devices` gains `wearos` beside `watch` on every
  watch row but the double pinch, and `android` beside `iphone` on every
  phone row but the Page look. `wearLabel` and `wearHelp` give the crown's row
  its rotary words.
- The welcome and Help link Google Play beside the App Store.
