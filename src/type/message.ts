
import { STORAGE_FOLLOWING, POST } from './storage';

// [팔로우 상태 정보] - 요청
//- targetUser: 팔로우한 상대인지 확인할 유저 id
interface RequestFollow {
  type: "REQUEST_FOLLOW_STATE";
  targetUser: string;
}
// [팔로우 상태 정보] - 응답
//- follow: true(팔로우함), false(팔로우안함)
interface Follow {
  type: "FOLLOW_STATE";
  follow: boolean;
}


// [팔로우중인 유저 정보] -  요청
interface RequestFollowing {
  type: "REQUEST_FOLLOWING";
}
// [팔로우중인 유저 정보] - 응답
interface Following {
  type: "FOLLOWING";
  following: STORAGE_FOLLOWING;
}


interface RequestNotice {
  type: "REQUEST_NOTICE_REFRESH";
}
interface ResponseNotice {
  type: "RESPONSE_NOTICE_REFRESH";
  notice: POST[];
  following: STORAGE_FOLLOWING;
  recentAt: string;
}
interface RefreshNotice {
  type: "REFRESH_NOTICE";
  notice: POST[];
  recentAt: string;
}
interface EditNotice {
  type: "EDIT_NOTICE";
  notice: POST[];
}
interface Notice {
  type: "NOTICE";
  notice: POST[];
}


// [팔로우 상태 변경 요청]
//- targetUser: 상태를 변경할 유저 id
interface ChangeFollow {
  type: "CHANGE_FOLLOW_STATE";
  targetUser: string;
}


// [새로고침]
//- 페이지가 이동되었으니 contents 내용도 새로고침 요청
interface PageRefresh {
  type: "REFRESH";
}

// 에러 메세지
interface Error {
  type: "ERROR";
}

export type MESSAGE_TYPE = RequestFollow | Follow | 
                          RequestFollowing | Following | 
                          RequestNotice | ResponseNotice | RefreshNotice | EditNotice | Notice | 
                          ChangeFollow | 
                          PageRefresh | 
                          Error;