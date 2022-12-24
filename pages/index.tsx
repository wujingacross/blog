import Head from 'next/head'
import Layout, { siteTitle } from 'components/Layout'
import Header from 'components/headers/Header'

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta key="twitter:title" name="twitter:title" content={siteTitle} />
        <meta key="og:title" property="og:title" content={siteTitle} />
        <title>{siteTitle}</title>
      </Head>
      <main className="mb-20 space-y-20 overflow-hidden">
        <Header />
        <div>
          <h1 className="text-4xl text-slate-900 font-extrabold sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
            websites
          </h1>
          <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl dark:text-slate-400 mx-auto">
            Write something casually
          </p>
        </div>
      </main>
    </>
  )
}
