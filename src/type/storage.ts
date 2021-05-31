
// 기본 유저 데이터
export type USER_TYPE = {
    // 팔로우한 날짜
    followAt: string
}

// Storage 에 저장될 유저 데이터들
export type STORAGE_FOLLOWING = {
    /*
        "대상이름1" : {
            "followAt": "팔로우한 날짜"
        },
        "대상이름2" : {
            "followAt": "팔로우한 날짜"
        },
    */
    [targetUser: string]: USER_TYPE;
}


// 포스트 데이터
export type POST = {
    title: string | '';
    link: string | '';
    pubDate: string | '';
}

// 알림 데이터
export type NOTICE = {
    title: string;
    link: string;
}
