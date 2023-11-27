import { AsProfile } from '../object/profile';
import { AsActivity, AsObject } from '../types/core';
import { WithPublishDate } from '../types/util';

export interface AsLike extends WithPublishDate<AsActivity> {
  id: string;
  type: 'Like';
  summary?: string;
  actor?: string;
  object?: string;
  target?: string;
  result?: string;

  profile?: WithPublishDate<AsProfile>;

  /**
   * 좋아요를 누른 게시글
   */
  objectDetail?: WithPublishDate<AsObject>;

  /**
   * 게시글 좋아요가 주는 포인트 : 10
   */
  activityPoint?: 10;
}

export type AsLikeParams = Partial<AsLike>;

class ASLike implements AsLike {
  id: string;
  type: 'Like';
  summary: string;
  actor: string;
  object: string;
  profile?: WithPublishDate<AsProfile>;
  objectDetail?: WithPublishDate<AsObject>;
  activityPoint?: 10;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  constructor(params: AsLikeParams) {
    this.id = params.id;
    this.type = 'Like';
    this.summary = params.summary ?? '게시글을 좋아합니다.';
    this.actor = params.actor;
    this.object = params.object;

    this.profile = params.profile;
    this.objectDetail = params.objectDetail;

    this.activityPoint = 10;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? null;
    this.deletedAt = params.deletedAt ?? null;
  }
}

export default ASLike;