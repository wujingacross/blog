import { Button } from '../Button'
import clsx from 'clsx'

export function IconContainer({ as: Component = 'div', className = '', light, dark, ...props }) {
  return (
    <Component
      className={`w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden ${className}`}
      {...props}
    >
      {light && (
        <div
          className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
          style={{ backgroundImage: `url(${light})` }}
        ></div>
      )}
      {dark && (
        <div
          className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
          style={{ backgroundImage: `url(${dark})` }}
        ></div>
      )}
    </Component>
  )
}

export function Caption({ className = '', ...props }) {
  return <h2 className={`mt-8 font-semibold ${className}`} {...props} />
}

export function BigText({ className = '', ...props }) {
  return (
    <p
      className={`mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ${className}`}
      {...props}
    />
  )
}

export function Paragraph({ as: Component = 'p', className = '', ...props }) {
  return <Component className={`mt-4 max-w-3xl space-y-6 ${className}`} {...props} />
}

export function Link({ className = '', ...props }) {
  return <Button className={clsx('mt-8', className)} {...props} />
}

export { Widont } from 'components/Widont'
