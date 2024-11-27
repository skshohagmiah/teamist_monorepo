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
import { 
  Lock, 
  Mail, 
  User,
  EyeOff,
  Eye,
  LogIn,
  UserPlus,
  ArrowRight
} from "lucide-react"

export function AuthModals() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState({
    signIn: false,
    signUp: false,
    confirm: false
  })

  return (
    <div className="flex space-x-4">
      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <LogIn size={18} /> Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md rounded-lg p-8 bg-white shadow-xl">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
              <User size={24} /> Welcome Back
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 py-3 border-gray-300"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type={passwordVisible.signIn ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10 py-3 border-gray-300"
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
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white py-3 hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={18} />
            </Button>
            
            <div className="text-center">
              <Button variant="link" className="text-gray-600">
                Forgot Password?
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogTrigger asChild>
          <Button className="bg-black text-white flex items-center gap-2">
            <UserPlus size={18} /> Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md rounded-lg p-8 bg-white shadow-xl">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
              <UserPlus size={24} /> Create Account
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 py-3 border-gray-300"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type={passwordVisible.signUp ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10 py-3 border-gray-300"
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
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type={passwordVisible.confirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="pl-10 pr-10 py-3 border-gray-300"
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
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white py-3 hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              Sign Up <ArrowRight size={18} />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}