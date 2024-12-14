/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.clerk.dev',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'us-west-2.graphassets.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
}

export default nextConfig