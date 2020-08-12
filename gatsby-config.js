require("dotenv").config()
module.exports = {
  siteMetadata: {
    title: `Eluize`,
    description: `Eluize - Eolian - August 24th.`,
    author: `@teh.raptor`,
  },
  plugins: [
    `gatsby-plugin-portal`,
    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({ object }) => object.typeName || "JsonFiles",
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Eolian`,
        short_name: `eluize-releases`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#FF0000`,
        display: `minimal-ui`,
        icon: `src/images/bird-head.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
