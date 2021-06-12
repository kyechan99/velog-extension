import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_FOLLOWING, NOTICE } from "@src/type/storage";
import "./SettingDisplay.scss";

import GithubIcon from '@src/assets/github.png';

export const SettingDisplay = () => {
  const [isResetFollow, setResetFollow] = React.useState(false);
  const [isResetNotice, setResetNotice] = React.useState(false);

  const resetFollowList = () => {
    chrome.storage.local.set({ "follow": [] });
    chrome.runtime.sendMessage({
      type: "EDIT_FOLLOW", 
      following: {}
    });
    setResetFollow(true);
  };

  const resetNoticeList = () => {
    chrome.storage.local.set({ "notice": [] });
    chrome.runtime.sendMessage({
      type: "EDIT_NOTICE", 
      notice: []
    });
    setResetNotice(true);
  };

  return (
      <div className="setting">
        <div className="block">
          <h2 className="block-title">#팔로우 설정</h2>
          <p className="block-desc">클릭 후 되돌릴 수 없습니다.</p>
          <button className="btn-outline btn-warning" onClick={resetFollowList}>전체 초기화</button>
          { isResetFollow && <p className="alert-msg">초기화 완료!</p> }
        </div>
        <div className="block">
          <h2 className="block-title">#알림 설정</h2>
          <p className="block-desc">클릭 후 되돌릴 수 없습니다.</p>
          <button className="btn-outline btn-warning"onClick={resetNoticeList}>전체 초기화</button>
          { isResetNotice && <p className="alert-msg">초기화 완료!</p> }
        </div>
        <div className="block">
          <h2 className="block-title">#정보</h2>
          <p className="block-desc">버그 제보, 피드백, PR 모두 감사합니다.</p>
          <button className="btn" onClick={ () => { window.open("https://github.com/kyechan99/velog-follow"); } }>
              <img className="github-img" src={GithubIcon} alt="github"/>
          </button>
        </div>
      </div>
  );
};