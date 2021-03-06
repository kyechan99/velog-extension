import React from 'react';
import './App.scss';

import { MainMenu, NoticeMenu, FollowMenu, SettingMenu } from '@components/Button/Menu/MenuButton';
import Logo from './logo.png';

import { MainDisplay } from '@components/Display/Main/MainDisplay';
import { NoticeDisplay } from '@components/Display/Notice/NoticeDisplay';
import { FollowDisplay } from '@components/Display/Follow/FollowDisplay';
import { SettingDisplay } from '@components/Display/Setting/SettingDisplay';


function Layout() {
  const [menu, setMenu] = React.useState('main');

  return (
    <>
      <div className="sidebar">
          <button className="btn" onClick={ () => { window.open("https://velog.io/"); } }>
            <img className="logo" src={Logo} alt="logo"/>
          </button>
          <MainMenu active={menu=='main'} setMenu={setMenu} to={'main'}></MainMenu>
          <NoticeMenu active={menu=='noticeList'} setMenu={setMenu} to={'noticeList'}></NoticeMenu>
          <FollowMenu active={menu=='followList'} setMenu={setMenu} to={'followList'}></FollowMenu>
          <SettingMenu active={menu=='setting'} setMenu={setMenu} to={'setting'}></SettingMenu>
      </div>
      <div className="content">
        {
          {
            main: <MainDisplay></MainDisplay>,
            noticeList: <NoticeDisplay isContents={false}></NoticeDisplay>,
            followList: <FollowDisplay></FollowDisplay>,
            setting: <SettingDisplay></SettingDisplay>
          }[menu]
        }
      </div>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Layout></Layout>
      </header>
    </div>
  );
}

export default App;