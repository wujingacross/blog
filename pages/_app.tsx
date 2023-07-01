import { AppProps } from 'next/app'
import 'styles/globals.css'
import HeaderLayout from 'components/headers/HeaderLayout'

export default function App({ Component, pageProps, router }: AppProps) {
  const showHeader = router.pathname !== '/'

  return (
    <>
      {showHeader && <HeaderLayout />}
      <Component {...pageProps} />
    </>
  )
}
