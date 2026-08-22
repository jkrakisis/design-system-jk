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

## 쇼케이스 페이지

`showcase/index.html`은 빌드 도구 없이 `build/web/*.css`를 직접 불러오는 정적 HTML 쇼케이스입니다. 컬러/타이포/spacing/radius 스케일과 버튼·인풋 컴포넌트를 Figma 실제 디자인 기준으로 보여줍니다. 토큰을 바꾸고 `npm run build`를 다시 돌리면 쇼케이스도 자동으로 최신값을 반영합니다.

브라우저에서 `showcase/index.html`을 열면 바로 확인할 수 있고, 우측 상단 버튼으로 라이트/다크 테마를 전환할 수 있습니다.

**버튼** — Figma "Buttons/round" 기준, pill 모양(`border-radius: 999px`)에 5가지 타입과 4단계 사이즈:

```html
<button class="btn btn-middle btn-primary">Primary</button>
<button class="btn btn-middle btn-secondary">Secondary</button>
<button class="btn btn-middle btn-tertiary">Tertiary</button>
<button class="btn btn-middle btn-gray">Gray</button>
<button class="btn btn-middle btn-four">Four</button>
```

사이즈는 `btn-xsmall`(32px) / `btn-small`(40px) / `btn-middle`(48px) / `btn-large`(56px) 중 하나를 타입 클래스와 함께 사용합니다.

**인풋** — box 스타일과 line(밑줄) 스타일, 각각 default/focus/error/disabled 상태 제공:

```html
<!-- box -->
<input class="input-field" type="text" placeholder="내용을 입력해 주세요.">
<input class="input-field is-error" type="text" value="오류">
<span class="input-error-message">메시지를 입력해 주세요</span>
<input class="input-field" type="text" disabled>

<!-- line -->
<input class="input-field-line" type="text" placeholder="내용을 입력해 주세요.">
<input class="input-field-line is-error" type="text" value="오류">
```

뱃지 컴포넌트는 아직 Figma 실제 스펙 반영 전입니다.

## 운영 원칙

- 원본 토큰은 JSON 파일에서 관리합니다.
- `build/`는 자동 생성물이므로 직접 수정하지 않습니다.
- Figma 변경 후 JSON을 교체하고 `npm run build`를 실행합니다.
- 앱 연결 시 앱 저장소에서 필요한 플랫폼 산출물만 가져옵니다.
- Light/Dark semantic 토큰은 같은 이름을 유지하고 mode로 값을 분리합니다.
