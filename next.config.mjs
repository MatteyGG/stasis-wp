/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .mdx extensions for files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  output: "standalone",
  // Optional: bring your own cache handler
  // cacheHandler: path.resolve('./cache-handler.mjs'),
  // cacheMaxMemorySize: 0, // Disable default in-memory caching

  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
  // Optionally, add any other Next.js config below
};

// Combine MDX and Next.js config
export default nextConfig;
