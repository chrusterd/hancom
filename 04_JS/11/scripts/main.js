// 1. 입력칸·목록·버튼을 찾아 담기
const n = document.querySelector("#n");
const out = document.querySelector("#out");

// 2. "반복" 버튼 — for로 1부터 N까지 반복 (화살표 함수)
document.querySelector("#run").addEventListener("click", () => {
  out.innerHTML = "";                 // 목록 비우기
  const count = Number(n.value);
  // for (시작값; 계속할 조건; 매번 변화) — 반복문은 ES6에서도 그대로 씀
  for (let i = 1; i <= count; i++) {
    const li = document.createElement("li");
    li.textContent = `${i}번째 사과🍎`;    // 1~count까지 반복 출력
    out.appendChild(li);
  }
});

// 3. "카운트다운" 버튼 — while로 N부터 1까지
document.querySelector("#down").addEventListener("click", () => {
  out.innerHTML = "";
  let i = Number(n.value);
  // while (조건): 조건이 참인 동안 반복
  while (i > 0) {
    const li = document.createElement("li");
    li.textContent = i;               // count부터 1까지
    out.appendChild(li);
    i--;                              // 안 줄이면 무한반복 주의! (i = i - 1 과 같음)
  }
});