const {
  app,
  shell,
  nativeImage,
  Menu,
  Tray,
  BrowserWindow,
} = require("electron");
const path = require("path");

let tray;
let win;
let showingUnreadTrayIcon = false;

const browserUserAgent = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

// tray icon
const trayIcon = nativeImage.createFromDataURL(
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACBCAMAAADQfiliAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAZVQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4EeKHgAAAId0Uk5TACNos+P599ulVAXqwXwVlv/dThzEiAwBahi2/vqSCmH1CJxxAjnyUfbkLQnLvI92NPDW1WY4jFWYY5pkbkAT0W8RwyzgMtgX+CZst+f9lHlHGQtn/IBfvfFdENIHKgbfL/TagexLXkTmta5PIPOsdAPMqSi/H+6X0DUEKbreW0jpspM/jsXOx5gbYAAABmRJREFUeJztm3tsFEUcx2e292jv2rumBHpX9JqWYsUjSkyphXJFKE1bqtQ2QsCkphJSYoLRqPxDjSSQaIIv4iNGjQIVxWgVgWitChV5VSQGH9SiFW2hlmJs6OP6sMeNe8/uzszO7tK7W032+8fc7u+3u/e5u935/eY3cxBoLag1gE6gE+gEOoFOoBNMhwBGNYp5LCggE4QjKI4ENjhmiaIMiFwZKPLGoyloKF4EM6BPsGeEV6LbmXBc4DGgv+ND4ITQK9hNhbAnsp0Nrwo8VoT64kGQAye8IoPXBbtCW3MFX0cQwYx+jwNBPryMWZywI/jqhpcwjwOdjz2By36RtPX3822mo5vw3DjYQ9imS7AAkl9sbl/g93Zm/UZ4ctDZmBMUdJE2R9q3fLtwGP95eOWdiTlB4S8UY/43fHMH7Te/6XTMCYo6KcZ5p/hm0c8Uzy0nY05A/Q7cJ/im+BzFk3Eh5gRLftKawNNu1ZigBH6vMQG481cvYUsswTL4ncYEoBQSvUyCCUAZxLuZRBOA8mFbu7YEAFQGUsRjWhLQpBPoBPEicGUYOAMl8QlrPv887FdBUHthzkXO7/cNUHNHCkGOyWSQSbZXDNmPR4cEMgTLZkL4WfC6vvnwXSUEzhST9MefUtWZhXuVEJSi89GI5mmreVueYIYZkjGQpvTb7E3yBGVIFEyq4W45ApvJrAwAgJrxI/1yBOUICyW5XfiwFiewq3g4anchOYLFHbgDDbIJoNECFMta8aYMQSVqxx2jk1h9ASPgbMoB+GG6pYdNsJKSsw/5mQRJaWoI7j3ZwSaoOkF6hq8xCQypagjA6jfYBHcdJz0jPvE+RmCkpOQM2bvZBHcfIz3eSSaBScWNyGvN63zT8D7FU3Iw0KZTPKP/MAnMKWoAPFmv8e3GPymfdOkBKYKxCSZBcrIagrXdLXxbmf0e4Vnh+1iKYHxcvI8RpJjVEKzbE6gqWurJeFNo3S9FMDHGJLCYVdQjvQ2vBF83QSLelH0AJAjgBFYLxTvhDKy/YOn+Q+Eg/vAezFN1pE+KgBvADEQYmGkeUQjgzDoc3noE7hJ50s3hsgpJsP553EIQzDJfVtYnOP+YHS0tPfaVsJhVM5C2V4JgwztErZMMhS6jSUFF1PvguW5BbWvzxKsRbmv5mLEJUAka4KmviStRgnGeyWAYZaZJntmQ+1ScyOWs9KNevl+os/711qz+iFVI4LD4quBT5MWo6UAmdwPHcZIAbthzFC/u84/RUhdqTU6xCT9lcXTL7/df8vcTJ0kRJFQ6wX+WALsThYmOK7X483LJO5GWKYSk7k50Gwxe4dM4NX+ype3Htc2Bp5HjXsZO2uT391Ki9JQcVp+PRkghmGvGJiyiBI1wV2QwUcfBnYJD8qr85GiI0ENwmwKCzGTzFcwUIdgqetMHuOei2+41L8i/f0CPNhGTBASBI/kqbgobtnc3i8xzlj8T3sqrUwgAwONPyBHQonOIwLn8E8wuHZ0ZkovO1AwlRLD6C9zOyFCkJZehULO0IEGNl5w1kc7SGJLJ0qiZapDgHsOXhEM6U2VIJlOlZutBguqjpIORrUtLJlunjliCBKvI3II1YpGWzIiFNmrzHAq0ufg9HFCwqpuNVwTYkhm1WY3kKQ072AT51O5eUpNYjQYjSDWQp2xuZBMs8Kh4GAHwYbk4RpCWRJ4SGn1IE5RU7FBDcG2YSUCp4hTBFjYBWNSjtPgF5Ks4lEpWePaUQbCFCNUMyVWyyGpeIWyVIwCNxp0UJ1Xy1Ty8olkAw+GARQC29jZTvBQpqGiKq7rWfBgZGzIJwPZOPHDSpKyqK6hsexdD2BaxsgmAc8mgjQwc4usqrWyDUHWf85sgFPTEMgR88EQI0WbHQ3L4VFT36ZIluF7pBDpBjAgEVV3PPPvZkRYtCQIqGkpr1ZaADyWISOwTTAAK0GHKwYkkALejNvLghBJYi5Xnz/EhAOWTH2lMUNEZ+9WB6ghA6YdaE8RhdSA5ewpYqwNvJqY6p02g/QpJ7VeJar9SVvvVwmDdCF6oaEh6Ovjqrn0J83hS9ym+rnKC+w7i4+qNSeEJiydfxDy+VcpLSyoq23XcAdH+htPRZH6beP6qWkmB9ToIQP0PwkVG6/dNTUfl1T8r8OTeulvFVf9f/6AA2v+LJC7SCXQCnUAn0Al0Ap1ArH8BaXRIoN7I2R8AAAAASUVORK5CYII=",
);

