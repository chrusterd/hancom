// 1. 관련된 값을 "이름표: 값" 쌍으로 묶어 person 객체 만들기
const person = {
  name: "콩이",   // 이름표(속성) name → 값 "콩이"
  age: 10         // 이름표(속성) age → 값 10
};

// 2. 결과 칸을 찾아 담기
const out = document.querySelector("#out");

// 3. 객체 값을 화면에 그리는 화살표 함수
const render = () => {
  // 점(.)으로 값 읽기, 템플릿 리터럴로 조립
  out.textContent = `${person.name} (${person.age}살)`;
};
render();

// 4. "나이 +1" 버튼 — 점(.)으로 age 값 바꾸기 (화살표 함수)
document.querySelector("#up").addEventListener("click", () => {
  person.age++;          // person.age = person.age + 1 과 같음
  render();
});

// 5. "이름 바꾸기" 버튼 — 삼항 연산자로 "두부" ↔ "콩이" 번갈아 바꾸기
document.querySelector("#rename").addEventListener("click", () => {
  person.name = person.name === "콩이" ? "두부" : "콩이";
  render();
});