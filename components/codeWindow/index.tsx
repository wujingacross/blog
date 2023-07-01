import { useMemo } from 'react'
import clsx from 'clsx'
export * from './Code'
import { Code } from './Code'

export const CodeWindow = ({ children, className, border = true }) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10',
        className
      )}
    >
      <div className="relative w-full flex flex-col">
        <div className={clsx('flex-none', border && 'border-b border-slate-500/30')}>
          <div className="flex items-center h-8 space-x-1.5 px-3">
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div>
          </div>
        </div>
        <div className="relative min-h-0 flex-auto flex flex-col">{children}</div>
      </div>
    </div>
  )
}

// eslint-disable-next-line react/display-name
CodeWindow.Code = ({ tokens, initialLineNumber = 1, ...props }) => {
  const lineNumbers = useMemo(() => {
    const t = tokens.flat(Infinity)
    let line = initialLineNumber + 1
    let str = `${initialLineNumber}\n`
    for (let i = 0; i < t.length; i++) {
      if (typeof t[i] === 'string') {
        const newLineChars = t[i].match(/\n/g)
        if (newLineChars !== null) {
          for (let j = 0; j < newLineChars.length; j++) {
            str += `${line++}\n`
          }
        }
      }
    }
    return str
  }, [tokens])

  return (
    <div>
      <pre className="flex min-h-full text-sm leading-6">
        <div
          aria-hidden="true"
          className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none"
          style={{ width: 50 }}
        >
          {lineNumbers}
        </div>
        <code className="flex-auto relative block text-slate-50 pt-4 pb-4 px-4 overflow-auto">
          <Code tokens={tokens} {...props} />
        </code>
      </pre>
    </div>
  )
}
