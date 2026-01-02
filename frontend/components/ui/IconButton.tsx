import { LucideIcon } from 'lucide-react'

interface IconButtonProps {
  icon: LucideIcon
  onClick?: () => void
  variant?: 'default' | 'danger' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  ariaLabel: string
}

export default function IconButton({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  ariaLabel,
}: IconButtonProps) {
  const variants = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-red-600 hover:bg-red-50',
    primary: 'text-blue-600 hover:bg-blue-50',
  }

  const sizes = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${sizes[size]} 
        ${variants[variant]} 
        rounded-lg 
        transition-colors
        disabled:opacity-50 
        disabled:cursor-not-allowed
        min-w-[44px] min-h-[44px]
        flex items-center justify-center
      `}
    >
      <Icon className={iconSizes[size]} />
    </button>
  )
}
