// 1. 인사말(greet)과 이름 입력칸(input)을 찾아 담기
const greet = document.querySelector("#greet");
const input = document.querySelector("#name");

// 2. 처음 열 때 — 저장된 이름이 있으면(getItem) 꺼내서 인사
const saved = localStorage.getItem("name");
if (saved) {
  greet.textContent = `안녕, ${saved}!`;
}

// 3. "저장" 버튼 — 입력한 이름을 브라우저에 저장(setItem) — 화살표 함수
document.querySelector("#save").addEventListener("click", () => {
  const myName = input.value;
  if (!myName) { return; }   // 비어 있으면 아무것도 안 함
  localStorage.setItem("name", myName);
  greet.textContent = `안녕, ${myName}!`;
});

// 4. "지우기" 버튼 — 저장된 이름 삭제(removeItem)
document.querySelector("#reset").addEventListener("click", () => {
  localStorage.removeItem("name");
  greet.textContent = "안녕하세요!";
});