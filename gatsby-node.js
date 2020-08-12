const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  // const { createPage } = actions
  // const template = path.resolve(`src/templates/artist.js`)
  // return graphql(`
  //   query loadArtistQuery {
  //     allJsonFiles {
  //       edges {
  //         node {
  //           name
  //         }
  //       }
  //     }
  //   }
  // `).then(result => {
  //   if (result.errors) {
  //     throw result.errors
  //   }
  //   result.data.allJsonFiles.edges.forEach(edges => {
  //     const name = edges.node.name.toLowerCase().split(" ").join("-")
  //     createPage({
  //       path: `${name}`,
  //       component: template,
  //       context: {
  //         profileUrl: `Artists/${name}/profile`,
  //         midUrl: `Artists/${name}/MID`,
  //         midUrlDesk: `Artists/${name}/MID_desk`,
  //         regexName: `/^${edges.node.name}$/i`,
  //         releaseSquare: `Artists/${name}/release-square`,
  //       },
  //     })
  //   })
  // })
}
// exports.onCreateWebpackConfig = ({ actions }) => {
//   actions.setWebpackConfig({
//     externals: ["react-helmet"],
//   })
// }
