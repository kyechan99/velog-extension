import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_FOLLOWING, NOTICE } from "@src/type/storage";
import "@assets/base.scss";
import "./NoticeDisplay.scss";


export type NoticeProps = {
  title: string;
  link: string;
  idx: number;
  editMode: boolean;
  selected: boolean;
  setRemoveTarget: (idx:number) => void
}

const Notice = ( { title, link, idx, editMode, selected, setRemoveTarget }: NoticeProps ) => {
  const author = link.match(/(?<=\/\@).+?(?=\/)/g);
  
  const onClick = () => {
    if (editMode) {
      setRemoveTarget(idx);
    } else {
      window.open(link);
    }
  }
  
  return (
    <button className={`notice ${editMode ? (selected ? 'selected' : 'ready-selected') : ''}`} onClick={ onClick }>
      <p className="notice-author">{ author ? '@'+author[0] : 'NULL' }</p>
      <p className="notice-title">{ title }</p>
    </button>
  )
}




type NoticeListProps = {
  isContents: boolean
}

const NoticeList = ({ isContents = true }: NoticeListProps ) => {
  const [notices, setNotices] = React.useState<NOTICE[]>([]);
  const [editMode, setEditMode] = React.useState(false);
  const [removeList, setRemoveList] = React.useState<number[]>([]);


  // state 변경 전에 같은 변수를 이용해서 먼저 데이터 수정함.
  let storageRecent: Date;
  let followListData : STORAGE_FOLLOWING = {};
  let noticeListData : NOTICE[] = [];
  let tempData : NOTICE[] = [];


  // 삭제모드시, 삭제할 대상을 눌렀을때 호출됨.
  //- 해당 대상을 삭제 대상에 추가할지 해제할지
  const setRemoveTarget = React.useCallback(
    idx => {
      if (removeList?.indexOf(idx) < 0) {
        // 삭제 목록에 없으니 추가함
        setRemoveList(removeList?.concat(idx));
      } else {
        // 이미 삭제 목록에 추가된 상태이니 제거함
        removeList.splice(idx, 1);
      }
    },
    [removeList]
  )

  // 편집 완료되었을때 state를 변경하고 background에게 수정된 데이터 보내줌
  const sendCompleteNoticeList = () => {
    setNotices(noticeListData);
    setRemoveList([]);

    chrome.storage.local.set({ "notice": noticeListData });
    chrome.runtime.sendMessage({
      type: "EDIT_NOTICE", 
      notice: noticeListData
    });
    setEditMode(false);
  }

  // 전체 삭제 버튼 클릭
  const onRemoveListAll = () => {
    if (notices?.length == 0)
      return;

    noticeListData = [];
    
    sendCompleteNoticeList();
  };

  // 일부 삭제 버튼
  const onRemoveList = () => {
    if (removeList?.length == 0)
      return;

    noticeListData = notices;
    removeList?.forEach((idx) => {
      if (noticeListData && (noticeListData?.length || 0 < idx))
        delete noticeListData[idx];
    })
    noticeListData = noticeListData?.filter(e=>e != undefined);

    sendCompleteNoticeList();
  };

  // Notice 목록 새로고침. Rss 에서 새 포스트가 있는지 확인후 가져옴
  const refreshNotice = async () => {
    try {
      tempData = [];
      for (let key in followListData) {
        await $.ajax(`https://v2.velog.io/rss/${key}`, {
          accepts: {
            xml: "application/rss+xml"
          },
        
          dataType: "xml",
        
          success: function(data) {
            $(data).find("channel").find("item").each(() => {
              const el = $(this);
              let postData = new Date(el.find("pubDate").text());
              // 최근 업데이트 날짜 이후에 작성된 글이며 팔로우 한 날보다 뒤의 글이여야 함
              if (storageRecent < postData && new Date(followListData[key].followAt) < postData) {
                tempData.push({
                  title: el.find("title").text(),
                  link: el.find("link").text()
                });
              } else {
                return;
              }
            });
          }
        });
      }

      // 새로 발견한 글이 추가되었다면  저장소에 저장하고 background에 변경사항을 보냄
      //- background 내에서 새로 storage 값을 가져오게 해도 되지만 비동기 호출이 연속으로 들어가 비효율적이라 판단
      if (tempData.length > 0) {
        // 팔로워들 순으로 검색한 공지를 순서대로 입력하기 때문에 디테일한 시간 정렬은 되지 않음 (필요한지 고민중)
        noticeListData = [...tempData, ...noticeListData];

        setNotices(noticeListData);
        storageRecent = new Date();
        chrome.storage.local.set({ "recent": storageRecent.toString() });
        chrome.storage.local.set({ "notice": noticeListData });
        
        chrome.runtime.sendMessage({
          type: "REFRESH_NOTICE", 
          notice: noticeListData, 
          recentAt: storageRecent.toString()
        })
      }
    } catch (err) { 
      // 메세지를 잘못 읽었거나 대체로 보내야할 tabId 창이 사라졌을때 들어옴
      console.error(err);
    }
  }

  // background 로부터의 리스터
  const checkMsg = (message: MESSAGE_TYPE) => {
    switch (message.type) {
      case "RESPONSE_NOTICE_REFRESH":
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        // 백그라운드에 저장되 있던 임시 데이터를 먼저 받아옴
        noticeListData = message.notice;
        followListData = message.following;
        storageRecent = new Date(message.recentAt);
        setNotices(noticeListData);

        // rss 에서 신규 데이터 여부 확인 및 저장
        refreshNotice();
        break;

      default:
        break;
    }
  }

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "REQUEST_NOTICE_REFRESH" });
    chrome.runtime.onMessage.addListener(checkMsg);

    return () => {
      chrome.runtime.onMessage.removeListener(checkMsg);
    };
  }, []);

  return  (
    <>
      { !isContents && 
          <div className="edit-menu">
            {
              !editMode ? (
                  <>
                    <button className="btn first-btn" onClick={() => setEditMode(true)}>편집</button>
                  </>
              ) : (
                <>
                  <button className="btn first-btn" onClick={() => setEditMode(false)}>취소</button>
                  <button className="btn" onClick={onRemoveListAll}>모두 삭제</button>
                  <button className="btn danger" onClick={onRemoveList}>삭제</button>
                </>
              )
            }
          </div>
      }
      <div className={`notice-list scroll-content ${isContents ? "contents-notice-list" : "popup-notice-list"}`}>
        {
          notices.length > 0 ?
            notices?.map((e, idx) => {
              return <Notice 
                title={e.title} 
                link={e.link} 
                key={idx}
                idx={idx}
                editMode={editMode}
                selected={removeList.indexOf(idx) >= 0}
                setRemoveTarget={setRemoveTarget}
              ></Notice>
            })
            :
            <>
              <p className="notice-msg">
                알림 내역이 없습니다.
              </p>
              <p className="notice-msg">
                아직 팔로우 이후 새로 올라온 글이 없거나 새로 고침 후 나타날 수도 있습니다.
              </p>
            </>
        }
      </div>
    </>
  );
};



export const NoticeDisplay = ({ isContents=true }: NoticeListProps ) => {
  return (
      <NoticeList isContents={isContents}></NoticeList>
  );
};