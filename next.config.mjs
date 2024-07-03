/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: '/prime-factorization-game',
    assetPrefix: '/prime-factorization-game/',
  };
  
  export default nextConfig;