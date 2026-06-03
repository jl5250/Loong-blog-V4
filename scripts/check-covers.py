import json, sys
sys.stdout.reconfigure(encoding="utf-8")
d = json.load(open("C:/Users/23829/AppData/Local/Temp/articles.json", encoding="utf-8"))
for a in d["data"]["result"]:
    c = a.get("cover")
    has = "YES" if c else "NO"
    print(f"  [{a['id']}] {str(a['title'])[:30]:30s}  cover={has}")
