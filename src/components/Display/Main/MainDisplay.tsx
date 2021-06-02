import * as React from "react";

import "@assets/base.scss";
import "./MainDisplay.scss";


export const MainDisplay = () => {
  let versionList = [
        {
            tag: '1.0.2',
            list: [
                '어쩌구 저쩌구2',
                '블라 블라2'
            ]
        },
        {
            tag: '1.0.1',
            list: [
                '어쩌구 저쩌구1',
                '블라 블라1'
            ]
        },
        {
            tag: '1.0.0',
            list: [
                '어쩌구 저쩌구',
                '블라 블라'
            ]
        },
        {
            tag: '1.0.0',
            list: [
                '어쩌구 저쩌구',
                '블라 블라'
            ]
        },
        {
            tag: '1.0.0',
            list: [
                '어쩌구 저쩌구',
                '블라 블라'
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