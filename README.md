# Design Tokens

Figma에서 추출한 디자인 토큰 저장소입니다. 웹 CSS/SCSS, iOS Swift, Android Compose 형식으로 빌드할 수 있습니다.

## 빌드

```powershell
cd 설정
npm install
npm run build
```

개별 플랫폼 빌드:

```powershell
npm run build:css
npm run build:scss
npm run build:ios
npm run build:android
```

## 산출물

```text
build/
├── web/
│   ├── primitive-variables.css
│   ├── color-light.css
│   ├── color-high-contrast.css
│   ├── semantic-light.css
│   ├── semantic-dark.css
│   ├── device-desktop.css
│   ├── device-tablet.css
│   ├── device-mobile.css
│   ├── border-radius-md.css
│   ├── border-radius-none.css
│   ├── border-radius-sm.css
│   └── *.scss
├── ios/
│   ├── DesignTokens.swift
│   ├── ColorTokensLight.swift
│   └── ColorTokensDark.swift
└── android/
    ├── DesignTokens.kt
    ├── ColorTokensLight.kt
    └── ColorTokensDark.kt
```

## 웹 연결 예시

```css
@import './build/web/primitive-variables.css';
@import './build/web/color-light.css';
@import './build/web/color-high-contrast.css';
@import './build/web/semantic-light.css';
@import './build/web/semantic-dark.css';
```

테마 전환:

```html
<html data-theme="light">
<html data-theme="dark">
```

디바이스별 토큰은 `data-device="desktop|tablet|mobile"`, radius 토큰은 `data-radius="md|none|sm"` 속성으로 선택합니다.

## 프로젝트별 override 빌드

프로젝트마다 디자인시스템이 조금씩 다를 때, base 토큰 전체를 복사하지 않고 바뀐 semantic 토큰만 관리합니다.

```text
projects/
└── <project-name>/
    └── override.tokens.json   ← base와 동일한 key 경로로, 바뀐 토큰만 작성 (W3C DTCG 포맷: $type/$value)
```

예시 (`projects/example/override.tokens.json`):

```json
{
  "color": {
    "key": {
      "primary": { "$type": "color", "$value": "#ff5500" }
    }
  }
}
```

빌드:

```powershell
cd 설정
node build-project.js <project-name>
```

`build/<project-name>/`에 CSS가 생성되며, override에 없는 토큰은 base 값을 그대로 상속합니다. override한 토큰을 참조하는 다른 토큰(예: 버튼 컬러 등)도 자동으로 값이 따라갑니다. override 파일이 없으면 base와 동일하게 빌드됩니다.

## 운영 원칙

- 원본 토큰은 JSON 파일에서 관리합니다.
- `build/`는 자동 생성물이므로 직접 수정하지 않습니다.
- Figma 변경 후 JSON을 교체하고 `npm run build`를 실행합니다.
- 앱 연결 시 앱 저장소에서 필요한 플랫폼 산출물만 가져옵니다.
- Light/Dark semantic 토큰은 같은 이름을 유지하고 mode로 값을 분리합니다.
