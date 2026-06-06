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

## Stack Đã Chọn

**Next.js + Vercel + Supabase**

```
Frontend + Backend API : Next.js
Hosting (hiện tại)     : Vercel (free, custom domain)
Database               : Supabase PostgreSQL (free 500MB)
Auth / SSO             : Supabase Auth — login Google Workspace theo domain, admin quản lý user
ETL / Sync data        : GitHub Actions cron — gọi API FB/TT/GG + MMP → upsert DB (free)
```

### Lý do chọn

- Filter động, login SSO tên miền riêng, admin quản lý user → cần frontend + backend thật
- Tính năng edit budget camp (làm sau) → cần API routes gọi ngược FB/TT/GG API
- Sau này ổn định → migrate lên server cty không cần viết lại code

### Nguyên tắc code để dễ migrate sau

| Phần | Làm đúng | Tránh |
|---|---|---|
| Hosting | `next build` + `next start` chuẩn | Vercel Edge Runtime, Vercel KV, Vercel Blob |
| Database | SQL chuẩn PostgreSQL | Supabase-specific extensions không cần thiết |
| Auth | Supabase Auth (self-hostable) | Auth0, Clerk |
| Config | Tất cả qua `.env` | Hard-code URL / API key |

### Roadmap tính năng

- [x] Xem spend, installs, CPI, revenue — khớp qua campaign_id
- [x] Filter động (platform, ngày, campaign)
- [x] Login SSO tên miền riêng, admin quản lý user
- [x] Auto-refresh 30p / 1h
- [ ] Edit campaign budget trực tiếp trên tool (làm sau)

## Ghi chú

<!-- Thêm ghi chú đặc thù của project vào đây -->
