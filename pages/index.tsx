import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Date from "components/DateN";
import Layout, { siteTitle } from "components/Lay";
import utilStyles from "styles/utils.module.css";
import { getSortedPostsData } from "lib/posts";

export default function Home({ allPostsData }) {
  console.log("allPostsData: ", allPostsData);
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

        {/* Add this <section> tag below the existing <section> tag */}
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>{title}</Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
