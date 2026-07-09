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
import Alert from './components/24/Alert.jsx'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      {/*
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div> 
       
        <div>
          <Hello />   // Hello 도장 쾅 (재사용 1) 
          <Hello />   // 또 쾅 (재사용 2) — 복붙 아님
        </div>
        <div>
          <Greeting name="React" />
          <Greeting name="지니" />
          <Profile name="지니" job="프론트엔드" />   // job 넘김
          <Profile name="이디자인" /> 
        </div> 
        <div>               // job 생략 → 개발자(기본값)
          <Card emoji="💻" title="배우기" desc="Props 조합" />
          <Card emoji="📝" title="연습하기" desc="컴포넌트 재사용" />
          <Card emoji="🚀" title="배포하기" desc="Vite + React" />
        </div>
        <Avatar name="지니" online={true} />
        <Avatar name="철수" online={false} />
      </section>
      <h1>삼항 연산자 조건식 ? true : false</h1>
      <Badge text="true" type="new" />
      <Badge text="false" type="hot" />
      */}
      <Alert type="success" text="성공했습니다" />
      <Alert type="error" text="실패했습니다" />
      <Alert type="warning" text="주의하세요" />
    </>
  )
}

export default App
