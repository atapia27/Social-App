// edtech-social-app\pages\index.tsx

import type { NextPage } from "next";
import VideoFeed from "../components/VideoFeed";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <VideoFeed />
      </main>
    </div>
  );
};

export default Home;
