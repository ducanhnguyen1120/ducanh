# Intraday — Campaign Analytics

## Mục đích

Dashboard phân tích campaign marketing theo ngày (intraday). Dùng **campaign ID** làm khóa nối giữa dữ liệu MMP và các nền tảng quảng cáo: Facebook, TikTok, Google.

## Nguồn dữ liệu

| Nguồn | Loại dữ liệu |
|-------|-------------|
| MMP (AppsFlyer / Adjust / …) | Install, event, revenue, attribution |
| Facebook Ads | Spend, impression, click, campaign ID |
| TikTok Ads | Spend, impression, click, campaign ID |
| Google Ads | Spend, impression, click, campaign ID |

## Logic khớp nối

- Trường khóa: **campaign_id** — phải nhất quán giữa MMP export và platform report
- Join type mặc định: `LEFT JOIN` từ MMP ra platform (MMP là nguồn chính)
- Xử lý trùng: nếu 1 campaign_id xuất hiện nhiều lần → dedup theo ngày + platform

## Cấu trúc dự án

```
intraday/
├── CLAUDE.md              # file này
├── .claude/
│   └── skills/            # các workflow hay dùng (gọi bằng /tên-skill)
├── data/                  # raw data từ các nguồn
├── notebooks/             # phân tích, EDA
└── src/                   # code xử lý, pipeline
```

## Quy ước

- Ngôn ngữ: Python (pandas / polars)
- Định dạng date: `YYYY-MM-DD`
- Encoding file: UTF-8
- Tên cột sau khi join: `platform_spend`, `mmp_installs`, `mmp_revenue`, v.v.

## Web Dashboard — Các Option Đang Xem Xét

> Yêu cầu: **miễn phí**, **auto-refresh** mỗi 30 phút hoặc 1 tiếng (hoặc liên tục).
> Metrics cần hiển thị: `spend`, `installs`, `CPI`, `revenue` — khớp qua `campaign_id`.
> **Chưa chọn option nào — đang ở giai đoạn lựa chọn.**

### Option 1 — Streamlit + Streamlit Cloud
| | |
|---|---|
| **Stack** | Python, Streamlit Community Cloud (free) |
| **Refresh** | `st.rerun()` loop — mỗi 30p/1h tự động |
| **Data flow** | Script gọi API (FB/TT/GG + MMP) → pandas join → render |
| **Pros** | Nhanh nhất (~1 ngày), không cần frontend, deploy 1 click |
| **Cons** | UI đơn giản, app ngủ sau 7 ngày không dùng (free tier) |

### Option 2 — Google Looker Studio + Google Sheets
| | |
|---|---|
| **Stack** | Python (`gspread`) đẩy vào Sheets, Looker Studio đọc |
| **Refresh** | Looker Studio: 15 phút / Script: GitHub Actions cron (free) |
| **Data flow** | Script chạy định kỳ → ghi Sheets → Looker Studio tự cập nhật |
| **Pros** | Zero hosting, giao diện đẹp, dễ share link |
| **Cons** | Phụ thuộc Google, không real-time thực sự |

### Option 3 — Next.js + Vercel + Supabase
| | |
|---|---|
| **Stack** | Next.js (Vercel free), PostgreSQL (Supabase free 500MB) |
| **Refresh** | Vercel Cron Job (free: 1 job) mỗi 30p → upsert DB → frontend poll |
| **Data flow** | Cron gọi API → upsert Supabase → UI fetch mới khi load/interval |
| **Pros** | UI tùy biến hoàn toàn, dữ liệu persist, dễ mở rộng |
| **Cons** | Cần viết cả frontend + backend, tốn thời gian hơn |

### Option 4 — Grafana Cloud + Supabase
| | |
|---|---|
| **Stack** | Grafana Cloud (free tier), PostgreSQL (Supabase), Python ETL |
| **Refresh** | Grafana tự refresh từ 5 giây → custom interval, không cần code thêm |
| **Data flow** | Script ETL → upsert Supabase → Grafana query trực tiếp DB |
| **Pros** | Dashboard đẹp nhất, real-time thực sự, có alerting sẵn |
| **Cons** | Setup phức tạp nhất, cần cấu hình data source + panel |

### So sánh nhanh

| | Dễ build | UI đẹp | Real-time | Mở rộng |
|---|---|---|---|---|
| Streamlit | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| Looker Studio | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Next.js + Vercel | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Grafana | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

## Ghi chú

<!-- Thêm ghi chú đặc thù của project vào đây -->
