/**
 * Object service
 * 오브젝트 객체의 생성, 수정, 삭제, 조회를 담당하는 서비스
 */
import { Timestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
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
   */
  read: () => {
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
