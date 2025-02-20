// import { NextResponse } from 'next/server';
// import { connectToDB } from '@/utils/db';
// import Timer from '@/models/Timer';


// export async function GET() {
//   try {
//     await connectToDB();
//     const timers = await Timer.find({})
//     return NextResponse.json(timers)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch timers' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB()
//     const { type, duration } = await req.json()
//     const newTimer = new Timer({
//       type,
//       duration,
//       remaining: duration,
//       isRunning: false
//     })
//     await newTimer.save()
//     return NextResponse.json(newTimer)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create timer' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(req) {
//   try {
//     await connectDB()
//     const { id } = await req.json()
//     await Timer.findByIdAndDelete(id)
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to delete timer' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(req) {
//   try {
//     await connectDB()
//     const { id, action } = await req.json()
//     const timer = await Timer.findById(id)

//     if (action === 'start') {
//       timer.isRunning = true
//       timer.startedAt = Date.now()
//     } else if (action === 'stop') {
//       timer.remaining = timer.duration - (Date.now() - timer.startedAt)
//       timer.isRunning = false
//     } else if (action === 'reset') {
//       timer.remaining = timer.duration
//       timer.isRunning = false
//     }

//     await timer.save()
//     return NextResponse.json(timer)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update timer' },
//       { status: 500 }
//     )
//   }
// }