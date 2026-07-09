// 1. 요소 잡기
const form  = document.querySelector("#form");
const inp   = document.querySelector("#inp");
const list  = document.querySelector("#list");
const count = document.querySelector("#count");

// 2. 데이터 — localStorage에서 불러오기 (없으면 빈 배열)
//    할 일 하나 = { text: "내용", done: true/false } 객체
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 3. 저장하기
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 4. 화면 다시 그리기
function render() {
  list.innerHTML = "";                       // 비우고 처음부터 다시 그리기
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");  // 완료면 줄긋기

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = todo.text;
    span.onclick = () => { todos[i].done = !todos[i].done; save(); render(); };  // 완료 토글

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.onclick = () => { todos.splice(i, 1); save(); render(); };       // 삭제

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });

  const left = todos.filter(t => !t.done).length;   // 남은 개수
  count.textContent = `할 일 ${left}개`;
}

// 5. 추가 (form 제출 = 버튼 클릭 + Enter 둘 다)
form.addEventListener("submit", (e) => {
  e.preventDefault();                 // 새로고침 막기
  const text = inp.value.trim();
  if (!text) return;                  // 빈 입력 무시
  todos.push({ text, done: false });  // 배열에 객체 추가
  inp.value = "";
  save();
  render();
});

// 6. 첫 화면 그리기
render();