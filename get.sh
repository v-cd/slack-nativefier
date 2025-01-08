#!/bin/bash

REPO_ID=v-cd/slack-nativefier

sudo mkdir -p /opt/slack
sudo wget raw.githubusercontent.com/$REPO_ID/app.asar -O /opt/slack/app.asar
sudo wget raw.githubusercontent.com/$REPO_ID/slack -O /usr/bin/slack
sudo wget raw.githubusercontent.com/$REPO_ID/slack.desktop -O /usr/share/applications/slack.desktop
