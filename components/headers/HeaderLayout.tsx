import { useState, useEffect } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ThemeToggle } from 'components/headers/ThemeToggle'

export function NavItems() {
  return (
    <>
      <li>
        <Link href="/docs/installation" className="hover:text-sky-500 dark:hover:text-sky-400">
          Docs
        </Link>
      </li>
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
          Showcase
        </Link>
        <span className="ml-2 font-medium text-xs leading-5 rounded-full text-sky-600 bg-sky-400/10 px-2 py-0.5  dark:text-sky-400">
          New
        </span>
      </li>
    </>
  )
}

export default function Header() {
  let [isOpaque, setIsOpaque] = useState(false) // 页面滚动超过50时，是否显示透明背景
  // console.log('页面Header是否显示透明背景', isOpaque)

  useEffect(() => {
    let offset = 50
    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true)
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isOpaque])

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06]',
        isOpaque
          ? 'bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75'
          : 'bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent'
      )}
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between py-4 px-4 lg:px-8 border-b lg:border-0 border-slate-900/10">
          <Link href="/">Logo</Link>
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
    </div>
  )
}
