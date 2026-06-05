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

## Ghi chú

<!-- Thêm ghi chú đặc thù của project vào đây -->
