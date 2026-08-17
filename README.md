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

## 운영 원칙

- 원본 토큰은 JSON 파일에서 관리합니다.
- `build/`는 자동 생성물이므로 직접 수정하지 않습니다.
- Figma 변경 후 JSON을 교체하고 `npm run build`를 실행합니다.
- 앱 연결 시 앱 저장소에서 필요한 플랫폼 산출물만 가져옵니다.
- Light/Dark semantic 토큰은 같은 이름을 유지하고 mode로 값을 분리합니다.
