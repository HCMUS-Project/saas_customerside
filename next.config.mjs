/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    domains: ["localhost", "res.cloudinary.com", "img.freepik.com"],
  },
};

export default nextConfig;
