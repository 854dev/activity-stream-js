import { nanoid } from 'nanoid';
import ASAgendaBoardExt from '../../activity-stream/group/agenda-board';
import ASBoardExt from '../../activity-stream/group/board';
import ASGroup, { AsGroup } from '../../activity-stream/group/group';
import objectService from './object-service';
import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  QueryConstraint,
} from 'firebase/firestore';
import { firebaseDB } from './config/init';
import ASNote, { ASNoteConstructor, AsNote } from '../../activity-stream/object/note';
import { AsProfile } from '../../activity-stream/object/profile';
import { AsObject } from '../../activity-stream/types/core';
import fileService from './file-service';
import COLLECTION_NAME from './config/collection-name';
import ASLike, { AsLikeParams } from '../../activity-stream/activity/like';

/**
 * @fileoverview group service
 * 그룹 생성, 수정, 삭제, 조회를 담당하는 서비스
 *
 * 그룹 하위에 오브젝트를 생성, 수정, 삭제, 조회하는 서비스는 object-service.ts 에서 담당
 *
 * 로컬링크에서 그룹은 지역단위 구분을 위해 사용되고 있음
 *
 * 오브젝트 계층
 * 하위 계층인 Agenda 와 Wall 오브젝트를 생성 및 수정할 때, 그룹의 id 를 참조해야 함
 *
 */
