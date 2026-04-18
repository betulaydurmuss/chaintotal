import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { Button } from '@components/atoms/Button'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="text-9xl font-bold text-gradient-primary">404</div>
        
        <h1 className="text-3xl font-bold text-text-primary">
          Page Not Found
        </h1>
        
        <p className="text-text-muted max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button
          size="lg"
          icon={<Home className="w-5 h-5" />}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}
