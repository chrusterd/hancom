const title = document.querySelector("#title");
// 1. id가 "title"인 제목을 찾아 title 상자에 담기
// . => ~의

const btn = document.querySelector("#btn");
// 2. id가 "btn"인 버튼을 찾아 btn 상자에 담기

const events = {
  click: "Clicked!",
  dblclick: "Double Clicked!",
  keydown: "Key Pressed!",
  keyup: "Key Released!",
};

Object.entries(events).forEach(([type, text]) => {
  btn.addEventListener(type, () => {
    title.textContent = text;
  });
});