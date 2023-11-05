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
 * @see https://www.w3.org/TR/activitystreams-core
 * id, type, @context 를 갖는 액티비트스팀 Core properties
 */
interface AsCore {
  "@context": "https://www.w3.org/ns/activitystreams"; // fixed
  type: string; // any URI
  id: string; // any URI
}

/**
 * 액티비티 나타내는 기본 인터페이스
 * @see https://www.w3.org/TR/activitystreams-core
 */
export interface AsActivity extends AsCore {
  type: ActivityType;
  summary?: string;
  actor?: string | AsObject | AsLink;
  object?: string | AsObject | AsLink;
  target?: string | AsObject | AsLink;
  result?: string | AsObject | AsLink;
  origin?: string | AsObject | AsLink;
  instrument?: string | AsObject | AsLink;
  published?: string; // xsd:dateTime
}

/**
 * JS Object와 충돌 피하기 위해 AsObject로 명명
 * ./types/ext-object-type.ts 에서 확장 오브젝트 타입을 정의
 * 확장 오브젝트 타입은 Note, Article, Event 등이 있음
 * 오브젝트의 구현체는 이 인터페이스를 사용하지 않고, 이 인터페이스를 상속한 확장 오브젝트 타입을 사용
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */
export interface AsObject extends AsCore {
  subject?: AsObject | AsLink;
  relationship?: AsObject | AsLink;
  actor?: AsObject | AsLink;
  attributedTo?: AsObject | AsLink;
  attachment?: AsObject | AsLink;
  attachments?: AsObject[] | AsLink[];
  audience?: AsObject | AsLink;
  content?: string;
  context?: AsObject | AsLink;
  name?: string; // non-html text
  endTime?: string; // xsd:dateTime
  generator?: AsObject | AsLink;
  icon?: Image | AsLink | string;
  image?: Image | AsLink | string;
  inReplyTo?: AsObject | AsLink;
  location?: AsObject | AsLink;
  preview?: AsObject | AsLink;
  published?: string; // xsd:dateTime
  replies?: AsObject | AsLink;
}

/**
 * Link
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 * 다른 라이브러리 Link와 이름 충돌문제로 AsLink로 명명
 */
export interface AsLink extends AsCore {
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
 * 이미지 오브젝트
 */
export interface Image extends AsLink {
  type: "Image";
}

/**
 * 액티비티 스트림의 컬렉션
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collection
 */
export interface AsCollection extends AsObject {
  type: "Collection";
  totalItems?: number;
  current?: AsLink;
  first?: AsLink;
  last?: AsLink;
  items?: AsObject[] | AsLink[];
}

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
type PublishDate = {
  published: string;
  updated?: string;
  deleted?: string;
};

export type WithPublishDate<T = AsObject> = T & PublishDate;

/**
 * 시작시간, 종료시간, 기간
 */
type Interval = {
  startTime?: string;
  endTime?: string;
  duration?: string;
};

export type WithInterval<T = AsObject> = T & Interval;