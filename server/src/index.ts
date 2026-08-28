import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import emergencyRoutes from './routes/emergencies'
import operatorRoutes from './routes/operator'
import contactRoutes from './routes/contacts'
import alertsRouter from './routes/alerts'
import aiRoutes from './routes/ai'
import responderRoutes from './routes/responder'

dotenv.config()

const app = express()

const PORT =
  Number(process.env.PORT) || 3000

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://112-operator.onrender.com',
  ],

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
}

/*
  Middleware must be before routes.
*/
app.use(cors(corsOptions))
app.use(express.json())

/*
  Health check
*/
app.get('/api/health', (_req, res) => {
  res.json({
    message: '112 API is running',
  })
})

/*
  API routes
*/
app.use('/api/auth', authRoutes)
app.use('/api/emergencies', emergencyRoutes)
app.use('/api/operator', operatorRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/alerts', alertsRouter)
app.use('/api/ai', aiRoutes)
app.use('/api/responder', responderRoutes)
/*
  Start server
*/
app.listen(PORT, () => {
  console.log(
    `112 API running on http://localhost:${PORT}`,
  )
})