import { AsLink as AsLinkType } from "./types/core";

class ASLink implements AsLinkType {
  id: string;
  "@context": "https://www.w3.org/ns/activitystreams";
  type: "Link" | string;

  constructor(public href: string) {
    this.id = href;
    this["@context"] = "https://www.w3.org/ns/activitystreams";
    this.type = "Link";
  }
}

export default ASLink;
