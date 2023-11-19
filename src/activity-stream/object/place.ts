import { AsObject } from "../types/core";

/**
 * W3C Activity Streams 2.0 Place Object
 */
export interface AsPlace extends AsObject {
  type: "Place";
  name: string;
  latitude: number;
  longitude: number;
  actor: string | AsObject;
}
