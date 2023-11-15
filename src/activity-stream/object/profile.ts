import ASObject from "./as-object";

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
  image: string | null;
  /**
   * 배경 이미지
   */
  header: string | null;

  /**
   * 기타 프로필 속성들
   * 비표준 항목
   * 디폴트 값 : ""
   */
  email: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
  gender: string;
  website: { name: string; url: string }[];
}
