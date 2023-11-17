import { WithPublishDate } from "../types/util";
import { AsObject } from "../types/core";

/**
 * W3C Activity Streams 2.0 Note Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export interface AsNote extends WithPublishDate<AsObject> {
  id: string;
  type: "Note";
  name: string;
  content: string; // HTML content
  image: string;
  actor: AsObject;
  replies: AsObject[];
  inReplyTo: string | AsObject;
}

class Note implements AsNote {
  id: string;
  type: "Note" = "Note";
  name: string;
  content: string;
  image: string;
  actor: AsObject;
  replies: AsObject[];
  inReplyTo: string | AsObject;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;

  constructor(params: AsNote) {
    this.id = params.id;
    this.name = params.name;
    this.content = params.content;
    this.image = params.image;
    this.actor = params.actor;
    this.replies = params.replies;
    this.inReplyTo = params.inReplyTo;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}

export default Note;
