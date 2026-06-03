"""Generate local @font-face CSS from downloaded Google Fonts files.

Parses the Google Fonts CSS response, rewrites URLs to local paths,
and outputs a single fonts.css file.
"""
import re, sys, urllib.request, ssl
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

FONTS_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
CSS_DIR = Path(__file__).resolve().parent.parent / "src" / "styles"
CSS_DIR.mkdir(parents=True, exist_ok=True)

FONTS = {
    "NotoSerifSC": {
        "url": "https://fonts.geekzu.org/css2?family=Noto+Serif+SC:wght@400;700&display=swap",
        "family": "Noto Serif SC",
    },
    "MaShanZheng": {
        "url": "https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap",
        "family": "Ma Shan Zheng",
    },
    "Inter": {
        "url": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap",
        "family": "Inter",
    },
    "JetBrainsMono": {
        "url": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap",
        "family": "JetBrains Mono",
    },
    "PlayfairDisplay": {
        "url": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
        "family": "Playfair Display",
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


def download_woff2(url: str, dest: Path) -> bool:
    if dest.exists():
        return False
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        dest.write_bytes(resp.read())
    return True


def rewrite_css(css: str, font_name: str) -> str:
    """Rewrite Google Fonts CSS to use local file paths."""
    lines = []
    for line in css.split("\n"):
        # Skip the charset declaration
        if "@charset" in line:
            continue
        # Rewrite URLs: download the file and point to local path
        urls = re.findall(r"url\((https://[^)]+)\)", line)
        for url in urls:
            clean_url = url.strip("'\"")
            filename = clean_url.split("/")[-1].split("?")[0]
            if not filename.endswith(".woff2"):
                filename += ".woff2"
            local_path = FONTS_DIR / filename
            if download_woff2(clean_url, local_path):
                kb = local_path.stat().st_size / 1024
                print(f"  [FONT] {filename} ({kb:.0f} KB)")
            # Rewrite URL to local path
            line = line.replace(url, f"/fonts/{filename}")
        lines.append(line)
    return "\n".join(lines)


def main():
    all_css = []
    for name, cfg in FONTS.items():
        print(f"\n--- {cfg['family']} ---")
        css = fetch_css(cfg["url"])
        rewritten = rewrite_css(css, name)
        all_css.append(rewritten)

    # Add LXGWWenKai manually (downloaded from v3)
    lxgwwenkai_css = """/* LXGWWenKai — local, will be subset in production */
@font-face {
  font-family: 'LXGWWenKai';
  src: url('/fonts/LXGWWenKai-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
"""
    all_css.append(lxgwwenkai_css)

    combined = "\n".join(all_css)
    out_path = CSS_DIR / "fonts.css"
    out_path.write_text(combined, encoding="utf-8")
    print(f"\nDone. {out_path} written ({out_path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
