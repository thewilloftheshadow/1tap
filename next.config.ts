import type { NextConfig } from "next"

const config: NextConfig = {
	reactStrictMode: true,
	allowedDevOrigins: ["http://localhost:3000", "https://local.shadowing.dev"],
	productionBrowserSourceMaps: false,
	experimental: {
		serverSourceMaps: false,
		serverActions: {
			bodySizeLimit: "100mb"
		},
		esmExternals: true
	},
	transpilePackages: ["file-type"]
}

export default config
