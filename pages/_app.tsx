import { AppProps } from 'next/app'
import { Fragment, useState } from 'react'
import 'styles/globals.css'
import HeaderLayout from 'components/headers/HeaderLayout'

// 全局布局文件

export default function App({ Component, pageProps, router }: AppProps) {
  let [navIsOpen, setNavIsOpen] = useState(false)

  const showHeader = router.pathname !== '/'
  const Layout = (Component as any).layoutProps?.Layout || Fragment
  const layoutProps = (Component as any).layoutProps?.Layout
    ? { layoutProps: (Component as any).layoutProps, navIsOpen, setNavIsOpen }
    : {}

  return (
    <>
      {showHeader && <HeaderLayout />}
      <Layout {...layoutProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
