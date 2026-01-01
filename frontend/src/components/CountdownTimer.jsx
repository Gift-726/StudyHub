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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
      <div className="text-center">
        <div className="bg-purple bg-opacity-20 rounded-lg p-4 mb-2">
          <div className="text-3xl md:text-4xl font-bold">{timeLeft.days}</div>
        </div>
        <div className="text-sm md:text-base text-purple-100">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
          <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        </div>
        <div className="text-sm md:text-base text-purple-100">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
          <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        </div>
        <div className="text-sm md:text-base text-purple-100">Minutes</div>
      </div>
      <div className="text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
          <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        </div>
        <div className="text-sm md:text-base text-purple-100">Seconds</div>
      </div>
    </div>
  )
}

export default CountdownTimer

