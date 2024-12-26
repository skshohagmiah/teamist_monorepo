import { create } from 'zustand'

type AuthStore = {
  isSignInOpen: boolean
  isSignUpOpen: boolean
  passwordVisible: {
    signIn: boolean
    signUp: boolean
    confirm: boolean
  }
  signInErrors: {
    email?: string
    password?: string
  }
  signUpErrors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
  setIsSignInOpen: (open: boolean) => void
  setIsSignUpOpen: (open: boolean) => void
  togglePasswordVisibility: (field: 'signIn' | 'signUp' | 'confirm') => void
  setSignInErrors: (errors: AuthStore['signInErrors']) => void
  setSignUpErrors: (errors: AuthStore['signUpErrors']) => void
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isSignInOpen: false,
  isSignUpOpen: false,
  passwordVisible: {
    signIn: false,
    signUp: false,
    confirm: false
  },
  signInErrors: {},
  signUpErrors: {},
  setIsSignInOpen: (open) => {
    set({ isSignInOpen: open })
    if (open) set({ isSignUpOpen: false })
  },
  setIsSignUpOpen: (open) => {
    set({ isSignUpOpen: open })
    if (open) set({ isSignInOpen: false })
  },
  togglePasswordVisibility: (field) => 
    set((state) => ({
      passwordVisible: {
        ...state.passwordVisible,
        [field]: !state.passwordVisible[field]
      }
    })),
  setSignInErrors: (errors) => set({ signInErrors: errors }),
  setSignUpErrors: (errors) => set({ signUpErrors: errors }),
  reset: () => set({
    signInErrors: {},
    signUpErrors: {},
    passwordVisible: {
      signIn: false,
      signUp: false,
      confirm: false
    }
  })
}))