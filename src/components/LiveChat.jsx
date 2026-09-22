import { useEffect } from "react";
import { liveChat } from "../data/shopData";

// Loads the Tawk.to live-chat widget so customers can send enquiries
// straight from the site and the shop can reply from the Tawk.to app.
// No-op until tawkToPropertyId/tawkToWidgetId are filled in.
export default function LiveChat() {
  useEffect(() => {
    if (!liveChat.tawkToPropertyId || !liveChat.tawkToWidgetId) return;
    if (document.getElementById("tawkto-script")) return;

    const script = document.createElement("script");
    script.id = "tawkto-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${liveChat.tawkToPropertyId}/${liveChat.tawkToWidgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null;
}
