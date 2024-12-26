'use client';
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authenticationStore';
import { useRouter } from 'next/navigation';

export default  function Hero() {

  const logined = true
  const router =  useRouter();
  
  const {
   setIsSignUpOpen,
  } = useAuthStore()


  
  const handleButtonClick = () => {
    if(logined){
      router.push('/dashboard')
    }else{
      setIsSignUpOpen(true)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Collaborate same way with your team like never before
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience seamless communication, real-time updates, and powerful tools that bring your team closer together, no matter where they are.
            </p>
            <motion.button
              className="bg-indigo-600 text-white text-lg font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 z-40 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleButtonClick}
            >
              Get Started
            </motion.button>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/hero.png"
              alt="Team collaboration illustration"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute  -bottom-[130px] left-0 right-0 z-30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  )
}

