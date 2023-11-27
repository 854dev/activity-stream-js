import { AsNote } from '../object/note';
import { AsProfile } from '../object/profile';
import { AsActivity } from '../types/core';
import { WithPublishDate } from '../types/util';

export interface AsCreateBoardNote extends WithPublishDate<AsActivity> {
  id: string;
  type: 'Create';
  summary?: string;
  actor?: string;
  object?: string | null;
  target?: string | null;

  profile?: WithPublishDate<AsProfile>;
  /**
   * 게시물 글쓰기
   * object는 내가 작성한 게시글
   */
  objectDetail?: AsNote;

  /**
   * 게시물 글쓰기
   * target은 내가 게시글을 작성한 게시판
   */
  targetDetail?: AsNote;
  /**
   * 게시물 글쓰기가 주는 포인트 : 30
   */
  activityPoint?: 30;
}

type AsCreateBoardNoteParams = Partial<AsCreateBoardNote>;

class ASCreateBoardNote implements AsCreateBoardNote {
  id: string;
  type: 'Create';
  summary: string;
  actor: string;
  object?: string | null;
  target?: string | null;
  profile?: WithPublishDate<AsProfile>;
  objectDetail?: AsNote;
  activityPoint?: 30;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  constructor(params: AsCreateBoardNoteParams) {
    this.id = params.id;
    this.type = 'Create';
    this.summary = params.summary ?? '게시물을 작성했습니다.';
    this.actor = params.actor;
    this.object = params.object ?? null;
    this.target = params.target ?? null;

    this.profile = params.profile;
    this.objectDetail = params.objectDetail;

    this.activityPoint = 30;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? null;
    this.deletedAt = params.deletedAt ?? null;
  }
}

export default ASCreateBoardNote;
