/**
 * File service
 * 파일 업로드 및 다운로드를 담당하는 서비스
 */

import { fi } from '@faker-js/faker';
import { firebaseAppInstance } from './config/init';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

/** firebase 스토리지 폴더 경로 종류 */
type storageFilePath = 'profile' | 'object' | 'link' | 'activity';

const fileService = {
  /** filename 은 확장자 빼고 쓸것 */
  uploadImage: async (file: File, path: storageFilePath, filename?: string) => {
    // jpg, png, gif 가 아니면 에러
    if (!file.type.includes('image')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    const finalFileName = filename ? fileService.changeFileNameExt(file.name, filename) : file.name;

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
  changeFileNameExt(before: string, to: string) {
    // 파일 이름에서 마지막 온점을 찾음
    const lastDotIndex = before.lastIndexOf('.');

    // 온점을 찾지 못한 경우 또는 파일 이름이 비어있는 경우
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return before;
    }

    // 파일 이름과 확장자 분리
    const baseName = before.substring(0, lastDotIndex);
    const ext = before.substring(lastDotIndex);

    // 파일 이름 변경
    const newFileName = to + ext;

    return newFileName;
  },
};

export default fileService;
