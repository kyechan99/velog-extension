import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_TYPE } from "@src/type/storage";
import "./FollowDisplay.scss";

const Follow = ( { userId }: { userId: string }) => {
  return (
    <button className="follow" onClick={ () => { window.open("https://velog.io/@" + userId); } }>
      <p className="user-id">{ userId }</p>
    </button>
  )
}

const FollowList = () => {
  const [following, setFollowing] = React.useState<STORAGE_TYPE>({});

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
    <div>
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