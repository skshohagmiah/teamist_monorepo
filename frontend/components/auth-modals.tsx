"use client"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, User, EyeOff, Eye, LogIn, UserPlus } from 'lucide-react'
import { cn } from "@/lib/utils"
import axios from 'axios'
import { toast } from "sonner"
import { useAuthStore } from "@/store/authenticationStore"


const URL = 'http://localhost:3001/api'

// Zod Validation Schemas
const emailSchema = z.string().email("Please enter a valid email address")
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
})

export const SignInModal = () => {
  const {
    isSignInOpen,
    setIsSignInOpen,
    setIsSignUpOpen,
    passwordVisible,
    togglePasswordVisibility,
    signInErrors,
    setSignInErrors,
    reset
  } = useAuthStore()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = form.email.value
    const password = form.password.value

    try {
      const data = signInSchema.parse({ email, password })
      const res = await axios.post(URL + '/auth/login', data)
      console.log("Sign in successful")
      toast('Sign In Successful')
      reset()
      setIsSignInOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors
        setSignInErrors({
          email: errorMap.email?.[0],
          password: errorMap.password?.[0]
        })
      }
    }
  }

  return (
    <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn size={18} /> Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={cn("pl-10", signInErrors.email && "border-red-500")}
                required
              />
            </div>
            {signInErrors.email && <p className="text-sm text-red-500">{signInErrors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="password"
                name="password"
                type={passwordVisible.signIn ? "text" : "password"}
                placeholder="Enter your password"
                className={cn("pl-10 pr-10", signInErrors.password && "border-red-500")}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('signIn')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordVisible.signIn ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {signInErrors.password && <p className="text-sm text-red-500">{signInErrors.password}</p>}
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => {
              setIsSignInOpen(false)
              setIsSignUpOpen(true)
            }}
          >
            Sign up
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  )
}

export const SignUpModal = () => {
  const {
    isSignUpOpen,
    setIsSignUpOpen,
    setIsSignInOpen,
    passwordVisible,
    togglePasswordVisibility,
    signUpErrors,
    setSignUpErrors,
    reset
  } = useAuthStore()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = form.name.value
    const email = form.email.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value

    try {
      const data = signUpSchema.parse({ name, email, password, confirmPassword })
      const res = await axios.post(URL + '/auth/register', data)
      console.log("Sign up successful", data)
      toast('Sign up successful')
      reset()
      setIsSignUpOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors
        setSignUpErrors({
          name: errorMap.name?.[0],
          email: errorMap.email?.[0],
          password: errorMap.password?.[0],
          confirmPassword: errorMap.confirmPassword?.[0]
        })
      }
    }
  }

  return (
    <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus size={18} /> Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create an Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Enter your Name"
                className={cn("pl-10", signUpErrors.name && "border-red-500")}
                required
              />
            </div>
            {signUpErrors.name && <p className="text-sm text-red-500">{signUpErrors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={cn("pl-10", signUpErrors.email && "border-red-500")}
                required
              />
            </div>
            {signUpErrors.email && <p className="text-sm text-red-500">{signUpErrors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="signup-password"
                name="password"
                type={passwordVisible.signUp ? "text" : "password"}
                placeholder="Create a password"
                className={cn("pl-10 pr-10", signUpErrors.password && "border-red-500")}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('signUp')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordVisible.signUp ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {signUpErrors.password && <p className="text-sm text-red-500">{signUpErrors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={passwordVisible.confirm ? "text" : "password"}
                placeholder="Confirm your password"
                className={cn("pl-10 pr-10", signUpErrors.confirmPassword && "border-red-500")}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordVisible.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {signUpErrors.confirmPassword && <p className="text-sm text-red-500">{signUpErrors.confirmPassword}</p>}
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => {
              setIsSignUpOpen(false)
              setIsSignInOpen(true)
            }}
          >
            Sign in
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  )
}

export const AuthModals = () => {
  return (
    <div className="flex space-x-4">
      <SignInModal />
      <SignUpModal />
    </div>
  )
}