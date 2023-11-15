import ASObject from "./as-object";
import { AsImage } from "../link/image";
import { WithPublishDate } from "../types/util";

/**
 * W3C Activity Streams 2.0 Note Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export interface AsNote extends WithPublishDate<ASObject> {
  id: string;
  type: "Note";
  name: string;
  content: string; // HTML content
  image: string | AsImage | null;
  actor: ASObject;
  replies: ASObject[];
  isreplyto: ASObject;
}

class Note implements AsNote {
  id: string;
  type: "Note" = "Note";
  name: string;
  content: string;
  image: string | AsImage | null;
  actor: ASObject;
  replies: ASObject[];
  isreplyto: ASObject;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | undefined;

  toJSON(): this {
    return this;
  }

  constructor(params: AsNote) {
    this.id = params.id;
    this.name = params.name;
    this.content = params.content;
    this.image = params.image;
    this.actor = params.actor;
    this.replies = params.replies;
    this.isreplyto = params.isreplyto;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}

export default Note;
