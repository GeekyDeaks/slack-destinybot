# Destiny SlackBot

Simple SlackBot to pull stats and info from the Bungie API

## Installation

1. Install [node.js](https://nodejs.org/en/download/)
2. Clone this repo

        $ git clone https://github.com/GeekyDeaks/slack-destinybot.git

4. Download the required node modules from NPM

        $ cd slack-destinyboy
        $ npm install

5. Create the config.js

        $ cp config.js.template config.js

6. Get your bungie APIKEY from 
    [https://www.bungie.net/en/User/API](https://www.bungie.net/en/User/API)
    and save it under `config.modules.destiny.apikey`

7. Create a bot in the slack team and copy the token to `config.slack.token`

8. Start the bot

        node destinybot.js
