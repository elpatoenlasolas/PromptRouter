import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
    },
    isLoaded: true,
    isSignedIn: true,
  })),
  useAuth: jest.fn(() => ({
    userId: 'test-user-id',
    isLoaded: true,
    isSignedIn: true,
  })),
  ClerkProvider: ({ children }) => children,
  SignInButton: ({ children }) => children,
  SignUpButton: ({ children }) => children,
  UserButton: () => <div>User Button</div>,
}))
