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
}; 

export default nextConfig;