function iconWithUnreadDot(icon) {
  const size = 32;
  const bitmap = Buffer.from(icon.resize({ width: size, height: size }).toBitmap());

  function paintCircle(centerX, centerY, radius, color) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const distanceX = x - centerX;
        const distanceY = y - centerY;

        if (distanceX * distanceX + distanceY * distanceY > radius * radius) {
          continue;
        }

        const offset = (y * size + x) * 4;
        bitmap[offset] = color[0];
        bitmap[offset + 1] = color[1];
        bitmap[offset + 2] = color[2];
        bitmap[offset + 3] = color[3];
      }
    }
  }

  paintCircle(24, 8, 7, [0x5a, 0x1e, 0xe0, 0xff]);
  paintCircle(24, 8, 3.5, [0xff, 0xff, 0xff, 0xff]);

  return nativeImage.createFromBitmap(bitmap, {
    width: size,
    height: size,
    scaleFactor: 1,
  });
}

const unreadTrayIcon = iconWithUnreadDot(trayIcon);

function hasUnreadMessages(title) {
  return /^\s*(?:\(\d+\)|\u2022)/.test(title);
}

function updateTrayUnreadState(hasUnread) {
  if (!tray || hasUnread === showingUnreadTrayIcon) {
    return;
  }

  showingUnreadTrayIcon = hasUnread;
  tray.setImage(hasUnread ? unreadTrayIcon : trayIcon);
  tray.setToolTip(hasUnread ? "Slack Desktop - unread messages" : "Slack Desktop");
}

// tray menu options
const contextMenu = Menu.buildFromTemplate([
  {
    label: "Quit",
    click: function () {
      app.isQuiting = true;
      app.quit();
    },
  },
]);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    autoHideMenuBar: true,
  });

  // load slack
  win.loadURL("https://crustdata.slack.com", {
    userAgent: browserUserAgent,
  });

  // FUCK the menubar
  win.removeMenu();

  // minimize to taskbar
  win.on("minimize", function (event) {
    event.preventDefault();
    win.hide();
  });

  win.on("close", function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });

  // tray
  tray = new Tray(trayIcon);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Slack Desktop");
  tray.setTitle("Slack");

  tray.on("click", function (event) {
    win.show();
  });

  win.webContents.on("page-title-updated", function (event, title) {
    updateTrayUnreadState(hasUnreadMessages(title));
  });

  win.webContents.on("did-finish-load", function () {
    updateTrayUnreadState(hasUnreadMessages(win.webContents.getTitle()));
  });

  // open links in browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.on("ready", createWindow);
