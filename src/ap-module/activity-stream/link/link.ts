/**
 * Link
 *
 * 특정 링크를 외부로 제공할 경우 사용
 * 대부분의 경우 링크는 url로 제공되므로,
 * DB에 별도 저장된 링크가 아니라면
 * 이 인터페이스를 사용하지 않아도 됨
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 * 다른 라이브러리 Link와 이름 충돌문제로 AsLink로 명명
 */
export interface AsLinkType {
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

export default class ASLink implements AsLinkType {
  id: string;
  '@context': 'https://www.w3.org/ns/activitystreams';
  type: 'Link' | string;

  constructor(public href: string) {
    this.id = href;
    this['@context'] = 'https://www.w3.org/ns/activitystreams';
    this.type = 'Link';
  }
}
