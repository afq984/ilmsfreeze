import { registerRoute } from "workbox-routing";

const handleStatus = async () => {
  return new Response(
    JSON.stringify({
      version: 1,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

registerRoute("/sw-status.json", handleStatus);
