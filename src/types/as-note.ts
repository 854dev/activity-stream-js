// W3c activity stream 2.0 Note Object
// https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note
interface ASNoteObject extends ASObject {
  type: "Note";
  name: string;
  content: string;
}
