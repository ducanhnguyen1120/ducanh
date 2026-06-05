# daily-report

Tổng hợp báo cáo campaign theo ngày từ dữ liệu đã join.

## Khi nào dùng

Gọi `/daily-report` khi cần tạo bảng tổng hợp hiệu suất campaign trong ngày / tuần / tháng.

## Loop

1. Lấy data từ bảng đã join (output của `campaign-match`)
2. Group by: `date`, `platform`, `campaign_id`
3. Tính: `total_spend`, `total_installs`, `avg_cpi`, `total_revenue`, `roas`
4. So sánh với kỳ trước (WoW / DoD) nếu có data
5. Highlight campaign: top spend, top ROAS, CPI bất thường
6. Xuất bảng markdown + gợi ý insight

## Output mong đợi

```
| Platform | Campaign | Spend | Installs | CPI  | Revenue | ROAS |
|----------|----------|-------|----------|------|---------|------|
| FB       | camp_001 | 500$  | 200      | 2.5$ | 1200$   | 2.4  |
```

## Ghi chú

<!-- Thêm threshold cảnh báo, định dạng output riêng tại đây -->
