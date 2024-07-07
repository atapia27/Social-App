// edtech-social-app\pages\_app.tsx
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import '../styles/globals.css';
import Layout from '../components/layout';
import ProtectedRoute from '../auth/ProtectedRoute';
import { isProtectedRoute } from '../utils/protectedRoutes';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname;

  return (
    <Provider store={store}>
      <Layout>
        {isProtectedRoute(path) ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </Provider>
  );
}

export default MyApp;