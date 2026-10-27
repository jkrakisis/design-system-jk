# Design Tokens

Figma에서 추출한 디자인 토큰 저장소입니다. 웹 CSS/SCSS, iOS Swift, Android Compose 형식으로 빌드할 수 있습니다.

👉 **[Design System UI Showcase 바로 보기](https://jkrakisis.github.io/design-system-jk/showcase/)**  
Figma Variables 기반의 컬러, 타이포그래피, 버튼, 입력창, 뱃지, 태그와 반응형 UI를 브라우저에서 확인할 수 있습니다.

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


## UI 쇼케이스

디자인 토큰과 주요 UI 컴포넌트를 브라우저에서 확인할 수 있습니다.

- [Design System UI Showcase](https://jkrakisis.github.io/design-system-jk/showcase/)
- [쇼케이스 소스 코드](./showcase/index.html)

쇼케이스에서 확인할 수 있는 항목:

- Light / Dark 테마 전환
- Primitive 및 Semantic 컬러
- Typography, Spacing, Border Radius
- 버튼, 뱃지, 태그
- Box / Line Input 상태
- Notification, Checkbox, Radio, Tabs
- Desktop / Mobile 반응형 레이아웃

GitHub Pages 주소가 404로 표시되면 저장소의 Settings → Pages에서 다음과 같이 설정합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

설정 후 아래 주소로 접속합니다.

```text
https://jkrakisis.github.io/design-system-jk/showcase/
```

## Figma Variables → Token 흐름

Figma Variables를 변경한 뒤 컬렉션의 모드에서 Export mode 또는 Export modes를 선택해 JSON으로 내보냅니다.

```text
Figma Variables
→ Export modes
→ token/*.tokens.json
→ npm run build
→ build/web · build/ios · build/android
→ GitHub 반영
```

현재는 유료 플러그인 없이 Figma 기본 Export 기능을 사용하는 방식입니다. Figma Variables REST API를 이용한 완전 자동화는 Enterprise 플랜과 API 권한이 필요할 수 있으므로, 현재 프로젝트에서는 JSON Export 후 Style Dictionary 빌드 방식을 기본 흐름으로 사용합니다.

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

## Primitive 토큰

`primitive-float.tokens.json`은 폰트·수치 계열 primitive를 담고 있으며, Figma의 `primitive` 컬렉션과 그룹 구성이 같습니다.

| 그룹 | 개수 | 내용 |
|---|---|---|
| `font-family` | 3 | `font-family-01` Pretendard GOV(기본) / `-02` Paperlogy(디스플레이) / `-03` Montserrat(영문 보조) |
| `font-weight` | 9 | `font-weight-300`~`900`(숫자 7개), `regular`·`bold`(스타일명 문자열 2개) |
| `line-height` | 19 | `line-height-16`~`80` (`number` 그룹 참조) |
| `letter-spacing` | 19 | 자간 (`t1`~`t4`, `h1`~`h4`, `b1`~`b3`, `l0`, `c1` 등) |
| `number` | 35 | 기본 수치 0~96, `max`(999) |
| `opacity` | 15 | 불투명도 0~100 (퍼센트 값) |

변수명은 `--{그룹}-{토큰명}` 형태라 그룹명이 한 번 더 붙습니다. Figma의 `--font-family-01`은 로컬에서 `--font-family-font-family-01`입니다.

| 플랫폼 | 예시 |
|---|---|
| CSS | `--line-height-line-height-80` |
| SCSS | `$line-height-line-height-80` |
| Swift | `DesignTokens.lineHeightLineHeight80` |
| Kotlin | `DesignTokens.lineHeightLineHeight80` |

사용할 때 알아둘 점:

- 숫자 토큰은 단위가 없습니다. CSS에서는 `calc(var(--line-height-line-height-80) * 1px)`처럼 단위를 붙여 사용합니다.
- 문자열 토큰(`font-family`, `regular`, `bold`)은 `build-platforms.js`의 `string/quote` 변환으로 SCSS·Swift·Kotlin에서 따옴표가 붙은 문자열로 출력됩니다. 따옴표가 없으면 Swift/Kotlin 컴파일이 깨지므로, 문자열 타입 변수를 추가할 때도 이 변환이 적용되는지 빌드 결과를 확인합니다.
- `primitive-float.tokens.json`은 Figma Export로 덮어써지므로 직접 수정한 내용은 다음 Export 때 사라집니다. 값 보정이 필요하면 JSON이 아니라 빌드 스크립트에 둡니다.

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

**뱃지 — 상태(Status)** — success/warning/danger/information, pill 모양:

```html
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-information">Information</span>
```

**태그 (badge-group)** — Figma "badge-group" 기준, primary/gray/outline 3색상 × lg(32)/md(24)/sm(20) 3사이즈, 각진 8px 라운드(`--border-radius-300`):

```html
<span class="tag tag-lg tag-primary">BADGE</span>
<span class="tag tag-lg tag-gray">BADGE</span>
<span class="tag tag-lg tag-outline">BADGE</span>
```

사이즈는 `tag-lg` / `tag-md` / `tag-sm` 중 하나를 색상 클래스와 함께 사용합니다.

## 운영 원칙

- 원본 토큰은 JSON 파일에서 관리합니다.
- `build/`는 자동 생성물이므로 직접 수정하지 않습니다.
- Figma 변경 후 JSON을 교체하고 `npm run build`를 실행합니다.
- 앱 연결 시 앱 저장소에서 필요한 플랫폼 산출물만 가져옵니다.
- Light/Dark semantic 토큰은 같은 이름을 유지하고 mode로 값을 분리합니다.
