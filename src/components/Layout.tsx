/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Search from "./search"
import "../styles/code.css"
const { MDXProvider } = require("@mdx-js/react")

interface LayoutInterface {
  location: {
    pathname: string | undefined
  }
}
const searchIndices = [{ name: `Blogs`, title: `検索結果`, hitComp: `PostHit` }]

enum HeaderType {
  TOP_PAGE = "TOP_PAGE",
  ARTICLE_PAGE = "ARTICLE_PAGE",
}

const Layout: React.FC<LayoutInterface> = props => {
  const { location, children } = props
  const rootPath = `/`

  const siteData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          algoliaSearch
        }
      }
    }
  `)

  const siteTitle = siteData.site.siteMetadata.title
  const algoliaSearch = siteData.site.siteMetadata.algoliaSearch

  return (
    <React.Fragment>
      <Header
        type={
          location.pathname === rootPath
            ? HeaderType.TOP_PAGE
            : HeaderType.ARTICLE_PAGE
        }
        title={siteTitle}
        isSearch={algoliaSearch}
      />
      <div className="w-full mx-auto" role="main">
        <MDXProvider>{children}</MDXProvider>
      </div>
    </React.Fragment>
  )
}

export default Layout

interface HeaderProps {
  title: string
  isSearch: boolean
  type: HeaderType
}
const Header: React.FC<HeaderProps> = ({ title, isSearch, type }) => {
  return (
    <nav className="bg-white w-full max-w-screen-xl mx-auto" role="navigation">
      <div className="container mx-auto p-4 flex flex-wrap items-center flex-no-wrap">
        <div className="mr-4 md:mr-8 text-lg">
          <Link to={`/`} className="sm:text-3xl text-xl">
            {type === HeaderType.TOP_PAGE ? <h1>{title}</h1> : <h3>{title}</h3>}
          </Link>
        </div>
        <div className="w-full w-auto flex-grow flex items-center">
          <ul className="flex flex-row items-center mx-0 ml-auto mt-0 pt-0 border-0">
            {isSearch && (
              <li>
                <Search collapse indices={searchIndices} hitsAsGrid={false} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}