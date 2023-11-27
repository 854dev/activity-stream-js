import { deleteDoc } from 'firebase/firestore';
import { AsObject } from '../types/core';
import { WithPublishDate } from '../types/util';

/**
 * W3C Activity Streams 2.0 Profile Object
 */
export interface AsProfile extends WithPublishDate<AsObject> {
  type: 'Profile';
  name: string;
  /**
   * 프로필 요약
   * HTML content
   */
  summary?: string;
  /**
   * 프로필 이미지
   */
  image?: string | null;
  /**
   * 배경 이미지
   */
  header?: string | null;

  /**
   * 기타 프로필 속성들
   * 비표준 항목
   */
  email: string;
  phone?: string;
  address?: string;
  addressDetail?: string;
  zipCode?: string;
  gender?: string;
  link?: { name: string; href: string }[];

  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  activityPoint?: number;
}

/**
 * ASProfile 의 생성자 인터페이스
 */
export interface AsProfileConstructor {
  id: string;
  name: string;
  email: string;
  summary?: string;
  image?: string | null;
  header?: string | null;
  phone?: string;
  address?: string;
  addressDetail?: string;
  zipCode?: string;
  gender?: string;
  link?: { name: string; href: string }[];
  activityPoint?: number;

  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

/**
 * AsProfile 의 구현 클래스 ASProfile
 */
class ASProfile implements AsProfile {
  id: AsProfile['id'];
  type: AsProfile['type'] = 'Profile';
  name: AsProfile['name'];
  email: AsProfile['email'];
  summary?: AsProfile['summary'];
  image?: AsProfile['image'];
  header?: AsProfile['header'];
  phone?: AsProfile['phone'];
  address?: AsProfile['address'];
  addressDetail?: AsProfile['addressDetail'];
  zipCode?: AsProfile['zipCode'];
  gender?: string;
  link?: { name: string; href: string }[];
  activityPoint?: number;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;

  constructor(params: AsProfileConstructor) {
    // params 에서 필수 항목들 할당
    this.id = params.id;
    this.type = 'Profile';
    this.name = params.name;
    this.email = params.email;

    // params 에서 선택 항목들 할당. 없으면 디폴트 값 할당
    this.summary = params.summary || '';
    this.image = params.image || null;
    this.header = params.header || null;
    this.phone = params.phone || '';
    this.address = params.address || '';
    this.addressDetail = params.addressDetail || '';
    this.zipCode = params.zipCode || '';
    this.gender = params.gender || '';
    this.link = params.link || [];
    this.activityPoint = params.activityPoint || 0;
    this.createdAt = params.createdAt || new Date().toISOString();
    this.updatedAt = params.updatedAt || null;
    this.deletedAt = params.deletedAt || null;
  }
}

export default ASProfile;
