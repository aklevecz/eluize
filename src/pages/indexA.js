import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ScrollUp from "../components/scroll-up"
import { useStaticQuery, graphql, Link } from "gatsby"

const IndexPage = () => {
  // const data = useStaticQuery(graphql`
  //   query {
  //     allJsonFiles {
  //       edges {
  //         node {
  //           name
  //         }
  //       }
  //     }
  //   }
  // `)
  let heading
  return (
    <Layout>
      <SEO title="Home" />
      <h1>HOWDY</h1>
      <ScrollUp />
      {/* {data.allJsonFiles.edges
        .sort((a, b) => a.node.name.localeCompare(b.node.name))
        .map((n, i) => {
          const link = n.node.name.split(" ").join("-").toLowerCase()
          const firstChar = link[0]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
          if (heading !== firstChar) {
            heading = firstChar
            heading = isNaN(heading) ? heading : "#"
            return (
              <div key={heading}>
                <div className="link-section-heading">{heading}</div>
                <Link key={link} className="link" to={`/${link}`}>
                  {n.node.name}
                </Link>
              </div>
            )
          }
          heading = firstChar
          return (
            <Link key={link} className="link" to={`/${link}`}>
              {n.node.name}
            </Link>
          )
        })} */}
    </Layout>
  )
}

export default IndexPage
