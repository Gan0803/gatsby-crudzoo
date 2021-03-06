import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"

import { Bio } from "../components/Bio"
import SEO from "../components/Seo"
import { Button } from "../components/Button"
import { Section } from "../components/Section"

import ArticleList from "../components/ArticleList"
import SeriesList from "../components/SeriesList"
import { useLocalizeData } from "../hooks/useLocalize"

import { IArticleNode } from "../types/Article"
import { ISeriesNode } from "../types/Series"
import { ILocation } from "../types/Location"
import "../styles/tailwind.css"
import "../styles/global.css"

interface ITopPageProps {
  location: ILocation
  data: {
    site: {
      siteMetadata: {
        title: string
        heroText: string
        language: string
        keywords: string[]
        description: string
      }
    }
    allSeriesJson: {
      totalCount: number
      edges: ISeriesNode[]
    }
    allMdx: {
      edges: IArticleNode[]
    }
  }
}

const TopPage: React.FC<ITopPageProps> = ({ data, location }) => {
  const { language, title, description, heroText } = data.site.siteMetadata
  const localizedData = useLocalizeData()
  const seriesCount = data.allSeriesJson.totalCount
  const seriesData = data.allSeriesJson.edges
  const keywords = data.site.siteMetadata.keywords
  const postData = data.allMdx.edges

  return (
    <Layout location={location}>
      <SEO lang={language} title={title} keywords={keywords} />
      <Hero heroText={heroText} description={description} />

      {seriesCount > 0 && (
        <Section isBgColor={true}>
          <SectionTitle>Series</SectionTitle>
          <SeriesList series={seriesData}></SeriesList>
        </Section>
      )}
      <Section isBgColor={false}>
        <SectionTitle>Articles</SectionTitle>
        <ArticleList articles={postData} />
        <div className="flex justify-center">
          <Link to="/blogs">
            <Button>{localizedData.Archive.list}</Button>
          </Link>
        </div>
      </Section>
    </Layout>
  )
}
export default TopPage

interface HeroProps {
  heroText: string
  description: string
}
const Hero: React.FC<HeroProps> = ({ heroText, description }) => {
  return (
    <div className="w-full max-w-screen-xl relative mx-auto px-6 pt-16 pb-40 md:pb-24">
      <div className=" -mx-6">
        <div className="px-6 text-left md:text-center max-w-2xl md:max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight">
            <PrimaryColorSpan>{heroText}</PrimaryColorSpan>
          </h1>
          <p className="mt-6 leading-relaxed sm:text-lg md:text-xl text-gray-600">
            {description}
          </p>
          <div className="flex mt-12 justify-start md:justify-center">
            <Bio />
          </div>
        </div>
      </div>
    </div>
  )
}

const SectionTitle: React.FC = ({ children }) => {
  return <div className="text-primary text-4xl mb-10">{children}</div>
}

const PrimaryColorSpan: React.FC = ({ children }) => {
  return <span className="text-primary font-medium">{children}</span>
}

export const query = graphql`
  query MDXQuery {
    site {
      siteMetadata {
        title
        heroText
        description
        language
        keywords
      }
    }
    allSeriesJson {
      totalCount
      edges {
        node {
          id
          title
          seriesId
          spoiler
          image {
            childImageSharp {
              fluid(maxWidth: 300) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 10) {
      edges {
        node {
          body
          parent {
            ... on File {
              name
              relativeDirectory
            }
          }
          id
          frontmatter {
            title
            date
            spoiler
            image {
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
