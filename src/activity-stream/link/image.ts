/**
 * image.ts
 * 액티비티 스트림 이미지 링크
 *
 * 이미지를 외부 링크로 제공할 경우 사용
 *
 * 대부분의 경우 이미지는 url로 제공되므로,
 * DB에 별도 저장된 이미지가 아니라면
 * image 프로퍼티에 이 인터페이스를 사용하지 않아도 됨
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-image
 */

import { AsLinkType } from "./link";

export interface AsImage extends AsLinkType {
  type: "Link" | string;
  href: string;
  rel?: string;
  mediaType?: string;
  name?: string;
  hreflang?: string;
  height?: number;
  width?: number;
  preview?: AsLinkType;
}
