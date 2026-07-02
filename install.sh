#!/bin/bash

sudo mkdir -p /opt/slack
sudo cp ./slack /usr/bin/slack
sudo cp ./app.asar /opt/slack/app.asar
sudo cp ./slack.desktop /usr/share/applications/slack.desktop
sudo chmod +x /usr/bin/slack
