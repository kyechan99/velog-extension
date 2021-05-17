import { Button } from './components/Button/Button';
import ReactDOM from 'react-dom';


/******************************************************************************
 *    <프로필 페이지>
 *    팔로우 상태를 변경해줄 버튼 생성
 */
if (document.URL.includes('velog.io/@')) {
  console.log('000000', document.URL.split('@')[1] );


  // 팔로우 버튼을 넣을 공간. APP 생성
  const followApp = document.createElement("div");
  followApp.id = "v-follow-app"



  // 프로필 설명 (이름, 소개말) 공간
  const profileHeader = document.getElementsByClassName("sc-hZSUBg dBpWKY");
  profileHeader[0]?.append(followApp);



  // 이름, 소개말 공간
  const profileDesc = document.getElementsByClassName("sc-cMhqgX eGVHys");
  profileDesc[0]?.setAttribute("style", "width: 100%;")



  // 팔로우 버튼 그려줌
  ReactDOM.render(<Button/>, document.getElementById('v-follow-app'));
}




/******************************************************************************
 *    <모든 페이지>
 *    Navbar에 알림 상태를 띄워줄 버튼 및 공간 생성
 */

// Notice 버튼을 넣을 공간. APP 생성
const noticeApp = document.createElement("div");
noticeApp.id = "v-notice-app"


// Navbar 우측 사이드 (프로필 및 아이콘 기능)
const navbarRightSide = document.getElementsByClassName("sc-jKJlTe hoxhZc");
navbarRightSide[0]?.prepend(noticeApp);


// chrome.runtime.sendMessage({ type:"REQUEST_FOLLOW_STATE" });   // contents->background 에게 팔로우 요청

export {}