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
  type: "Group";
  name: string;
  content: string; // HTML content
  image: string;
  actor: AsObject;
  replies: AsObject[];
  inReplyTo: string | AsObject;
}

class Group implements AsGroup {
  id: string;
  type: "Group" = "Group";
  name: string;
  content: string;
  image: string;
  actor: AsObject;
  replies: AsObject[];
  inReplyTo: string | AsObject;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;

  constructor(params: AsGroup) {
    this.id = params.id;
    this.name = params.name;
    this.content = params.content;
    this.image = params.image;
    this.actor = params.actor;
    this.replies = params.replies;
    this.inReplyTo = params.inReplyTo;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}

export default Group;
