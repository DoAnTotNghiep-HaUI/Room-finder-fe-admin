import { createDirectus, rest, authentication, realtime } from "@directus/sdk";

const directus = createDirectus(`${import.meta.env.VITE_API_ENDPOINT}`)
  .with(authentication("json", { credentials: "include", autoRefresh: true }))
  .with(rest())
  .with(realtime());

export default directus;
