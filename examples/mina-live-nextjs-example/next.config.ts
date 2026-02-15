import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withMinaLive = require("@keadex/mina-live/nextjs-plugin");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withMinaLive()(nextConfig);
