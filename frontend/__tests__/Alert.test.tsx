import { render, screen } from '@testing-library/react'
import Alert from '@/components/ui/Alert'
import userEvent from '@testing-library/user-event'

describe('Alert', () => {
  it('renders error alert correctly', () => {
    render(
      <Alert 
        type="error" 
        title="Error occurred"
        message="Something went wrong" 
      />
    )
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders success alert correctly', () => {
    render(
      <Alert 
        type="success" 
        message="Operation successful" 
      />
    )
    
    expect(screen.getByText('Operation successful')).toBeInTheDocument()
  })

  it('renders warning alert correctly', () => {
    render(
      <Alert 
        type="warning" 
        message="Warning message" 
      />
    )
    
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('renders info alert correctly', () => {
    render(
      <Alert 
        type="info" 
        message="Information message" 
      />
    )
    
    expect(screen.getByText('Information message')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(<Alert type="error" message="Error message" />)
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('calls action onClick when action button is clicked', async () => {
    const user = userEvent.setup()
    const handleAction = jest.fn()
    
    render(
      <Alert 
        type="info" 
        message="Test message"
        action={{ label: 'Retry', onClick: handleAction }}
      />
    )
    
    const actionButton = screen.getByRole('button', { name: /retry/i })
    await user.click(actionButton)
    
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = jest.fn()
    
    render(
      <Alert 
        type="error" 
        message="Test message"
        onClose={handleClose}
      />
    )
    
    const closeButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    if (closeButton) {
      await user.click(closeButton)
    }
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not render close button when onClose is not provided', () => {
    render(<Alert type="info" message="Test message" />)
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('applies correct color scheme for error type', () => {
    const { container } = render(<Alert type="error" message="Error" />)
    
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument()
    expect(container.querySelector('.border-red-200')).toBeInTheDocument()
  })

  it('applies correct color scheme for success type', () => {
    const { container } = render(<Alert type="success" message="Success" />)
    
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument()
    expect(container.querySelector('.border-green-200')).toBeInTheDocument()
  })

  it('displays correct icon for each alert type', () => {
    const { rerender, container } = render(<Alert type="error" message="Error" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    
    rerender(<Alert type="success" message="Success" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    
    rerender(<Alert type="warning" message="Warning" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    
    rerender(<Alert type="info" message="Info" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
