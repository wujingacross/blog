const path = require('path')
const minimatch = require('minimatch')
const frontMatter = require('front-matter')
const { createLoader } = require('simple-functional-loader')
const withSmartQuotes = require('@silvenon/remark-smartypants')
const { withSyntaxHighlighting } = require('./remark/withSyntaxHighlighting')
const { withPrevalInstructions } = require('./remark/withPrevalInstructions')
const { withTableOfContents } = require('./remark/withTableOfContents')
const withExamples = require('./remark/withExamples')
const { withNextLinks } = require('./remark/withNextLinks')
const { withLinkRoles } = require('./rehype/withLinkRoles')
const Prism = require('prismjs')

const fallbackLayouts = {
  'pages/docs/**/*': ['layouts/DocumentationLayout', 'DocumentationLayout'],
}

const fallbackDefaultExports = {
  'pages/{docs,components}/**/*': ['layouts/ContentsLayoust', 'ContentsLayout'],
  'pages/blog/**/*': ['layouts/BlogPostLayout', 'BlogPostLayout'],
  'pages/showcase/**/*': ['layouts/ShowcaseLayout', 'ShowcaseLayout'],
}

const fallbackGetStaticProps = {
  'pages/blog/**/*': 'layouts/BlogPostLayout',
}

// const withMDX = require("@next/mdx")({
//   extension: /\.mdx?$/,
//   options: {
//     remarkPlugins: [],
//     rehypePlugins: [],
//   },
// });

module.exports = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    esmExternals: false,
  },
  webpack(config, options) {
    let mdx = (plugins = []) => [
      {
        loader: '@mdx-js/loader',
        /** @type {import('@mdx-js/loader').Options} */
        options:
          plugins === null
            ? {}
            : {
                remarkPlugins: [
                  withPrevalInstructions,
                  withExamples,
                  withTableOfContents,
                  withSyntaxHighlighting,
                  withNextLinks,
                  withSmartQuotes,
                  ...plugins,
                ],
                rehypePlugins: [withLinkRoles],
              },
      },
      createLoader(function (source) {
        console.log('mainMdxLoader 3 -----')
        let pathSegments = this.resourcePath.split(path.sep)

        let slug =
          pathSegments[pathSegments.length - 1] === 'index.mdx'
            ? pathSegments[pathSegments.length - 2]
            : pathSegments[pathSegments.length - 1].replace(/\.mdx$/, '')
        return source + `\n\nexport const slug = '${slug}'`
      }),
    ]

    config.module.rules.push({
      test: { and: [/\.mdx$/, /snippets/] },
      resourceQuery: { not: [/rss/, /preview/] },
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [withSyntaxHighlighting],
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.mdx$/,
      resourceQuery: /rss/,
      use: [options.defaultLoaders.babel, ...mdx()],
    })

    config.module.rules.push({
      test: /\.mdx$/,
      resourceQuery: /preview/,
      use: [
        options.defaultLoaders.babel,
        createLoader(function (src) {
          const [preview] = src.split('<!--/excerpt-->')
          return preview.replace('<!--excerpt-->', '')
        }),
        ...mdx([
          () => (tree) => {
            console.log('mdx plugs', this.resourcePath)
            let firstParagraphIndex = tree.children.findIndex((child) => child.type === 'paragraph')
            if (firstParagraphIndex > -1) {
              tree.children = tree.children.filter((child, index) => {
                if (child.type === 'import' || child.type === 'export') {
                  return true
                }
                return index <= firstParagraphIndex
              })
            }
          },
        ]),
      ],
    })

    function mainMdxLoader(plugins) {
      console.log('mainMdxLoader-----', plugins)
      return [
        options.defaultLoaders.babel,
        createLoader(function (source) {
          console.log('mainMdxLoader 1 -----')
          if (source.includes('/*START_META*/')) {
            const [meta] = source.match(/\/\*START_META\*\/(.*?)\/\*END_META\*\//s)
            return 'export default ' + meta
          }
          return (
            source.replace(/export const/gs, 'const') + `\nMDXContent.layoutProps = layoutProps\n`
          )
        }),
        ...mdx(plugins),
        createLoader(function (source) {
          console.log('mainMdxLoader 2 -----')
          let fields = new URLSearchParams(this.resourceQuery.substr(1)).get('meta') ?? undefined
          let { attributes: meta, body } = frontMatter(source)
          if (fields) {
            for (let field in meta) {
              if (!fields.split(',').includes(field)) {
                delete meta[field]
              }
            }
          }

          let extra = []
          let resourcePath = path.relative(__dirname, this.resourcePath)

          if (!/^\s*export\s+(var|let|const)\s+Layout\s+=/m.test(source)) {
            for (let glob in fallbackLayouts) {
              if (minimatch(resourcePath, glob)) {
                extra.push(
                  `import { ${fallbackLayouts[glob][1]} as _Layout } from '${fallbackLayouts[glob][0]}'`,
                  'export const Layout = _Layout'
                )
                break
              }
            }
          }

          if (!/^\s*export\s+default\s+/m.test(source.replace(/```(.*?)```/gs, ''))) {
            console.log('zzzzz', this.resourcePath)
            // 不同目录下的mdx,添加不同的布局组件
            for (let glob in fallbackDefaultExports) {
              console.log('zzzzz1', resourcePath, glob, minimatch(resourcePath, glob))
              if (minimatch(resourcePath, glob)) {
                console.log('zzzzz2', glob)
                extra.push(
                  `import { ${fallbackDefaultExports[glob][1]} as _Default } from '${fallbackDefaultExports[glob][0]}'`,
                  'export default _Default'
                )
                break
              }
            }
          }

          if (
            !/^\s*export\s+(async\s+)?function\s+getStaticProps\s+/m.test(
              source.replace(/```(.*?)```/gs, '')
            )
          ) {
            console.log('qqqqq', this.resourcePath)
            for (let glob in fallbackGetStaticProps) {
              console.log('qqqqq1', resourcePath, glob, minimatch(resourcePath, glob))
              if (minimatch(resourcePath, glob)) {
                console.log('qqqqq2', glob)
                extra.push(`export { getStaticProps } from '${fallbackGetStaticProps[glob]}'`)
                break
              }
            }
          }

          let metaExport
          if (!/export\s+(const|let|var)\s+meta\s*=/.test(source)) {
            metaExport =
              typeof fields === 'undefined'
                ? `export const meta = ${JSON.stringify(meta)}`
                : `export const meta = /*START_META*/${JSON.stringify(meta || {})}/*END_META*/`
          }

          return [
            ...(typeof fields === 'undefined' ? extra : []),
            typeof fields === 'undefined'
              ? body.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, '')
              : '',
            metaExport,
          ]
            .filter(Boolean)
            .join('\n\n')
        }),
      ]
    }

    config.module.rules.push({
      test: { and: [/\.mdx$/], not: [/snippets/] },
      resourceQuery: { not: [/rss/, /preview/] },
      exclude: [path.join(__dirname, 'src/pages/showcase/')],
      use: mainMdxLoader(),
    })

    config.module.rules.push({
      test: /\.mdx$/,
      include: [path.join(__dirname, 'src/pages/showcase/')],
      use: mainMdxLoader(null),
    })

    return config
  },
}
