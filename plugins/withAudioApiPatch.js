// Expo config plugin: patches react-native-audio-api's Constants.h
// which is missing `#include <cstddef>` needed for `size_t` on Xcode 16+.
// Injects the fix into the existing post_install block in the generated Podfile.
const { withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const PATCH_MARKER = '# RNAudioAPI-cstddef-patch';
const PATCH_CODE = `
    ${PATCH_MARKER}
    begin
      header = File.join(
        File.dirname(installer.pods_project.path),
        'Headers/Private/RNAudioAPI/audioapi/core/Constants.h'
      )
      if File.exist?(header)
        content = File.read(header)
        unless content.include?('#include <cstddef>')
          File.write(header, "#include <cstddef>\\n" + content)
          puts "Patched RNAudioAPI Constants.h with #include <cstddef>"
        end
      end
    rescue => e
      puts "Warning: RNAudioAPI patch failed: #{e}"
    end`;

module.exports = (config) =>
  withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes(PATCH_MARKER)) return cfg; // already patched

      // Insert our code right before the end of the first post_install block
      // The existing block ends with two end statements: one for the block, one for the target
      podfile = podfile.replace(
        /(\s+react_native_post_install\([^)]*\)[\s\S]*?)(^\s+end\s*\n^end\s*$)/m,
        `$1${PATCH_CODE}\n$2`
      );

      fs.writeFileSync(podfilePath, podfile);
      return cfg;
    },
  ]);
