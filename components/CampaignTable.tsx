"use client"

import { useState } from "react"
import { CampaignRow } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface Props {
  data: CampaignRow[]
}

const PLATFORM_BADGE: Record<string, string> = {
  facebook: "bg-blue-100 text-blue-700",
  tiktok: "bg-black text-white",
  google: "bg-red-100 text-red-700",
}

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  google: "Google",
}

type SortKey = keyof CampaignRow
type SortDir = "asc" | "desc"

export default function CampaignTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const PER_PAGE = 15

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
    setPage(1)
  }

  const sorted = [...data].sort((a, b) => {
    const va = a[sortKey]
    const vb = b[sortKey]
    if (typeof va === "number" && typeof vb === "number") {
      return sortDir === "asc" ? va - vb : vb - va
    }
    return sortDir === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va))
  })

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: "campaign_id", label: "Campaign ID" },
    { key: "campaign_name", label: "Campaign" },
    { key: "platform", label: "Platform" },
    { key: "date", label: "Date" },
    { key: "spend", label: "Spend", align: "right" },
    { key: "installs", label: "Installs", align: "right" },
    { key: "cpi", label: "CPI", align: "right" },
    { key: "revenue", label: "Revenue", align: "right" },
    { key: "roas", label: "ROAS", align: "right" },
  ]

  function Arrow({ col }: { col: SortKey }) {
    if (col !== sortKey) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-indigo-500 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 font-semibold text-gray-600 cursor-pointer select-none whitespace-nowrap hover:text-indigo-600 transition-colors ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.label}<Arrow col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={`${row.campaign_id}-${row.date}-${row.platform}`} className={`border-b border-gray-100 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.campaign_id}</td>
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{row.campaign_name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PLATFORM_BADGE[row.platform]}`}>
                    {PLATFORM_LABEL[row.platform]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{row.date}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.spend)}</td>
                <td className="px-4 py-3 text-right">{formatNumber(row.installs)}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(row.cpi)}</td>
                <td className="px-4 py-3 text-right font-medium text-green-700">{formatCurrency(row.revenue)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${row.roas >= 1 ? "text-green-600" : "text-red-500"}`}>
                    {row.roas.toFixed(2)}x
                  </span>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">No campaigns found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Showing {Math.min((page - 1) * PER_PAGE + 1, sorted.length)}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length} rows
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${page === p ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            )
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
