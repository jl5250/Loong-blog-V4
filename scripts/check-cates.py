import json
with open("C:/Users/23829/AppData/Local/Temp/cc.json", "r", encoding="utf-8") as f:
    d = json.load(f)
items = d["data"]["result"]
for c in items:
    ch = c.get("children") or []
    print(f'  id={c["id"]} name={c["name"]} level={c["level"]} children={len(ch)}')
    for x in ch:
        print(f'    -> id={x["id"]} name={x["name"]} level={x["level"]}')
