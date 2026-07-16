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

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(timeLeft.seconds).padStart(2, '0') },
  ]

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-sm mt-1">
      {timeBlocks.map((block, idx) => (
        <div key={idx} className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-3 px-2 sm:px-4 border border-white/10 shadow-lg flex flex-col justify-center items-center min-w-[70px] sm:min-w-[80px]">
          <span className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight">
            {block.value}
          </span>
          <span className="text-[9px] sm:text-[10px] text-purple-200 font-extrabold uppercase tracking-widest mt-1.5">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CountdownTimer
