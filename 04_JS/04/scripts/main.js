// 결과 칸을 찾아 담기
const out = document.querySelector("#out");

// 값을 받아 "값 (타입: ...)" 형태로 보여 주는 화살표 함수
const show = (value) => {
  // 객체·배열은 보기 좋게 JSON 글자로, 나머지는 그대로
  const shown = (typeof value === "object" && value !== null) ? JSON.stringify(value) : value;
  // 템플릿 리터럴 `${ }`로 값과 타입(typeof)을 한 문장에 끼워 넣기
  out.textContent = `${shown}  (타입: ${typeof value})`;
};

// 선언만 하고 값을 안 넣으면 그 변수는 undefined (← 실제 사용 예시)
let empty;

// 버튼마다 서로 다른 타입의 값을 넣어 호출 (7가지 타입 모두)
document.querySelector("#bStr").addEventListener("click", () => show("안녕"));          // String
document.querySelector("#bNum").addEventListener("click", () => show(10));              // Number
document.querySelector("#bBool").addEventListener("click", () => show(true));            // Boolean
document.querySelector("#bUndef").addEventListener("click", () => show(empty));           // undefined (값 미할당)
document.querySelector("#bNull").addEventListener("click", () => show(null));             // null → typeof는 "object" (유명한 버그)
document.querySelector("#bArr").addEventListener("click", () => show([1, "Bob", 10]));   // Array → object
document.querySelector("#bObj").addEventListener("click", () => show({ name: "Bob" }));  // Object