import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        afterSignUpUrl="/onboarding"
        signInUrl="/sign-in"
      />
    </div>
  )
}
