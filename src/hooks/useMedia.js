import { useEffect, useState } from "react";

// Admin-uploaded photos/videos (see Admin dashboard "Media" tab), merged
// into the Gallery and Services pages alongside the built-in ones.
export default function useMedia() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setMedia(data.media);
      })
      .catch(() => {});
  }, []);

  return media;
}
