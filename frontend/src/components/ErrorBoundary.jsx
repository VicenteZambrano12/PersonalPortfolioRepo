import { Component } from 'react'
import { createLogger } from '../utils/logger.js'

const log = createLogger('error-boundary')

// Catches render-time errors anywhere below it, logs them, and shows a fallback.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    log.error('Render error caught', {
      message: error?.message,
      stack: error?.stack,
      componentStack: info?.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
            Something went wrong. Please reload the page.
          </div>
        )
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
