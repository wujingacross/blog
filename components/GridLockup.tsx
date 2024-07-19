import clsx from 'clsx'
import styles from './GridLockup.module.css'

let overhangs = { sm: 'top-0 xl:top-8', md: 'top-0 xl:top-14', lg: 'top-0 xl:top-18' }

type GridLockupProps = {
  className: string
  left: JSX.Element
  right: JSX.Element
  leftProps?: Object
  rightProps?: Object
  overhang?: string
  beams?: number
}

export const GridLockup: React.FC<GridLockupProps> = ({
  className,
  left,
  right,
  leftProps = {},
  rightProps = {},
  overhang = 'sm',
  beams = 0,
}) => {
  return (
    <GridLockup.Container className={className} overhang={overhang} beams={beams}>
      <GridLockup.Grid left={left} right={right} leftProps={leftProps} rightProps={rightProps} />
    </GridLockup.Container>
  )
}

GridLockup.Container = function Grid({ className, children, overhang = 'sm', beams = 0 }) {
  return (
    <div className={clsx('relative pt-10 xl:pt-0', className)}>
      {/* 背景图片 */}
      {beams !== -1 && (
        <div
          className={clsx(
            'absolute top-0 inset-x-0 bg-top bg-no-repeat',
            styles[`beams-${beams}`],
            overhangs[overhang]
          )}
        />
      )}
      {/* 背景格子 */}
      <div
        className={clsx(
          'absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5',
          overhangs[overhang]
        )}
      />
      {children}
    </div>
  )
}

GridLockup.Grid = function Inner({ left, right, leftProps = {}, rightProps = {} }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
      {left && (
        <div className={clsx('lg:col-span-5 xl:col-span-6', leftProps.className)}>{left}</div>
      )}
      {right && (
        <div
          className={clsx(
            'lg:col-span-7 xl:col-span-6 -mx-4 sm:mx-0 mt-4 lg:mt-0',
            rightProps.className
          )}
        >
          {right}
        </div>
      )}
    </div>
  )
}
