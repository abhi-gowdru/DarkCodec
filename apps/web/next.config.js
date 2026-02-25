/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; " +
                               // Added static.cloudflareinsights.com here
                               "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com; " + 
                               "frame-src https://challenges.cloudflare.com; " +
                               "style-src 'self' 'unsafe-inline'; " +
                               "img-src 'self' data:; " +
                               // Added static.cloudflareinsights.com here as well for reporting
                               "connect-src 'self' https://challenges.cloudflare.com *.r2.cloudflarestorage.com https://static.cloudflareinsights.com;",
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;