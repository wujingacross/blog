import Head from 'next/head'
import Layout, { siteTitle } from 'components/Layout'
import Header from 'components/headers/Header'
import Testimonials from 'components/home/Testimonials'

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
    </>
  )
}
