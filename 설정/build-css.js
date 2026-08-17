const path = require('path');

async function build() {
  const { default: StyleDictionary } = await import('style-dictionary');
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'build', 'web');

  async function buildFile({ sources, destination, selector, filter }) {
    const dictionary = new StyleDictionary({
      source: sources,
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: `${output}${path.sep}`,
          files: [{
            destination,
            format: 'css/variables',
            ...(filter ? { filter } : {}),
            options: { selector },
          }],
        },
      },
    });
    await dictionary.buildAllPlatforms();
  }

  const primitiveFloat = path.join(root, 'primitive-float.tokens.json');
  const primitiveLight = path.join(root, 'primitive-color-light.tokens.json');
  const primitiveHighContrast = path.join(root, 'primitive-color-high-contrast.tokens.json');
  const semanticLight = path.join(root, 'mode.light.tokens.json');
  const semanticDark = path.join(root, 'mode.dark.tokens.json');

  await buildFile({
    sources: [primitiveFloat],
    destination: 'primitive-variables.css',
    selector: ':root',
  });
  await buildFile({
    sources: [primitiveLight],
    destination: 'color-light.css',
    selector: ":root, [data-theme='light']",
  });
  await buildFile({
    sources: [primitiveHighContrast],
    destination: 'color-high-contrast.css',
    selector: "[data-theme='high-contrast']",
  });
  await buildFile({
    sources: [semanticLight, primitiveLight, primitiveHighContrast],
    destination: 'semantic-light.css',
    selector: ":root, [data-theme='light']",
    filter: (token) => token.filePath && token.filePath.endsWith('mode.light.tokens.json'),
  });
  await buildFile({
    sources: [semanticDark, primitiveLight, primitiveHighContrast],
    destination: 'semantic-dark.css',
    selector: "[data-theme='dark']",
    filter: (token) => token.filePath && token.filePath.endsWith('mode.dark.tokens.json'),
  });
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
