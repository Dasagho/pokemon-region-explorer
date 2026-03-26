import { Component, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  resetError = () => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return <ErrorFallback onReset={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  onReset: () => void
}

function ErrorFallback({ onReset }: ErrorFallbackProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('common.errorMessage')}</h2>
        <p className="text-muted-foreground mb-6">{t('common.errorDescription')}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('common.tryAgain')}
          </Button>
          <Button asChild>
            <Link to="/">{t('common.goHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
