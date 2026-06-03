import json

data = json.load(open("/tmp/api-docs.json", encoding="utf-8"))
paths = data.get("paths", {})

for path in sorted(paths.keys()):
    methods = paths[path]
    for m in methods:
        info = methods[m]
        tags = ",".join(info.get("tags", []))
        summary = info.get("summary", "")
        print(f"{m.upper():6s} {path:35s} [{tags:12s}] {summary}")
