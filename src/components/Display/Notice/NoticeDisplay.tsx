import * as React from "react";
import { MESSAGE_TYPE } from "@src/type/message";
import { STORAGE_FOLLOWING, NOTICE } from "@src/type/storage";
import "./NoticeDisplay.scss";



const Notice = ( { title, link }: NOTICE ) => {
  const author = link.match(/(?<=\/\@).+?(?=\/)/g);
  
  return (
    <button className="notice" onClick={ () => { window.open(link); } }>
      <p className="notice-author">{ author ? '@'+author[0] : 'NULL' }</p>
      <p className="notice-title">{ title }</p>
    </button>
  )
}

type NoticeListProps = {
  contents: boolean
}

const NoticeList = ({ contents=true }: NoticeListProps ) => {
  const [notices, setNotices] = React.useState<NOTICE[]>();

  let storageRecent: Date;
  let followListData : STORAGE_FOLLOWING = {};
  let noticeListData : NOTICE[] = [];
  let tempData : NOTICE[] = [];

  const refreshNotice = async () => {
    console.log('-- 이전 시각 ', storageRecent);
    try {
      tempData = [];
      for (let key in followListData) {
      // Object.keys(followListData).map(async (key) => {
        await $.ajax(`https://v2.velog.io/rss/${key}`, {
          accepts: {
            xml: "application/rss+xml"
          },
        
          dataType: "xml",
        
          success: function(data) {
            // console.log(' 검색 중입니다 !!!!!!!');
            $(data)
              .find("channel")
              .find("item")
              .each(function() {
                const el = $(this);
                if (storageRecent < new Date(el.find("pubDate").text())) {
                  tempData.push({
                    title:  el.find("title").text(),
                    link:  el.find("link").text()
                  });
                  // console.log(' 저장 완료 ');
                }  else {
                  // console.log('post  date : ', new Date(el.find("pubDate").text()));
                }
                // const template = `
                //   <article>
                //     <img src="${el.find("link").text()}/image/large.png" alt="">
                //     <h2>
                //       <a href="${el
                //         .find("link")
                //         .text()}" target="_blank" rel="noopener">
                //         ${el.find("title").text()}
                //       </a>
                //     </h2>
                //   </article>
                // `;
        
                // document.body.insertAdjacentHTML("beforeend", template);
              });
          }
        });
        // await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https%3A//v2.velog.io/rss/${key}`)
        //           .then((response) => {
        //               return response.json();
        //           })
        //           .then((data) => {
        //               console.log(key, data);
        //               if (data.items)
        //                 data.items.slice(0, 10).forEach((item: POST) => {
        //                     console.log('만큼 호출됨! ', item.title, item.pubDate);
        //                     if (storageRecent < new Date(item.pubDate + ' GMT')) {
        //                       console.log('진짜로 입력됩니다.');
        //                       noticeListData.push( {
        //                         title: item.title,
        //                         link: item.link
        //                       });
        //                     }
        //                 });
        //           })
          console.log('호출 완료 ');
      }
      console.log('모두 읽기 끗 ', noticeListData);

      // 새로 발견한 글이 추가되었다면  저장소에 저장하고 background에 변경사항을 보냄
      //- background 내에서 새로 storage 값을 가져오게 해도 되지만 비동기 호출이 연속으로 들어가 비효율적이라 판단
      if (tempData.length > 0) {
        // 팔로워들 순으로 검색한 공지를 순서대로 입력하기 때문에 디테일한 시간 정렬은 되지 않음 (필요한지 고민중)
        noticeListData = [...tempData, ...noticeListData];

        setNotices(noticeListData);
        storageRecent = new Date();
        chrome.storage.local.set({ "recent": storageRecent.toString() });
        chrome.storage.local.set({ "notice": noticeListData });
        console.log('-- 마치고 난후 시각 ', storageRecent);
    
        // console.log(tabId ,' 에게 보냅니다');
    
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

  const checkMsg = (message: MESSAGE_TYPE) => {
    console.log('!!!!!!!!! 메세지 도착함 !!!!!! ', message);
    switch (message.type) {
      case "RESPONSE_NOTICE_REFRESH":
        // setMsg('이 메세지 보여야됨');
        console.log('!!!!!!!!! RESPONSE_NOTICE_REFRESH !!!!!! ');
        noticeListData = message.notice;
        setNotices(noticeListData);
        followListData = message.following;
        storageRecent = new Date(message.recentAt);

        refreshNotice();
        // setFollowing(message.following);
        // followListData = message.following;
        // refreshNotice();
        // setMsg('--------')
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    console.log('마운트 됨 !');
    // const RSS_URL = `https://v2.velog.io/rss/hoony0802`;

    // $.ajax(RSS_URL, {
    //   accepts: {
    //     xml: "application/rss+xml"
    //   },
    
    //   dataType: "xml",
    
    //   success: function(data) {
    //     console.log($(data).find(""));
    //     $(data)
    //       .find("channel")
    //       .find("item")
    //       .each(function() {
    //         const el = $(this);
    //         setMsg(el.find("title").text());
    //         // const template = `
    //         //   <article>
    //         //     <img src="${el.find("link").text()}/image/large.png" alt="">
    //         //     <h2>
    //         //       <a href="${el
    //         //         .find("link")
    //         //         .text()}" target="_blank" rel="noopener">
    //         //         ${el.find("title").text()}
    //         //       </a>
    //         //     </h2>
    //         //   </article>
    //         // `;
    
    //         // document.body.insertAdjacentHTML("beforeend", template);
    //       });
    //   }
    // });

    chrome.runtime.sendMessage({ type: "REQUEST_NOTICE_REFRESH" });
    chrome.runtime.onMessage.addListener(checkMsg);

    return () => {
      console.log('언마운트 됨!');
      chrome.runtime.onMessage.removeListener(checkMsg);
    };

  }, []);

  return  (
    <div className={`notice-list ${contents ? "contents-notice-list" : "popup-notice-list"}`}>
      {
        notices?.map((e, idx) => {
          return <Notice 
            title={e.title} 
            link={e.link} 
            key={idx}
          ></Notice>
        })
      }
    </div>
  );
};

export const NoticeDisplay = ({ contents=true }: NoticeListProps ) => {

  return (
    <NoticeList contents={contents}></NoticeList>
  );
};