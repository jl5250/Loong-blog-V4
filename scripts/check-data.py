import json
with open("C:/Users/23829/AppData/Local/Temp/arts.json", "r", encoding="utf-8") as f:
    d = json.load(f)
r = d.get("data", {})
print(f'total: {r.get("total")}')
print(f'page: {r.get("page")}, pages: {r.get("pages")}')
arts = r.get("result") or []
print(f'articles: {len(arts)}')
