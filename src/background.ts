import { MESSAGE_TYPE } from "./type/message";
import { USER_TYPE, STORAGE_TYPE } from "./type/storage";



// Storage 데이터
let storageData : STORAGE_TYPE = {};


// Storage에 저장되있는 데이터 가져와서 초기화
chrome.storage.local.get("follow", (res) => {
  storageData = res["follow"];
  if (!storageData) {
    storageData = {};
  }
});


// 팔로우 상태를 보냄.
// TODO : 현재 popup 과 contents 에게 모두 보냄. 수정할것
const sendFollowState = (follow: boolean, tabId: number = -1) => {
  const message = { type: "FOLLOW_STATE", follow };

  console.log('SEND TO ', tabId);

  if (tabId > 0) {
    // 보낼 탭이 지정되어 있으면 그곳에만 보내고 마침
    chrome.tabs.sendMessage(tabId, message);
    return;
  }

  // chrome.runtime.sendMessage({ type: "FOLLOW_STATE", follow });
  
  // content script 로 보냄
  chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
    // tabs.forEach((tab) => {
    //   console.log(tab);
    //   if (tab.id) {
    //     console.log('UIDDDDDDDDDDDDD');
    //     chrome.tabs.sendMessage(tab.id, message);
    //   }
    // });
  });
};



// contents나 component들 한테서 오는 메세지 리스너
chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE, sender) => {
  
  let tabId = sender.tab?.id;
  
  switch (message.type) {
    // [팔로우 정보 요청]
    case "REQUEST_FOLLOW_STATE":
      sendFollowState(storageData[message.targetUser] ? true: false, tabId);

      break;

    // [팔로우 상태 변경 요청]
    case "CHANGE_FOLLOW_STATE":
      let follow = storageData[message.targetUser] ? true: false;

      if (follow) {
        // 이미 팔로우 중이면 팔로우 해제함
        delete storageData[message.targetUser];
      } else {
        // 팔로우 중이 아니면 팔로우함
        let data : USER_TYPE = { followAt: new Date() };
        storageData[message.targetUser] = data;
        console.log('save ', storageData);
      }
      
      // storage에 변경사항 저장
      chrome.storage.local.set({ "follow": storageData });

      // 변경된 정보를 컴포넌트 들에게 보내줌
      sendFollowState(!follow, tabId);
      break;
    
    // [팔로우중인 유저 정보 요청]
    case "REQUEST_FOLLOWING":
      if (tabId)
        // Velog가 켜져있는 탭에게 보냄
        chrome.tabs.sendMessage(tabId, { type: "FOLLOWING", following: storageData });
      
      else
        // Popup 에게 보냄
        chrome.runtime.sendMessage({ type: "FOLLOWING", following: storageData });
      
      break;
    case "FOLLOWING":
      console.log('나한테 왔음');
      break;
    default:
      break;
  }
});



// 페이지가 변경되었을때 호출됨
// - 페이지가 완전 새로고침의 경우 contents.js 도 새로고침 되어 필요없지만
// - velog 는 해당 경우가 아님
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) { 
  console.log('d',  details);
  if (details.frameId === 0) { 
    chrome.tabs.get(details.tabId, function(tab) { 
      if (tab.status == 'complete') {
        chrome.tabs.sendMessage(details.tabId, { type: 'REFRESH' } );
      }
    }); 
  }
}); 
