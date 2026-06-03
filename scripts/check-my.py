import json
with open("C:/Users/23829/AppData/Local/Temp/my.json", "r", encoding="utf-8") as f:
    d = json.load(f)
v = d.get("data", {}).get("value", {})
print("keys:", list(v.keys()))
for k in v:
    val = v[k]
    if isinstance(val, list):
        print(f"  {k}: list ({len(val)} items)")
        if val:
            print(f"    first: {json.dumps(val[0], ensure_ascii=False)[:200]}")
    elif isinstance(val, dict):
        print(f"  {k}: dict -> {json.dumps(val, ensure_ascii=False)[:200]}")
    else:
        print(f"  {k}: {repr(val)[:100]}")
