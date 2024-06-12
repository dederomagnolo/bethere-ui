import './styles.scss'

interface AppCardProps {
  children: any
  className?: string
}

export const AppCard = ({ children, className } : AppCardProps) => {
  return (
    <div className={`neo-generic-card ${className || ''}`}>
      {children}
    </div>
  )
}