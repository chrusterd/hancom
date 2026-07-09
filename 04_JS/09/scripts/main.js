// 두 그림 주소 (실제 프로젝트에선 "images/cat.png" 같은 파일 주소를 씀)
// 여기선 picsum.photos 더미 이미지 서비스를 사용 — 인터넷 연결 필요
// (?random= 뒤 번호만 다르게 주면 서로 다른 사진을 받아옴)
const IMG_A = "https://picsum.photos/300?random=1";
const IMG_B = "https://picsum.photos/300?random=2";

// 1. 페이지의 그림(id="pic")을 찾아 myImage 상자에 담기
const myImage = document.querySelector("#pic");
// 2. 처음 보여 줄 그림을 IMG_A로 정하기
myImage.setAttribute("src", IMG_A);

// 3. 그림을 클릭할 때마다 실행 (onclick 속성에 화살표 함수 연결)
myImage.onclick = () => {
  // 지금 걸려 있는 그림 주소를 읽어오기 (getAttribute)
  const mySrc = myImage.getAttribute("src");
  if (mySrc === IMG_A) {
    myImage.setAttribute("src", IMG_B);   // A였으면 → B로 바꾸기
  } else {
    myImage.setAttribute("src", IMG_A);   // 아니면 → A로 되돌리기
  }
};