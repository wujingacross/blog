import Link from 'next/link'
import { ThemeToggle } from 'components/headers/ThemeToggle'
import Hero from 'components/home/Hero'

export function NavItems() {
  return (
    <>
      <li>
        <a
          href="https://tailwindui.com/?ref=top"
          className="hover:text-sky-500 dark:hover:text-sky-400"
        >
          Components
        </a>
      </li>
      <li>
        <Link href="/blog" className="hover:text-sky-500 dark:hover:text-sky-400">
          Blog
        </Link>
      </li>
      <li>
        <Link href="/showcase" className="hover:text-sky-500 dark:hover:text-sky-400">
          <>
            Showcase
            <span className="ml-2 font-medium text-xs leading-5 rounded-full text-sky-600 bg-sky-400/10 px-2 py-0.5  dark:text-sky-400">
              New
            </span>
          </>
        </Link>
      </li>
    </>
  )
}

const TopMenuBar = () => (
  <div className="relative pt-6 lg:pt-8 font-semibold text-sm leading-6 text-slate-700 dark:text-slate-200">
    <div className="flex justify-between">
      Logo
      <div className="flex items-center">
        <nav>
          <ul className="flex items-center space-x-8">
            <NavItems />
          </ul>
        </nav>
        <div className="flex items-center ml-6 pl-6 border-l border-slate-200 dark:border-slate-800">
          <ThemeToggle />
          <a
            href="https://github.com/wujingacross/blog"
            className="ml-6 block text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
          >
            <span className="sr-only">WJ on GitHub</span>
            <svg viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
)

const Title = () => (
  <div className="pt-20">
    <h1 className="text-4xl text-slate-900 font-extrabold sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
      websites
    </h1>
    <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl dark:text-slate-400 mx-auto">
      Write something casually
    </p>
  </div>
)

export default function Header() {
  return (
    <header className="relative">
      <div className="px-4 sm:px-6 md:px-8">
        <TopMenuBar />
        <Title />
      </div>
      <Hero />
    </header>
  )
}
