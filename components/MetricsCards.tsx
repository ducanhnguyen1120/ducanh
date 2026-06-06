import { CampaignRow } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface Props {
  data: CampaignRow[]
}

export default function MetricsCards({ data }: Props) {
  const totalSpend = data.reduce((s, r) => s + r.spend, 0)
  const totalInstalls = data.reduce((s, r) => s + r.installs, 0)
  const avgCpi = totalInstalls > 0 ? totalSpend / totalInstalls : 0
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0

  const cards = [
    {
      label: "Total Spend",
      value: formatCurrency(totalSpend),
      icon: "💸",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Installs",
      value: formatNumber(totalInstalls),
      icon: "📲",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Avg CPI",
      value: formatCurrency(avgCpi),
      icon: "🎯",
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Revenue (MMP)",
      value: formatCurrency(totalRevenue),
      icon: "💰",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "ROAS",
      value: `${roas.toFixed(2)}x`,
      icon: "📈",
      color: "bg-rose-50 text-rose-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg mb-3 ${card.color}`}>
            {card.icon}
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
