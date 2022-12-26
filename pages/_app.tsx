import { AppProps } from 'next/app'
import 'styles/globals.css'
import HeaderLayout from 'components/headers/HeaderLayout'
console.log('_app.tsx')

export default function App({ Component, pageProps, router }: AppProps) {
  console.log('nnnn', router, router.pathname)
  const showHeader = router.pathname !== '/'

  return (
    <>
      {showHeader && <HeaderLayout />}
      <Component {...pageProps} />
    </>
  )
}
