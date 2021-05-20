// 팔로우 정보를 요청하는 메세지
interface RequestFollow {
  type: "REQUEST_FOLLOW_STATE";
  targetUser: string;
}

interface Follow {
  type: "FOLLOW_STATE";
  follow: boolean;
}

interface ChangeFollow {
  type: "CHANGE_FOLLOW_STATE";
  targetUser: string;
}

interface PageRefresh {
  type: "REFRESH";
}

interface Error {
  type: "ERROR";
}

export type MESSAGE_TYPE = RequestFollow | Follow | ChangeFollow | PageRefresh | Error;