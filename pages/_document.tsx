import clsx from 'clsx'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

// 服务器的初始响应

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body
          className={clsx('antialiased text-slate-500 dark:text-slate-400', {
            'bg-white dark:bg-slate-900': !this.props.dangerousAsPath.startsWith('/examples/'),
          })}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
