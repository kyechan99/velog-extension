import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_TYPE } from "@src/type/storage";
import "./NoticeDisplay.scss";

const Notice = ( { userId }: { userId: string }) => {
  return (
    <div className="notice">
      <p>{ userId }</p>
    </div>
  )
}

const NoticeList = () => {
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
          return <Notice userId={key} key={key}></Notice>
        })
      }
    </div>
  );
};

export const NoticeDisplay = () => {

  return (
    <NoticeList></NoticeList>
  );
};