// build-project.js
// 사용법: node build-project.js <project-name>
// projects/<project-name>/override.tokens.json 이 있으면 semantic 토큰에 병합해서
// build/<project-name>/ 에 CSS를 생성한다. override 파일이 없으면 base 그대로 빌드된다.

const path = require('path');
const fs = require('fs');

async function build() {
  const { default: StyleDictionary } = await import('style-dictionary');
  const root = path.resolve(__dirname, '..');
  const projectName = process.argv[2];

  if (!projectName) {
    console.error('사용법: node build-project.js <project-name>');
    process.exitCode = 1;
    return;
  }

  const overridePath = path.join(root, 'projects', projectName, 'override.tokens.json');
  const hasOverride = fs.existsSync(overridePath);
  const output = path.join(root, 'build', projectName);

  const primitiveFloat = path.join(root, 'primitive-float.tokens.json');
  const primitiveLight = path.join(root, 'primitive-color-light.tokens.json');
  const primitiveHighContrast = path.join(root, 'primitive-color-high-contrast.tokens.json');
  const semanticLight = path.join(root, 'mode.light.tokens.json');
  const semanticDark = path.join(root, 'mode.dark.tokens.json');

  async function buildFile({ sources, destination, selector, filter, allowOverride }) {
    const dictionary = new StyleDictionary({
      source: hasOverride && allowOverride ? [...sources, overridePath] : sources,
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

  const semanticFilter = (fileName) => (token) =>
    token.filePath && (token.filePath.endsWith(fileName) || (hasOverride && token.filePath.endsWith('override.tokens.json')));

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
    filter: semanticFilter('mode.light.tokens.json'),
    allowOverride: true,
  });
  await buildFile({
    sources: [semanticDark, primitiveLight, primitiveHighContrast],
    destination: 'semantic-dark.css',
    selector: "[data-theme='dark']",
    filter: semanticFilter('mode.dark.tokens.json'),
    allowOverride: true,
  });

  console.log(`✓ ${projectName} 토큰 빌드 완료 (override: ${hasOverride ? 'O' : 'X'}) → build/${projectName}/`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
