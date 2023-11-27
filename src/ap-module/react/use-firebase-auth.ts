import { useContext } from 'react';
import { AuthContext } from './auth-context';

const useFirebaseAuth = () => {
  return useContext(AuthContext);
};
export default useFirebaseAuth;
