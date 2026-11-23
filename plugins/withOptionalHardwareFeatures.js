/**
 * Marks hardware features that Google Play infers from the manifest as optional,
 * so the app stays installable on every phone, tablet, Chromebook and XR device.
 *
 * - android.hardware.screen.portrait: implied by `orientation: "portrait"`.
 *   The app still locks to portrait; devices without a portrait screen just
 *   letterbox it.
 * - android.hardware.wifi: implied by ACCESS_WIFI_STATE (added by libraries for
 *   network checks). The app works over any connection.
 */
const { withAndroidManifest } = require('expo/config-plugins');

const OPTIONAL_FEATURES = ['android.hardware.screen.portrait', 'android.hardware.wifi'];

module.exports = function withOptionalHardwareFeatures(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$['xmlns:tools'] = manifest.$['xmlns:tools'] || 'http://schemas.android.com/tools';
    const features = (manifest['uses-feature'] = manifest['uses-feature'] || []);

    for (const name of OPTIONAL_FEATURES) {
      const attrs = { 'android:name': name, 'android:required': 'false', 'tools:replace': 'android:required' };
      const existing = features.find((f) => f.$?.['android:name'] === name);
      if (existing) existing.$ = { ...existing.$, ...attrs };
      else features.push({ $: attrs });
    }
    return cfg;
  });
};
