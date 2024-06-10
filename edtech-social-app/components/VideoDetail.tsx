import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CommentForm from "./CommentForm";

const VideoDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const video = useSelector((state: RootState) =>
    state.videos.videos.find((video) => video.id === id)
  );

  if (!video) return <div>Video not found</div>;

  const handlePlaybackSpeedChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.playbackRate = parseFloat(e.target.value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.volume = parseFloat(e.target.value);
    }
  };
  return (
    <div>
      <h2 className="text-2xl mb-4">{video.title}</h2>
      <p>{video.description}</p>
      <div>
        <video controls src={video.url} className="w-full h-auto" />
      </div>
      <div>
        <h3 className="text-xl mt-4">Comments</h3>
        <ul>
          {video.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
      <CommentForm videoId={video.id} />
      <div className="mt-4">
        <label>
          Playback Speed:
          <select
            onChange={handlePlaybackSpeedChange}
            className="ml-2 border p-1 rounded"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>
      </div>
      <div className="mt-2">
        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            onChange={handleVolumeChange}
            className="ml-2"
          />
        </label>
      </div>
    </div>
  );
};

export default VideoDetail;
