// build-device-tokens.js

const path = require('path');

async function build() {
  const { default: StyleDictionary } = await import('style-dictionary');
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'build', 'web');
  const deviceTokens = require(path.join(root, 'device.tokens.json'));
  const borderRadiusTokens = require(path.join(root, 'border-radius.tokens.json'));
  const primitiveFloat = require(path.join(root, 'primitive-float.tokens.json'));

  async function buildFile({ tokens, destination, selector }) {
    const dictionary = new StyleDictionary({
      tokens,
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: `${output}${path.sep}`,
          files: [{
            destination,
            format: 'css/variables',
            options: { selector },
          }],
        },
      },
    });
    await dictionary.buildAllPlatforms();
  }

  for (const mode of ['desktop', 'tablet', 'mobile']) {
    const radiusMode = mode === 'mobile' ? 'sm' : 'md';
    const deviceModeTokens = deviceTokens[mode];
    const radiusModeTokens = borderRadiusTokens[radiusMode];
    await buildFile({
      tokens: {
        ...primitiveFloat,
        ...radiusModeTokens,
        ...deviceModeTokens,
        'border-radius': {
          ...radiusModeTokens['border-radius'],
          ...deviceModeTokens['border-radius'],
        },
      },
      destination: `device-${mode}.css`,
      selector: `[data-device='${mode}']`,
    });
  }

  for (const mode of ['md', 'none', 'sm']) {
    await buildFile({
      tokens: { ...primitiveFloat, ...borderRadiusTokens[mode] },
      destination: `border-radius-${mode}.css`,
      selector: `[data-radius='${mode}']`,
    });
  }

  console.log('✓ Device & border-radius tokens built successfully');
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
