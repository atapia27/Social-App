// edtech-social-app\pages\index.tsx

import type { NextPage } from "next"
import VideoFeed from "../components/video/VideoFeed"
import { useEffect } from "react"
import { useRouter } from "next/router"
import useAuthStore from "../zustand/store/authStore"

const Home: NextPage = () => {
  const { loggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loggedIn) {
      router.push("/register")
    }
  }, [loggedIn, router])

  if (!loggedIn) {
    return <div>Loading...</div> // Or any other loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <VideoFeed />
      </main>
    </div>
  )
}

export default Home
