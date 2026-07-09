// 1. 입력칸·기호 선택·결과 칸을 찾아 담기
const a = document.querySelector("#a");
const b = document.querySelector("#b");
const op = document.querySelector("#op");
const out = document.querySelector("#out");

// 2. "계산" 버튼을 누르면 실행 (화살표 함수)
document.querySelector("#calc").addEventListener("click", () => {
  // Number( ): 입력칸 글자 "3"을 숫자 3으로 바꾸기
  const x = Number(a.value);
  const y = Number(b.value);
  let result;   // 결과는 나중에 정해지니 let
  // 3. 고른 기호(op)에 따라 다른 연산자로 계산 (=== 는 같은지 비교)
  if (op.value === "+") { result = x + y; }
  else if (op.value === "-") { result = x - y; }
  else if (op.value === "*") { result = x * y; }
  else { result = x / y; }
  // 템플릿 리터럴로 "3 + 5 = 8" 같은 문장 조립
  out.textContent = `${x} ${op.value} ${y} = ${result}`;
});