//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
//import heroImg from './assets/hero.png'
//import './App.css'
//import Hello from './components/18/Hello.jsx'  // Hello 컴포넌트 가져오기
//import Greeting from './components/19/Greeting.jsx'
//import Profile from './components/20/Profile.jsx'
//import Card from './components/21/Card.jsx'
//import Avatar from './components/22/Avater.jsx'
//import Badge from './components/23/Badge.jsx' 
//import Alert from './components/24/Alert.jsx'
//import Rating from './components/25/Rating.jsx'
//import Tag from './components/26/Tag.jsx'   // Tag 컴포넌트 가져오기
//import SubmitButton from './components/27/SubmitButton'
//import NewTextField from './components/27/NewTextField'
//import Header from './components/28/Header.jsx'
//import Menu from './components/28/Menu.jsx'
//import Content from './components/28/Content.jsx'
//import Footer from './components/28/Footer.jsx'
//import Counter from './components/29/Counter.jsx'
//import Counter from './components/30/Counter.jsx'
//import Counter from './components/31/Counter.jsx'
//import NameForm from './components/32/NameForm.jsx'
//import ProductItem from './components/33/ProductItem.jsx'
//import Hello from './components/34/Hello.jsx'
//import Clock from './components/35/Clock.jsx'
//import Counter from './components/36/Counter.jsx'
//import Every from './components/37/Every.jsx'
//import Users from './components/38/Users.jsx'
//import Weather from './components/39/Weather.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/40/Home.jsx'
import About from './components/40/About.jsx'

// function App() {
//   //const [count, setCount] = useState(0)
//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div> 
//         <div>
//           <Hello />   // Hello 도장 쾅 (재사용 1) 
//           <Hello />   // 또 쾅 (재사용 2) — 복붙 아님
//         </div>
//         <div>
//           <Greeting name="React" />
//           <Greeting name="지니" />
//           <Profile name="지니" job="프론트엔드" />   // job 넘김
//           <Profile name="이디자인" /> 
//         </div> 
//         <div>               // job 생략 → 개발자(기본값)
//           <Card emoji="💻" title="배우기" desc="Props 조합" />
//           <Card emoji="📝" title="연습하기" desc="컴포넌트 재사용" />
//           <Card emoji="🚀" title="배포하기" desc="Vite + React" />
//         </div>
//         <Avatar name="지니" online={true} />
//         <Avatar name="철수" online={false} />
//       </section>
//       <h1>삼항 연산자 조건식 ? true : false</h1>
//       <Badge text="true" type="new" />
//       <Badge text="false" type="hot" />
//       <Alert type="success" text="성공했습니다" />
//       <Alert type="error" text="실패했습니다" />
//       <Alert type="warning" text="주의하세요" />
//       <Rating score={3} />   // ⭐⭐⭐☆☆
//       <NewTextField />
//       <SubmitButton />
//     </>
//   )
//}

const App = () => {
  return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <Menu />
//       <Content />
//       <Footer />
//     </div>
//   )
// <>
//   <Weather />
//   <Counter />
//   <NameForm />
//   <ProductItem name="러닝화" />
//   <Hello />
//   <Clock />
//   <Every />
//   <Users />
// </>
    <BrowserRouter>
      <div className="relative isolate min-h-screen overflow-hidden bg-white">
        {/* 메쉬 그라데이션 배경 — 흐릿한 색 얼룩들 */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-300/50 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-300/50 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        </div>

        {/* 메뉴 - 어느 화면에서든 보임 */}
        <nav className="mx-auto flex max-w-3xl items-center justify-center gap-3 p-6">
          <Link
            to="/"
            className="rounded-full bg-white/70 px-6 py-2 font-semibold text-slate-700 shadow-md backdrop-blur-md ring-1 ring-black/5 transition hover:scale-105 hover:bg-white"
          >
            🏠 홈
          </Link>
          <Link
            to="/about"
            className="rounded-full bg-white/70 px-6 py-2 font-semibold text-slate-700 shadow-md backdrop-blur-md ring-1 ring-black/5 transition hover:scale-105 hover:bg-white"
          >
            ✨ 소개
          </Link>
        </nav>

        {/* 화면 갈아끼우는 곳 */}
        <Routes>
          <Route path="/"      element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App
