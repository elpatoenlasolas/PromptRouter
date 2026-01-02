import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

type AlertType = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

export default function Alert({ 
  type, 
  title, 
  message, 
  action,
  onClose 
}: AlertProps) {
  const config = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      iconColor: 'text-red-600',
      icon: AlertCircle,
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
      icon: CheckCircle,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      iconColor: 'text-yellow-600',
      icon: AlertCircle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
      icon: Info,
    },
  }

  const { bgColor, borderColor, textColor, iconColor, icon: Icon } = config[type]

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${textColor} mb-1`}>{title}</h3>
          )}
          <p className={`text-sm ${textColor.replace('900', '800')}`}>
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 text-sm font-medium ${textColor} underline hover:no-underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className={`${iconColor} hover:opacity-70`}>
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
