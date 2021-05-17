import * as React from "react";
import { MESSAGE_TYPE } from "../../types";
import "./Button.css";

export const Button = () => {
  const [follow, setFollow] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "REQUEST_FOLLOW_STATE" });

    chrome.runtime.onMessage.addListener((message: MESSAGE_TYPE) => {
      switch (message.type) {
        case "FOLLOW_STATE":
          setFollow(message.follow);
          break;
        default:
          break;
      }
    });
  }, []);

  const onClick = () => {
    chrome.runtime.sendMessage({ type: "CHANGE_FOLLOW_STATE", follow: !follow });
  };

  return (
    <button className={`v-follow-bt ${follow ? "following" : "follow"}`} onClick={onClick}>
      {follow ? "팔로우" : "팔로우 하기"}
    </button>
  );
};