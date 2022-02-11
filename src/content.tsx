import ReactDOM from 'react-dom';
import { FollowButton } from '@components/Button/Follow/FollowButton';
import { NoticeButton } from '@components/Button/Notice/NoticeButton';
import { TopButton } from '@components/Button/TopButton/TopButton';
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

  
  // 이름 Div 찾기, 부모가 소개말이며 그 부모가 전체 프로필이 됨
  const nameDiv = document.getElementsByClassName('name')[0];


  // 이름, 소개말 공간
  let profileDesc = nameDiv?.parentElement;
  profileDesc?.setAttribute("style", "width: 100%;")


  // 프로필 설명 (이름, 소개말) 공간
  let profileHeader = profileDesc?.parentElement;
  profileHeader?.append(followApp);


  // 팔로우 버튼 그려줌
  let urlRegex = (document.URL + '/').match(/(?<=\/\@).+?(?=\/)/g);
  if (urlRegex) {
    ReactDOM.render(<FollowButton targetUser={urlRegex[0]}/>, followApp);
  } else {
    console.log('[VELOG FOLLOW EXTENSION] : 유저명을 찾을 수 없습니다.');
  }
}


/******************************************************************************
 *    <모든 페이지>
 *    Navbar에 알림 상태를 띄워줄 버튼 및 공간 생성
 */
const createNoticeApp = async () => {
  if (document.getElementById("v-notice-app") || document.getElementById("v-nav-app")) {
    return;
  }
  console.log('velog extension 생성중...');

  // 버튼을 바로 생성하게 되면 렌더링 과정에서 사라져 버림. 딜레이를 줌
  // - background 에서 페이지가 완전 로드 후 생성하게 해도 되지만 효율 자체는 떨어져 보임
  // - 100 은 임의. 바로 로드 되는 듯한 느낌을 주지만 강력 새로고침의 경우 너무 빨리 호출되는 문제가 있긴 있음
  await new Promise<void>((resolve, reject) => setTimeout(() => { resolve(); }, 100));


  // Notice 버튼을 넣을 공간. APP 생성
  const noticeApp = document.createElement("div");
  noticeApp.id = "v-notice-app";
  const navApp = document.createElement("div");
  navApp.id = "v-nav-app";
  
  
  // Navbar 우측 사이드 (프로필 및 아이콘 기능)
  //  - Velog 는 navbar 를 두개 사용함. (고정용 | 스크롤용)
  let navbarRightSide = document.getElementsByClassName("sc-iwjdpV ajzPu");
  if (navbarRightSide.length == 0)
    navbarRightSide = document.getElementsByClassName('sc-iwjdpV gQLlod');
  if (!navbarRightSide) return;
  navbarRightSide[0]?.prepend(noticeApp);   // 고정 navbar
  navbarRightSide[1]?.prepend(navApp);   // 스크롤 했을때 뜨는 navbar
  
  let isDark = false;
  if (localStorage.getItem('theme') == '\"dark\"')
    isDark = true;

  // 알림 버튼 그려줌
  ReactDOM.render(<NoticeButton darkMode={isDark}/>, noticeApp);
  ReactDOM.render(<TopButton darkMode={isDark}/>, navApp);


  // 3초후에 재확인함.
  await new Promise<void>((resolve, reject) => setTimeout(() => { resolve(); }, 3000));
  createNoticeApp();
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