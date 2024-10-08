/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com', 'img.youtube.com', 'i.ytimg.com'],
    },
}

export default nextConfig;