import ASCreateBoardNote from '../../activity-stream/activity/create-board-note';
import ASCreateBoardReply from '../../activity-stream/activity/create-board-reply';
import ASCreateBoardVote from '../../activity-stream/activity/create-board-vote';
import ASLike from '../../activity-stream/activity/like';
import { AsActivity, AsObject } from '../../activity-stream/types/core';
import { WithPublishDate } from '../../activity-stream/types/util';
import activityService from './activity-service';
import objectService from './object-service';

/**
 * ActivityRunService
 * 액티비티를 실제로 실행하는 서비스
 * TODO actor, object 등을 string 이 아닌 객체로 받아서 처리할 수 있도록 변경
 */

type availableActivity = 'like' | 'createBoardReply' | 'createBoardNote' | 'createBoardVote';
type returnActivity =
  | AsActivity
  | ASLike
  | ASCreateBoardReply
  | ASCreateBoardNote
  | ASCreateBoardVote;

type ActivityRunServiceSignature = (option: {
  actor: string;
  target?: string;
  object?: string;
}) => Promise<WithPublishDate<returnActivity>>;

const ActivityRunService: {
  [key in availableActivity]: ActivityRunServiceSignature;
} = {
  like: async (option: { actor: string; target?: string; object?: string }) => {
    const { actor, target, object } = option;

    const likeActivity = new ASLike({
      actor,
      object,
    });

    // 해당 액티비티 저장
    const save = activityService.saveToFirestore(likeActivity);

    // actor 프로필에 점수 추가
    const addpoint = activityService.addPoint(likeActivity);

    // 해당 object 프로필 likeCount 추가
    const objToLike = objectService.getOne<AsObject>(object);

    // save, addpoint, objToLike 실행
    const [saveResult, addpointResult, objToLikeResult] = await Promise.all([
      save,
      addpoint,
      objToLike,
    ]);

    // object 프로필에 likeCount 추가
    const updateObject = await objectService.update(object, {
      likeCount: objToLikeResult.likeCount + 1,
    });

    // likeActivity 에 targetDetail, objectDetail, profile 추가
    likeActivity.objectDetail = objToLikeResult;
    likeActivity.profile = addpointResult;

    return likeActivity;
  },

  createBoardReply: async (option) => {
    // 해당 액티비티 저장
    const createActivity = new ASCreateBoardReply({
      actor: option.actor,
      object: option.object,
      target: option.target,
    });

    const save = activityService.saveToFirestore(createActivity);

    // actor 프로필에 점수 추가
    const addpoint = activityService.addPoint(createActivity);

    return createActivity;
  },

  createBoardNote: async (option) => {
    // 해당 액티비티 저장
    const createActivity = new ASCreateBoardNote({
      actor: option.actor,
      object: option.object,
      target: option.target,
    });

    const save = activityService.saveToFirestore(createActivity);

    // actor 프로필에 점수 추가
    const addpoint = activityService.addPoint(createActivity);

    return createActivity;
  },

  createBoardVote: async (option) => {
    // 해당 액티비티 저장
    const createActivity = new ASCreateBoardVote({
      actor: option.actor,
      object: option.object,
      target: option.target,
    });

    const save = activityService.saveToFirestore(createActivity);

    // actor 프로필에 점수 추가
    const addpoint = activityService.addPoint(createActivity);

    return createActivity;
  },
} as const;

export default ActivityRunService;
