import Head from "next/head";
import Layout, { siteTitle } from "components/Lay";
import utilStyles from "styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta key="twitter:title" name="twitter:title" content={siteTitle} />
        <meta key="og:title" property="og:title" content={siteTitle} />
        <title>{siteTitle}</title>
      </Head>
      <main>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <section className={utilStyles.headingMd}>
          <p>Hello, I&apos;m WJ... I&apos;m a software enginer!!</p>
          <p>
            (This is my website - you’ll be building a site like this on{" "}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
          </p>
        </section>
      </main>
    </Layout>
  );
}
