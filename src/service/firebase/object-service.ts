/**
 * Object service
 * 오브젝트 객체의 생성, 수정, 삭제, 조회를 담당하는 서비스
 */

import { nanoid } from "nanoid";
import { AsObject } from "../../activity-stream/types/core";
import { WithPublishDate } from "../../activity-stream/types/util";

const objectService = {
  /**
   * Create object
   */
  create: (target: AsObject) => {
    // 타겟 오브젝트 복사.
    //  createdAt 등 날짜 추가시 사용
    const result = { ...target } as WithPublishDate<AsObject>;

    // id프로퍼티 없을 시 생성
    if (!result.id) {
      target.id = nanoid();
    }

    // 날짜 프로퍼티 없을 시 생성
    if (!result.createdAt) {
      result.createdAt = new Date().toISOString();
    }

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함

    return;
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
  update: () => {
    return;
  },

  /**
   * Delete object
   */
  delete: () => {
    return;
  },
};

export default objectService;
