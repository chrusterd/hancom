// 1. 과일 배열을 fruits 상자에 담기 (대괄호 [ ] 안에 쉼표로 나열)
let fruits = ["사과", "바나나"];

// 2. 입력칸·결과 칸·개수 칸을 찾아 담기
const fruit = document.querySelector("#fruit");
const out = document.querySelector("#out");
const info = document.querySelector("#info");

// 3. 화면을 다시 그리는 화살표 함수
const render = () => {
  out.textContent = fruits.join(", ");          // .join(", "): 사이 글자로 이어 붙이기
  info.textContent = `개수(length): ${fruits.length}`;
};
render();

// 4. "추가" 버튼 — 입력한 과일을 배열 끝에 push (화살표 함수)
document.querySelector("#add").addEventListener("click", () => {
  if (!fruit.value) { return; }   // 비어 있으면 아무것도 안 함
  fruits.push(fruit.value);       // .push(값): 배열 끝에 새 값 추가
  fruit.value = "";              // 입력칸 비우기 (다음 입력 준비)
  render();
});