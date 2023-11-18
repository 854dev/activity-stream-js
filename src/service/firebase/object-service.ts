/**
 * Object service
 * 오브젝트 객체의 생성, 수정, 삭제, 조회를 담당하는 서비스
 */
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { AsObject } from "../../activity-stream/types/core";
import { WithPublishDate } from "../../activity-stream/types/util";
import { firebaseDB } from "./config/init";
import COLLECTION_NAME from "./config/collection-name";

type publishibleObject = WithPublishDate<AsObject>;

const objectService = {
  /**
   * Create object
   */
  create: async (target: AsObject) => {
    const result = target as publishibleObject;

    // 게시글 작성 시간을 firebase Timestamp에서 ISOString으로 변환하여
    result.createdAt = Timestamp.now().toDate().toISOString();

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함
    const noteRef = doc(firebaseDB, COLLECTION_NAME.OBJECT);
    return setDoc(noteRef, result);
  },

  /**
   * Read object
   * TODO : 피드 화면 진입시, 페이징 진행시, 마이페이지 진입시 쿼리 조건을 분기하여 쿼리를 날린다.
   */
  read: async (option: {
    ids?: string[];
    lastItem?: string;
    actor?: string;
    limitCount?: number;
    type?: string;
  }) => {
    const { lastItem, actor, limitCount = 10, type } = option || {};

    // Collection 을 가져온다.
    const objCollection = collection(firebaseDB, COLLECTION_NAME.OBJECT);

    const lastItemRef = doc(
      firebaseDB,
      `${COLLECTION_NAME.OBJECT}/${lastItem}`
    );

    const lastItemSnapshot = lastItem ? await getDoc(lastItemRef) : null;

    // 피드 화면 진입시 쿼리조건
    const firstQuery = query(
      objCollection,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    // 페이징 진행시 쿼리조건
    const startAfterQuery = query(
      objCollection,
      orderBy("createdAt", "desc"),
      limit(limitCount),
      startAfter(lastItemSnapshot)
    );

    // 마이페이지 진입시 쿼리 조건
    const actorQuery = actor
      ? query(
          objCollection,
          orderBy("createdAt", "desc"),
          where("author", "==", actor),
          limit(limitCount)
        )
      : null;

    // 비동기 요청 날리기
    const finalQuery = (() => {
      if (actor) {
        return actorQuery;
      }
      return lastItem ? startAfterQuery : firstQuery;
    })();

    const postRes = await getDocs(finalQuery);

    return;
  },

  /**
   * Update object
   */
  update: (id: string, target: AsObject) => {
    const result = target as publishibleObject;

    // 게시글 작성 시간을 firebase Timestamp에서 ISOString으로 변환하여
    result.updatedAt = Timestamp.now().toDate().toISOString();

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함
    const noteRef = doc(firebaseDB, COLLECTION_NAME.OBJECT, id);
    return setDoc(noteRef, result);
  },

  /**
   * Delete object
   */
  delete: async (id: string) => {
    const collectionToGet = COLLECTION_NAME.OBJECT;
    const objRef = doc(firebaseDB, collectionToGet, id);
    return deleteDoc(objRef);
  },
};

export default objectService;
