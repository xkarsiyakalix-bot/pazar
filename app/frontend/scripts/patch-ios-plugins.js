#!/usr/bin/env node
/**
 * Patch @capacitor plugin Package.swift files to enable NonescapableTypes.
 * This is needed because capacitor-swift-pm 8.5.2 uses Swift 6.2 compiler
 * features gated behind #if compiler(>=5.3) && $NonescapableTypes.
 * Without enabling the experimental feature, Xcode 16 cannot see plugin members.
 *
 * Run automatically via: "postinstall": "node scripts/patch-ios-plugins.js"
 */

const fs = require('fs');
const path = require('path');

const plugins = [
  'splash-screen',
  'status-bar',
  'share',
  'push-notifications',
  'app',
];

for (const plugin of plugins) {
  const filePath = path.join(
    __dirname,
    '..',
    'node_modules',
    '@capacitor',
    plugin,
    'Package.swift'
  );

  if (!fs.existsSync(filePath)) {
    console.log(`[patch-ios-plugins] Skipping ${plugin} (not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix swift-tools-version if it's 6.0 (requires Swift 6.0 toolchain locally)
  content = content.replace(/swift-tools-version:\s*6\.0/g, 'swift-tools-version: 5.9');

  // Add swiftSettings if not already present
  if (content.includes('enableExperimentalFeature("NonescapableTypes")')) {
    console.log(`[patch-ios-plugins] Already patched: ${plugin}`);
    continue;
  }

  // Replace: path: "ios/Sources/SomePlugin"
  // With:    path: "ios/Sources/SomePlugin",
  //              swiftSettings: [.enableExperimentalFeature("NonescapableTypes")]
  //
  // Using a function replacement to avoid issues with $1 group captures
  // The original line ends with ")" after the path string, so we insert BEFORE that ")"
  const patched = content.replace(
    /path:\s*"ios\/Sources\/[^"]+"/g,
    function(match) {
      return match + ',\n            swiftSettings: [.enableExperimentalFeature("NonescapableTypes")]';
    }
  );

  if (patched === content) {
    console.log(`[patch-ios-plugins] No path: pattern found in ${plugin}, skipping`);
    continue;
  }

  fs.writeFileSync(filePath, patched);
  console.log(`[patch-ios-plugins] Patched: ${plugin}`);
}

console.log('[patch-ios-plugins] Done.');
