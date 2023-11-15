import ASObject from "./as-object";
import { AsImage } from "../link/image";
import { WithPublishDate } from "../types/util";

/**
 * W3C Activity Streams 2.0 Note Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
 */
export interface AsNote extends WithPublishDate<ASObject> {
  type: "Note";
  name: string;
  content: string; // HTML content
  image: string | AsImage | null;
  actor: ASObject;
  replies: ASObject[];
  isreplyto: ASObject;
}
