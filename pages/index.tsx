import Head from 'next/head'
import Layout, { siteTitle } from 'components/Layout'
import Header from 'components/headers/Header'
import Testimonials from 'components/home/Testimonials'
import ConstraintBased from 'components/home/ConstraintBased'
import BuildAnything from 'components/home/BuildAnything'

export default function Home() {
  return (
    <>
      {/* NextJs中 页面元数据 */}
      <Head>
        <title>{siteTitle}</title>
        <meta key="twitter:title" name="twitter:title" content={siteTitle} />
        <meta key="og:title" property="og:title" content={siteTitle} />
        <title>{siteTitle}</title>
      </Head>
      {/* 页面内容 */}
      <div className="mb-20 space-y-20 overflow-hidden">
        <Header />
      </div>
      <Testimonials />
      <div className="pt-20 mb-20 flex flex-col gap-y-20 overflow-hidden sm:pt-32 sm:mb-32 sm:gap-y-32 md:pt-40 md:mb-40 md:gap-y-40">
        <ConstraintBased />
        <BuildAnything />
      </div>
    </>
  )
}
