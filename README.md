# Wrist Assistant for Home Assistant

Official Home Assistant integration for the [Wrist Assistant](https://apps.apple.com/us/search?term=Wrist%20Assistant) Apple Watch app.

Wrist Assistant connects your Apple Watch to Home Assistant with fast setup, real-time sync, and watch notifications.

## What it does

- Pairs your watch with Home Assistant
- Keeps your watch and Home Assistant in real-time sync
- Uses efficient updates so the watch stays fast and responsive
- Supports 45+ Home Assistant entity types in the app
- Shows watch-optimized camera previews and live views
- Supports more than one watch in the same home
- Sends notifications to your watch through Apple notifications

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

## Main features

- Real-time sync between Home Assistant and your Apple Watch
- Fast watch updates designed to stay lightweight and efficient
- Camera previews and live camera views built for the watch
- Apple Watch notifications sent from Home Assistant

## Watch notifications

### `wrist_assistant.send_notification`

A notification blueprint is included under `Scripts`. It lets you choose a watch, title, message, up to 4 entity buttons, custom labels, sound, priority, and auto-dismiss behavior.

If you want to call the service directly, use `wrist_assistant.send_notification` to send a message to one or all paired watches using Apple notifications.

```yaml
service: wrist_assistant.send_notification
data:
  title: "Door Alert"
  message: "Front door was opened"
```

You can also target a specific watch:

```yaml
service: wrist_assistant.send_notification
data:
  title: "Garage"
  message: "Garage door is open"
  target: "my-watch-id"
```

## Need help?

- Open an issue: <https://github.com/NylonDiamond/homeassistant-wrist-assistant/issues>

## License

MIT
