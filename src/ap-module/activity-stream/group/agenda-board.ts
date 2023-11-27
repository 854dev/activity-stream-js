import { WithInterval, WithPublishDate } from '../types/util';
import { AsObject } from '../types/core';

/**
 * Board 오브젝트
 * Group 오브젝트의 하위 오브젝트
 * 액티비티 스트림 비표준 확장
 */
export interface AsAgendaBoardExt extends WithInterval<WithPublishDate<AsObject>> {
  id: string;
  type: 'AgendaBoard';
  name: string;
  content: string; // HTML content
  image: string;
  actor: string;
  attributedTo: string;
  voteOptions: string[];
}

export interface AsAgendaBoardExtParams {
  id: string;
  name: string;
  attributedTo: string;
  content?: string;
  image?: string;
  actor?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  startTime: string;
  endTime: string;
  voteOptions: string[];
}

class ASAgendaBoardExt implements AsAgendaBoardExt {
  id: string;
  type: 'AgendaBoard' = 'AgendaBoard';
  name: string;
  content: string;
  image: string;
  actor: string;
  attributedTo: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;

  voteOptions: string[];
  startTime: string;
  endTime: string;

  constructor(params: AsAgendaBoardExtParams) {
    this.id = params.id;
    this.attributedTo = params.attributedTo;
    this.name = params.name;

    this.content = params.content ?? '';
    this.image = params.image ?? '';
    this.actor = params.actor ?? '';
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? '';
    this.deletedAt = params.deletedAt ?? '';

    this.voteOptions = params.voteOptions ?? [];
    this.startTime = params.startTime ?? '';
    this.endTime = params.endTime ?? '';
  }
}

export default ASAgendaBoardExt;
