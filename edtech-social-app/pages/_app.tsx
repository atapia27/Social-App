// edtech-social-app/pages/_app.tsx

import { AppProps } from "next/app"
import { useRouter } from "next/router"
import "../styles/globals.css"
import Layout from "../components/layout"
import ProtectedRoute from "../auth/ProtectedRoute"
import { isProtectedRoute } from "../auth/utils/isProtectedRoute"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const path = router.pathname

  return (
    <Layout>
      {isProtectedRoute(path) ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </Layout>
  )
}

export default MyApp
