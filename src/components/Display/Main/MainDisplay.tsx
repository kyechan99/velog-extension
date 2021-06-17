import * as React from "react";

import "@assets/base.scss";
import "./MainDisplay.scss";


export const MainDisplay = () => {
  let versionList = [
        {
            tag: '1.0.0',
            list: [
                '첫 정식버전입니다!',
                '브라우저 상에서 팔로우 상태 버튼 띄우기',
                '브라우저 상에서 알림 목록 띄우기',
                '크롬 확장프로그램에서 팔로우|알림 관리하기'
            ]
        }
  ];

  return (
      <div className="main scroll-content">
        <div className="version-content">
            {
                versionList.map((e, idx)=> 
                    <div className="version">
                        <h2 className="version-tag">
                            v{e.tag}
                            { idx === 0 && <span className="version-latest">NEW</span>}
                        </h2>
                        <ul className="version-list">
                            {
                                e.list.map((l) => 
                                    <li>{l}</li>
                                )
                            }
                        </ul>
                    </div>
                )
            }
        </div>
      </div>
  );
};