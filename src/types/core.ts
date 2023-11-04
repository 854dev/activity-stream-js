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

/** 프로젝트 내에서만 사용하는 비표준 오브젝트 타입 */
export type ExtObjectType = "groupy:Campaign";

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
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 * 확장 오브젝트 타입
 * 실제 프로젝트 내에서 사용되는 오브젝트들임
 * 비표준 항목이 있을수 있음
 */
export interface ExtObject extends AsObject {
  /**
   * @context 에 비표준 항목이 있을 수 있음
   */
  "@context": AsObject["@context"];

  type: ObjectType | ExtObjectType;

  /**
   * author 는 Profile.id 를 사용
   * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-content
   */
  actor?: AsObject;

  /**
   * 작성자 사진 조회용 프로필
   */
  profile?: Profile;

  /**
   * firebase uid
   */
  author?: string; // Profile.id

  /**
   * @시간컬럼
   * 클래스 선언시 AsObjectDateToTimestamp, AsObjectDateToString 으로 타입 변경
   */
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  /**
   * @기타정보
   * @category 카테고리 (프로젝트에 따라 다양하게 사용될 수 있음)
   * @area 지역 (프로젝트에 따라 다양하게 사용될 수 있음, location 과 다르게 지역명만 사용)
   */
  category?: string[];
  area?: string[];
}

export interface Image extends ExtObject {
  type: "Image";
  url: string;
  width?: number;
  height?: number;
}

interface CoreObject {
  "@context": "https://www.w3.org/ns/activitystreams"; // fixed
  type: string; // any URI
  id: string; // any URI
}

export interface CoreActivity extends CoreObject {
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
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 * JS Object와 충돌 피하기 위해 AsObject로 명명
 */
export interface AsObject extends CoreObject {
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
export interface AsLink {
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
 * object 인터페이스에서 CoreObject의 type, @context, id 제거한 인터페이스
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */
export type AsObjectWithoutCoreProps<T = AsObject> = Omit<
  T,
  "type" | "context" | "id"
>;
