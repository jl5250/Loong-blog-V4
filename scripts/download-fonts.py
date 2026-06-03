"""Download CJK fonts from Google Fonts for self-hosting."""
import os, re, urllib.request, ssl, sys
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

FONTS_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
FONTS_DIR.mkdir(parents=True, exist_ok=True)

FONTS = {
    "NotoSerifSC": {
        "url": "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap",
    },
    "MaShanZheng": {
        "url": "https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap",
    },
    "Inter": {
        "url": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap",
    },
    "JetBrainsMono": {
        "url": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap",
    },
    "PlayfairDisplay": {
        "url": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
    },
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}
ctx = ssl.create_default_context()


def fetch_css(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        return resp.read().decode("utf-8")


def download(url: str, dest: Path):
    if dest.exists():
        print(f"  [SKIP] {dest.name} exists")
        return
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    size_kb = len(data) / 1024
    print(f"  [OK] {dest.name} ({size_kb:.0f} KB)")


def main():
    downloaded = 0
    for name, cfg in FONTS.items():
        print(f"\n--- {name} ---")
        css = fetch_css(cfg["url"])
        # Extract all src: url(...) format('woff2') entries
        pattern = re.compile(r"url\(([^)]+)\)\s*format\(['\"]woff2['\"]\)")
        urls = pattern.findall(css)
        if not urls:
            print(f"  [WARN] No woff2 URLs found for {name}")
            print(f"  CSS preview: {css[:200]}")
            continue
        for url in urls:
            clean_url = url.strip("'\"")
            filename = clean_url.split("/")[-1].split("?")[0]
            if not filename.endswith(".woff2"):
                filename += ".woff2"
            dest = FONTS_DIR / filename
            download(clean_url, dest)
            downloaded += 1
    print(f"\nDone. {downloaded} font files in {FONTS_DIR}")


if __name__ == "__main__":
    main()
