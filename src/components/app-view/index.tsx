import './styles.scss'

export const View = ({
  title,
  children,
  className
}: any) => {
  return (
    <div className={`app-view ${className}`}>
      <h2 className='app-view__title'>{title}</h2>
      <div className='app-view__content'>
        {children}
      </div>
    </div>
  )
}