const groupService = {
  /**
   * 그룹 만들기
   * @param target
   */
  createGroup: async (target: { id: string; name: string }) => {
    // type="Group" 인 오브젝트 생성
    // 그룹 오브젝트 생성
    const profileToSend = new ASGroup(target);

    const response = await objectService.create(profileToSend, {
      collectionName: 'group',
    });

    // 만들어진 그룹 오브젝트를 반환
    return response;
  },

  /**
   * 그룹 정보 업데이트
   * @param target
   */
  updateGroup: async (id: string, target: Partial<AsGroup>) => {
    // id 에 해당하는 그룹 오브젝트를 업데이트
    const response = await objectService.update(id, { ...target }, 'group');
  },

  /**
   * 그룹 목록 조회
   */
  getGroupList: async () => {
    // 그룹 오브젝트 목록을 조회
    const response = await objectService.getList<AsGroup>({}, 'group');
    return response;
  },

  /**
   * 전체 게시판 목록 조회. Board와 AgendaBoard를 모두 조회
   */
  getAllBoardList: async (attributedTo: string) => {
    // 그룹 오브젝트 목록을 조회
    const response = await objectService.getManyWhere<ASBoardExt | ASAgendaBoardExt>('board', {
      attributedTo,
    });
    return response;
  },

  /**
   * Board 오브젝트 생성
   */
  createBoard: async (target: { id: string; name: string; attributedTo: string }) => {
    // type="Board" 인 오브젝트 생성
    const board = new ASBoardExt(target);

    const response = await objectService.create(board, {
      collectionName: 'board',
    });

    // 만들어진 그룹 오브젝트를 반환
    return response;
  },

  /**
   * id로 Board 오브젝트 조회
   */
  getBoardById: async <Board = ASBoardExt>(id: string) => {
    // type="Board" 인 오브젝트 생성
    const board = await objectService.getOne<Board>(id, 'board');
    return board;
  },

  /**
   * AgendaBoard 오브젝트 생성
   */
  createAgendaBoard: async (target: {
    id?: string;
    name: string;
    attributedTo: string;
    startTime: string;
    endTime: string;
    voteOptions: string[];
  }) => {
    // type="AgendaBoard" 인 오브젝트 생성
    const agendaBoard = new ASAgendaBoardExt({ ...target, id: target.id ?? nanoid() });

    const response = await objectService.create(agendaBoard, {
      collectionName: 'board',
    });

    // 만들어진 오브젝트를 반환
    return response;
  },

  /**
   * actor 키가 존재하는 오브젝트에 대해, actor 프로퍼티를 Profile 객체로 변환
   */
  getProfileListByActor: async (targetObjectList: AsObject[]) => {
    /** obj 가 actor 키를 가졌는지 판단 */
    function hasActor(obj: AsObject): obj is AsObject {
      return obj.actor !== undefined || obj.actor !== '' || obj.actor !== null;
    }

    /** actor 값 목록 */
    const actorList = targetObjectList.filter(hasActor).map((obj) => obj.actor);

    /** actorList가 빈 배열이라면 리턴 */
    if (actorList.length === 0) {
      return targetObjectList;
    }

    // actor 프로퍼티가 존재하는 오브젝트들의 actor 프로퍼티를 Profile 객체로 변환
    const profileList = await objectService.getUserListByUids(actorList);
    const profileListData = profileList.docs;

    // actor 프로퍼티를 Profile 객체로 변환한 값을 저장
    targetObjectList.forEach((obj) => {
      const profileSnapshot = profileListData.find((profile) => profile.id === obj.actor);
      const profileData = profileSnapshot?.data() as AsProfile;

      if (profileSnapshot) {
        obj.profile = profileData;
      }
    });

    // 변환된 오브젝트 목록 반환
    return targetObjectList;
  },

  /**
   * Board 의 게시물 목록에 대하여 내가 좋아요를 눌렀는지 여부를 판단
   */
  getFeedNoteListWithLike: async (objIds: AsObject[], uid: string) => {
    // activity 컬렉션에서 id 가 objIds 이고 actor 가 uid, type 이 Like 인 오브젝트 목록을 가져온다
    const actRef = collection(firebaseDB, COLLECTION_NAME.ACTIVITY);

    const whereList: QueryConstraint[] = [];

    // 날짜 조건 추가
    whereList.push(where('deletedAt', '==', null));
    whereList.push(orderBy('createdAt', 'desc'));

    // id 조건 추가
    whereList.push(
      where(
        'object',
        'in',
        objIds.map((obj) => obj.id)
      )
    );

    // actor 조건 추가
    whereList.push(where('actor', '==', uid));

    // type 조건 추가
    whereList.push(where('type', '==', 'Like'));

    // 쿼리 실행
    const querySnapshot = await getDocs(query(actRef, ...whereList));

    // querySnapshot 을 ASLike 객체로 변환
    const likeList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as AsLikeParams;
      return new ASLike(data);
    });

    // objIds 에 해당하는 오브젝트 목록에 isLiked 프로퍼티를 추가
    const result = objIds.map((obj) => {
      const like = likeList.find((like) => like.object === obj.id);
      obj.isLiked = like ? true : false;
      return obj;
    });

    // result 를 반환
    return result;
  },

  /**
   * Board 의 게시물 목록을 조회
   */
  getFeedNoteList: async (
    boardId: string,
    option?: { lastItem?: string; limitCount?: number; likedActor?: string }
  ) => {
    try {
      const { lastItem, limitCount = 10, likedActor } = option || {};

      const collectionToGet = 'object';

      // Collection 을 가져온다.
      const noteCollection = collection(firebaseDB, collectionToGet);
      const lastItemRef = doc(firebaseDB, `${collectionToGet}/${lastItem}`);
      const lastItemSnapshot = lastItem ? await getDoc(lastItemRef) : null;

      // 쿼리 조건 별로 쿼리를 만든다.
      const queries: QueryConstraint[] = [
        where('type', '==', 'Note'),
        where('attributedTo', '==', boardId),
        where('deletedAt', '==', null),
        orderBy('createdAt', 'desc'),
        limit(limitCount),
      ];

      // startAfter 쿼리를 추가한다.
      if (lastItem) {
        queries.push(startAfter(lastItemSnapshot));
      }

      const postRes = await getDocs(query(noteCollection, ...queries));

      // 결과값 을 Note 객체로 변환
      const postList = postRes.docs.map((doc) => {
        const data = doc.data() as ASNoteConstructor;
        return new ASNote(data);
      });

      // postList 빈 배열이라면, 빈 배열을 반환한다.
      if (postList.length === 0) {
        return [];
      }

      // 결과값들의 profile 정보를 가져온다
      const addedProfileList = await groupService.getProfileListByActor(postList);

      // 결과값들의 isLiked 정보를 가져온다
      if (likedActor) {
        const addedIsLikedList = await groupService.getFeedNoteListWithLike(
          addedProfileList,
          likedActor
        );

        return addedIsLikedList;
      }

      console.log(addedProfileList);

      return addedProfileList;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * 특정 유저가 작성한 게시물 목록을 조회
   * 프로필과 마이페이지에서 사용
   */
  getFeedNoteListByActor: async (
    actor: string,
    option?: { lastItem?: string; limitCount?: number }
  ) => {
    try {
      const { lastItem, limitCount = 10 } = option || {};

      const collectionToGet = 'object';

      // Collection 을 가져온다.
      const noteCollection = collection(firebaseDB, collectionToGet);
      const lastItemRef = doc(firebaseDB, `${collectionToGet}/${lastItem}`);
      const lastItemSnapshot = lastItem ? await getDoc(lastItemRef) : null;

      // 쿼리 조건 별로 쿼리를 만든다.
      const queries: QueryConstraint[] = [
        where('type', '==', 'Note'),
        where('actor', '==', actor),
        where('deletedAt', '==', null),
        orderBy('createdAt', 'desc'),
        limit(limitCount),
      ];

      // startAfter 쿼리를 추가한다.
      if (lastItem) {
        queries.push(startAfter(lastItemSnapshot));
      }

      const postRes = await getDocs(query(noteCollection, ...queries));

      // 결과값 을 Note 객체로 변환
      const postList = postRes.docs.map((doc) => {
        const data = doc.data() as ASNoteConstructor;
        return new ASNote(data);
      });

      // postList 빈 배열이라면, 빈 배열을 반환한다.
      if (postList.length === 0) {
        return [];
      }

      // 결과값들의 profile 정보를 가져온다
      const addedProfileList = await groupService.getProfileListByActor(postList);
      return addedProfileList;
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * 게시물 등록
   */
  createFeedNote: async (boardId: string, target: ASNoteConstructor, imageFile?: File) => {
    // type="Note" 인 오브젝트 생성
    const asNote = new ASNote(target);

    // attributedTo 프로퍼티에 boardId 를 추가
    if (!asNote.attributedTo) {
      asNote.attributedTo = boardId;
    }

    // 이미지 파일이 존재한다면, 이미지를 업로드하고, 이미지 주소를 asNote.image 에 추가
    if (imageFile) {
      const imageResponse = await fileService.uploadImage(imageFile, 'object');
      asNote.image = imageResponse;
    }

    // 저장
    const response = await objectService.create(asNote, {
      collectionName: 'object',
    });

    // 만들어진 오브젝트를 반환
    return response;
  },

  /**
   * 게시물에 댓글 남기기
   */
  createFeedNoteReply: async (
    noteId: string,
    replyTarget: ASNoteConstructor,
    noteTarget: ASNoteConstructor
  ) => {
    // type="Note" 인 오브젝트 생성
    const asReplyNote = new ASNote(replyTarget);

    // 댓글생성, 갯수증가 동시요청을 위해 id를 미리 생성
    const replyId = nanoid();
    asReplyNote.id = replyId;

    // inReplyTo 프로퍼티에 noteId 를 추가
    if (!asReplyNote.inReplyTo) {
      asReplyNote.inReplyTo = noteId;
    }

    // 생성 요청
    const createReq = objectService.create(asReplyNote, {
      collectionName: 'object',
    });

    // 원 글의 repliesCount 프로퍼티에 1 추가
    const updateReq = objectService.update(
      noteId,
      { repliesCount: noteTarget.repliesCount + 1 },
      'object'
    );

    // create, update 동시 요청
    const response = await Promise.all([createReq, updateReq]);

    // 만들어진 오브젝트를 반환
    return asReplyNote;
  },

  /**
   * 게시물 댓글 보기
   */
  getFeedNoteReplyList: async (noteId: string, lastItem?: string) => {
    // type="Note" 인 오브젝트 생성
    const response = await objectService.getManyWhere<AsNote>(
      'object',
      {
        inReplyTo: noteId,
      },
      {
        lastItem,
        limitCount: 10,
      }
    );

    // 만들어진 오브젝트 배열에 profile 프로퍼티 추가
    const addedProfileList = await groupService.getProfileListByActor(response);

    return addedProfileList;
  },

  /**
   * 게시물 삭제
   */
  deleteFeedNote: async (id: string) => {
    const response = await objectService.delete(id, 'object');
    return response;
  },
};

export default groupService;
