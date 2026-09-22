import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // The case study used to live at an underscored slug, and the old Bagel
      // entry duplicated Bagel Labs. Both are linked from elsewhere, so they
      // are redirected rather than dropped.
      { source: "/work/bagel_labs", destination: "/work/bagel-labs", permanent: true },
      { source: "/work/bagel", destination: "/work/bagel-labs", permanent: true },
    ];
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
