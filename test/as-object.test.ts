/**
 * activity-stream object tests
 */

test("asObject", () => {
  const asObject = {
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    name: "A Note",
    content: "This is a note",
  };

  expect(asObject).toEqual(asObject);
});
