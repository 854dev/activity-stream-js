import { WithPublishDate } from "../types/util";
import { AsObject } from "../types/core";
import { AsProfile } from './profile';

/**
 * W3C Activity Streams 2.0 Note Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export interface AsNote extends WithPublishDate<AsObject> {
  id: string;
  type: 'Note';
  name?: string;
  summary?: string;
  content: string; // HTML content
  image?: string;
  actor: string;
  replies?: string[];
  inReplyTo?: string;
  profile?: AsProfile;

  /**
   * 이 노트가 속한 그룹 또는 게시판의 id
   */
  attributedTo?: string;

  /**
   * 좋아요, 댓글수
   */
  likeCount?: number;
  repliesCount?: number;

  /**
   * 현재 사용자가 좋아요를 눌렀는지 여부
   * DB에 저장되지 않는다
   */
  isLiked?: boolean;

  /**
   * 투표한 값
   */
  voteValue?: string | null;
}

/**
 * ASProfile 의 생성자 인터페이스
 */
export type ASNoteConstructor = Partial<AsNote>;

class ASNote implements AsNote {
  id: string;
  type: 'Note' = 'Note';
  name: string;
  summary?: string;
  content: string;
  image: string;
  actor: string;
  replies: string[];
  inReplyTo: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  profile?: AsProfile;
  attributedTo?: string;
  likeCount: number;
  repliesCount: number;
  voteValue?: string | null;

  /**
   * 현재 사용자가 좋아요를 눌렀는지 여부
   * DB에 저장되지 않는다
   */
  isLiked?: boolean = false;

  constructor(params: ASNoteConstructor) {
    Object.assign(this, params);
    this.type = 'Note';
    this.replies = params.replies ?? [];
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? null;
    this.deletedAt = params.deletedAt ?? null;
    this.content = params.content ?? '';
    this.summary = params.summary ?? this.content.slice(0, 100);
    this.likeCount = params.likeCount ?? 0;
    this.repliesCount = params.repliesCount ?? 0;
    this.voteValue = params.voteValue ?? null;

    if ('isLiked' in this) {
      // 생성자에서 isLiked를 넣으면, 삭제한다
      delete this.isLiked;
    }
  }
}

export default ASNote;
