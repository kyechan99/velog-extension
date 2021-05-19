// aa
console.log("Hello from background script!")

import { MESSAGE_TYPE } from "./message/types";


// 팔로우 상태를 보냄.
// TODO : 현재 popup 과 contents 에게 모두 보냄. 수정할것
const sendFollowState = (follow: boolean) => {  
  const message = { type: "FOLLOW_STATE", follow };

  chrome.runtime.sendMessage({ type: "FOLLOW_STATE", follow });

  // 열려있는 탭들(contents)에게 보냄
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
  chrome.storage.local.get("follow", (res) => {
    console.log('저장소 follow 상태 ', res["follow"]);
  });
};

let follow = false;

chrome.storage.local.get("follow", (res) => {
  if (res["follow"]) {
    follow = true;
  } else {
    follow = false;
  }
  console.log('저장소 follow 상태 ', follow);
});

chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE) => {
  console.log('메세지 도착, ' , message.type);
  switch (message.type) {
    case "REQUEST_FOLLOW_STATE":
      sendFollowState(follow);
      break;
    case "CHANGE_FOLLOW_STATE":
      console.log('상태를 변경합니다');
      
      follow = message.follow;
      console.log("CALL CHANGE FOLLOW !   NOW : ", follow);
      chrome.storage.local.set({ "follow": follow });
      sendFollowState(follow);
      break;
    default:
      break;
  }
});

// 페이지가 변경되었을때 호출됨
// - 페이지가 완전 새로고침의 경우 contents.js 도 새로고침 되어 필요없지만
// - velog 는 해당 경우가 아님
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) { 
  if(details.frameId === 0) { 
    chrome.tabs.get(details.tabId, function(tab) { 
      if (tab.status == 'complete')
        chrome.tabs.sendMessage(details.tabId, { type: 'REFRESH' } );
    }); 
  }
}); 
