// ..
console.log("Hello from content script!")

import { MESSAGE_TYPE } from "./types";

// const header = document.createElement("h1");
// header.innerHTML = "Christmas!";

// const body = document.getElementsByTagName("body");
// body[0]?.prepend(header);



const showFollowState = (follow : Boolean) => {
    const header = document.createElement("h1");
    header.innerHTML = follow ? "ALREADY FOLLOW" : "NOT YET";

    const body = document.getElementsByTagName("body");
    body[0]?.prepend(header);
}



chrome.runtime.sendMessage({ type:"REQUEST_FOLLOW_STATE" });   // contents->background 에게 팔로우 요청


let follow = false;     // 팔로우 상태
chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE) => {
  
    console.log('C',  message);
    
    switch (message.type) {
        case "FOLLOW_STATE":
            showFollowState(message.follow);
            follow = message.follow;
        break;
        default:
          break;
    }
  });

export {}