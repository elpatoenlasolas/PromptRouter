import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders spinner without text', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('svg')
    expect(spinner).toBeInTheDocument()
  })

  it('renders spinner with text', () => {
    render(<LoadingSpinner text="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender, container } = render(<LoadingSpinner size="sm" />)
    let spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('w-4', 'h-4')

    rerender(<LoadingSpinner size="lg" />)
    spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('has spinning animation', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
