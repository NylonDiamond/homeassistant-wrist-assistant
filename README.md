# Wrist Assistant for Home Assistant

Official Home Assistant integration for the [Wrist Assistant](https://apps.apple.com/us/app/wrist-assistant/id6759152098) Apple Watch app.

Wrist Assistant connects your Apple Watch to Home Assistant with fast setup, real-time sync, native watch notifications, and tons of other features.

<p align="center">
  <a href="https://apps.apple.com/us/app/wrist-assistant/id6759152098">
    <img src="https://raw.githubusercontent.com/NylonDiamond/homeassistant-wrist-assistant/main/images/01-overview.png" alt="Your Home on Your Wrist" width="22%">
    <img src="https://raw.githubusercontent.com/NylonDiamond/homeassistant-wrist-assistant/main/images/02-entities.png" alt="50+ Entities" width="22%">
    <img src="https://raw.githubusercontent.com/NylonDiamond/homeassistant-wrist-assistant/main/images/03-customization.png" alt="Endless Customization" width="22%">
    <img src="https://raw.githubusercontent.com/NylonDiamond/homeassistant-wrist-assistant/main/images/04-features.png" alt="Features" width="22%">
  </a>
</p>

## What it does

- Pairs your watch with Home Assistant
- Keeps your watch and Home Assistant in real-time sync with a delta protocol so the watch stays fast and responsive on cellular, Wi-Fi, or iPhone-relay
- Supports 50+ Home Assistant entity types in the app, including lights, switches, locks, covers, valves, climate, fans, scenes, scripts, media players, vacuums, lawn mowers, water heaters, humidifiers, cameras, alarm panels, remotes, timers, sirens, updates, weather, calendars, todo lists, sensors, binary sensors, buttons, numbers, selects, input helpers, counters, device trackers, zones, events, images, automations, and persons
- Shows watch-optimized camera previews, live streams, and batched multi-camera views
- Native Apple push notifications with up to 4 inline entity action buttons (lights, covers, fans, climate, locks, scenes, scripts, and more)
- Home Assistant Remote entity control with native watch button and crown mapping
- Music Assistant integration: player, queue, and provider-aware metadata
- Status pages optimized for Siri, Shortcuts, watch tiles, and Quick Actions
- Ships a bundled `Watch Notification` script blueprint for no-YAML notification automations
- Supports more than one watch in the same home

## Install

### Recommended

1. Install the Wrist Assistant iPhone app.
2. Follow the onboarding steps in the app.
3. The iPhone app installs the Home Assistant integration automatically for you.

### HACS

1. Open HACS.
2. Go to `Integrations`.
3. Search for `Wrist Assistant`.
4. Install it and restart Home Assistant.
5. Go to `Settings` -> `Devices & Services`.
6. Add the `Wrist Assistant` integration.

### Manual

1. Copy `custom_components/wrist_assistant` into your Home Assistant `custom_components` folder.
2. Restart Home Assistant.
3. Add the `Wrist Assistant` integration from `Settings` -> `Devices & Services`.

## Beta versions

Beta builds are published as GitHub pre-releases. Home Assistant hides them unless you
opt in, so nothing changes until you turn this on. Betas pair with the TestFlight beta
of the iPhone app, and some features need both.

### With HACS

HACS creates a `Pre-release` switch for each downloaded repository, and ships it
disabled so nobody lands on a beta by accident. Turning it on is a one-time job.

1. Go to `Settings` -> `Devices & Services` -> `HACS` and open its devices list.
2. Open the `Wrist Assistant` device.
3. On the Diagnostic card, click `+1 disabled entity`, then click `Pre-release`.
4. Open the settings gear and press `Enable`. Wait about 30 seconds.
5. Turn the `Pre-release` switch on.

Beta versions now appear in `Settings` -> `Updates` like any other update, with release
notes. Install one, then restart Home Assistant yourself.

Leave the switch on until the next stable release is out. If you turn it off while
running a beta, Home Assistant offers you the newest stable version, which may be older
than what you have, and presents it as an update.

### Without HACS

Download `Source code (zip)` from the newest release marked `Pre-release` on the
[releases page](https://github.com/NylonDiamond/homeassistant-wrist-assistant/releases),
replace `custom_components/wrist_assistant` with the copy from the zip, and restart
Home Assistant. There is no update notice this way.

### Going back to stable

Turn the `Pre-release` switch off after the stable release ships, then use HACS
`Redownload` and pick the stable version if you are still on a beta.

## Watch notifications

### `wrist_assistant.send_notification`

The easiest option is the bundled script blueprint called `Watch Notification`.
In Home Assistant, go to `Settings` -> `Automations & Scenes` -> `Blueprints` -> `Scripts`, then create a script from `Watch Notification`.

The blueprint is easier to set up in the UI and lets you choose a watch, title, message, up to 4 entity buttons, custom labels, sound, priority, and auto-dismiss behavior.

If you want to call the service directly, use `wrist_assistant.send_notification` to send a message to one or all paired watches using Apple notifications.

`target` accepts a watch `device_id` (copy it from the device page under `Settings` -> `Devices & Services` -> `Wrist Assistant`). Omit `target` to broadcast to every paired watch.

If you see `No registered push token for watch ...`, the watch app has not re-registered for notifications yet. Open Wrist Assistant on the Apple Watch and let it fully sync once, then try the notification again.

If it still fails:

1. On the watch, verify `Settings` -> `Notifications` -> `Wrist Assistant` is enabled.
2. Reopen Wrist Assistant on the watch and pull to refresh if needed.
3. Retry the notification after the watch reconnects.
4. If it still will not register, re-pair the watch or reinstall the watch app.

```yaml
service: wrist_assistant.send_notification
data:
  target: "" # leave empty to send to all watches, or paste a watch device_id
  title: "Front Door Alert"
  message: "Motion detected at the front door."

  # Optional camera snapshot shown in the notification
  image: "camera.front_door"
  snapshot_width: 720 # optional, 256-1024 (default 1024); smaller loads faster
  snapshot_quality: 75 # optional, 40-90 (default 80)

  sound: "Doorbell-Single.caf"
  push_type: "alert"
  tag: ""
  group: ""
  priority: "time-sensitive"

  data:
    subtitle: "Security"
    entity_state: "Motion detected"
    show_state: true
    auto_dismiss: false

  actions:
    - entity_id: "light.porch"
      label: "Porch"
      icon: "lightbulb.fill"

    - entity_id: "lock.front_door"
      label: "Lock"
      icon: "lock.fill"

    - entity_id: "cover.garage_door"
      label: "Garage"
      icon: "door.garage.open"

    - entity_id: "alarm_control_panel.home"
      label: "Alarm"
      icon: "shield.fill"
```

## Need help?

- Wrist Assistant site: <https://wrist-assistant.com/>
- Wrist Assistant docs: <https://docs.wrist-assistant.com/>
- Community Discord: <https://discord.gg/6zmNK2jA5P>
- Open an issue: <https://github.com/NylonDiamond/homeassistant-wrist-assistant/issues>

## License

MIT
