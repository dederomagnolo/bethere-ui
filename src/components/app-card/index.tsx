interface AppCardProps {
  Content: () => JSX.Element
  className: String
}

export const AppCard = ({ Content, className } : AppCardProps) => {
  return (
    <div className={`neo-generic-card ${className}`}>
      {Content && <Content />}
    </div>
  )
}