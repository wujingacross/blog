// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import clsx from 'clsx'
import { debounce } from 'debounce'
import { useMedia } from 'hooks/useMedia'
import { fit } from 'utils/fit'
import { createInViewPromise } from 'utils/createInViewPromise'
import { wait } from 'utils/wait'
import { CodeWindow, Token } from 'components/codeWindow'
import { tokens, code } from '../../samples/hero.html?highlight'

const CHAR_DELAY = 75
const GROUP_DELAY = 1000
const TRANSITION = { duration: 0.5 }

function getRange(text, options = {}) {
  return { start: code.indexOf(text), end: code.indexOf(text) + text.length, ...options }
}

const ranges = [
  getRange(' p-8'), // char:0:0 ' '  char:0:1 'p' char:0:2 '-' char:0:3:last '8'
  getRange(' rounded-full'), // char:1:0 ' '
  getRange(' mx-auto'), // char:2:0 ' '
  getRange(' font-medium'), // char:3:0 ' '
  getRange(' class="font-medium"'), // char:4:0 ' '
  getRange(' class="text-sky-500 dark:text-sky-400"'), // char:5:0 ' '
  getRange(' class="text-slate-700 dark:text-slate-500"'), // char:6:0 ' '
  getRange(' text-center'), // char:7:0 ' '
  getRange('md:flex '), // char:8:0 'm'  char:8:1 'd' char:8:2 ':' char:8:3 'f' char:8:4 'l' char:8:5 'e' char:8:6 'x' char:8:7:last ' '
  getRange(' md:p-0'), // char:9:0 ' '
  getRange(' md:p-8', { immediate: true }), // char:10:0 ' '
  getRange(' md:rounded-none'), // char:11:0 ' '
  getRange(' md:w-48'), // char:12:0 ' '
  getRange(' md:h-auto'), // char:13:0 ' '
  getRange(' md:text-left'), // char:14:0 ' '
]

function getRangeIndex(index, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const rangeArr = Array.isArray(ranges[i]) ? ranges[i] : [ranges[i]]
    for (let j = 0; j < rangeArr.length; j++) {
      if (index >= rangeArr[j].start && index < rangeArr[j].end) {
        return [i, index - rangeArr[j].start, index === rangeArr[j].end - 1]
      }
    }
  }
  return [-1]
}

function Words({ children, bolder = false, layout, transition }) {
  return children.split(' ').map((word, i) => {
    return (
      <span key={i} className="relative inline-flex whitespace-pre text-lg">
        {bolder ? (
          <>
            <motion.span
              initial={{ fontWeight: 400 }}
              animate={{ fontWeight: 500 }}
              transition={transition}
              className="absolute top-0 left-0"
            >
              {`${word} `}
            </motion.span>
            <span style={{ opacity: 0, fontWeight: 500 }}>{word} </span>
          </>
        ) : (
          `${word} `
        )}
      </span>
    )
  })
}

function augment(tokens, index = 0) {
  for (let i = 0; i < tokens.length; i++) {
    if (Array.isArray(tokens[i])) {
      const _type = tokens[i][0]
      const children = tokens[i][1]
      if (Array.isArray(children)) {
        index = augment(children, index)
      } else {
        const str = children
        const result = []
        for (let j = 0; j < str.length; j++) {
          const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
          if (rangeIndex > -1) {
            result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
          } else {
            if (typeof result[result.length - 1] === 'string') {
              result[result.length - 1] += str[j]
            } else {
              result.push(str[j])
            }
          }
          index++
        }
        if (!(result.length === 1 && typeof result[0] === 'string')) {
          tokens[i].splice(1, 1, result)
        }
      }
    } else {
      const str = tokens[i]
      const result = []
      for (let j = 0; j < str.length; j++) {
        const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
        if (rangeIndex > -1) {
          result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
        } else {
          if (typeof result[result.length - 1] === 'string') {
            result[result.length - 1] += str[j]
          } else {
            result.push(str[j])
          }
        }
        index++
      }
      tokens.splice(i, 1, ...result)
      i += result.length - 1
    }
  }
  return index
}

augment(tokens)

