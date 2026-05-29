import { useState, useEffect } from 'react'

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-3 max-w-sm mt-3">
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-2 px-3 border border-white/10 shadow-sm">
        <div className="text-xl md:text-2xl font-black text-white leading-none">{timeLeft.days}</div>
        <div className="text-[10px] text-purple-200 font-extrabold uppercase tracking-wider mt-1.5">Days</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-2 px-3 border border-white/10 shadow-sm">
        <div className="text-xl md:text-2xl font-black text-white leading-none">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-[10px] text-purple-200 font-extrabold uppercase tracking-wider mt-1.5">Hours</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-2 px-3 border border-white/10 shadow-sm">
        <div className="text-xl md:text-2xl font-black text-white leading-none">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-[10px] text-purple-200 font-extrabold uppercase tracking-wider mt-1.5">Minutes</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-2 px-3 border border-white/10 shadow-sm">
        <div className="text-xl md:text-2xl font-black text-white leading-none">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-[10px] text-purple-200 font-extrabold uppercase tracking-wider mt-1.5">Seconds</div>
      </div>
    </div>
  )
}

export default CountdownTimer

