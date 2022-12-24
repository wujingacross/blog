import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getSortedPostsData } from 'lib/posts'
import Layout from 'components/Layout'
import { Widont } from 'components/Widont'
import Date from 'components/DateN'

export default function PostBlog({ allPostsData }) {
  return (
    <Layout>
      <main>
        <header className="py-16 sm:text-center">
          <h1 className="mb-4 text-3xl tracking-tight text-slate-900 font-extrabold dark:text-slate-200">
            Latest Updates
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-400">
            <Widont>All the latest Tailwind CSS news, straight from the team.</Widont>
          </p>
        </header>
      </main>
      {/* Add this <section> tag below the existing <section> tag */}
      <section className="relative">
        <div className="space-y-16">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id} className="relative group">
              <div className="relative">
                <Link href={`/posts/${id}`}>
                  <div className="text-base font-semibold tracking-tight text-slate-900 pt-8 lg:pt-0 dark:text-slate-200">
                    {title}
                  </div>
                </Link>
                <div className="mt-2 mb-4">
                  <Date dateString={date} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

PostBlog.layoutProps = {
  meta: {
    title: 'PostBlog',
    description: 'All the latest Tailwind CSS news, straight from the team.',
  },
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
