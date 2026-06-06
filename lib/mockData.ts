import { CampaignRow, Platform } from "./types"

const platforms: Platform[] = ["facebook", "tiktok", "google"]
const campaignNames = [
  "Summer Sale 2024",
  "App Install - Lookalike",
  "Retargeting Q2",
  "Brand Awareness",
  "Performance Max",
  "Smart Campaign",
  "Video Views",
  "Conversion Boost",
]

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function generateRows(): CampaignRow[] {
  const rows: CampaignRow[] = []
  const today = new Date()

  for (let d = 6; d >= 0; d--) {
    const date = new Date(today)
    date.setDate(today.getDate() - d)
    const dateStr = date.toISOString().split("T")[0]

    platforms.forEach((platform, pi) => {
      campaignNames.slice(0, 5).forEach((name, ci) => {
        const spend = rand(200, 2000)
        const installs = Math.round(rand(50, 500))
        const cpi = spend / installs
        const revenue = spend * rand(0.8, 3.5)
        rows.push({
          campaign_id: `camp_${pi + 1}${ci + 1}`,
          campaign_name: name,
          platform,
          date: dateStr,
          spend: Math.round(spend * 100) / 100,
          installs,
          cpi: Math.round(cpi * 100) / 100,
          revenue: Math.round(revenue * 100) / 100,
          roas: Math.round((revenue / spend) * 100) / 100,
        })
      })
    })
  }

  return rows
}

export const mockData: CampaignRow[] = generateRows()
