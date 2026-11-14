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
  `paired_platforms` beside the rows: the platforms of every paired device,
  sorted, whoever asks. It also carries
  `platform` on every device row (the resolved one, `ios` or `watchos` for an
  Apple device) and null on the Library and orphans. `pair/lookup` and
  `pair/offer_status` carry it too. `update_metadata` echoes it only to a
  device that said one.

## Capability and replies

- `/version` and every delta reply list the capability `device_platforms`
  once the integration knows the four platforms. The Android apps look for
  it before they register a push token; an Apple app never reads it.
- `stored_metadata` on a delta reply carries `platform` for a device that
  said one. An Android app that sees `device_platforms` and no `platform`
  there reports again through `update_metadata`, as for a version that fell
  behind. An Apple device's `stored_metadata` is unchanged.
- `phone_pages_offer` gives each watch row its `platform` (`watchos` or
  `wearos`), so an Android phone can tell an Apple Watch from a Wear OS
  watch. The iPhone app reads the row by key and skips it.
- A device's diagnostics download says `platform` for a device that said one.
- Refusals that name a phone (`not_an_iphone`, `invalid_watch`,
  `no_pages_record`, the QR redeem's `not_an_iphone`, `unbound_needs_replace`
  and `bound_to_other_user`) say "phone" to an Android phone or a Wear OS
  watch and "iPhone" to an Apple device, as before. The codes are unchanged.
  A QR code is for any phone, so its own refusals are general copy: "iPhone"
  while every paired device is an Apple one, "phone" once an Android device
  is paired.
- `watch_logs_put`, `client_certificate_get`, `addresses_get`,
  `addresses_set`, `verify_identity`, `phone_pages_offer` and
  `phone_pages_link_watch` read only the signer's id, its kind and its user,
  so they work for an Android device as they are.
- `client_certificate_put` and `_delete` work from an Android device too, and
  file the record under the source `android` (the iPhone's stays `iphone`).
  It is a phone's path like the iPhone's: once the panel has written the
  user's record, neither changes it. The panel's status reply carries the
  source and names it "From the Android app".

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
- `pro_open_on_phone` from a Wear OS watch reaches the user's Android phones
  over FCM, with `wa_open_pro` in the data (`PushMessage.OPEN_PRO_KEY` in the
  Android app). Pro is bought in each store, so an Apple Watch still asks
  only the user's iPhones, and a Wear watch whose user has only an iPhone is
  told `no_phone`.
- The relay token is bound with the token's platform on `/v1/register`, which
  is how the relay picks APNs or FCM. An FCM send also names `platform` in
  the `/v1/push/send` body. An Apple send's body is unchanged.
- No sound is forced on an FCM push. The `sound: "default"` rule stays for an
  iPhone's mirrored alert only.
- `ComplicationPhonePush` sends an Android phone's background push to its own
  `android` token.

## Home map and photo icons

Every op reads the signer's kind and user, never its platform, so the
Android apps use them as the Apple apps do (the in-process tests sign as an
Android phone and a Wear OS watch in `test_home_map_ops.py`,
`test_home_map_page_add.py` and `test_page_images_ops.py`):

- `home_map_get` and `areas_get` answer any paired device alike.
- `home_map_put` takes a phone's save (Place Devices on an Android phone),
  with the same conflict on a stale `base_rev`; a Wear OS watch hears
  `not_an_iphone` with "Only a phone saves the home map." Android has no room
  scan, so its saves name no `scanned` room.
- `home_map_page_add` adds the panel's map page to an Android phone's own
  pages, once however often it asks, and refuses a Wear OS watch.
- `page_image_put` with `edit`, `page_image_list`, `page_image_edit_get` and
  `page_image_replace` take an Android phone's icon photos and edit packs
  under the same contract (`WAED` first, at most 1 MiB), and replace moves the
  tiles of every owner bound to the phone's user, its Wear OS watch's too.
- `home_map_rev` rides a Wear OS watch's delta replies, lean ones too, and a
  save wakes its parked poll, beside `stored_metadata` with its platform.

## Panel

- Nouns come from the platform: "iPhone" for an iPhone, "phone" for an
  Android phone, "watch" for either watch (`deviceNoun`, `nounFor`).
- **General copy follows the home.** Copy about no device in particular (the
  pair choices, "Scan with the iPhone", "No iPhone yet", the help sheet, the
  phone only tiles, iPhone extras, the shared screens' blurbs and the rest)
  keeps the Apple words it always had while every device paired to this Home
  Assistant is an Apple one, and says "phone" and "watch" once an Android
  phone or a Wear OS watch is paired. Each line reads `generalCopy(apple,
  phoneAndWatch)` (`device-platform.ts`), which follows one home level
  switch: `fetchOwners` notes every owners reply (`noteHomeDevices`), whose
  `paired_platforms` lists the platforms of every paired device whoever asks
  (a person who is not an administrator gets only their own rows), and from
  an integration without that field the rows say (`homeHasAndroid`). Google
  Play beside the App Store (the welcome, Help) follows the same switch. The
  integration's own general words do the same (`general_words` in
  `device_platform.py`): the notification target errors and the QR code's
  person refusals. `frontend/test/general-copy.test.ts` holds the Apple side
  to main's words byte for byte (`test/fixtures-general-copy`). The texts
  Home Assistant shows from files (the config flow, `services.yaml`, the
  blueprint) cannot follow a switch and keep the Apple words; their device
  selectors list the Android models.
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
- A line about the device on show names it by its platform: the page editor's
  views, stage and screen lines (`phonePlatform`), a design's sync words
  (`sendState`'s `platform`), Home's lines, the lineup, the boards, the
  addresses, rooms, status pages, the new device and rejected save lines,
  and the pairing refusals. Each keeps its Apple words for an Apple device.
- Apple only features say so: Siri is "on Apple devices", a Control Center
  control is a Quick Settings tile on an Android phone, the Lock Screen and
  the iPhone app's old presets stay iPhone words, and an Android device is
  never told about presets. A Wear OS watch's rooms leave out the double
  pinch, and its speak and assist choices say the watch, not an Apple Watch
  (`wearWords`). The hold time row has its own Android line (`androidHelp`).
- A panel open on an Android phone offers "Pair this phone instead" beside
  the QR code, as an iPhone's offers "Pair this iPhone instead".
- The tap menu's phone caveat on an Android phone names only the room page,
  since its widgets open a page or an entity themselves ("On a phone this
  only opens the app"). Refresh now on an Android phone has no iOS in it
  (`refreshNowTitle`).
- A Wear OS watch's "How alerts arrive" row says Fast comes through the
  phone and Reliable straight to the watch (`WEAR_DELIVERY_HELP`,
  `WEAR_DELIVERY_DETAILS`); the key table keeps the Apple words, which the
  Apple app reads.
- The phone extras' help, the web card's help and the camera play hints say
  "the phone" on an Android device's editor (`phoneWordsFor`).
- A full Android device is never told the iPhone app's presets count too.
- Left as Apple words on purpose: the home map's scans (RoomPlan is Apple
  only), the iPhone app's old presets and the one-time move from an iPhone,
  the Lock Screen and iOS widget sizes, watchOS redraw budgets, the HTTP
  action and status page lists only the iPhone app writes (`catalog`), and
  the update gates, which an Android device never meets
  (`ANDROID_FEATURE_VERSION`).
