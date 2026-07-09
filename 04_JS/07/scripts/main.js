// 1. 두 숫자를 곱하는 화살표 함수 (num1, num2 = 받아올 재료=매개변수)
//    => 뒤가 한 줄이면 { return } 없이 그 값이 바로 반환됨
const multiply = (num1, num2) => num1 * num2;

// 2. 입력칸 두 개와 결과 칸을 찾아 담기
const a = document.querySelector("#a");
const b = document.querySelector("#b");
const out = document.querySelector("#out");

// 3. "곱하기" 버튼을 누르면 함수를 불러서(호출) 답을 표시
document.querySelector("#calc").addEventListener("click", () => {
  // Number( ): 입력칸 글자를 숫자로 바꿔 곱하기, 템플릿 리터럴로 문장 조립
  out.textContent = `${a.value} × ${b.value} = ${multiply(Number(a.value), Number(b.value))}`;
});