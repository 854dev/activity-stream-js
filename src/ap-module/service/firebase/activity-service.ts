/**
 * Activity service
 * 액티비티 객체의 생성, 수정, 삭제, 조회를 담당하는 서비스
 */

import { nanoid } from 'nanoid';
import { AsActivity, AsObject } from '../../activity-stream/types/core';
import { WithPublishDate } from '../../activity-stream/types/util';
import objectService from './object-service';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseDB } from './config/init';
import COLLECTION_NAME from './config/collection-name';
import AccountService from './account-service';
import groupService from './group-service';

const activityService = {
  /**
   * 액티비티 객체를 생성한다.
   */
  saveToFirestore: async (
    target: AsActivity,
    option?: {
      collectionName?: string;
    }
  ) => {
    const { collectionName } = option || {};

    const result = target as WithPublishDate<AsActivity>;

    // result 의 프로퍼티로 object 생성
    const resultAsActivity = { ...result };

    // id 프로퍼티가 없으면 nanoid()로 생성
    if (!resultAsActivity.id) {
      resultAsActivity.id = nanoid();
    }

    // createdAt 프로퍼티가 없으면 추가
    if (!resultAsActivity.createdAt) {
      resultAsActivity.createdAt = new Date().toISOString();
    }

    // 값이 undefined 프로퍼티는 제거
    Object.keys(resultAsActivity).forEach((key) => {
      if (resultAsActivity[key] === undefined) {
        delete resultAsActivity[key];
      }
    });

    // 오브젝트를 저장하고, 생성된 오브젝트를 반환
    // 반환된 오브젝트는 id프로퍼티가 존재해야 함
    let collectionRef = doc(
      firebaseDB,
      `${collectionName ?? COLLECTION_NAME.ACTIVITY}/${resultAsActivity.id}`
    );

    const response = await setDoc(collectionRef, resultAsActivity);
    return resultAsActivity;
  },

  /**
   * actor 아이디값으로 액티비티 객체를 조회한다.
   * option 의 프로퍼티는 적어도 하나는 존재해야 한다.
   */
  findAll: async (option: { actor?: string; type?: string }) => {
    return objectService.getManyWhere<AsActivity>('activity', option);
  },

  /**
   * findAll 과 같은 기능을 하지만
   * objectDetail, profile, targetDetail 프로퍼티를 채워서 반환한다.
   */
  findAllWithDetail: async (
    option: {
      actor?: string;
      type?: string;
    },
    detailOption: {
      hasObjectDetail?: boolean;
      hasTargetDetail?: boolean;
      hasProfile?: boolean;
    }
  ) => {
    let result = await activityService.findAll(option);

    // objectDetail, profile, targetDetail 프로퍼티를 채워서 반환한다.
    if (detailOption.hasObjectDetail) {
      result = await activityService.populateObjectDetail(result);
    }

    return result;
  },

  /**
   * actor 아이디값에 해당하는 프로필에 점수 추가
   */
  addPoint: async (activity: AsActivity) => {
    const pointToAdd = activity.activityPoint ?? 0;
    const actor = activity.actor;

    // 프로필 조회 후 activityPoint 확인
    const profile = await AccountService.getProfile(actor);

    const profileRequest = AccountService.updateProfile(actor, {
      activityPoint: profile.activityPoint + pointToAdd,
    });

    profile.activityPoint += pointToAdd;

    // 점수 추가된 프로필 반환
    return profile;
  },

  /**
   * AsActivity[] 의 배열을 받아서, objectDetail 을 채운 배열을 반환한다.
   */
  populateObjectDetail: async (activities: AsActivity[]) => {
    const objectIds = activities.map((activity) => activity.object);

    const objectsSnapshot = await objectService.getObjectListByUids(objectIds);
    const objects = objectsSnapshot.docs.map((doc) => doc.data()) as AsObject[];
    const objectsWithProfile = await groupService.getProfileListByActor(objects);

    // activities 의 objectDetail 프로퍼티에 object 를 채워넣는다.
    // object 프로퍼티와 objects 의 id 프로퍼티가 일치하는 object 를 찾아서 채워넣는다.
    activities.forEach((activity) => {
      const object = objectsWithProfile.find(
        (object) => object.id === activity.object
      ) as WithPublishDate<AsObject>;
      activity.objectDetail = object;
    });

    return activities;
  },
};

export default activityService;
