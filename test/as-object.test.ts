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

// 최상단 ASObject 클래스의 인스턴스를 만들어서 사용할 수 있다.
test("asObject instance", () => {
  const asObject = new ASObject({
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    name: "A Note",
    content: "This is a note",
  });

  expect(asObject).toEqual(asObject);
});


// ASNoteObject 를 생성할수 있다. ASObject 생성자에 interface 를 넣어서 생성할 수 있다.
// 인터페이스를 넣어서 생성하면, 인터페이스에 정의된 필드만 사용할 수 있다.
test("asNoteObject", () => {
  const asObject = new ASObject<ASNoteObject>({
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "Note",
    name: "A Note",
    content: "This is a note",
  });

  // asObject 인스턴스는 ASNoteObject 인터페이스에 정의된 필드를 가진다.
  expect(asObject.type).toBe("Note");
  expect(asObject.name).toBe("A Note");
  expect(asObject.content).toBe("This is a note");

  // 인터페이스에 정의되지 않은 필드 참조시 undefined 를 반환한다.
  expect(asObject.summary).toBeUndefined();

});
