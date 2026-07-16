const MetricsCard = ({ title, value, icon, description, colorClass = "text-[#4B2E83] bg-[#4B2E83]/10" }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-[#4B2E83]/10">
      <div className="flex-1 min-w-0">
        <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1 leading-none">{value}</p>
        <p className="text-sm font-semibold text-gray-700 tracking-wide">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1 font-medium">{description}</p>
        )}
      </div>
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${colorClass}`}>
          {icon}
        </div>
      )}
    </div>
  )
}

export default MetricsCard
