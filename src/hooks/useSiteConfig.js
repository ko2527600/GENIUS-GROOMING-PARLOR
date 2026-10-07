import { useEffect, useState } from "react";

const EMPTY = { hiddenStaticIds: [], categoryOverrides: {} };

// Which built-in photos/videos the admin has hidden or recategorized (see
// Admin dashboard "Site Photos & Videos" panel). Gallery.jsx and
// Services.jsx both read this to filter the bundled media they already ship.
export default function useSiteConfig() {
  const [config, setConfig] = useState(EMPTY);

  useEffect(() => {
    fetch("/api/media?config=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setConfig(data.config);
      })
      .catch(() => {});
  }, []);

  return config;
}
