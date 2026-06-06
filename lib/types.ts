export type Platform = "facebook" | "tiktok" | "google"

export interface CampaignRow {
  campaign_id: string
  campaign_name: string
  platform: Platform
  date: string
  spend: number
  installs: number
  cpi: number
  revenue: number
  roas: number
}

export interface FilterState {
  platform: Platform | "all"
  dateFrom: string
  dateTo: string
  search: string
}
