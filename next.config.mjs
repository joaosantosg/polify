/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true, // Add this to ignore TypeScript errors during build
  },
};

export default nextConfig;
