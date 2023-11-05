/**
 * 확장 객체 타입
 * ASObject 를 상속받아서 확장 객체 타입을 만들 수 있다.
 * 확장 객체 타입에서 사용할 필드를 정의한다.
 * 비표준 항목이 포함될 수 있다.
 */

// W3c activity stream 2.0 Note Object
import ASObject from "../activity-stream/as-object";
import { Image, WithPublishDate } from "./core";

/**
 * W3C Activity Streams 2.0 Note Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export interface AsNote extends WithPublishDate<ASObject> {
  type: "Note";
  name: string;
  content: string; // HTML content
  image: Image | null;
  actor: ASObject;
  replies: ASObject[];
}

/**
 * W3C Activity Streams 2.0 Place Object
 */
export interface AsPlace extends ASObject {
  type: "Place";
  name: string;
  latitude: number;
  longitude: number;
  actor: ASObject;
}

/**
 * W3C Activity Streams 2.0 Profile Object
 */
export interface AsProfile extends ASObject {
  type: "Profile";
  name: string;
  /**
   * 프로필 요약
   * HTML content
   */
  summary: string;
  /**
   * 프로필 이미지
   */
  image: Image | null;
  /**
   * 배경 이미지
   */
  header: Image | null;
  actor: ASObject;
  /**
   * 비표준 항목
   * 디폴트 값 : ""
   */
  email: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
  gender: string;
  /**
   * 기타 key-value 형태의 비표준 항목
   * 홈페이지 등
   */
  common: { [key: string]: string };
}
