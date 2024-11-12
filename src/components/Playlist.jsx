import React, { useState } from "react";
import axios from "axios";
import "./Playlist.css";

function Playlist() {
  let [link, setLink] = useState("");
  const [watchTimes, setWatchTimes] = useState({
    "1x": "",
    "1.25x": "",
    "1.5x": "",
    "1.75x": "",
    "2x": "",
  });
  const [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  let [totalVideos, setTotalVideos] = useState(0);
  let [channelName, setChannelName] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
  
    if (!link || !link.includes("playlist?list=")) {
      setError("Please enter a valid YouTube playlist link.");
      setLoading(false);
      return;
    }
  
    try {
      const playlistId = new URLSearchParams(new URL(link).search).get("list");
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  
      let totalVideos = 0;
      let totalDurationInSeconds = 0;
      let nextPageToken = "";
      let channelName = "";
  
      do {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            params: {
              part: "snippet,contentDetails",
              maxResults: 50,
              playlistId: playlistId,
              key: apiKey,
              pageToken: nextPageToken,
            },
          }
        );
  
        const items = response.data.items;
        totalVideos += items.length;
  
        if (totalVideos === items.length) {
          channelName = items[0]?.snippet.channelTitle || "";
        }
  
        for (let item of items) {
          const videoId = item.contentDetails.videoId;
          const videoDetails = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: "contentDetails",
                id: videoId,
                key: apiKey,
              },
            }
          );
          const duration = videoDetails.data.items[0].contentDetails.duration;
          const seconds = convertISO8601ToSeconds(duration);
          totalDurationInSeconds += seconds;
        }
  
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
  
      setChannelName(channelName);
      setTotalVideos(totalVideos);
  
      const timeAt1x = totalDurationInSeconds;
      const timeAt1_25x = totalDurationInSeconds / 1.25;
      const timeAt1_5x = totalDurationInSeconds / 1.5;
      const timeAt1_75x = totalDurationInSeconds / 1.75;
      const timeAt2x = totalDurationInSeconds / 2;
  
      setWatchTimes({
        "1x": formatTime(timeAt1x),
        "1.25x": formatTime(timeAt1_25x),
        "1.5x": formatTime(timeAt1_5x),
        "1.75x": formatTime(timeAt1_75x),
        "2x": formatTime(timeAt2x),
      });
    } catch (err) {
      setError("There was an error fetching the playlist data.");
      console.error(err);
    }
    setLoading(false);
  };
  
  

  const convertISO8601ToSeconds = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    const hours = parseInt(matches[1] || 0, 10);
    const minutes = parseInt(matches[2] || 0, 10);
    const seconds = parseInt(matches[3] || 0, 10);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${sec} seconds`;
  };

  return (
    <div className="container w-75 border rounded-3 p-4 mt-4 custom-con">
      <div>
        <h5 className="fs-6 mb-2">Enter a YouTube Playlist Link Below:</h5>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control custom-input fs-6 text-muted"
            placeholder="https://youtube.com/playlist?list=..."
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            className="btn btn-secondary custom-button"
            onClick={handleSubmit}
          >
            Analyze
          </button>
        </div>
        {error && <p className="text-center fw-bold text-danger">{error}</p>}
        {loading && (
          <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center" disabled>
            <div className="spinner-border text-light spinner-border-sm wave-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Analyzing, please wait...
          </button>
        )}

        {!loading && !error && watchTimes["1x"] && (
          <div className="mt-4 p-3 bg-light rounded shadow-sm">
            <h5 className="mb-3 text-primary border-bottom pb-2">
              {"\u{1F3AC}"} Playlist Analytics
            </h5>

            <div className="mb-2">
              <span className="badge bg-info text-dark me-2">Channel:</span>
              <span className="fw-bold">{channelName}</span>
            </div>

            <div className="mb-2">
              <span className="badge bg-warning text-dark me-2">
                Total Videos:
              </span>
              <span className="fw-bold">{totalVideos} videos</span>
            </div>

            <div className="mb-2">
              <span className="badge bg-success text-light me-2">
                Total Duration:
              </span>
              <span>{watchTimes["1x"]}</span>
            </div>

            <h6 className="mt-4 text-secondary">
              {"\u{23E9}"} Breakdown by Playback Speed:
            </h6>

            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="text-info">At 1.25x speed:</span>{" "}
                {watchTimes["1.25x"]}
              </li>
              <li className="list-group-item">
                <span className="text-info">At 1.5x speed:</span>{" "}
                {watchTimes["1.5x"]}
              </li>
              <li className="list-group-item">
                <span className="text-info">At 1.75x speed:</span>{" "}
                {watchTimes["1.75x"]}
              </li>
              <li className="list-group-item">
                <span className="text-info">At 2x speed:</span>{" "}
                {watchTimes["2x"]}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="bottom-text mt-4 p-3 bg-light rounded shadow-sm">
        <p>
          YouTube Playlist Analyzer evaluates your playlist's total duration,
          then breaks down viewing times at speeds of 1.25x, 1.5x, 1.75x, and
          2x. Streamline your viewing experience and optimize your
          binge-watching sessions with precise insights!
        </p>
      </div>
    </div>
  );
}

export default Playlist;
