import { WithPublishDate } from "../types/util";
import { AsObject } from "../types/core";

/**
 * W3C Activity Streams 2.0 Group Object
 * 
 * 그룹은 사용자들이 모여서 활동하는 공간을 의미합니다.
 * 그룹은 Join 액티비티를 통해 사용자가 그룹에 참여할 수 있습니다.
 * 그룹은 Leave 액티비티를 통해 사용자가 그룹에서 탈퇴할 수 있습니다.
 * 그룹에서는 사용자에게 셋 중 하나의 권한을 부여할 수 있습니다.
 * 
 * - viewer: 그룹의 모든 활동을 볼 수 있습니다.
 * - member: 그룹의 모든 활동을 볼 수 있고, 그룹에 글을 쓸 수 있습니다.
 * - admin: 그룹의 모든 활동을 볼 수 있고, 그룹에 글을 쓸 수 있고, 그룹의 설정을 변경할 수 있습니다.
 * 
 * 그룹 구현에 대한 이 논의를 참고하세요.
 * https://socialhub.activitypub.rocks/t/groups-implementation/591/46
 * 
 */
export interface AsGroup extends WithPublishDate<AsObject> {
  id: string;
  type: 'Group';
  name: string;
  summary?: string; // HTML content
  image?: string;
  bannerImage?: string[];
}

export interface AsGroupConstructor {
  id: string;
  name: string;
  summary?: string;
  image?: string;
  bannerImage?: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

class ASGroup implements AsGroup {
  id: string;
  type: 'Group' = 'Group';
  name: string;
  createdAt: string;
  summary?: string;
  image?: string;
  bannerImage?: string[];
  updatedAt?: string;
  deletedAt?: string;

  constructor(params: AsGroupConstructor) {
    this.id = params.id;
    this.name = params.name;
    this.createdAt = params.createdAt ?? new Date().toISOString();

    /**
     * optional properties
     */
    this.summary = params.summary;
    this.image = params.image;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
    this.bannerImage = params.bannerImage;
  }
}

export default ASGroup;
