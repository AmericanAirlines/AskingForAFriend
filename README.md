[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![](https://github.com/AmericanAirlines/AskingForAFriend/workflows/Build/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/AmericanAirlines/AskingForAFriend/branch/main/graph/badge.svg)](https://codecov.io/gh/AmericanAirlines/AskingForAFriend)

# Asking for a Friend
Helping our Slack community ask questions without fear of being judged

![Screenshot](/assets/AppScreenshot.png)

Once installed in your workspace, try it out by clicking the lightning bolt at the bottom left of the text box in Slack and clicking `Ask question anonymously` in the list of shortcuts.

After asking your question, it will appear like this:
![Screenshot](/assets/PostScreenshot.png)

## Development
### Environment Variables
Project environment variables should first be defined in `.env.sample` without real values for their data (that file is tracked by git). After cloning, make sure to duplicate `.env.sample` as `.env` and then fill in all required variables using the details provided in the section below.

### Dependencies
This project is reliant on the installation of the following dependencies:
- [Node (LTS)](https://nodejs.org/en/download/) (v18.0+)

After downloading the dependencies above, install all dependencies by running `yarn`.

### Create a Slack App
Before being able to run the app locally, you'll need to create a Slack app and configure it with the appropriate permissions:
- Create an app on the [Slack API Site](https://api.slack.com/apps)
- Use the following manifest and update with your local or cloud URL:
  
```yaml
display_information:
  name: Asking for a Friend
  description: Helping our community ask questions without fear of being judged
  background_color: "#004492"
features:
  bot_user:
    display_name: Asking for a Friend
    always_online: true
  shortcuts:
    - name: Ask question anonymously
      type: global
      callback_id: postAnonymousQuestion
      description: Posts an anonymous question in the current channel
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
      - commands
      - channels:read
settings:
  interactivity:
    is_enabled: true
    request_url: https://[YOUR-APP-URL]/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false

```

### Starting the App
The best way to start the app and work on it is by using `yarn dev`, which will start the app and then restart the app whenever a TypeScript file changes. After modifying a non-Typescript file, restart the app by typing `rs` into the same terminal you ran `yarn dev` from and then hitting return.

After the app starts, it will be accessible on `localhost:3000` (unless the port was modified via `.env`).

# Contributing
Interested in contributing to the project? Check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).
