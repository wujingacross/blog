import { GetStaticProps } from "next";
import Link from "next/link";
import { getSortedPostsData } from "lib/posts";
import { getAllPostPreviews } from "lib/getAllPosts";
import Layout from "components/Layout";
import { Widont } from "components/Widont";
import Date from "components/DateN";

const posts = getAllPostPreviews()
console.log('dddddd3', posts)

export default function Blog({ allPostsData }) {
  console.log("allPostsData: ", allPostsData);

  return (
    <Layout>
      <main>
        <header className="py-16 sm:text-center">
          <h1 className="mb-4 text-3xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200">
            Latest Updates
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400">
            <Widont>
              All the latest Tailwind CSS news, straight from the team.
            </Widont>
          </p>
        </header>
      </main>
      {/* Add this <section> tag below the existing <section> tag */}
      <section className="relative">
        <div className="space-y-16">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id} className="relative group">
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
              <div className="relative">
                <h3 className="text-base font-semibold tracking-tight text-slate-900 pt-8 lg:pt-0 dark:text-slate-200">
                  {title}
                </h3>
                <div className="mt-2 mb-4">
                  <Date dateString={date} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-16">
          {posts.map(({ slug, module: CusModule }, idx) => {
            console.log('eeee', slug, module)
            return (
              <div key={idx}>
                <Link href={`/blog/${slug}`}>
                  <h3>{slug}</h3>
                </Link>
                {/* <CusModule /> */}
              </div>
            )
          })}
        </div>
      </section>
    </Layout>
  );
}

Blog.layoutProps = {
  meta: {
    title: 'Blog',
    description: 'All the latest Tailwind CSS news, straight from the team.',
  },
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  // const posts = getAllPostPreviews()
  // console.log("lllll", posts);
  return {
    props: {
      allPostsData,
      // posts
    },
  };
};
