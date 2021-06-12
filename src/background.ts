import { MESSAGE_TYPE } from "./type/message";
import { USER_TYPE, STORAGE_FOLLOWING, POST, NOTICE } from "./type/storage";


// Storage 데이터
let followListData : STORAGE_FOLLOWING = {};
let storageRecent : Date = new Date();
let noticeListData : NOTICE[] = [];


// Storage에 저장되있는 데이터 가져와서 초기화
chrome.storage.local.get("follow", (res) => {
  followListData = res["follow"];
  if (!followListData) {
    followListData = { 
      'tomato2532' : { followAt: (new Date()).toString() },
      'henry0814' : { followAt: (new Date()).toString() }
    };
  }
  console.log(followListData);
});
chrome.storage.local.get("recent", (res) => {
  if (!res.recent) {
    storageRecent = new Date('Sat, 21 May 2021 00:54:25 GMT')
  } else {
    storageRecent = new Date(res.recent);
  }
  console.log('날짜 : ', storageRecent);
});
chrome.storage.local.get("notice", (res) => {
  noticeListData = res["notice"];
  console.log("NOTICE", noticeListData);
  if (!noticeListData) {
    noticeListData = [];
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
  
  // content script 로 보냄
  chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
};


const changeFollowState = (targetUser: string, tabId: number) => {
  let follow = followListData[targetUser] ? true: false;

  if (follow) {
    // 이미 팔로우 중이면 팔로우 해제함
    delete followListData[targetUser];
  } else {
    // 팔로우 중이 아니면 팔로우함
    let data : USER_TYPE = { 
      followAt: (new Date()).toString()
    };
    followListData[targetUser] = data;
  }
  console.log(targetUser, '의 팔로우 상태를 변경합니다');
  console.log(followListData);
  
  // storage에 변경사항 저장
  chrome.storage.local.set({ "follow": followListData });

  // 변경된 정보를 컴포넌트 들에게 보내줌
  sendFollowState(!follow, tabId);
}


// contents나 component들 한테서 오는 메세지 리스너
chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE, sender) => {
  
  let tabId = sender.tab?.id;
  

  switch (message.type) {
    // [팔로우 정보 요청]
    case "REQUEST_FOLLOW_STATE":
      sendFollowState(followListData[message.targetUser] ? true: false, tabId);
      break;


    // [팔로우 상태 변경 요청]
    case "CHANGE_FOLLOW_STATE":
      changeFollowState(message.targetUser, tabId ? tabId : -1);
      break;
    

    // [팔로우중인 유저 정보 요청]
    case "REQUEST_FOLLOWING":
      if (tabId)    // Velog가 켜져있는 탭에게 보냄
        chrome.tabs.sendMessage(tabId, { type: "FOLLOWING", following: followListData });
      else          // Popup 에게 보냄
        chrome.runtime.sendMessage({ type: "FOLLOWING", following: followListData });
      break;
    

    case "REQUEST_NOTICE_REFRESH":
      if (tabId)
        // Velog가 켜져있는 탭에게 보냄
        chrome.tabs.sendMessage(tabId, { 
          type:"RESPONSE_NOTICE_REFRESH", 
          notice: noticeListData, 
          following: followListData,
          recentAt: storageRecent.toString()
        });
      else
        // Popup 에게 보냄
        chrome.runtime.sendMessage({ 
          type:"RESPONSE_NOTICE_REFRESH", 
          notice: noticeListData, 
          following: followListData,
          recentAt: storageRecent.toString()
        });
      break;


    case "REFRESH_NOTICE":
      storageRecent = new Date(message.recentAt);
      noticeListData = message.notice;
      break;

    case "EDIT_FOLLOW":
      followListData = message.following;
      break;

    case "EDIT_NOTICE":
      noticeListData = message.notice;
      break;


    default:
      break;
  }
});



// 페이지가 변경되었을때 호출됨
// - 페이지가 완전 새로고침의 경우 contents.js 도 새로고침 되어 필요없지만
// - velog 는 해당 경우가 아님
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) { 
  if (details.frameId === 0) { 
    chrome.tabs.get(details.tabId, function(tab) { 
      if (tab.status == 'complete') {
        chrome.tabs.sendMessage(details.tabId, { type: 'REFRESH' } );
      }
    }); 
  }
}); 
