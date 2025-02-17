/** @type {import('next').NextConfig} */
const nextConfig = {
  // Recommended: this will reduce output
  // Docker image size by 80%+
  output: "standalone",
  // Optional: bring your own cache handler
  // cacheHandler: path.resolve('./cache-handler.mjs'),
  // cacheMaxMemorySize: 0, // Disable default in-memory caching

  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
  // Optional: override the default (1 year) `stale-while-revalidate`
  // header time for static pages
  // swrDelta: 3600 // seconds
  images: {
    remotePatterns: [
      {
        hostname: "s3.timeweb.cloud",
      },
      {
        protocol: "https",
        hostname: "www.s3.timeweb.cloud",
      },
    ],
  },
};

export default nextConfig;

