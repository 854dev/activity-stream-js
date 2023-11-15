import { AsActivity } from "../types/core";

export const activity: AsActivity = {
  // "@context": "https://www.w3.org/ns/activitystreams",
  // id: "https://example.com/activities/1",
  type: "Create",
  actor: {
    type: "Person",
    id: "https://example.com/actor",
    name: "Sally",
  },
  object: {
    type: "Note",
    id: "https://example.com/notes/1",
    content: "This is a note",
  },
};
