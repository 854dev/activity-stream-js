import { faker } from '@faker-js/faker/locale/ko';
import { Comment } from 'src/types';
import ms from 'ms';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import requestIp from 'request-ip';
import { AsActivity } from './ap-module/activity-stream/types/core';

export function generateMockCommunityComment(count: number, opinion?: boolean): Comment[] {
  const mockData: Comment[] = [];

  for (let i = 0; i < count; i++) {
    mockData.push({
      id: faker.number.int(),
      author: faker.person.lastName() + faker.person.firstName(),
      createdAt: faker.date.past().toISOString(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      replyCount: faker.number.int({ min: 0, max: 50 }),
      likeCount: faker.number.int({ min: 0, max: 50 }),
      opinion: opinion ? faker.helpers.arrayElement(['agree', 'disagree']) : null,
    });
  }

  return mockData;
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never';
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? '' : ' ago'}`;
};

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return '0';
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0';
}

export function capitalize(str: string) {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const dateFormat = (iso: string, format: string) => {
  const date = DateTime.fromISO(iso);
  return date.toFormat(format);
};

export function getUuid() {
  return uuidv4();
}

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
export function getUserIP(onNewIP) {
  //  onNewIp - your listener function for new IPs
  //compatibility for firefox and chrome
  var myPeerConnection =
    window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new myPeerConnection({
      iceServers: [],
    }),
    noop = function () {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }

  //create a bogus data channel
  pc.createDataChannel('');

  // create offer and set local description
  pc.createOffer()
    .then(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    })
    .catch(function (reason) {
      // An error occurred, so handle the failure to connect
    });

  //listen for candidate events
  pc.onicecandidate = function (ice) {
    if (
      !ice ||
      !ice.candidate ||
      !ice.candidate.candidate ||
      !ice.candidate.candidate.match(ipRegex)
    )
      return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
}

/* object 를 formdata 로 변환 */
export function objectToFormData(obj: object) {
  const formData = new FormData();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] instanceof File) {
        formData.append(key, obj[key], obj[key].name);
      } else {
        formData.append(key, obj[key]);
      }
    }
  }

  return formData;
}

/** rem 길이를 px 로 변환 */
export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/** getServerSideProps context에서 ip 조회 */
export function getClientIp(req) {
  return requestIp.getClientIp(req);
}

/** getServerSideProps 응답헤더에 ip 넣기 */
export function setResponseHeaderIp(context: any) {
  const clientIp = requestIp.getClientIp(context.req);
  // 쿠키 설정
  const cookieOptions = [
    `clientIp=${clientIp}`,
    `Secure`, // HTTPS를 통해서만 쿠키 전송
  ];
  context.res.setHeader('Set-Cookie', cookieOptions);
  return;
}

export function getCookie() {
  const cookieString = document.cookie; // 현재 페이지의 쿠키 문자열을 가져온다.

  const cookieArray = cookieString.split(';'); // 쿠키 문자열을 세미콜론을 기준으로 나눈다.
  const cookies = {}; // 쿠키를 저장할 객체

  // 각 쿠키를 순회하며 key:value 형태로 객체에 저장한다.
  // 값이 없는경우 true 로 저장
  cookieArray.forEach((cookie) => {
    if (!cookie.includes('=')) {
      const cookieKey = cookie.trim();
      const cookieValue = true;
      cookies[cookieKey] = cookieValue;
      return;
    }

    const [key, value] = cookie.split('=');
    const cookieKey = key.trim();
    const cookieValue = decodeURIComponent(value.trim());
    cookies[cookieKey] = cookieValue;
  });

  return cookies; // 쿠키 객체를 반환한다.
}

// 이미지 파일을 로드하고 변환하는 함수
export const loadImageAsBinary = (url: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const arrayBuffer = xhr.response;
        const bytes = new Uint8Array(arrayBuffer);
        resolve(bytes);
      } else {
        reject(new Error('Failed to load image'));
      }
    };
    xhr.onerror = function () {
      reject(new Error('Failed to load image'));
    };
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.send();
  });
};

/**
 * 이미지 파일 리사이즈
 * @param file
 * @param maxWidth
 * @param maxHeight
 * @param keepAspectRatio
 * @returns Promise<File>
 */
function resizeFileAndReturnFile(
  file: File,
  maxWidth: number,
  maxHeight: number,
  keepAspectRatio?: boolean
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target!.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        let width = img.width;
        let height = img.height;

        if (keepAspectRatio) {
          // 원본 파일의 가로세로 비율을 유지
          const aspectRatio = width / height;
          if (width > maxWidth) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        } else {
          // 가로세로 비율 유지하지 않음
          if (width > maxWidth) {
            width = maxWidth;
          }
          if (height > maxHeight) {
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          // Blob에서 File 객체로 변환
          const resizedFile = new File([blob!], file.name, { type: file.type });
          resolve(resizedFile);
        }, file.type); // 원본 파일의 MIME 타입을 사용
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export default resizeFileAndReturnFile;

/**
 * 액티비티 객체를 문자열로 변환
 * summary 와 activityPoint 를 문자열로 출력
 * 토스트 메시지에 사용
 */
export function activityToStrng(activity: AsActivity) {
  return `${activity.summary} (+${activity.activityPoint}점)`;
}
