import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import "./FollowButton.scss";

type FollowButtonProps = {
  targetUser: string
}

export const FollowButton = ({ targetUser } : FollowButtonProps) => {
  const [follow, setFollow] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "REQUEST_FOLLOW_STATE", targetUser: targetUser });

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
    chrome.runtime.sendMessage({ type: "CHANGE_FOLLOW_STATE", targetUser: targetUser });
  };

  return (
    <button className={`v-follow-bt ${follow ? "following" : "follow"}`} onClick={onClick}>
      {follow ? "팔로우 중" : "팔로우 하기"}
    </button>
  );
};