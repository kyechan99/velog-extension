import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_FOLLOWING } from "@src/type/storage";
import Icon from '@src/components/Icon';
import "@assets/base.scss";
import "./FollowDisplay.scss";


const Follow = ( { userId }: { userId: string }) => {
  return (
    <button className="follow" onClick={ () => { window.open("https://velog.io/@" + userId); } }>
      <p className="user-id">@{ userId }</p>
      <Icon d={"M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"}></Icon>
    </button>
  )
}


const FollowList = () => {
  const [following, setFollowing] = React.useState<STORAGE_FOLLOWING>({});

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "REQUEST_FOLLOWING" });

    chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE) => {
      switch (message.type) {
        case "FOLLOWING":
          setFollowing(message.following);

          break;
        default:
          break;
      }
    });
  }, []);

  return  (
    <div className="follow-list scroll-content">
      {
        Object.keys(following).map(function (key) {
          return <Follow userId={key} key={key}></Follow>
        })
      }
    </div>
  );
};


export const FollowDisplay = () => {

  return (
    <FollowList></FollowList>
  );
};