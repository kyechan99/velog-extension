import React from 'react';
import './App.scss';

import { NoticeMenu, FollowMenu, SettingMenu } from './components/Menu/MenuButton';
import { MenuButton } from './components/Menu/MenuButton';
import Logo from './logo.png';

// let menu = 'noticeList';

// const onClick = () => {

// }

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
            noticeList: <p>알림 목록</p>,
            followList: <p>팔로우 목록</p>,
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