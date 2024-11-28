"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Lock, Mail, User, EyeOff, Eye, LogIn, UserPlus, ArrowRight, Github, Twitter, Facebook } from 'lucide-react'
import { cn } from "@/lib/utils"

export function AuthModals() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState({
    signIn: false,
    signUp: false,
    confirm: false
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your sign-in logic here
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = form.email.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value

    let errors = {
      email: "",
      password: "",
      confirmPassword: ""
    }

    if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)

    if (!errors.email && !errors.password && !errors.confirmPassword) {
      // Add your sign-up logic here
    }
  }

  const SocialButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
      {icon}
      <span>Sign in with {label}</span>
    </Button>
  )

  return (
    <div className="flex space-x-4">
      {/* Sign In Modal */}
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
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  type={passwordVisible.signIn ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(prev => ({...prev, signIn: !prev.signIn}))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible.signIn ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="space-y-2">
              <SocialButton icon={<Github size={18} />} label="GitHub" />
              <SocialButton icon={<Twitter size={18} />} label="Twitter" />
              <SocialButton icon={<Facebook size={18} />} label="Facebook" />
            </div>
          </div>
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

      {/* Sign Up Modal */}
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
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn("pl-10", formErrors.email && "border-red-500")}
                  required
                />
              </div>
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
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
                  className={cn("pl-10 pr-10", formErrors.password && "border-red-500")}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(prev => ({...prev, signUp: !prev.signUp}))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible.signUp ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
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
                  className={cn("pl-10 pr-10", formErrors.confirmPassword && "border-red-500")}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(prev => ({...prev, confirm: !prev.confirm}))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="space-y-2">
              <SocialButton icon={<Github size={18} />} label="GitHub" />
              <SocialButton icon={<Twitter size={18} />} label="Twitter" />
              <SocialButton icon={<Facebook size={18} />} label="Facebook" />
            </div>
          </div>
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
    </div>
  )
}

