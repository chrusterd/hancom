// 1. 선택 목록(flavor)과 결과 문장(result)을 찾아 담기
const flavor = document.querySelector("#flavor");
const result = document.querySelector("#result");

// 2. "확인" 버튼을 클릭하면 조건을 판단 (화살표 함수)
document.querySelector("#check").addEventListener("click", () => {
  // 3. 만약(if) 고른 값이 "chocolate"와 같으면(===) 이 문장
  if (flavor.value === "chocolate") {
    result.textContent = "와! 초코 아이스크림 좋아! 🍫";
  } else if (flavor.value === "vanilla") {
    // 4. 첫 조건이 거짓이면 다음 조건(else if)을 검사
    result.textContent = "바닐라도 깔끔하니 좋지! 🍦";
  } else {
    // 5. 위 조건이 모두 거짓이면(else) 이 문장
    result.textContent = "음... 그래도 초코가 최고인데...";
  }
});