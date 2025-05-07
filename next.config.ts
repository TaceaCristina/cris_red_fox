import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: "lh3.googleusercontent.com"
        },
                   
    ]
},
    typescript: {
        // Această opțiune va permite build-ului să treacă fără a verifica erorile TypeScript
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
  env: {
    // Expunem explicit variabilele de mediu pentru server
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    // Variabile publice sunt deja disponibile cu prefixul NEXT_PUBLIC_
  },
}; 

export default nextConfig;
