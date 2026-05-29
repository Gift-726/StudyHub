const MetricsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex flex-col justify-between">
        <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-semibold text-gray-400 tracking-wide">{title}</p>
      </div>
    </div>
  )
}

export default MetricsCard
