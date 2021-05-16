// 팔로우 정보를 요청하는 메세지
interface FollowRequest {
  type: "REQUEST_FOLLOW_STATE";
}

interface Follow {
  type: "FOLLOW_STATE";
  follow: boolean;
}

interface ChangeFollow {
  type: "CHANGE_FOLLOW_STATE";
  follow: boolean;
}

export type MESSAGE_TYPE = FollowRequest | Follow | ChangeFollow;