// console.log('tokens=', tokens)

export default function Hero() {
  const [step, setStep] = useState(-1) // 第几步
  const [state, setState] = useState({ group: -1, char: -1 }) // 动效的控制， group： 每组动效样式的控制， char：每组里样式的每个字符的控制
  const [finished, setFinished] = useState(false) // 标记动画步骤是否完成

  const [isMd, setIsMd] = useState(false)
  const supportsMd = useMedia('(min-width: 640px)') // 媒体查询是否匹配Md
  const cursorControls = useAnimation()
  const [wide, setWide] = useState(false) // 控制DOM变宽动效
  const [containerRect, setContainerRect] = useState()

  const mounted = useRef(true) // 标记组件是否加载
  const inViewRef = useRef() // 代码展示区域
  const containerRef = useRef() // 样式预览区域
  const imageRef = useRef() // 头像图片DOM

  const layout = !finished
  const md = supportsMd && isMd // 控制媒体查询md的样式生效

  // console.log(
  //   `Hero------- md(supportsMd && isMd)=${md}, supportsMd=${supportsMd}, isMd=${isMd}, wide=${wide}`
  // )

  // 组件是否加载
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  // 监听图片加载、代码区域Dom是否进入到可视区中间
  useEffect(() => {
    let current = true

    const { promise: inViewPromise, disconnect } = createInViewPromise(inViewRef.current, {
      threshold: 0.5,
    })

    const promises = [
      wait(1000),
      inViewPromise,
      new Promise((resolve) => {
        // ？？？ 这个Promise不太懂
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(resolve)
        } else {
          window.setTimeout(resolve, 0)
        }
      }),
      new Promise((resolve) => {
        if (imageRef.current.complete) {
          resolve()
        } else {
          imageRef.current.addEventListener('load', resolve)
        }
      }),
    ]

    Promise.all(promises).then(() => {
      // console.log('动效开始 =======>', current)
      if (current) {
        setState({ group: 0, char: 0 })
      }
    })

    return () => {
      current = false
      disconnect()
    }
  }, [])

  // 标记动画步骤是否完成
  useEffect(() => {
    if (step === 14) {
      let id = window.setTimeout(() => {
        setFinished(true)
      }, 1000)
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [step])

  // 动画结束之后，又进行了不同媒体查询的适配效果的展示（根据wide变量来进行左侧展示区域宽度的判断）
  useEffect(() => {
    if (!finished) return
    let count = 0
    cursorControls.start({ opacity: 0.5 })
    const id = window.setInterval(() => {
      if (count === 2) {
        return window.clearInterval(id)
      }
      count++
      cursorControls.start({ opacity: 1, scale: 0.9, transition: { duration: 0.25 } }).then(() => {
        setWide((wide) => !wide)
        cursorControls.start({
          opacity: count === 2 ? 0 : 0.5,
          scale: 1,
          transition: { duration: 0.25, delay: 0.6 },
        })
      })
    }, 2000)
    return () => {
      window.clearInterval(id)
    }
  }, [finished])

  useEffect(() => {
    if (finished) {
      const id = window.setTimeout(() => {
        setIsMd(wide)
      }, 250)
      return () => window.clearTimeout(id)
    }
  }, [wide, finished])

  // 监听左边展示区的尺寸
  useEffect(() => {
    const observer = new window.ResizeObserver(
      debounce(() => {
        if (containerRef.current) {
          setContainerRect(containerRef.current.getBoundingClientRect())
        }
      }, 500)
    )
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Layout
      left={
        <div ref={containerRef} className="lg:-mr-18">
          <AnimateSharedLayout>
            <motion.div
              layout={layout}
              transition={TRANSITION}
              className="relative z-10 rounded-lg shadow-xl text-slate-900 dark:text-slate-300 mx-auto sm:w-[23.4375rem]"
              // 先把鼠标的标记显示，然后改变左边效果展示区域的宽度，即可模仿鼠标拖拽动画的效果
              animate={
                containerRect?.width
                  ? {
                      width: !supportsMd || wide ? containerRect.width : 375,
                    }
                  : {}
              }
            >
              <motion.div
                layout={layout}
                className={clsx(
                  'bg-white rounded-lg overflow-hidden ring-1 ring-slate-900/5 dark:bg-slate-800 dark:highlight-white/5 dark:ring-0',
                  {
                    flex: step >= 8 && md,
                    'p-8': step >= 0,
                    'text-center': (step >= 7 && !md) || (step < 14 && md),
                  }
                )}
              >
                {/* 1. 鼠标拖动的标记 cicle */}
                <motion.div
                  layout={layout}
                  initial={{ opacity: 0 }}
                  animate={cursorControls}
                  className={clsx(
                    'absolute z-20 top-1/2 right-0 xl:right-auto xl:left-0 text-black rounded-full -mt-4 -mr-4 xl:mr-0 xl:-ml-4 pointer-events-none',
                    { invisible: !supportsMd }
                  )}
                >
                  <svg className="h-8 w-8" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth="8"
                      fill="rgba(0, 0, 0, 0.5)"
                    />
                  </svg>
                </motion.div>
                {/* 2. img */}
                <motion.div
                  layout={layout}
                  transition={TRANSITION}
                  animate={{
                    ...(step >= 1 ? { borderRadius: 96 / 2 } : { borderRadius: 0 }),
                    ...((step >= 1 && step < 11) || (step >= 11 && !md && !finished)
                      ? { borderRadius: 96 / 2 }
                      : { borderRadius: 0 }),
                  }}
                  className={clsx(
                    'relative z-10 overflow-hidden flex-none',
                    step >= 10 && md ? '-m-8 mr-8' : step >= 2 ? 'mx-auto' : undefined,
                    step >= 12 && md ? 'w-48' : 'w-24',
                    step >= 13 && md ? 'h-auto' : 'h-24'
                  )}
                >
                  <motion.img
                    ref={imageRef}
                    layout={layout}
                    transition={TRANSITION}
                    src={require('img/sarah-dayan.jpg').default.src}
                    decoding="async"
                    alt=""
                    className={clsx('absolute max-w-none object-cover bg-slate-100', {
                      'rounded-full': finished && !md,
                    })}
                    style={
                      finished
                        ? { top: 0, left: 0, width: '100%', height: '100%' }
                        : step >= 13 && md
                        ? fit(192, containerRect.height, 384, 512)
                        : step >= 12 && md
                        ? fit(192, 96, 384, 512)
                        : fit(96, 96, 384, 512)
                    }
                  />
                </motion.div>
                {/* 3. text */}
                <motion.div
                  layout={layout}
                  transition={TRANSITION}
                  className={step >= 10 && md ? '' : 'pt-6'}
                >
                  <motion.div layout={layout} transition={TRANSITION} className="mb-4">
                    <Words bolder={step >= 3} layout={layout} transition={TRANSITION}>
                      {/* `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  */}
                      “Tailwind CSS is the only framework that I&apos;ve seen scale on large teams.
                      It&rsquo;s easy to customize, adapts to any design, and the build size is
                      tiny.”
                    </Words>
                  </motion.div>
                  <motion.div
                    layout={layout}
                    className={clsx(
                      'flex flex-col',
                      (step >= 7 && !md) || (step < 14 && md) ? 'items-center' : 'items-start'
                    )}
                    style={{
                      ...(step >= 4 ? { fontWeight: 500 } : { fontWeight: 400 }),
                    }}
                  >
                    <motion.p
                      layout={layout}
                      transition={TRANSITION}
                      className={clsx(
                        'transition-colors duration-500',
                        step >= 5
                          ? 'text-sky-500 dark:text-sky-400'
                          : 'text-black dark:text-slate-300'
                      )}
                    >
                      Sarah Dayan
                    </motion.p>
                    <motion.p
                      layout={layout}
                      transition={TRANSITION}
                      className={clsx(
                        'transition-colors duration-500',
                        step >= 6
                          ? 'text-slate-700 dark:text-slate-500'
                          : 'text-black dark:text-slate-300'
                      )}
                    >
                      Staff Engineer, Algolia
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimateSharedLayout>
        </div>
      }
      right={
        <CodeWindow className="!h-auto max-h-[none]">
          <CodeWindow.Code
            ref={inViewRef}
            tokens={tokens}
            tokenComponent={HeroToken} // 将下面的tokenProps参数展开传到了tokenComponent组件中，即传到了HeroToken组件中
            tokenProps={{
              currentGroup: state.group,
              currentChar: state.char,
              onCharComplete(charIndex) {
                // 每个字符完事后的处理
                // console.log('onCharComplete=', charIndex)
                if (!mounted.current) return
                setState((state) => ({ ...state, char: charIndex + 1 }))
              },
              async onGroupComplete(groupIndex) {
                // 每组样式完事后的处理
                // console.log(
                //   'onGroupComplete=',
                //   groupIndex,
                //   ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate
                // )
                if (!mounted.current) return
                setStep(groupIndex)

                if (groupIndex === 7) {
                  if (!supportsMd) return
                  await cursorControls.start({ opacity: 0.5, transition: { delay: 1 } }) // 拖动鼠标样式显示
                  if (!mounted.current) return
                  setWide(true)
                  setIsMd(true)
                  await cursorControls.start({ opacity: 0, transition: { delay: 0.5 } }) // 拖动鼠标样式隐藏
                }

                if (!mounted.current) return

                if (ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate) {
                  setState({ char: 0, group: groupIndex + 1 })
                } else {
                  window.setTimeout(() => {
                    if (!mounted.current) return
                    setState({ char: 0, group: groupIndex + 1 })
                  }, GROUP_DELAY)
                }
              },
            }}
          />
        </CodeWindow>
      }
    ></Layout>
  )
}

/**
 * ******** 代码动效的处理 ********
 */
function AnimatedToken({ isActiveToken, onComplete, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      onComplete()
    }
  }, [visible])

  useEffect(() => {
    if (isActiveToken) {
      // 控制代码动效的节奏，不然太快了
      let id = window.setTimeout(() => {
        setVisible(true)
      }, CHAR_DELAY)
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [isActiveToken])

  return (
    <>
      <span className={visible ? undefined : 'hidden'}>{children}</span>
    </>
  )
}

/**
 * ******** 代码展示最终的细节判断，'char:'开头的token，即一开始需要隐藏，样式动效开始后，代码按照节奏一点一点显示
 * @param param0
 * @returns
 */
function HeroToken({ currentGroup, currentChar, onCharComplete, onGroupComplete, ...props }) {
  const { token } = props

  // ******** char: 开头的是需要动效的部分，即上面ranges参数，整体可以输出 augment(tokens)后的tokens参数值 ********
  if (token[0].startsWith('char:')) {
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))
    /**
     * char: => ['char:0:0', ' '] char:0:0 true 0 0 0 0
     * char: => ['char:0:1', 'p'] char:0:1 false 0 0 1 0
     * 返回结果: [NaN, 8, 0]
     */
    // console.log(
    //   'char: =>',
    //   token,
    //   token[0],
    //   currentGroup === groupIndex && currentChar === indexInGroup,
    //   groupIndex,
    //   currentGroup,
    //   indexInGroup,
    //   currentChar
    // )

    return (
      <AnimatedToken
        isActiveToken={currentGroup === groupIndex && currentChar === indexInGroup}
        onComplete={() => {
          if (token[0].endsWith(':last')) {
            onGroupComplete(groupIndex)
          } else {
            onCharComplete(indexInGroup)
          }
        }}
        {...props}
      />
    )
  }

  // console.log('普通代码: =>', token)
  return <Token {...props} />
}

function Layout({ left, right }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 sm:mt-24 lg:mt-32 lg:grid lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="relative row-start-1 col-start-1 col-span-5 xl:col-span-6 -mt-10">
        <div className="h-[24.25rem] max-w-xl mx-auto lg:max-w-none flex items-center justify-center">
          <div className="w-full flex-none">{left}</div>
        </div>
      </div>
      <div className="relative row-start-1 col-start-6 xl:col-start-7 col-span-7 xl:col-span-6">
        <div className="-mx-4 sm:mx-0">{right}</div>
      </div>
    </div>
  )
}
