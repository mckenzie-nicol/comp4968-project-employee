import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SignInFormProps {
  onLogin: (email: string, password: string) => void
}

export function SignInForm({ onLogin }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (email === 'admin@admin.com' && password === '123456') {
      onLogin(email, password)
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/10 border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gradient">
          Sign in
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity"
          >
            Sign in
          </Button>
          <div className="text-sm text-gray-500 text-center mt-4">
            Demo credentials: admin@admin.com / 123456
          </div>
        </form>
      </CardContent>
    </Card>
  )
}