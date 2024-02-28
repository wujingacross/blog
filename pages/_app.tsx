import { AppProps } from 'next/app'
import { Fragment, useState } from 'react'
import 'styles/globals.css'
import HeaderLayout from 'components/headers/HeaderLayout'

export default function App({ Component, pageProps, router }: AppProps) {
  let [navIsOpen, setNavIsOpen] = useState(false)

  const showHeader = router.pathname !== '/'
  const Layout = Component.layoutProps?.Layout || Fragment
  const layoutProps = Component.layoutProps?.Layout
    ? { layoutProps: Component.layoutProps, navIsOpen, setNavIsOpen }
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
