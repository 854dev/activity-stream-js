import { WithPublishDate } from '../types/util';
import { AsObject } from '../types/core';

/**
 * Board 오브젝트
 * Group 오브젝트의 하위 오브젝트
 * 액티비티 스트림 비표준 확장
 */
export interface AsBoardExt extends WithPublishDate<AsObject> {
  id: string;
  type: 'Board';
  name: string;
  content: string; // HTML content
  image: string;
  actor: string;
  attributedTo: string;
}

export interface AsBoardExtParams {
  id: string;
  name: string;
  attributedTo: string;
  content?: string;
  image?: string;
  actor?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

class ASBoardExt implements AsBoardExt {
  id: string;
  type: 'Board' = 'Board';
  name: string;
  content: string;
  image: string;
  actor: string;
  attributedTo: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;

  constructor(params: AsBoardExtParams) {
    this.id = params.id;
    this.attributedTo = params.attributedTo;
    this.name = params.name;
    this.content = params.content;
    this.image = params.image;
    this.actor = params.actor ?? '';
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}

export default ASBoardExt;
