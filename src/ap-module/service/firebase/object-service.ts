/**
 * Object service
 * 오브젝트 객체의 생성, 수정, 삭제, 조회를 담당하는 서비스
 */
import {
  QueryConstraint,
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
  updateDoc,
  where,
} from 'firebase/firestore';
import { AsObject } from '../../activity-stream/types/core';
import { WithPublishDate } from '../../activity-stream/types/util';
import { firebaseDB } from './config/init';
import COLLECTION_NAME from './config/collection-name';
import { nanoid } from 'nanoid';

type publishibleObject = WithPublishDate<AsObject>;

const objectService = {
  /**
   * Create object
   * 주의 : id 프로퍼티가 없으면 nanoid()로 생성
   */
  create: async (
    target: AsObject,
    option?: {
      collectionName?: string;
    }
  ) => {
    const { collectionName } = option || {};

    const result = target as publishibleObject;

    // result 의 프로퍼티로 object 생성
    const resultAsObject = { ...result };

    // id 프로퍼티가 없으면 nanoid()로 생성
    if (!resultAsObject.id) {
      resultAsObject.id = nanoid();
    }

    // createdAt 프로퍼티가 없으면 추가
    if (!resultAsObject.createdAt) {
      resultAsObject.createdAt = new Date().toISOString();
    }

    // 값이 undefined 프로퍼티는 제거
    Object.keys(resultAsObject).forEach((key) => {
      if (resultAsObject[key] === undefined) {
        delete resultAsObject[key];
      }
    });

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함
    let collectionRef = doc(
      firebaseDB,
      `${collectionName ?? COLLECTION_NAME.OBJECT}/${resultAsObject.id}`
    );

    const response = await setDoc(collectionRef, resultAsObject);
    
    return resultAsObject;
  },

  /**
   * get one object
   * @param option
   * @returns
   */
  getOne: async <T = unknown>(id: string, collectionName?: string) => {
    const collectionToGet = collectionName ?? COLLECTION_NAME.OBJECT;

    const objRef = doc(firebaseDB, collectionToGet, id);

    const objSnapshot = await getDoc(objRef);

    if (!objSnapshot.exists()) {
      return null;
    }

    return objSnapshot.data() as T;
  },

  getManyWhere: async <T = unknown>(
    collectionName: string,
    whereCondition: {
      [key: string]: string | number | boolean | Timestamp;
    },
    option?: {
      lastItem?: string;
      limitCount?: number;
    }
  ) => {
    const objRef = collection(firebaseDB, collectionName);

    const whereList: QueryConstraint[] = Object.keys(whereCondition).map((key) => {
      return where(key, '==', whereCondition[key]);
    });

    // 날짜 조건 추가
    whereList.push(where('deletedAt', '==', null));
    whereList.push(orderBy('createdAt', 'desc'));

    // lastItem, limitCount 옵션을 whereList에 추가
    const { lastItem, limitCount = 10 } = option || {};
    if (lastItem) {
      const lastItemRef = doc(firebaseDB, `${collectionName}/${lastItem}`);
      const lastItemSnapshot = await getDoc(lastItemRef);
      whereList.push(startAfter(lastItemSnapshot));
    }

    whereList.push(limit(limitCount));

    const queryRef = query(objRef, ...whereList);

    const objSnapshot = await getDocs(queryRef);

    if (objSnapshot.empty) {
      return [];
    }

    const result = objSnapshot.docs.map((doc) => {
      return doc.data() as T;
    });

    return result;
  },

  /**
   * get object list
   * @param option
   * @returns
   */
  getList: async <T = unknown>(
    option?: {
      lastItem?: string;
      limitCount?: number;
      isNotice?: boolean;
    },
    collectionName?: string
  ) => {
    const { lastItem, limitCount = 10 } = option || {};

    // Collection 을 가져온다.
    const collectionToGet = collectionName ?? COLLECTION_NAME.OBJECT;
    const objCollection = collection(firebaseDB, collectionToGet);
    const lastItemRef = doc(firebaseDB, `${collectionToGet}/${lastItem}`);

    // 쿼리 조건 설정
    const lastItemSnapshot = lastItem ? await getDoc(lastItemRef) : null;
    const firstQuery = query(objCollection, orderBy('createdAt', 'desc'), limit(limitCount));
    const startAfterQuery = query(
      objCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount),
      startAfter(lastItemSnapshot)
    );
    const finalQuery = lastItem ? startAfterQuery : firstQuery;

    // 비동기 요청 날리기
    const postRes = await getDocs(finalQuery);

    // 결과값 반환
    const result: T[] = [];
    postRes.forEach((doc) => {
      result.push(doc.data() as T);
    });
    return result;
  },

  /**
   * 사용자 여러명 구하기
   * 오브젝트 조회시 사용
   */
  getUserListByUids: async (uids: string[]) => {
    const profileRef = collection(firebaseDB, 'profile');

    const queryFinal = query(profileRef, where('id', 'in', uids));

    return getDocs(queryFinal);
  },

  getObjectListByUids: async (uids: string[], collectionName?: string) => {
    const collectionToGet = collectionName ?? COLLECTION_NAME.OBJECT;
    const objRef = collection(firebaseDB, collectionToGet);

    const queryFinal = query(objRef, where('id', 'in', uids));

    return getDocs(queryFinal);
  },

  /**
   * Update object
   */
  update: async (id: string, target: AsObject, collectionName?: string) => {
    const result = target as publishibleObject;

    // 게시글 작성 시간을 firebase Timestamp에서 ISOString으로 변환하여
    result.updatedAt = new Date().toISOString();

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함
    const ref = doc(firebaseDB, collectionName ?? COLLECTION_NAME.OBJECT, id);

    // 수정 요청 보낸 후, 수정된 오브젝트를 반환
    return updateDoc(ref, { ...result });
  },

  /**
   * Delete object
   */
  delete: async (id: string, collectionName?: string) => {
    const collectionToGet = collectionName ?? COLLECTION_NAME.OBJECT;
    const objRef = doc(firebaseDB, collectionToGet, id);
    return updateDoc(objRef, { deletedAt: new Date().toISOString() });
  },
};

export default objectService;
