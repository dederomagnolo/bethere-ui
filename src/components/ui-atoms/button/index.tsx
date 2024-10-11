
import './styles.scss'

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: any,
  variant?: 'primary' | 'cancel'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  variant = 'primary',
  disabled,
  id
}) => {
  return (
    <button
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={`app-button app-button--${variant} ${className}`}>
      {children}
    </button>
  )
}