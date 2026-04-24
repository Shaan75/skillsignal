import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/authRoutes'
import resumeRoutes from './routes/resumeRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://skillsignal-one.vercel.app/', // add after you get Vercel URL
  ],
  credentials: true,
}))
app.use(express.json())

// Connect DB
connectDB()

// Routes
app.use('/api/auth', authRoutes)

// add after app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SkillSignal API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})