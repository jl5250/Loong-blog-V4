import json
with open("C:/Users/23829/AppData/Local/Temp/fp.json", "r", encoding="utf-8") as f:
    d = json.load(f)
items = d.get("data") or []
print(f"count: {len(items)}")
if items:
    print("keys:", list(items[0].keys()))
    for item in items:
        print(f'  id={item["id"]} title={item["title"]} address={item.get("address","")} images={bool(item.get("images"))}')
