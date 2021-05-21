import ReactDOM from 'react-dom';
import { FollowButton } from '@components/Button/Follow/FollowButton';
import { NoticeButton } from '@components/Button/Notice/NoticeButton';
import { MESSAGE_TYPE } from "./type/message";

// 프로필을 띄울수 있는 페이지 인지 확인
//- 1. 프로필 페이지
//- 2. 포스트 페이지
function checkProfilePage () : Boolean {
  return (document.URL.includes('velog.io/@'));
}



/******************************************************************************
 *    <프로필 페이지>
 *    팔로우 상태를 변경해줄 버튼 생성
 */
const createFollowApp = async () => {
  if (document.getElementById("v-follow-app")) {
    return;
  }

  // 버튼을 바로 생성하게 되면 렌더링 과정에서 사라져 버림. 딜레이를 줌
  // - background 에서 페이지가 완전 로드 후 생성하게 해도 되지만 효율 자체는 떨어져 보임
  // - 500 은 임의. 바로 로드 되는 듯한 느낌을 주지만 강력 새로고침의 경우 너무 빨리 호출되는 문제가 있긴 있음
  await new Promise<void>((resolve, reject) => setTimeout(() => { resolve(); }, 500));

  // 팔로우 버튼을 넣을 공간. APP 생성
  const followApp = document.createElement("div");
  followApp.id = "v-follow-app"


  // 프로필 설명 (이름, 소개말) 공간
  let profileHeader = document.getElementsByClassName("sc-hZSUBg dBpWKY");
  if (profileHeader.length == 0)
    profileHeader = document.getElementsByClassName("sc-kgAjT jTAWUQ");
  profileHeader[0]?.append(followApp);


  // 이름, 소개말 공간
  let profileDesc = document.getElementsByClassName("sc-cMhqgX eGVHys");
  if (profileDesc.length == 0)
    profileDesc = document.getElementsByClassName("sc-cJSrbW bYKohe");
  profileDesc[0]?.setAttribute("style", "width: 100%;")


  // 팔로우 버튼 그려줌
  let urlRegex = (document.URL + '/').match(/(?<=\/\@).+?(?=\/)/g);
  if (urlRegex) {
    ReactDOM.render(<FollowButton targetUser={urlRegex[0]}/>, followApp);
  } else {
    console.error('[VELOG FOLLOW EXTENSION] : 유저명을 찾을 수 없습니다.');
  }
}


/******************************************************************************
 *    <모든 페이지>
 *    Navbar에 알림 상태를 띄워줄 버튼 및 공간 생성
 */
const createNoticeApp = async () => {
  if (document.getElementById("v-notice-app-1")) {
    return;
  }

  // 버튼을 바로 생성하게 되면 렌더링 과정에서 사라져 버림. 딜레이를 줌
  // - background 에서 페이지가 완전 로드 후 생성하게 해도 되지만 효율 자체는 떨어져 보임
  // - 100 은 임의. 바로 로드 되는 듯한 느낌을 주지만 강력 새로고침의 경우 너무 빨리 호출되는 문제가 있긴 있음
  await new Promise<void>((resolve, reject) => setTimeout(() => { resolve(); }, 100));

  // Notice 버튼을 넣을 공간. APP 생성
  const noticeApp1 = document.createElement("div");
  noticeApp1.id = "v-notice-app-1";
  const noticeApp2 = document.createElement("div");
  noticeApp2.id = "v-notice-app-2";
  
  
  // Navbar 우측 사이드 (프로필 및 아이콘 기능)
  //  - Velog 는 navbar 를 두개 사용함. (고정용 | 스크롤용)
  const navbarRightSide = document.getElementsByClassName("sc-jKJlTe hoxhZc");
  navbarRightSide[0]?.prepend(noticeApp1);   // 고정 navbar
  navbarRightSide[1]?.prepend(noticeApp2);   // 스크롤 했을때 뜨는 navbar
  
  
  // 알림 버튼 그려줌
  ReactDOM.render(<NoticeButton/>, noticeApp1);
  ReactDOM.render(<NoticeButton/>, noticeApp2);
}


// 초기 렌더링
if (checkProfilePage()) {
  createFollowApp();
}
createNoticeApp();


// 페이지 변경시 렌더링
chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE) => {
  switch (message.type) {
    case "REFRESH":
      if (checkProfilePage()) {
        createFollowApp();
      } 
      createNoticeApp();
      break;
    default:
      break;
  }
});