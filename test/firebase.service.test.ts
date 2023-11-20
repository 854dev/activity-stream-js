/**
 * firebase service test
 */
import fileService from "../src/service/firebase/file-service";

/**
 * file service test
 */
describe("file service test", () => {
  const file = new File(["foo"], "foo.png", {
    type: "image/png",
  });

  it("uploadImage", async () => {
    const result = await fileService.uploadImage(file, "object");
    expect(result).toBeTruthy();
  });
});

/**
 * change file name ext test
 * 확장자를 변경하는 함수 테스트
 */
describe("change file name ext test", () => {
  it("change file name ext", () => {
    const result = fileService.changeFileNameExt("test.png", "test2");
    expect(result).toBe("test2.png");
  });
});
