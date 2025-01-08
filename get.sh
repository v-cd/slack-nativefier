#!/bin/bash

REPO_ID=v-cd/slack-nativefier

sudo mkdir -p /opt/slack
sudo wget raw.githubusercontent.com/$REPO_ID/refs/heads/master/app.asar -O /opt/slack/app.asar
sudo wget raw.githubusercontent.com/$REPO_ID/refs/heads/master/slack -O /usr/bin/slack
sudo wget raw.githubusercontent.com/$REPO_ID/refs/heads/master/slack.desktop -O /usr/share/applications/slack.desktop
