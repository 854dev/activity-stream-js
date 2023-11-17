/**
 * util.ts
 * 유틸리티 타입 정의
 */

import { AsObject } from "./core";

/**
 * object 인터페이스에서 CoreObject의 type, @context, id 제거한 인터페이스
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */
export type AsObjectWithoutCoreProps<T = AsObject> = Omit<
  T,
  "type" | "context" | "id"
>;

/**
 * object 의 날짜 필드 이름
 * 생성일, 수정일, 삭제일
 * xsd:dateTime 형식
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */
export type PublishDate = {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type WithPublishDate<T = AsObject> = T & PublishDate;

/**
 * 시작시간, 종료시간, 기간
 */
export type Interval = {
  startTime?: string;
  endTime?: string;
  duration?: string;
};

export type WithInterval<T = AsObject> = T & Interval;
