/**
 * W3C Activity Streams 2.0 Object
 * https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 */

class ASObject<ExtType = unknown> {
  constructor(props: ExtType) {
    Object.assign(this, props);
  }

  // to json
  toJSON() {
    return this;
  }
}

export default ASObject;
