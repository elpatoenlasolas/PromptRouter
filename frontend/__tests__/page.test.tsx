import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
import { ThemeProvider } from '@/lib/theme'

// Mock ThemeProvider
jest.mock('@/lib/theme', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: jest.fn(() => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  })),
}))

// Mock toast hook
jest.mock('@/lib/toast', () => ({
  useToast: jest.fn(() => ({
    showToast: jest.fn(),
    toasts: [],
    removeToast: jest.fn(),
  })),
}))

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(() => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  })),
  useAuth: jest.fn(() => ({
    isLoaded: true,
    isSignedIn: false,
  })),
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

describe('HomePage', () => {
  it('renders the hero section', () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
    const promptRouterElements = screen.getAllByText('PromptRouter')
    expect(promptRouterElements.length).toBeGreaterThan(0)
  })

  it('renders pricing link in navigation', () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
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

    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
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

    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
    const dashboardLinks = screen.queryAllByText(/dashboard/i)
    expect(dashboardLinks.length).toBeGreaterThan(0)
  })

  it('renders feature sections with icons', () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
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

    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )
    
    // Should still render the page
    const promptRouterElements = screen.getAllByText('PromptRouter')
    expect(promptRouterElements.length).toBeGreaterThan(0)
  })
})
