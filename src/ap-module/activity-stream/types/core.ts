/**
 * @file activity-stream/types/core.ts
 * 핵심 타입인 Actor, Object, Activity, Link, Collection 등의 타입 정의
 */

import { AsProfile } from '../object/profile';
import { WithPublishDate } from './util';

export type CoreType =
  | 'Object'
  | 'Link'
  | 'Activity'
  | 'IntransitiveActivity'
  | 'Collection'
  | 'OrderedCollection'
  | 'CollectionPage'
  | 'OrderedCollectionPage';

export type ObjectType =
  | 'Article'
  | 'Audio'
  | 'Document'
  | 'Event'
  | 'Image'
  | 'Note'
  | 'Page'
  | 'Place'
  | 'Profile'
  | 'Relationship'
  | 'Tombstone'
  | 'Video';

// 주석처리 된 타입은 사용하지 않는 타입입니다. (2023.09.11)
export type ActivityType =
  // | 'Accept'
  | 'Add' // to Collection
  | 'Announce' // 공지사항
  // | 'Arrive'
  // | 'Block'
  | 'Create'
  | 'Delete'
  // | 'Dislike'
  // | 'Flag'
  | 'Follow'
  // | 'Ignore'
  | 'Invite'
  | 'Join'
  // | 'Leave'
  | 'Like'
  // | 'Listen'
  // | 'Move'
  // | 'Offer'
  // | 'Question'
  // | 'Reject'
  // | 'Read'
  // | 'Remove'
  // | 'TentativeReject'
  // | 'TentativeAccept'
  // | 'Travel'
  | 'Undo'
  | 'Update'
  | 'View';

/**
 * Link
 * 이미지 링크, 웹페이지 링크 등
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 * 다른 라이브러리 Link와 이름 충돌문제로 AsLink로 명명
 */
export interface AsLink {
  type?: 'Link' | string;
  href?: string;
  rel?: string;
  mediaType?: string;
  name?: string;
  hreflang?: string;
  height?: number;
  width?: number;
  preview?: AsLink;
}

/**
 * JS Object와 충돌 피하기 위해 AsObject로 명명
 * 확장 오브젝트 타입은 Note, Article, Event 등이 있음
 * 오브젝트의 구현체는 이 인터페이스를 사용하지 않고, 이 인터페이스를 상속한 확장 오브젝트 타입을 사용
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */
export interface AsObject {
  id?: string;
  type?: 'Object' | ObjectType | string;
  // subject?: AsObject | AsLink;
  // relationship?: AsObject | AsLink;
  /**
   * actor id만 가지며, 실제 프로필 정보는 profile 프로퍼티에 저장
   */
  actor?: string;
  attributedTo?: string | AsObject | AsLink;
  // attachment?: AsObject | AsLink;
  attachments?: AsLink[];
  // audience?: AsObject | AsLink;
  content?: string;
  // context?: AsObject | AsLink;
  name?: string; // non-html text
  // endTime?: string; // xsd:dateTime
  // generator?: AsObject | AsLink;
  icon?: string;
  image?: string;
  inReplyTo?: string | AsObject | AsLink;
  // location?: AsObject | AsLink;
  // preview?: AsObject | AsLink;
  // published?: string; // xsd:dateTime
  replies?: string[];

  /**
   * 비표준.
   * actor 프로퍼티가 존재하는 오브젝트에 대해,
   * actor 프로퍼티를 Profile 객체로 변환한 값을 저장
   * 게시물의 작성자 프로필 정보를 가져오기 위해 사용
   */
  profile?: AsObject | AsProfile;

  /**
   * 비표준.
   * 좋아요와 댓글 수
   */
  likeCount?: number;
  repliesCount?: number;

  /**
   * 현재 사용자가 좋아요를 눌렀는지 여부
   * DB에 저장되지 않는다
   */
  isLiked?: boolean;

  /**
   * 비표준.
   * 이 객체의 투표 결과
   */
  voteValue?: string | null;
}

/**
 * 액티비티 나타내는 기본 인터페이스
 * @see https://www.w3.org/TR/activitystreams-core
 */
export interface AsActivity {
  id: string;
  type: ActivityType;
  summary?: string;
  actor?: string;
  object?: string | null;
  target?: string | null;
  result?: string;
  // origin?: string | AsObject | AsLink;
  // instrument?: string | AsObject | AsLink;
  // published?: string; // xsd:dateTime

  /**
   * 비표준.
   */
  profile?: WithPublishDate<AsProfile>;
  objectDetail?: WithPublishDate<AsObject>;
  targetDetail?: WithPublishDate<AsObject>;
  resultDetail?: WithPublishDate<AsObject>;
  activityPoint?: number;
}

