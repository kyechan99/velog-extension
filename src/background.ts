import { MESSAGE_TYPE } from "./type/message";
import { USER_TYPE, STORAGE_FOLLOWING, POST, NOTICE } from "./type/storage";

// import Parser from 'rss-parser';
// let parser = new Parser();

// type CustomFeed = {foo: string};
// type CustomItem = {bar: number};

// const parser: Parser<CustomFeed, CustomItem> = new Parser({
//   customFields: {
//     feed: ['foo'],
//     //            ^ will error because `baz` is not a key of CustomFeed
//     item: ['bar']
//   }
// });
// console.log(document.querySelectorAll("#root"));

// (async () => {

//   const feed = await parser.parseURL('https://www.reddit.com/.rss');
//   console.log(feed.title); // feed will have a `foo` property, type as a string

//   feed.items.forEach(item => {
//     console.log(item.title + ':' + item.link) // item will have a `bar` property type as a number
//   });
// })();

// let RSSParser = require('rss-parser');
// let parser = new RSSParser();

// Storage 데이터
let followListData : STORAGE_FOLLOWING = {};
let storageRecent : Date;
let noticeListData : NOTICE[] = [];

// var xhr = new XMLHttpRequest();

// function parseXml(xml: string) {
//   var dom = null;
//   if (window.DOMParser) {
//      try { 
//         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
//      } 
//      catch (e) { dom = null; }
//   }
//   // else if (window.ActiveXObject) {
//   //    try {
//   //       dom = new ActiveXObject('Microsoft.XMLDOM');
//   //       dom.async = false;
//   //       if (!dom.loadXML(xml)) // parse error ..

//   //          window.alert(dom.parseError.reason + dom.parseError.srcText);
//   //    } 
//   //    catch (e) { dom = null; }
//   // }
//   else
//      alert("cannot parse xml string!");
//   return dom;
// }


// console.log('ROOT', $('#root'));

// Storage에 저장되있는 데이터 가져와서 초기화
chrome.storage.local.get("follow", (res) => {
  followListData = res["follow"];
  if (!followListData) {
    followListData = { 
      'tomato2532' : { followAt: new Date() },
      'henry0814' : { followAt: new Date() }
    };
  }
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

const refreshNotice = async (tabId : number = -1) => {  
  console.log('-- 이전 시각 ', storageRecent);
  try {
    for (let key in followListData) {
    // Object.keys(followListData).map(async (key) => {
      await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A//v2.velog.io/rss/${key}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(key, data);
                    if (data.items)
                      data.items.slice(0, 10).forEach((item: POST) => {
                          console.log('만큼 호출됨! ', item.title, item.pubDate);
                          if (storageRecent < new Date(item.pubDate + ' GMT')) {
                            console.log('진짜로 입력됩니다.');
                            noticeListData.push( {
                              title: item.title,
                              link: item.link
                            });
                          }
                      });
                })
        console.log('호출 완료 ');
    }
    console.log('모두 읽기 끗 ', noticeListData);

    storageRecent = new Date();
    chrome.storage.local.set({ "recent": storageRecent.toString() });
    chrome.storage.local.set({ "notice": noticeListData });
    console.log('-- 마치고 난후 시각 ', storageRecent);

    console.log(tabId ,' 에게 보냅니다');

    try {
      if (tabId > 0)
        chrome.tabs.sendMessage(tabId, { type:"RESPONSE_NOTICE_REFRESH", notice: noticeListData });
      else
        // Popup 에게 보냄
        chrome.runtime.sendMessage({ type:"RESPONSE_NOTICE_REFRESH", notice: noticeListData });
    } catch (err) {

    }
  } catch (err) { 
    // 메세지를 잘못 읽었거나 대체로 보내야할 tabId 창이 사라졌을때 들어옴
    console.error(err);
  }
}

setInterval(refreshNotice, 3600000);  // 1시간에 한번 자동 새로고침


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


const changeFollowState = (targetUser: string, tabId: number) => {
  let follow = followListData[targetUser] ? true: false;

  if (follow) {
    // 이미 팔로우 중이면 팔로우 해제함
    delete followListData[targetUser];
  } else {
    // 팔로우 중이 아니면 팔로우함
    let data : USER_TYPE = { followAt: new Date() };
    followListData[targetUser] = data;
  }
  
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
      // console.log("팔로우 수정 요청옴");
      if (tabId)
        // Velog가 켜져있는 탭에게 보냄
        chrome.tabs.sendMessage(tabId, { type: "FOLLOWING", following: followListData });
      
      else
        // Popup 에게 보냄
        chrome.runtime.sendMessage({ type: "FOLLOWING", following: followListData });
      
      break;
    case "REQUEST_NOTICE_REFRESH":
      // 일단 새로고침을 요청한후 이전 데이터를 먼저 보내줌.
      // 새로고침완료되면 새 데이터를 다시 보냄
      // refreshNotice(tabId);


      // console.log("알림 새로고침 완료 !!!!!!", noticeListData);

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
      // refreshFollowerPost(tabId ? tabId : -1); 
      // chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
      //   if (tabs.length > 0)
      //   if (tabs[0].id) {
      //     chrome.tabs.sendMessage(tabs[0].id, { type:"RESPONSE_NOTICE_REFRESH", notice: noticeListData });
      //   }
      // });
      break;
    case "REFRESH_NOTICE":
      storageRecent = new Date(message.recentAt);
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
