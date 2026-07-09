# my-app 온보딩 가이드

## Project Overview

`my-app`은 React와 Vite로 구성된 최소 프론트엔드 애플리케이션 템플릿입니다. HMR, React 개발 플러그인, ESLint 설정을 포함해 빠르게 React 앱을 시작할 수 있는 기본 구조를 제공합니다.

- Languages: CSS, HTML, JavaScript, JSON, Markdown
- Frameworks: React, Vite, ESLint
- Git 상태: 현재 폴더는 Git 저장소가 아니어서 graph에는 `no-git`로 기록됨

## Architecture Layers

### React 애플리케이션

브라우저 셸, React entry, 주요 컴포넌트, CSS 파일이 함께 Vite starter UI를 렌더링하고 스타일링합니다.

핵심 파일:

- `index.html`: React가 마운트될 root 요소와 `/src/main.jsx` module script를 제공
- `src/main.jsx`: React root renderer 생성, StrictMode 적용, App 마운트
- `src/App.jsx`: starter hero, counter, 문서/커뮤니티 링크를 렌더링
- `src/App.css`: App 화면의 component-level 스타일
- `src/index.css`: 전역 theme, typography, dark mode, root layout 정의

### 프로젝트 설정

패키지, lint, Vite 설정 파일이 의존성, 개발 스크립트, JSX tooling, 빌드 동작을 정의합니다.

핵심 파일:

- `package.json`: dev/build/lint/preview 스크립트와 의존성 정의
- `eslint.config.js`: JavaScript/JSX lint, React Hooks, React Refresh 규칙 구성
- `vite.config.js`: Vite React plugin 설정

### 문서와 분석 설정

README와 Understand-Anything ignore 설정이 프로젝트 맥락과 분석 범위를 설명하고 제어합니다.

핵심 파일:

- `README.md`: React + Vite 템플릿 개요
- `.understand-anything/.understandignore`: 분석 대상에서 생성물, 로그, 임시 파일 제외

## Key Concepts

- App bootstrap 흐름은 `index.html` -> `src/main.jsx` -> `src/App.jsx` 순서입니다.
- `src/App.jsx`의 `App` 함수가 현재 UI 상태의 중심이며 `useState`로 counter 상태를 관리합니다.
- 스타일은 전역 스타일(`src/index.css`)과 component-level 스타일(`src/App.css`)로 나뉩니다.
- Vite 설정은 작고 단순하며 React plugin 연결만 담당합니다.
- ESLint 설정은 React Hooks와 Fast Refresh 관련 실수를 잡는 역할을 합니다.

## Guided Tour

1. `README.md`에서 프로젝트 목적과 템플릿 구조를 확인합니다.
2. `package.json`에서 실행 명령과 의존성을 확인합니다.
3. `index.html`에서 브라우저 진입점과 React mount 위치를 봅니다.
4. `src/main.jsx`에서 React bootstrap 과정을 따라갑니다.
5. `src/App.jsx`에서 메인 UI 구성을 확인합니다.
6. `App` 컴포넌트에서 `useState` 기반 counter 상태 흐름을 봅니다.
7. `src/App.css`에서 component-level 스타일을 확인합니다.
8. `src/index.css`에서 전역 theme와 layout 설정을 확인합니다.
9. `vite.config.js`에서 Vite와 React plugin 연결을 확인합니다.
10. `eslint.config.js`에서 lint 규칙을 확인합니다.
11. `.understandignore`에서 분석 제외 범위를 확인합니다.

## File Map

| File | Role | Complexity |
| --- | --- | --- |
| `README.md` | 프로젝트 개요 문서 | simple |
| `index.html` | 브라우저 entry shell | simple |
| `package.json` | 패키지 manifest와 scripts | simple |
| `eslint.config.js` | ESLint 설정 | simple |
| `vite.config.js` | Vite React plugin 설정 | simple |
| `src/main.jsx` | React bootstrap entry | simple |
| `src/App.jsx` | 메인 React component | moderate |
| `src/App.css` | App component 스타일 | moderate |
| `src/index.css` | 전역 스타일과 theme | moderate |
| `.understand-anything/.understandignore` | 분석 범위 설정 | moderate |

## Complexity Hotspots

- `src/App.jsx`: UI 구성과 counter 상태가 함께 있어, 기능을 추가할 때 component 분리 여부를 검토해야 합니다.
- `src/App.css`: 화면별 스타일이 많아질 경우 selector 구조와 responsive 규칙이 복잡해질 수 있습니다.
- `src/index.css`: 전역 theme 변수와 layout이 들어 있으므로 변경 시 전체 화면에 영향을 줄 수 있습니다.
- `.understand-anything/.understandignore`: 분석 결과 품질에 직접 영향을 주므로 generated artifact가 graph에 섞이지 않게 관리해야 합니다.
