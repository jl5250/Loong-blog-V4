"""Scan source files and print CJK unicodes for fonttools subsetting."""
import os, re, sys
sys.stdout.reconfigure(encoding="utf-8")

CJK = re.compile(r"[一-鿿　-〿＀-￯]")
chars = set()

root_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")
for root, dirs, files in os.walk(root_dir):
    if ".next" in root:
        continue
    for f in files:
        if not f.endswith((".tsx", ".ts", ".css")):
            continue
        text = open(os.path.join(root, f), encoding="utf-8", errors="ignore").read()
        chars.update(CJK.findall(text))

print(f"CHARS={len(chars)}")
codes = ",".join(f"U+{ord(c):04X}" for c in sorted(chars))
print(codes)
