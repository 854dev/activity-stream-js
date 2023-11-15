/**
 * @file activity-stream/types/core.ts
 * 핵심 타입인 Actor, Object, Activity, Link, Collection 등의 타입 정의
 */

export type CoreType =
  | "Object"
  | "Link"
  | "Activity"
  | "IntransitiveActivity"
  | "Collection"
  | "OrderedCollection"
  | "CollectionPage"
  | "OrderedCollectionPage";

export type ObjectType =
  | "Article"
  | "Audio"
  | "Document"
  | "Event"
  | "Image"
  | "Note"
  | "Page"
  | "Place"
  | "Profile"
  | "Relationship"
  | "Tombstone"
  | "Video";

// 주석처리 된 타입은 사용하지 않는 타입입니다. (2023.09.11)
export type ActivityType =
  // | 'Accept'
  | "Add" // to Collection
  | "Announce" // 공지사항
  // | 'Arrive'
  // | 'Block'
  | "Create"
  | "Delete"
  // | 'Dislike'
  // | 'Flag'
  | "Follow"
  // | 'Ignore'
  | "Invite"
  | "Join"
  // | 'Leave'
  // | 'Like'
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
  | "Undo"
  | "Update"
  | "View";

/**
 * Link
 * 이미지 링크, 웹페이지 링크 등
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 * 다른 라이브러리 Link와 이름 충돌문제로 AsLink로 명명
 */
export interface AsLink {
  type: "Link" | string;
  href: string;
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
  type?: "Object" | ObjectType | string;
  // subject?: AsObject | AsLink;
  // relationship?: AsObject | AsLink;
  actor?: AsObject;
  // attributedTo?: AsObject | AsLink;
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
  inReplyTo?: AsObject | AsLink;
  // location?: AsObject | AsLink;
  // preview?: AsObject | AsLink;
  // published?: string; // xsd:dateTime
  replies?: AsObject | AsLink;
}

/**
 * 액티비티 나타내는 기본 인터페이스
 * @see https://www.w3.org/TR/activitystreams-core
 */
export interface AsActivity {
  type: ActivityType;
  summary?: string;
  actor?: AsObject;
  object?: AsObject;
  target?: AsObject;
  result?: AsObject;
  // origin?: string | AsObject | AsLink;
  // instrument?: string | AsObject | AsLink;
  // published?: string; // xsd:dateTime
}

