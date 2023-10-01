/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // In most cases, the images Next was producing were _larger_ after
    // transcoding to lossy WebP. This is very much an edge case of this site,
    // due to flags being large regions of flat colour.
    // For this site, it's better to leave the images as their default.
    unoptimized: true,
  },
};

module.exports = nextConfig;
