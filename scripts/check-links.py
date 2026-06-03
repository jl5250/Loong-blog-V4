import json, sys, subprocess
result = subprocess.run(
    ["curl", "-s", "-X", "POST", "http://localhost:9003/api/link/list",
     "-H", "Content-Type: application/json", "-d", "{}"],
    capture_output=True, text=True
)
d = json.loads(result.stdout)
for item in d["data"]:
    print(f'  [{item["id"]}] {item["title"]:20s} type={item["type"]["name"]:10s}')
