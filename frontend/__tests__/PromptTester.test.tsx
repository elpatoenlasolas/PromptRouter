import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PromptTester from '@/components/PromptTester'

// Mock fetch
global.fetch = jest.fn()

describe('PromptTester', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the prompt tester form', () => {
    render(<PromptTester />)
    
    expect(screen.getByLabelText(/test prompt/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter your prompt here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /execute prompt/i })).toBeInTheDocument()
  })

  it('disables submit button when prompt is empty', () => {
    render(<PromptTester />)
    
    const submitButton = screen.getByRole('button', { name: /execute prompt/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when prompt has text', () => {
    render(<PromptTester />)
    
    const textarea = screen.getByLabelText(/test prompt/i)
    const submitButton = screen.getByRole('button', { name: /execute prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    expect(submitButton).toBeEnabled()
  })

  it('shows loading state while executing prompt', async () => {
    // Mock a delayed response
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          content: 'Test response',
          routing: { model: 'gpt-4o-mini', provider: 'openai' },
          savings: { actual_cost: 0.001, amount_saved: 0.0005 },
          metrics: { latency_ms: 500 }
        })
      }), 100))
    )

    render(<PromptTester />)
    
    const textarea = screen.getByLabelText(/test prompt/i)
    const submitButton = screen.getByRole('button', { name: /execute prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText(/executing/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('displays result after successful execution', async () => {
    const mockResponse = {
      content: 'This is a test response',
      routing: {
        model: 'gpt-4o-mini',
        provider: 'openai'
      },
      savings: {
        actual_cost: 0.0012,
        amount_saved: 0.0008
      },
      metrics: {
        latency_ms: 450
      }
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<PromptTester />)
    
    const textarea = screen.getByLabelText(/test prompt/i)
    const submitButton = screen.getByRole('button', { name: /execute prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('This is a test response')).toBeInTheDocument()
    })

    expect(screen.getByText('gpt-4o-mini')).toBeInTheDocument()
    expect(screen.getByText('openai')).toBeInTheDocument()
    expect(screen.getByText('€0.0012')).toBeInTheDocument()
    expect(screen.getByText('€0.0008')).toBeInTheDocument()
    expect(screen.getByText('450ms')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    render(<PromptTester />)
    
    const textarea = screen.getByLabelText(/test prompt/i)
    const submitButton = screen.getByRole('button', { name: /execute prompt/i })
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute prompt')
      )
    })

    alertSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('updates textarea value on change', () => {
    render(<PromptTester />)
    
    const textarea = screen.getByLabelText(/test prompt/i) as HTMLTextAreaElement
    
    fireEvent.change(textarea, { target: { value: 'New prompt text' } })
    expect(textarea.value).toBe('New prompt text')
  })
})
