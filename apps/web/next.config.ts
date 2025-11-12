import type { NextConfig } from 'next';

const config: NextConfig = {
    reactStrictMode: true,
    experimental: {
        turbopack: {
            resolveAlias: {
                '@/*': './src/*',
            },
        },
    },
};

export default config;
