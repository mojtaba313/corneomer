import mongoose from 'mongoose'

const timerSchema = new mongoose.Schema({
  type: String,
  duration: Number,
  remaining: Number,
  isRunning: Boolean,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Timer || mongoose.model('Timer', timerSchema)