// 이 대시보드에 쓰인 리액트 주요 개념 정리 페이지 (#/docs)
// 초보자용: 비유 → 풀어 쓴 설명 → 실제 코드 → 코드 읽는 법 순서로 구성

const CONCEPTS = [
  {
    title: '컴포넌트 — 화면을 레고 블록처럼 조립하기',
    easy: '컴포넌트는 "화면 조각"이에요. 레고 블록처럼 작은 조각을 만들어 끼워 맞추면 큰 화면이 됩니다.',
    desc: `이 대시보드는 하나의 거대한 파일이 아니라, 역할별로 나뉜 작은 조각들로 만들어져 있어요.
헤더는 Header, 현재가 카드는 HeroTile, 코인 목록은 CoinList… 이런 식이죠.
이렇게 나누면 "코인 목록만 고치고 싶다"라고 할 때 CoinList 파일만 열면 되고,
같은 조각(예: Sparkline 그래프)을 여러 곳에서 재사용할 수도 있어요.
조각에게 데이터를 건네줄 때는 props라는 것을 씁니다. 함수에 인자를 넘기는 것과 똑같아요.`,
    where: 'App.jsx가 Header, HeroTile, RangeTabs, StatTiles, CoinList, PriceChart를 조립',
    code: `// App.jsx — 조각들을 조립하는 곳
<HeroTile coin={coin} ticker={ticker} />   {/* coin과 ticker를 props로 건네줌 */}
<RangeTabs />
<StatTiles stats={rangeStats} rangeLabel={range.label} />`,
    codeNote: 'HTML 태그처럼 생겼지만 <HeroTile>은 우리가 만든 컴포넌트예요. 속성처럼 쓴 coin={coin}이 데이터를 건네주는 props입니다.',
  },
  {
    title: 'useState — 컴포넌트의 메모장',
    easy: 'useState는 컴포넌트가 "기억해야 할 값"을 적어두는 메모장이에요. 메모가 바뀌면 리액트가 알아서 화면을 다시 그려줍니다.',
    desc: `일반 변수(let x = 0)는 값을 바꿔도 화면이 안 바뀌어요. 리액트가 "값이 바뀌었네?"를 모르거든요.
useState로 만든 값은 다릅니다. 전용 변경 함수(setHover 같은)로 바꾸면
리액트가 알아채고 그 컴포넌트를 다시 그려요.
차트 위에서 마우스를 움직일 때 세로선(크로스헤어)이 따라오는 게 바로 이 원리예요.
"마우스가 몇 번째 데이터를 가리키는지"를 hover라는 메모장에 계속 갱신하는 거죠.`,
    where: 'PriceChart.jsx의 hover(마우스 위치), useCandles.js의 캔들 데이터',
    code: `// PriceChart.jsx
const [hover, setHover] = useState(null)
// hover: 현재 값 (처음엔 null = 아무것도 안 가리킴)
// setHover: 값을 바꾸는 유일한 방법

<svg
  onPointerMove={(e) => setHover(indexFromEvent(e))}  // 마우스 이동 → 메모 갱신 → 화면 다시 그림
  onPointerLeave={() => setHover(null)}               // 마우스 나감 → 메모 지움
/>`,
    codeNote: 'useState(null)의 null은 시작값이에요. setHover를 부를 때마다 리액트가 화면을 자동으로 새로 그립니다.',
  },
  {
    title: 'useEffect — "화면 그리기 밖의 일" 담당 + 뒷정리',
    easy: '타이머 켜기, 서버에 데이터 요청하기처럼 화면 그리기와 별개인 일은 useEffect 안에서 해요. 그리고 끝날 때 뒷정리(클린업)를 꼭 합니다.',
    desc: `이 대시보드는 몇 초마다 서버에 "지금 시세 알려줘"라고 물어봐요(폴링이라고 불러요).
이런 반복 타이머는 useEffect 안에서 setInterval로 켭니다.
중요한 건 마지막에 돌려주는(return) 함수예요. 이걸 클린업이라고 하는데,
컴포넌트가 화면에서 사라지거나 설정(갱신 주기 등)이 바뀔 때 리액트가 대신 불러줘요.
여기서 clearInterval로 타이머를 꺼주지 않으면, 안 보이는 화면 뒤에서
타이머가 계속 돌면서 서버에 요청을 보내는 "유령 타이머"가 생깁니다.
"켰으면 끈다"를 자동으로 보장하는 장치라고 생각하면 돼요.`,
    where: 'useTicker.js(시세 폴링), useCandles.js(차트 데이터)',
    code: `// useTicker.js
useEffect(() => {
  tick()                                  // 1) 일단 한 번 바로 조회
  const id = setInterval(tick, intervalMs) // 2) 그 후 몇 초마다 반복

  return () => {                          // 3) 뒷정리 (클린업)
    clearInterval(id)                     //    타이머 끄기 — 이게 없으면 유령 타이머!
  }
}, [key, intervalMs])                     // 4) 이 값들이 바뀌면 껐다가 새로 켠다`,
    codeNote: '맨 아래 [key, intervalMs]는 "감시 목록"이에요. 갱신 주기를 3초→1초로 바꾸면 3초짜리 타이머를 끄고(클린업) 1초짜리를 새로 켭니다.',
  },
  {
    title: 'useReducer — 상태 변경 규칙을 한 곳에 모은 접수창구',
    easy: '상태를 아무 데서나 직접 고치지 않고, "이런 일이 일어났어요"라고 접수(dispatch)하면 접수창구(reducer)가 정해진 규칙대로 처리해요.',
    desc: `설정이 늘어나면(선택 코인, 조회 기간, 테마, 갱신 주기…) useState를 여러 개 쓰는 게 지저분해져요.
useReducer는 이걸 한 덩어리로 묶고, 바꾸는 규칙을 reducer 함수 하나에 모읍니다.
컴포넌트는 dispatch({ type: 'selectMarket', market: 'KRW-ETH' })처럼
"비트코인 대신 이더리움을 선택했어요"라는 사건만 접수해요.
실제로 상태가 어떻게 바뀌는지는 전부 reducer 안에 적혀 있으니,
"테마가 왜 바뀌었지?"가 궁금하면 reducer 파일 하나만 보면 됩니다.`,
    where: 'dashboardStore.js(설정 전체), useTicker.js(시세 히스토리 쌓기)',
    code: `// dashboardStore.js — 모든 변경 규칙이 이 한 곳에
function dashboardReducer(state, action) {
  switch (action.type) {                       // "무슨 일이 일어났나"에 따라
    case 'selectMarket':                       // 코인을 선택했다 →
      return { ...state, market: action.market }
    case 'toggleTheme':                        // 테마 버튼을 눌렀다 →
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
  }
}

// 컴포넌트에서는 사건 접수만:
dispatch({ type: 'selectMarket', market: coin.code })`,
    codeNote: '{ ...state, market: ... }는 "기존 상태를 복사하고 market만 바꾼 새 객체"라는 뜻이에요. 리액트는 이렇게 항상 새 객체를 만들어야 변경을 알아챕니다.',
  },
  {
    title: 'Context — 데이터를 손에서 손으로 전달하지 않는 공용 보관함',
    easy: 'props는 부모→자식→손자로 한 단계씩만 전달돼요. Context는 건물 로비의 공용 보관함처럼, 어떤 컴포넌트든 바로 꺼내 쓸 수 있게 해줍니다.',
    desc: `"선택된 코인"은 헤더도, 현재가 카드도, 차트도 알아야 해요.
props로만 전달하면 App → 중간 컴포넌트 → 최종 컴포넌트로
그 값을 안 쓰는 중간 컴포넌트까지 계속 전달만 해줘야 하죠(이걸 prop drilling이라고 해요).
Context를 쓰면 맨 위에서 Provider라는 울타리로 감싸두고,
그 안의 어떤 컴포넌트든 useDashboard() 한 줄로 설정을 바로 꺼내 씁니다.
택배를 이웃집들에 릴레이로 부탁하는 대신, 무인 보관함에 넣어두는 셈이에요.`,
    where: 'DashboardProvider.jsx(보관함 설치), useDashboard.js(꺼내 쓰는 열쇠)',
    code: `// App.jsx — 앱 전체를 Provider 울타리로 감싼다
<DashboardProvider>
  <Dashboard />
</DashboardProvider>

// 울타리 안이라면 어디서든, 몇 단계 아래든 상관없이:
const { state, dispatch } = useDashboard()
console.log(state.market) // 'KRW-BTC'`,
    codeNote: 'Header, RangeTabs, ViewToggle이 전부 이 방법으로 설정을 읽어요. App이 그 값들을 일일이 props로 내려보내지 않는 이유입니다.',
  },
  {
    title: '커스텀 훅 — 자주 쓰는 로직을 나만의 레시피로',
    easy: '"몇 초마다 시세 받아오기" 같은 로직을 use로 시작하는 함수로 포장해두면, 어느 컴포넌트든 한 줄로 그 기능을 가져다 쓸 수 있어요.',
    desc: `useState, useEffect를 조합해서 만든 로직 덩어리를 함수로 추출한 것이 커스텀 훅이에요.
특별한 문법이 아니라 그냥 "이름이 use로 시작하고, 안에서 다른 훅을 쓰는 함수"입니다.
이 프로젝트에서 시세 폴링은 useTicker, 차트 데이터는 useCandles,
요소 크기 측정은 useElementSize에 들어 있어요.
덕분에 컴포넌트 쪽 코드는 "데이터 가져와서 화면에 그린다"만 남아 아주 짧아집니다.
요리로 치면 매번 육수를 처음부터 끓이는 대신, 레시피를 적어두고 재사용하는 거예요.`,
    where: 'useTicker, useCandles, useDashboard, useElementSize, useHashRoute (hooks 폴더)',
    code: `// 복잡한 폴링 로직이 전부 useTicker 안에 숨어 있어서,
// 컴포넌트에서는 이 한 줄이면 끝:
const { tickers, history, isLive } = useTicker(MARKET_CODES, state.interval * 1000)

// 차트 데이터도 마찬가지:
const { candles, loading } = useCandles(state.market, range)`,
    codeNote: '컴포넌트가 짧고 읽기 쉬워지는 비결이에요. 타이머 관리, 실패 처리 같은 골치 아픈 부분은 훅 안에 캡슐화되어 있습니다.',
  },
  {
    title: 'useMemo — 계산 결과를 적어두는 포스트잇',
    easy: '무거운 계산을 매번 다시 하지 않고, 결과를 적어뒀다가 재료가 바뀌었을 때만 다시 계산해요.',
    desc: `리액트 컴포넌트는 생각보다 자주 다시 실행돼요. 시세가 1초마다 갱신되면 1초마다 다시 그려지죠.
그때마다 차트의 좌표 수백 개를 처음부터 다시 계산하면 낭비예요.
useMemo는 "이 계산의 재료(candles, width)가 지난번과 같으면,
계산을 건너뛰고 적어둔 결과를 그대로 써"라고 지시하는 도구입니다.
아래 코드에서 고가·저가·거래대금 집계는 캔들 데이터가 실제로 바뀔 때만 다시 계산돼요.`,
    where: 'App.jsx(기간 통계 집계), PriceChart.jsx(차트 좌표 계산)',
    code: `// App.jsx
const rangeStats = useMemo(() => {
  if (!candles?.length) return null
  return {
    high:   Math.max(...candles.map((c) => c.high)),   // 기간 내 최고가
    low:    Math.min(...candles.map((c) => c.low)),    // 기간 내 최저가
    volume: candles.reduce((sum, c) => sum + c.volume, 0), // 거래대금 합계
  }
}, [candles])  // ← 재료 목록: candles가 그대로면 계산 생략`,
    codeNote: '마지막 [candles]가 "재료 목록"이에요. 재료가 같으면 지난번 결과를 재사용하고, 바뀌면 그때만 다시 계산합니다.',
  },
  {
    title: 'React.memo + useCallback — "바뀐 게 없으면 다시 그리지 마"',
    easy: '부모가 다시 그려지면 자식도 전부 다시 그려지는 게 기본이에요. memo는 "내 재료(props)가 그대로면 나는 건너뛰어 줘"라는 표시입니다.',
    desc: `코인 목록에는 행이 6개 있어요. 비트코인을 클릭해서 선택을 바꾸면
원래는 6개 행이 전부 다시 그려집니다. 실제로 모양이 바뀌는 건 2개뿐인데도요
(새로 선택된 행, 선택이 풀린 행).
CoinRow를 React.memo로 감싸면 props가 지난번과 똑같은 행은 건너뜁니다.
한 가지 함정: 클릭 처리 함수(onSelect)를 부모가 매번 새로 만들면
"어? props가 바뀌었네?"가 되어 memo가 무용지물이 돼요.
그래서 useCallback으로 "이 함수는 같은 함수야"라고 참조를 고정해 줍니다. 둘은 세트예요.`,
    where: 'CoinList.jsx(CoinRow를 memo로), App.jsx(handleSelect를 useCallback으로)',
    code: `// CoinList.jsx — "props가 그대로면 이 행은 다시 그리지 마"
const CoinRow = memo(function CoinRow({ coin, ticker, selected, onSelect }) {
  ...
})

// App.jsx — 함수를 매번 새로 만들지 않도록 고정 (memo의 짝꿍)
const handleSelect = useCallback(
  (code) => dispatch({ type: 'selectMarket', market: code }),
  [dispatch],
)`,
    codeNote: '자바스크립트에서 함수를 새로 만들면 내용이 같아도 "다른 함수"로 취급돼요. useCallback이 그 참조를 고정해서 memo가 제대로 동작하게 합니다.',
  },
  {
    title: 'useRef + ResizeObserver — 실제 화면 요소를 만지는 손잡이',
    easy: 'useRef는 리액트가 그려낸 진짜 HTML 요소를 붙잡는 손잡이예요. 이 손잡이로 "이 박스, 실제로 몇 픽셀이야?"를 물어볼 수 있습니다.',
    desc: `차트를 창 크기에 맞추려면 "차트가 들어갈 자리가 실제로 몇 픽셀인지"를 알아야 해요.
그런데 리액트 코드 안에서는 그 값을 바로 알 수 없어요. 실제 브라우저 요소에게 물어봐야 하죠.
useRef로 요소에 손잡이(ref)를 달아두고,
브라우저 내장 기능인 ResizeObserver로 "이 요소 크기가 바뀌면 알려줘"라고 구독합니다.
크기가 바뀌면 그 값을 상태에 넣고 → 화면이 다시 그려지고 → 차트가 새 폭에 맞게 그려져요.
창을 드래그해서 줄이면 차트가 따라 줄어드는 게 이 원리입니다.`,
    where: 'useElementSize.js → PriceChart(차트 폭), HeroTile(현재가 그래프 폭)',
    code: `// useElementSize.js
const ref = useRef(null)          // 1) 손잡이 만들기 → <div ref={ref}>에 부착

useEffect(() => {
  const ro = new ResizeObserver(([entry]) => {
    setSize(entry.contentRect)    // 3) 크기가 바뀔 때마다 새 크기를 기록
  })
  ro.observe(ref.current)         // 2) "이 요소를 지켜봐 줘"
  return () => ro.disconnect()    // 4) 뒷정리: 감시 중단
}, [])`,
    codeNote: 'ref.current가 실제 HTML 요소예요. 여기서도 useEffect의 클린업(감시 중단)이 등장하죠 — "켰으면 끈다" 패턴은 어디서나 같습니다.',
  },
  {
    title: '제어 컴포넌트 — 입력값의 주인은 리액트 상태',
    easy: '드롭다운에 지금 무엇이 선택되어 있는지를 브라우저가 아니라 리액트 상태가 결정해요. 화면과 데이터가 어긋날 수 없는 구조입니다.',
    desc: `조회 기간 드롭다운을 보세요. value={state.rangeId}라고 되어 있죠.
"화면에 표시되는 선택값 = 리액트 상태값"으로 묶어버린 거예요.
사용자가 다른 항목을 고르면 onChange가 실행되고 → dispatch로 상태를 바꾸고 →
바뀐 상태가 다시 value로 내려와서 화면이 갱신됩니다.
데이터가 한 방향으로 빙글 도는 이 구조 덕분에,
"화면엔 7일인데 실제론 24시간 데이터가 나오는" 종류의 어긋남이 원천 차단돼요.`,
    where: 'RangeTabs.jsx(조회 기간), Header.jsx(갱신 주기)',
    code: `// RangeTabs.jsx
<select
  value={state.rangeId}                    // 화면 표시값 = 상태값 (한 몸)
  onChange={(e) =>                         // 사용자가 바꾸면 →
    dispatch({ type: 'setRange', rangeId: e.target.value })  // 상태를 바꾼다
  }
>
  {RANGES.map((r) => (
    <option key={r.id} value={r.id}>{r.label}</option>
  ))}
</select>`,
    codeNote: '상태가 바뀌지 않는 한 화면도 절대 안 바뀌어요. 그래서 "지금 뭐가 선택돼 있지?"의 정답은 언제나 state.rangeId 하나뿐입니다.',
  },
  {
    title: 'localStorage 저장 — 새로고침해도 기억하는 앱',
    easy: '리액트 상태는 새로고침하면 전부 사라져요. 브라우저의 저장 공간(localStorage)에 적어두면 다음 방문 때 이어서 시작할 수 있습니다.',
    desc: `다크 테마로 바꾸고 새로고침했는데 라이트로 돌아가면 짜증나겠죠.
그래서 두 가지를 합니다.
① 설정이 바뀔 때마다 useEffect로 localStorage에 저장하고,
② 앱이 켜질 때 useReducer의 세 번째 인자(지연 초기화)로 저장된 값을 읽어 시작해요.
"지연 초기화"는 어려운 말 같지만, "시작값을 매번 계산하지 말고
첫 실행 때 딱 한 번만 이 함수로 만들어 줘"라는 뜻일 뿐이에요.
localStorage 읽기는 느린 작업이라 매 렌더마다 하면 아깝거든요.`,
    where: 'dashboardStore.js(initSettings), DashboardProvider.jsx(저장하는 useEffect)',
    code: `// 켜질 때: 저장된 설정 읽기 (딱 한 번만 실행됨)
const [state, dispatch] = useReducer(dashboardReducer, null, initSettings)
//                                                    ↑ 세 번째 인자가 "첫 실행 때 한 번만"

// 바뀔 때: 자동 저장
useEffect(() => {
  localStorage.setItem('dashboard-settings', JSON.stringify(state))
}, [state])  // state가 바뀔 때마다 실행`,
    codeNote: '테마·조회 기간·갱신 주기가 새로고침 후에도 유지되는 이유예요. 개발자 도구 → Application → Local Storage에서 실제 저장값을 눈으로 볼 수 있습니다.',
  },
  {
    title: '조건부 렌더링과 key — 상황에 맞는 화면, 목록엔 이름표',
    easy: '"데이터가 없으면 로딩 문구, 차트 모드면 차트, 표 모드면 표" — 조건에 따라 다른 화면을 보여줘요. 목록을 그릴 땐 각 항목에 이름표(key)를 붙입니다.',
    desc: `리액트에서 "무엇을 보여줄까"는 그냥 자바스크립트 조건문이에요.
아래 코드는 물음표(삼항 연산자)가 두 번 이어진 형태인데, 말로 풀면
"캔들이 없어? → 로딩 문구. 있으면 차트 모드야? → 차트. 아니야? → 표"입니다.
그리고 코인 목록처럼 배열을 map으로 그릴 때는 각 항목에 key를 꼭 줘요.
key는 리액트가 "아, 이 행이 아까 그 비트코인 행이구나"를 알아보는 이름표예요.
이름표가 있어야 목록 순서가 바뀌거나 항목이 갱신될 때 엉뚱한 행을 건드리지 않습니다.`,
    where: 'App.jsx(로딩/차트/표 분기), CoinList.jsx·DataTable.jsx(map + key)',
    code: `// App.jsx — 조건에 따라 다른 화면
{!candles ? (
  <div className="placeholder">차트 불러오는 중…</div>   // 아직 데이터 없음
) : state.view === 'chart' ? (
  <PriceChart candles={candles} rangeId={range.id} />    // 차트 모드
) : (
  <DataTable candles={candles} rangeId={range.id} />     // 표 모드
)}

// CoinList.jsx — 목록엔 이름표(key)
{MARKETS.map((coin) => (
  <CoinRow key={coin.code} coin={coin} ... />  // key는 절대 안 겹치는 값으로
))}`,
    codeNote: 'key로는 배열 순서(index)보다 데이터 고유값(코인 코드, 타임스탬프)을 쓰는 게 좋아요. 순서가 바뀌어도 이름표는 그대로니까요.',
  },
  {
    title: '외부 이벤트 구독 — 이 문서 페이지가 열리는 원리',
    easy: '지금 보고 있는 이 페이지는 라우팅 라이브러리 없이, "주소가 바뀌면 알려줘"라는 브라우저 이벤트 구독만으로 열렸어요.',
    desc: `주소창을 보면 #/docs가 붙어 있을 거예요.
브라우저는 주소의 # 뒷부분이 바뀔 때 hashchange라는 이벤트를 발생시켜요.
useHashRoute 훅은 이 이벤트를 구독해서 현재 해시를 리액트 상태로 만들어 둡니다.
"📘이 서비스에 사용한 리액트" 버튼(실은 #/docs로 가는 링크)을 누르면 → 주소가 바뀌고 →
이벤트가 오고 → 상태가 바뀌고 → App이 대시보드 대신 이 페이지를 그려요.
useEffect로 바깥세상(브라우저)의 변화를 구독하는 전형적인 패턴이고,
페이지가 많아지는 실전 앱에서는 React Router라는 라이브러리를 쓰는 게 일반적입니다.`,
    where: 'useHashRoute.js, App.jsx의 route 분기 — 바로 지금 이 페이지',
    code: `// useHashRoute.js
const [route, setRoute] = useState(() => window.location.hash)

useEffect(() => {
  const onChange = () => setRoute(window.location.hash) // 주소가 바뀌면 상태 갱신
  window.addEventListener('hashchange', onChange)       // 구독 시작
  return () => window.removeEventListener('hashchange', onChange) // 뒷정리
}, [])

// App.jsx — 주소에 따라 다른 페이지
{route === '#/docs' ? <DocsPage /> : <Dashboard />}`,
    codeNote: '구독 시작(addEventListener)과 뒷정리(removeEventListener)가 짝을 이루죠. useEffect 항목에서 본 "켰으면 끈다" 패턴 그대로입니다.',
  },
]

