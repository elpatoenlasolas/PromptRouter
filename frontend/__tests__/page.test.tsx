import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(() => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  })),
}))

describe('HomePage', () => {
  it('renders the hero section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('PromptRouter')).toBeInTheDocument()
  })

  it('renders pricing link in navigation', () => {
    render(<HomePage />)
    
    const pricingLinks = screen.getAllByText(/pricing/i)
    expect(pricingLinks.length).toBeGreaterThan(0)
  })

  it('shows sign in and sign up buttons when not signed in', () => {
    const { useUser } = require('@clerk/nextjs')
    useUser.mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    })

    render(<HomePage />)
    
    // These might be in navigation
    const signInElements = screen.queryAllByText(/sign in/i)
    const getStartedElements = screen.queryAllByText(/get started/i)
    
    expect(signInElements.length + getStartedElements.length).toBeGreaterThan(0)
  })

  it('shows dashboard link when user is signed in', () => {
    const { useUser } = require('@clerk/nextjs')
    useUser.mockReturnValue({
      user: {
        id: 'test-user',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      },
      isLoaded: true,
      isSignedIn: true,
    })

    render(<HomePage />)
    
    const dashboardLinks = screen.queryAllByText(/dashboard/i)
    expect(dashboardLinks.length).toBeGreaterThan(0)
  })

  it('renders feature sections with icons', () => {
    render(<HomePage />)
    
    // The page should have multiple sections with content
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('handles loading state', () => {
    const { useUser } = require('@clerk/nextjs')
    useUser.mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false,
    })

    render(<HomePage />)
    
    // Should still render the page
    expect(screen.getByText('PromptRouter')).toBeInTheDocument()
  })
})
