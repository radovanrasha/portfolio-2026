import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Emit a minimal, self-contained server bundle in `.next/standalone`
  // so the Docker image can run without installing node_modules.
  output: "standalone",
};

export default nextConfig;