export default function DocsPage() {
  return (
    <div className="docs">
      <section className="card docs-hero">
        <a className="theme-btn docs-back" href="#/">← 대시보드로</a>
        <p className="docs-eyebrow">React Concepts</p>
        <h1>이 서비스에 쓰인<br />리액트 주요 개념 13가지</h1>
        <p className="docs-intro">
          코인 라이브 대시보드에 사용한 리액트 개념을 쉽게 정리했어요.
        </p>
        <nav className="docs-toc" aria-label="목차">
          {CONCEPTS.map((c, i) => {
            const id = `concept-${i + 1}`
            return (
              <a
                key={c.title}
                href={`#${id}`}
                onClick={(e) => {
                  // 이 해시는 페이지 내부 앵커일 뿐, 라우팅용 hashchange를 울리면 안 된다
                  // (울리면 useHashRoute가 감지해서 App이 대시보드로 튕겨버림)
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  history.replaceState(null, '', `#${id}`)
                }}
              >
                <b>{i + 1}</b> {c.title.split(' — ')[0]}
              </a>
            )
          })}
        </nav>
      </section>

      {CONCEPTS.map((c, i) => {
        const [main, sub] = c.title.split(' — ')
        return (
          <section
            key={c.title}
            id={`concept-${i + 1}`}
            className="card concept"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="concept-head">
              <span className="concept-no">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{main}</h2>
                {sub && <p className="concept-subtitle">{sub}</p>}
              </div>
            </div>
            <p className="concept-easy">{c.easy}</p>
            <p className="concept-desc">{c.desc}</p>
            <p className="concept-where">
              <span className="where-tag">어디에?</span> {c.where}
            </p>
            <pre>
              <code>{c.code}</code>
            </pre>
            <p className="concept-note">💡 {c.codeNote}</p>
          </section>
        )
      })}

      <footer className="docs-footer">
        <button
          type="button"
          className="theme-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ 맨 위로
        </button>
        <a className="docs-link" href="#/">📈 대시보드로 돌아가기</a>
      </footer>
    </div>
  )
}
