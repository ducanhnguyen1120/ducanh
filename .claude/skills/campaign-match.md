# campaign-match

Khớp dữ liệu MMP với platform report (FB / TT / GG) theo campaign_id.

## Khi nào dùng

Gọi `/campaign-match` khi cần join hoặc reconcile số liệu giữa MMP export và platform report.

## Loop

1. Nhận đầu vào: file MMP + file platform (hoặc mô tả schema)
2. Chuẩn hóa tên cột: lowercase, bỏ space, map về tên chuẩn
3. Dedup: giữ 1 dòng mỗi `(campaign_id, date, platform)`
4. LEFT JOIN MMP → platform theo `campaign_id` + `date`
5. Tính các metric: `spend`, `installs`, `cpi`, `revenue`, `roas`
6. Flag các campaign_id không khớp (có trong MMP nhưng thiếu platform hoặc ngược lại)
7. Xuất ra DataFrame sạch + báo cáo unmatch

## Output mong đợi

```python
# Columns sau khi join
campaign_id | date | platform | mmp_installs | mmp_revenue | platform_spend | cpi | roas | match_status
```

## Ghi chú

<!-- Thêm edge case hay quy ước riêng của từng platform vào đây -->
