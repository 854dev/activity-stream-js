# activity-stream-js
액티비티 스트림 데이터 생성기
From [TypeScript Boilerplate for 2022](https://github.com/metachris/typescript-boilerplate
)

## 개요
- 액티비티 스트림 데이터를 생성하는 데모 프로젝트입니다.

- 액티비티 스트림 데이터는 [Activity Streams 2.0](https://www.w3.org/TR/activitystreams-core/) 표준을 따릅니다.


## 구성
- src/activity-stream : 액티비티 스트림 객체를 생성
- src/storage : 객체를 저장하고 불러옴
- src/service : 글쓰기, 팔로우, 좋아요 등의 서비스 제공

- activity-stream-storage 는 firestore와 postgresql 중 하나를 선택하여 사용할 수 있습니다.

## 기능
- 액티비티 스트림 객체를 생성하며, 수정하여 저장할 수 있음

- 액티비티 스트림의 액티비티와 액터 중 일부가 구현되어 있습니다.

- 구현 예정 기능
  - 액터 관리
    - [ ] 정보 수정
    - [ ] 액터 삭제
    - [ ] 정보 조회
    - [ ] Profile 데이터 관리
    - [ ] AccountSetting 데이터 관리
  - 액티비티 관리
    - [ ] 액티비티 생성
    - [ ] 액티비티 수정
    - [ ] 액티비티 삭제
    - [ ] 액티비티 조회
  - 오브젝트 관리
    - [ ] 오브젝트 생성
    - [ ] 오브젝트 수정
    - [ ] 오브젝트 삭제
    - [ ] 오브젝트 조회
    - [ ] 오브젝트에 댓글 달기

- 현재 구현 및 예정 오브젝트 :
[ ] Note
[ ] Image
[ ] Place 
[ ] Profile 
[ ] Tombstone

- 정해진 유형의 액티비티 생성 : 
[ ] Create
[ ] Update
[ ] Delete
[ ] Follow
[ ] Like
[ ] Mention