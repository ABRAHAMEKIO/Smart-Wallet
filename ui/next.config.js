/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Ignores ESLint warnings during build
    },
    typescript: {
        ignoreBuildErrors: true, // Ignores TypeScript warnings and errors during build
    },
    reactStrictMode: true, // Ensures React strict mode is enabled
};

module.exports = nextConfig;