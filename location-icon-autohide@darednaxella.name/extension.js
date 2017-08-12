const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;

let locationSettings, locationIndicator, locationSettingsChangedTriggerID;

/*
* Location Icon Autohide
* Shows Location icon only if Location services are enabled.
* Source: https://github.com/alexanderad/gnome-shell-location-icon-autohide
* Additional docs on Location API: https://github.com/GNOME/gnome-shell/blob/master/js/ui/status/location.js
*/

function hideLocationIcon() {
    if (locationIndicator.visible) locationIndicator.hide();
}

function showLocationIcon() {
    if (!locationIndicator.visible) locationIndicator.show();
}

function triggerLocationSettingsChanged() {
    locationSettings.get_boolean('enabled') ? showLocationIcon() : hideLocationIcon();
}

function init() {

}

function enable() {
    locationIndicator = Main.panel.statusArea.aggregateMenu._location.indicators;
    locationSettings = new Gio.Settings({ schema_id: 'org.gnome.system.location' });
    locationSettingsChangedTriggerID = locationSettings.connect('changed::enabled', triggerLocationSettingsChanged);
    triggerLocationSettingsChanged();
}

function disable() {
    locationSettings.disconnect(locationSettingsChangedTriggerID);
    showLocationIcon();
}

