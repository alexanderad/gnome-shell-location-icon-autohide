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

const LOGGING_ENABLED = false;
const LOCATION_SETTINGS_SCHEMA_ID = "org.gnome.system.location";
const LOCATION_SETTINGS_CHANGED_SIGNAL = "changed::enabled";
const LOCATION_INDICATOR_RENDERED_SIGNAL = "notify::visible";

let extension;

const LocationIconAutohideExtension = new Lang.Class({
  Name: "LocationIconAutohideExtension",

  _init: function(metadata, params) {
    // load settings
    this._locationIndicator =
      Main.panel.statusArea.aggregateMenu._location.indicators;
    this._locationIndicatorActor =
      Main.panel.statusArea.aggregateMenu._location._item.actor;
    this._locationSettings = new Gio.Settings({
      schema_id: LOCATION_SETTINGS_SCHEMA_ID
    });

    // connect to settings change signal
    this._locationSettingsChangedTriggerID = this._locationSettings.connect(
      LOCATION_SETTINGS_CHANGED_SIGNAL,
      Lang.bind(this, this._triggerToggleIconDisplay)
    );

    // get notified once when shell is fully loaded and location icon rendered
    this._locationIndicatorRenderedTriggerID = this._locationIndicatorActor.connect(
      LOCATION_INDICATOR_RENDERED_SIGNAL,
      Lang.bind(this, this._triggerLocationIndicatorRendered)
    );

    // trigger manually upon initialization
    this._triggerToggleIconDisplay();

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

  _triggerToggleIconDisplay: function(proxy, sender) {
    if (this._locationSettings.get_boolean("enabled")) {
      this._showLocationIcon();
    } else {
      this._hideLocationIcon();
    }
  },

  _triggerLocationIndicatorRendered: function(proxy, sender) {
    this._triggerToggleIconDisplay();
  },

  destroy: function() {
    // disconnect from signals
    this._locationSettings.disconnect(this._locationSettingsChangedTriggerID);
    this._locationIndicatorActor.disconnect(
      this._locationIndicatorRenderedTriggerID
    );

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
