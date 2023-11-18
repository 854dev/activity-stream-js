import { AsLink, AsObject } from "../types/core";

/**
 * 액티비티 스트림의 컬렉션
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collection
 */
export interface AsCollection<Item = AsObject> extends AsObject {
  type: "Collection";
  attributedTo?: string | AsLink | AsObject;
  name?: string;
  totalItems?: number;
  current?: string | AsLink;
  first?: AsLink;
  last?: AsLink;
  items?: Item[];
}
