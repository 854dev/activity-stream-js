import { createContext, useEffect, useState } from 'react';

import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import nookies from 'nookies';

import { useToastContext } from 'src/components/toast/toast';
import { firebaseAuth } from '../service/firebase/config/init';
import { useRouter } from 'next/router';
import AccountService from '../service/firebase/account-service';
import { AsProfile } from '../activity-stream/object/profile';
import { set } from 'react-hook-form';

type AuthContextType = {
  user: User | null;
  profile: AsProfile | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  login: null,
  logout: null,
});

export function AuthProvider({ children }: any) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  // proflie state
  const [profile, setProfile] = useState<AsProfile>();

  // 로그인 중 상태
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const { showToast } = useToastContext();

  /** email, password 받아 로그인 처리 */
  const login = async (email: string, password: string) => {
    try {
      if (loginLoading) return;
      setLoginLoading(true);

      const res = await signInWithEmailAndPassword(firebaseAuth, email, password);

      // get user profile
      const profile = await AccountService.getProfile(res.user.uid);
      setProfile(profile);
      router.push('/');
      setLoginLoading(false);

      return res;
    } catch (error) {
      showToast(`로그인에 실패했습니다: ${error}`, 'lineError');
      setLoginLoading(false);
    }
  };

  /** signout 처리 */
  const logout = () => {
    signOut(firebaseAuth);
    setUser(null);
    setProfile(null);
    // 쿠키 비우기
    nookies.destroy(undefined, 'token');

    showToast('로그아웃 되었습니다.');

    // 메인 페이지로 이동
    if (window) {
      router.push('/');
    }
  };

  // set user state and token cookie
  useEffect(() => {
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);

        // remove token cookie
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();

        setUser(user);

        // set profile
        const profile = await AccountService.getProfile(user.uid);
        setProfile(profile ?? null);

        // set token cookie
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseAuth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, login, logout }}>{children}</AuthContext.Provider>
  );
}
