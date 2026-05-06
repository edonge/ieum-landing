# public/ — 정적 자산

디자이너에게 받을 자산을 이 폴더에 둠. 파일명·사이즈 규약:

| 파일명 | 용도 | 사이즈 |
|---|---|---|
| `logo.svg` | 메인 로고 (가로형) | SVG |
| `logo-symbol.svg` | 심볼만 | SVG |
| `og.png` | OpenGraph 이미지 (SNS 미리보기) | 1200×630 |
| `favicon.ico` | 브라우저 탭 아이콘 | 16/32/48 멀티 |
| `apple-touch-icon.png` | iOS 홈 추가 시 | 180×180 |
| `hero.png` (또는 `.svg`) | 히어로 비주얼 | 가로 1600px 권장 |

피그마 무료 버전이라 dev mode 없이 SVG/PNG export로 받으면 됨. 컬러·타이포·radius 토큰은 [globals.css](../app/globals.css) `:root` 블록에 입력.
