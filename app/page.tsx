"use client"

import { useMemo, useState } from "react"
import FilterBar from "@/components/FilterBar"
import MetricsCards from "@/components/MetricsCards"
import CampaignTable from "@/components/CampaignTable"
import SpendChart from "@/components/SpendChart"
import { mockData } from "@/lib/mockData"
import { FilterState } from "@/lib/types"

const today = new Date().toISOString().split("T")[0]
const sevenDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0]

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    platform: "all",
    dateFrom: sevenDaysAgo,
    dateTo: today,
    search: "",
  })

  const filtered = useMemo(() => {
    return mockData.filter(row => {
      if (filters.platform !== "all" && row.platform !== filters.platform) return false
      if (filters.dateFrom && row.date < filters.dateFrom) return false
      if (filters.dateTo && row.date > filters.dateTo) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!row.campaign_name.toLowerCase().includes(q) && !row.campaign_id.includes(q)) return false
      }
      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">Campaign Analytics</h1>
              <p className="text-xs text-gray-400 mt-0.5">Intraday Performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live · Mock Data
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* KPI Cards */}
        <MetricsCards data={filtered} />

        {/* Chart + Table */}
        <SpendChart data={filtered} />
        <CampaignTable data={filtered} />
      </main>
    </div>
  )
}
