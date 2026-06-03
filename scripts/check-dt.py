import json
with open("C:/Users/23829/AppData/Local/Temp/songs.json", "r", encoding="utf-8") as f:
    d = json.load(f)
for s in d["data"]["dailySongs"][:5]:
    print(f'dt={s["dt"]} seconds={s["dt"]/1000:.0f} name={s["name"]}')
