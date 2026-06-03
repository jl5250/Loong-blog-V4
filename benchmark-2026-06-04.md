# Performance Benchmark — 2026-06-04

**Target:** https://loongblog.fun
**Baseline:** First run

## Page Load Times

| Page        | HTTP | TTFB     | Total    | Size   |
|-------------|------|----------|----------|--------|
| `/`         | 200  | 2.03s    | 2.91s    | 57KB   |
| `/data`     | 200  | 2.11s    | 2.13s    | 27KB   |
| `/article/2`| 200  | 2.22s    | 2.59s    | 62KB   |
| `/record`   | 200  | 2.00s    | 2.01s    | 20KB   |
| `/search`   | 200  | 2.48s    | 2.50s    | 20KB   |
| `/my`       | 200  | 2.53s    | 2.71s    | 65KB   |

## Key Findings

- **All pages 200** ✓
- **TTFB 2-2.5s** — 瓶颈在后端 API（`api.loongblog.fun`），每次 ISR 刷新都要等它
- **HTML 大小**合理（20-65KB）
- 客户端渲染的页面（record, search）TTFB 也一样慢，因为首次渲染需要调用 API
- 之前首页 10.58s → 已降到 2.91s（ISR 优化生效）

## 建议

1. **加 CDN**（Cloudflare）缓存静态页面，大幅减少后端请求
2. **后端加 Redis 缓存**，Spring Boot 的 API 响应时间从 2s 降到 200ms 以内
3. **部署后预热 ISR**：跑个脚本把主要页面访问一遍，触发缓存生成
4. **下次跑浏览器级 benchmark**（Lighthouse）获取 FCP/LCP/CLS 数据

## Grade: B

TTFB 太长（2s+），但 ISR 后访问秒开。后端 API 是瓶颈。
