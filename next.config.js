/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "images.unsplash.com",
      "s3-media1.fl.yelpcdn.com",
      "s3-media2.fl.yelpcdn.com",
      "s3-media3.fl.yelpcdn.com",
      "s3-media4.fl.yelpcdn.com",
    ],
  },
};

// async headers() {
//   return [
//     {
//       // matching all API routes
//       source: "/api.yelp.com/v3/businesses/:path*",
//       headers: [
//         { key: "Access-Control-Allow-Credentials", value: "true" },
//         {
//           key: "Access-Control-Allow-Origin",
//           value: "http://localhost:3000/",
//         },
//         {
//           key: "Access-Control-Allow-Methods",
//           value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
//         },
//         {
//           key: "Access-Control-Allow-Headers",
//           value:
//             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
//         },
//       ],
//     },
//   ];
// },

module.exports = nextConfig;
