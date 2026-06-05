"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { CampaignRow } from "@/lib/types"

interface Props {
  data: CampaignRow[]
}

export default function SpendChart({ data }: Props) {
  const byDate: Record<string, { date: string; facebook: number; tiktok: number; google: number }> = {}

  data.forEach(row => {
    if (!byDate[row.date]) {
      byDate[row.date] = { date: row.date, facebook: 0, tiktok: 0, google: 0 }
    }
    byDate[row.date][row.platform] += row.spend
  })

  const chartData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      ...d,
      date: d.date.slice(5), // MM-DD
      facebook: Math.round(d.facebook),
      tiktok: Math.round(d.tiktok),
      google: Math.round(d.google),
    }))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Daily Spend by Platform</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={14} barGap={2}>
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="facebook" name="Facebook" fill="#6366f1" radius={[3, 3, 0, 0]} />
          <Bar dataKey="tiktok" name="TikTok" fill="#1f2937" radius={[3, 3, 0, 0]} />
          <Bar dataKey="google" name="Google" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
