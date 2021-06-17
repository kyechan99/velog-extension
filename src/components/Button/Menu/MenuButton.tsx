import * as React from "react";
import Icon from '@src/components/Icon';
import "./MenuButton.scss";

type MenuButtonProps = {
    children?: React.ReactNode,
    active: boolean,
    setMenu: (s: string) => void,
    to: string
}
// 메뉴 버튼의 Default 형태
export const MenuButton = ({ children, active, setMenu, to } : MenuButtonProps ) => {
    return (
      <button 
        className={`menu ${active ? "active" : "" }`}
        onClick={() => { setMenu(to) }}
      >
        {children}
      </button>
    );
};



type MenuProps = {
  active: boolean,
  setMenu: (s: string) => void,
  to: string
}
// 홈 메뉴
export const MainMenu = ({ active, setMenu, to } : MenuProps ) => {
    return (
        <MenuButton 
          active={active}
          setMenu={setMenu} 
          to={to}
        >
          <Icon d={"M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2h-.001z"}></Icon>
          홈
        </MenuButton>
    );
};
// 알림 내역 메뉴
export const NoticeMenu = ({ active, setMenu, to } : MenuProps ) => {
    return (
        <MenuButton 
          active={active}
          setMenu={setMenu} 
          to={to}
        >
          <Icon d={"M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"}></Icon>
          알림 내역
        </MenuButton>
    );
};
// 팔로우 목록 메뉴
export const FollowMenu = ({ active, setMenu, to } : MenuProps ) => {
    return (
        <MenuButton 
          active={active}
          setMenu={setMenu} 
          to={to}
        >
          <Icon d={"M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"}></Icon>
          팔로우 목록
        </MenuButton>
    );
};
// 설정 메뉴
export const SettingMenu = ({ active, setMenu, to } : MenuProps ) => {
    return (
        <MenuButton 
          active={active}
          setMenu={setMenu} 
          to={to}
        >
          <Icon d={"M5.433 2.304A4.494 4.494 0 003.5 6c0 1.598.832 3.002 2.09 3.802.518.328.929.923.902 1.64v.008l-.164 3.337a.75.75 0 11-1.498-.073l.163-3.33c.002-.085-.05-.216-.207-.316A5.996 5.996 0 012 6a5.994 5.994 0 012.567-4.92 1.482 1.482 0 011.673-.04c.462.296.76.827.76 1.423v2.82c0 .082.041.16.11.206l.75.51a.25.25 0 00.28 0l.75-.51A.25.25 0 009 5.282V2.463c0-.596.298-1.127.76-1.423a1.482 1.482 0 011.673.04A5.994 5.994 0 0114 6a5.996 5.996 0 01-2.786 5.068c-.157.1-.209.23-.207.315l.163 3.33a.75.75 0 11-1.498.074l-.164-3.345c-.027-.717.384-1.312.902-1.64A4.496 4.496 0 0012.5 6a4.494 4.494 0 00-1.933-3.696c-.024.017-.067.067-.067.16v2.818a1.75 1.75 0 01-.767 1.448l-.75.51a1.75 1.75 0 01-1.966 0l-.75-.51A1.75 1.75 0 015.5 5.282V2.463c0-.092-.043-.142-.067-.159zm.01-.005z"}></Icon>
          설정
        </MenuButton>
    );
};

