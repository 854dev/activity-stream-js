/**
 * File service
 * 파일 업로드 및 다운로드를 담당하는 서비스
 */

import { firebaseAppInstance } from "./config/init";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

/** firebase 스토리지 폴더 경로 종류 */
type storageFilePath = "profile" | "object" | "link" | "activity";

const fileService = {
  /** filename 은 확장자 빼고 쓸것 */
  uploadImage: async (file: File, path: storageFilePath, filename?: string) => {
    // jpg, png, gif 가 아니면 에러
    if (!file.type.includes("image")) {
      throw new Error("이미지 파일만 업로드 가능합니다.");
    }

    const finalFileName = filename
      ? fileService.changeFileNameExt(file.name, filename)
      : file.name;

    const finalPath = `${path}/${finalFileName}`;

    const storageRef = getStorage(firebaseAppInstance);

    const imageRef = ref(storageRef, finalPath);

    // 'file' comes from the Blob or File API
    const uploadResult = await uploadBytes(imageRef, file);

    const result = await getDownloadURL(uploadResult.ref);

    return result;
  },

  /**
   * 파일 이름을 변경하되, 확장자는 그대로 유지하는 함수
   */
  changeFileNameExt(fileName: string, newFileName: string) {
    const fileNameArr = fileName.split(".");
    const ext = fileNameArr.pop();
    const newFileNameArr = newFileName.split(".");
    newFileNameArr.pop();
    const result = [...newFileNameArr, ext].join(".");
    return result;
  },
};

export default fileService;
