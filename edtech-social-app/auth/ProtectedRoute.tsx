import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { selectAuthToken } from '../redux/slices/authSlice';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => selectAuthToken(state));

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [router, token]);

  return <>{children}</>;
};

export default ProtectedRoute;
