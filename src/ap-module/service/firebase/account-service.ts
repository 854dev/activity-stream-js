import { firebaseAuth } from './config/init';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import objectService from './object-service';
import fileService from './file-service';
import ASProfile from '../../activity-stream/object/profile';
import resizeFileAndReturnFile from 'src/lib/utils';
import constant from 'src/lib/constant';

import { jwtDecode } from 'jwt-decode';
/**
 * Account Service
 */
const AccountService = {
  /**
   * Sign up
   * firebase 의 createUserWithEmailAndPassword 를 사용하여 회원가입을 한다.
   * 회원가입 완료 후 profile 오브젝트 생성한다.
   */
  signUp: async ({
    email,
    password,
    username,
    image,
  }: {
    email: string;
    password: string;
    username: string;
    image: File;
  }) => {
    // 회원가입
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    // 프로필 이미지 url
    let imageUrl: string = constant.PROFILE_IMAGE_DEFAULT_URL;

    // upload image if imageFile exists
    if (image) {
      // 업로드 전 이미지 리사이징
      const resizedImageFile = await resizeFileAndReturnFile(image, 600, 600, true);

      // 이미지 업로드
      const imageUploadResponse = await fileService.uploadImage(
        resizedImageFile,
        'profile',
        `${userCredential.user.uid}-${Date.now().toLocaleString()}`
      );

      imageUrl = imageUploadResponse;
    }

    // 프로필 생성
    const profileToSend = new ASProfile({
      id: userCredential.user.uid,
      image: imageUrl,
      email,
      name: username,
    });

    const response = await objectService.create(profileToSend, {
      collectionName: 'profile',
    });
    return response;
  },

  /**
   * Get Profile
   * 사용자 uid 를 사용하여 profile 을 가져온다.
   */
  getProfile: async (uid: string) => {
    const fetcedobject = await objectService.getOne<ASProfile>(uid, 'profile');
    return new ASProfile(fetcedobject);
  },

  /**
   * get profile by username
   * @param username
   * @param profile
   * @returns
   */
  getProfileByUsername: async (username: string) => {
    const fetchedObject = await objectService.getManyWhere<ASProfile>('profile', {
      name: username,
    });
    return fetchedObject.map((elem) => new ASProfile(elem));
  },

  /**
   * Update Profile
   * objectService 의 updateObject 를 사용하여 profile 을 업데이트 한다.
   * 업데이트된 프로필을 리졸브하는 프로미스를 반환한다.
   */
  updateProfile: (uid: string, profile: Partial<ASProfile>) => {
    return objectService.update(uid, profile, 'profile');
  },

  /**
   * Update Profile Image
   * 프로필 이미지를 업로드 후 해당 url 을 프로필에 업데이트 한다.
   */
  updateProfileImage: async (uid: string, image: File) => {
    // 업로드 전 이미지 리사이징
    const resizedImageFile = await resizeFileAndReturnFile(image, 600, 600, true);

    // 이미지 업로드
    const imageUploadResponse = await fileService.uploadImage(
      resizedImageFile,
      'profile',
      `${uid}-${Date.now().toLocaleString()}`
    );

    // 프로필 업데이트
    const profile = await AccountService.updateProfile(uid, { image: imageUploadResponse });

    return profile;
  },

  /**
   * verify token
   */
  /** 토큰 디코드 */
  verifyToken: function <
    T = {
      iss: string;
      sub: string;
      aud: string;
      iat: number;
      exp: number;
      user_id: string;
      email: string;
      email_verified: boolean;
      auth_time: number;
      firebase: {
        identities: {
          email: string[];
        };
        sign_in_provider: string;
      };
    }
  >(token: string) {
    return jwtDecode<T>(token);
  },
};
export default AccountService;
