import { AsNote } from '../object/note';
import { AsProfile } from '../object/profile';
import { AsActivity } from '../types/core';
import { WithPublishDate } from '../types/util';

export interface AsCreateBoardVote extends WithPublishDate<AsActivity> {
  id: string;
  type: 'Create';
  summary?: string;
  actor?: string;
  object?: string | null;
  target?: string | null;

  profile?: WithPublishDate<AsProfile>;
  /**
   * 찬반투표 게시글에 대한 투표
   * object는 내가 작성한 찬반투표 게시글
   */
  objectDetail?: WithPublishDate<AsNote>;
  /**
   * 찬반투표 게시글에 대한 투표
   * target은 내가 투표한 찬반투표 게시글
   */
  targetDetail?: WithPublishDate<AsNote>;
  /**
   * 투표가 주는 포인트 : 30
   */
  activityPoint?: 20;
}

export type AsCreateBoardVoteParams = Partial<AsCreateBoardVote>;

class ASCreateBoardVote implements AsCreateBoardVote {
  id: string;
  type: 'Create';
  summary: string;
  actor: string;
  object: string | null;
  target: string | null;
  profile?: WithPublishDate<AsProfile>;
  objectDetail?: AsNote;
  activityPoint?: 20;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  constructor(params: AsCreateBoardVoteParams) {
    this.id = params.id;
    this.type = 'Create';
    this.summary = params.summary ?? '안건에 의견을 남겼습니다';
    this.actor = params.actor;
    this.object = params.object ?? null;
    this.target = params.target ?? null;

    this.profile = params.profile;
    this.objectDetail = params.objectDetail;

    this.activityPoint = 20;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? null;
    this.deletedAt = params.deletedAt ?? null;
  }
}

export default ASCreateBoardVote;