import React from 'react';
import './App.scss';

import { NoticeMenu, FollowMenu, SettingMenu } from '@components/Button/Menu/MenuButton';
import Logo from './logo.png';

import { NoticeDisplay } from '@components/Display/Notice/NoticeDisplay';
import { FollowDisplay } from '@components/Display/Follow/FollowDisplay';


function Layout() {
  const [menu, setMenu] = React.useState('noticeList');

  return (
    <>
      <div className="sidebar">
          <img className="logo" src={Logo} alt="logo"/>
          <NoticeMenu active={menu=='noticeList'} setMenu={setMenu} to={'noticeList'}></NoticeMenu>
          <FollowMenu active={menu=='followList'} setMenu={setMenu} to={'followList'}></FollowMenu>
          <SettingMenu active={menu=='setting'} setMenu={setMenu} to={'setting'}></SettingMenu>
      </div>
      <div className="content">
        {
          {
            noticeList: <NoticeDisplay isContents={false}></NoticeDisplay>,
            followList: <FollowDisplay></FollowDisplay>,
            setting: <p>설정 목록</p>,
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