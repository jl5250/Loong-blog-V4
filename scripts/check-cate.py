import json
with open("C:/Users/23829/AppData/Local/Temp/cates.json", "r", encoding="utf-8") as f:
    d = json.load(f)
print("keys:", list(d.keys()))
print("data type:", type(d["data"]).__name__)
if isinstance(d["data"], dict):
    print("data keys:", list(d["data"].keys()))
    if "records" in d["data"]:
        print("records count:", len(d["data"]["records"]))
elif isinstance(d["data"], list):
    print("items count:", len(d["data"]))
    if d["data"]:
        print("first item keys:", list(d["data"][0].keys()))
