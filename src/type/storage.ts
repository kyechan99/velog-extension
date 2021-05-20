
// Storage 에 저장될 기본 유저 데이터
export type USER_TYPE = {
    // 팔로우한 날짜
    followAt: Date
}

// Storage 에 저장될 통합 데이터
export type STORAGE_TYPE = {
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