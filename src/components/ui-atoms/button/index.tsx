
import './styles.scss'

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: any,
  variant?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  variant = 'primary',
  disabled
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`app-button app-button--${variant} ${className}`}>
      {children}
    </button>
  )
}