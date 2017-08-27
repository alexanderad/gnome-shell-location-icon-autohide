/*
* Location Icon Autohide
* Shows Location icon only if Location services are enabled.
* Source: https://github.com/alexanderad/gnome-shell-location-icon-autohide
* Additional docs on Location API: https://github.com/GNOME/gnome-shell/blob/master/js/ui/status/location.js
*/
"use strict";

const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;

const LOGGING_ENABLED = true;
const LOCATION_SETTINGS_SCHEMA_ID = "org.gnome.system.location";
const LOCATION_SETTINGS_CHANGED_SIGNAL = "changed::enabled";

let extension;

const LocationIconAutohideExtension = new Lang.Class({
  Name: "LocationIconAutohideExtension",

  _init: function(metadata, params) {
    // load settings
    this._locationIndicator =
      Main.panel.statusArea.aggregateMenu._location.indicators;
    this._locationSettings = new Gio.Settings({
      schema_id: LOCATION_SETTINGS_SCHEMA_ID
    });

    // connect to settings change signal
    this._locationSettingsChangedTriggerID = this._locationSettings.connect(
      LOCATION_SETTINGS_CHANGED_SIGNAL,
      Lang.bind(this, this._triggerLocationSettingsChanged)
    );

    // trigger manually upon initialization
    this._triggerLocationSettingsChanged();

    this._log("extension enabled");
  },

  _log: function(message) {
    if (LOGGING_ENABLED) {
      global.log("[Location Icon Autohide] " + message);
    }
  },

  _hideLocationIcon: function() {
    if (this._locationIndicator.visible) {
      this._locationIndicator.hide();
    }
  },

  _showLocationIcon: function() {
    if (!this._locationIndicator.visible) this._locationIndicator.show();
  },

  _triggerLocationSettingsChanged: function(proxy, sender) {
    if (this._locationSettings.get_boolean("enabled")) {
      this._showLocationIcon();
    } else {
      this._hideLocationIcon();
    }
  },

  destroy: function() {
    // disconnect from signals
    this._locationSettings.disconnect(this._locationSettingsChangedTriggerID);

    // restore default behavior
    this._showLocationIcon();

    this._log("extension disabled");
  }
});

function init(meta) {}

function enable() {
  extension = new LocationIconAutohideExtension();
}

function disable() {
  extension.destroy();
  extension = null;
}
