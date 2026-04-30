/** @type {import('next').NextConfig} */
const nextConfig = {
  // When building for Capacitor (native iOS/Android shells), we need a fully
  // static export. Toggle with `EXPORT=1 npm run build`.
  ...(process.env.EXPORT === "1"
    ? { output: "export", images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
