import type { NextConfig } from "next";
import CopyPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@keadex/mina-react/*.wasm",
            to({ context, absoluteFilename }) {
              return "static/chunks/[name][ext]";
            },
          },
        ],
      }),
    );
    return config;
  },
};

export default nextConfig;
