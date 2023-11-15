import ASObject from "./as-object";

/**
 * W3C Activity Streams 2.0 Place Object
 */
export interface AsPlace extends ASObject {
  type: "Place";
  name: string;
  latitude: number;
  longitude: number;
  actor: ASObject;
}
