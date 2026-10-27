const path = require('path');

async function build() {
  const { default: StyleDictionary } = await import('style-dictionary');

  // 문자열 토큰(font-weight/regular 등)은 따옴표가 없으면 Swift/Kotlin/SCSS에서 유효하지 않은 값이 된다
  StyleDictionary.registerTransform({
    name: 'string/quote',
    type: 'value',
    filter: (token) => ['string', 'fontFamily'].includes(token.$type ?? token.type),
    transform: (token) => {
      const value = token.$value ?? token.value;
      return /^['"]/.test(value) ? value : JSON.stringify(value);
    },
  });
  for (const group of ['scss', 'ios-swift', 'compose']) {
    // 그룹 이름을 바꾸면 swift 포맷의 import(UIKit)가 달라지므로 같은 이름으로 덮어쓴다
    StyleDictionary.registerTransformGroup({
      name: group,
      transforms: [...StyleDictionary.hooks.transformGroups[group], 'string/quote'],
    });
  }

  const root = path.resolve(__dirname, '..');
  const primitiveFloat = path.join(root, 'primitive-float.tokens.json');
  const primitiveLight = path.join(root, 'primitive-color-light.tokens.json');
  const primitiveHighContrast = path.join(root, 'primitive-color-high-contrast.tokens.json');
  const semanticLight = path.join(root, 'mode.light.tokens.json');
  const semanticDark = path.join(root, 'mode.dark.tokens.json');
  const target = process.argv[2] || 'all';

  async function buildFile({ platform, transformGroup, buildPath, sources, destination, format, options, filter }) {
    const dictionary = new StyleDictionary({
      source: sources,
      platforms: {
        [platform]: {
          transformGroup,
          buildPath: `${buildPath}${path.sep}`,
          files: [{
            destination,
            format,
            ...(options ? { options } : {}),
            ...(filter ? { filter } : {}),
          }],
        },
      },
    });
    await dictionary.buildAllPlatforms();
  }

  const semanticFilter = (fileName) => (token) => token.filePath && token.filePath.endsWith(fileName);
  const semanticSources = (semantic) => [semantic, primitiveLight, primitiveHighContrast];

  if (target === 'all' || target === 'scss') {
    const buildPath = path.join(root, 'build', 'web');
    await buildFile({
      platform: 'scss',
      transformGroup: 'scss',
      buildPath,
      sources: [primitiveFloat],
      destination: '_primitive-variables.scss',
      format: 'scss/variables',
    });
    await buildFile({
      platform: 'scss',
      transformGroup: 'scss',
      buildPath,
      sources: semanticSources(semanticLight),
      destination: '_semantic-light.scss',
      format: 'scss/variables',
      filter: semanticFilter('mode.light.tokens.json'),
    });
    await buildFile({
      platform: 'scss',
      transformGroup: 'scss',
      buildPath,
      sources: semanticSources(semanticDark),
      destination: '_semantic-dark.scss',
      format: 'scss/variables',
      filter: semanticFilter('mode.dark.tokens.json'),
    });
  }

  if (target === 'all' || target === 'ios') {
    const buildPath = path.join(root, 'build', 'ios');
    await buildFile({
      platform: 'swift',
      transformGroup: 'ios-swift',
      buildPath,
      sources: [primitiveFloat],
      destination: 'DesignTokens.swift',
      format: 'ios-swift/enum.swift',
      options: { className: 'DesignTokens' },
    });
    await buildFile({
      platform: 'swift',
      transformGroup: 'ios-swift',
      buildPath,
      sources: semanticSources(semanticLight),
      destination: 'ColorTokensLight.swift',
      format: 'ios-swift/enum.swift',
      options: { className: 'ColorTokensLight' },
      filter: semanticFilter('mode.light.tokens.json'),
    });
    await buildFile({
      platform: 'swift',
      transformGroup: 'ios-swift',
      buildPath,
      sources: semanticSources(semanticDark),
      destination: 'ColorTokensDark.swift',
      format: 'ios-swift/enum.swift',
      options: { className: 'ColorTokensDark' },
      filter: semanticFilter('mode.dark.tokens.json'),
    });
  }

  if (target === 'all' || target === 'android') {
    const buildPath = path.join(root, 'build', 'android');
    await buildFile({
      platform: 'compose',
      transformGroup: 'compose',
      buildPath,
      sources: [primitiveFloat],
      destination: 'DesignTokens.kt',
      format: 'compose/object',
      options: { className: 'DesignTokens', packageName: 'com.app.designsystem.tokens' },
    });
    await buildFile({
      platform: 'compose',
      transformGroup: 'compose',
      buildPath,
      sources: semanticSources(semanticLight),
      destination: 'ColorTokensLight.kt',
      format: 'compose/object',
      options: { className: 'ColorTokensLight', packageName: 'com.app.designsystem.tokens' },
      filter: semanticFilter('mode.light.tokens.json'),
    });
    await buildFile({
      platform: 'compose',
      transformGroup: 'compose',
      buildPath,
      sources: semanticSources(semanticDark),
      destination: 'ColorTokensDark.kt',
      format: 'compose/object',
      options: { className: 'ColorTokensDark', packageName: 'com.app.designsystem.tokens' },
      filter: semanticFilter('mode.dark.tokens.json'),
    });
  }

  console.log(`✓ ${target} platform token build completed successfully`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
