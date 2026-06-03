"""CJK font subsetting for production builds.

Scans all source files for used Chinese characters,
then subsets the CJK fonts to include only those glyphs.

Usage:
    python scripts/subset-cjk.py          # dev: preview only
    python scripts/subset-cjk.py --run    # production: actually subset
"""
import argparse, glob, os, re, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

PROJECT = Path(__file__).resolve().parent.parent
FONTS_DIR = PROJECT / "public" / "fonts"
SRC_DIR = PROJECT / "src"

CJK_RE = re.compile(r"[一-鿿㐀-䶿豈-﫿]")

FONTS_TO_SUBSET = [
    {
        "name": "LXGWWenKai",
        "src": FONTS_DIR / "LXGWWenKai-Regular.ttf",
        "out": FONTS_DIR / "LXGWWenKai-Regular.subset.woff2",
        "family": "LXGWWenKai",
    },
    # Noto Serif SC is on Google Fonts CDN for now — add when self-hosted
]


def collect_cjk_chars(root: Path) -> set[str]:
    """Collect all unique CJK characters used in source files."""
    chars: set[str] = set()
    for filepath in root.rglob("*"):
        if filepath.suffix not in (".tsx", ".ts", ".css", ".js", ".json"):
            continue
        if ".next" in filepath.parts or "node_modules" in filepath.parts:
            continue
        try:
            text = filepath.read_text(encoding="utf-8", errors="ignore")
            chars.update(CJK_RE.findall(text))
        except Exception:
            continue
    return chars


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--run", action="store_true", help="Actually subset fonts")
    args = parser.parse_args()

    print("Scanning source files for CJK characters...")
    chars = collect_cjk_chars(SRC_DIR)
    print(f"  Found {len(chars)} unique CJK characters in source")

    if not chars:
        print("  No CJK characters found — nothing to subset")
        return

    for font in FONTS_TO_SUBSET:
        if not font["src"].exists():
            print(f"  [SKIP] {font['src'].name} not found")
            continue

        size_before = font["src"].stat().st_size / 1024
        print(f"\n  {font['name']}: {size_before:.0f} KB full")

        if args.run:
            # Build unicode range string
            unicodes = ",".join(f"U+{ord(c):04X}" for c in sorted(chars))

            cmd = [
                sys.executable, "-m", "fonttools", "subset",
                str(font["src"]),
                f"--unicodes={unicodes}",
                "--flavor=woff2",
                f"--output-file={font['out']}",
                "--drop-tables+=DSIG",  # remove digital signature
                "--no-subset-tables+=gsub",  # keep some layout tables
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0 and font["out"].exists():
                size_after = font["out"].stat().st_size / 1024
                saved = (1 - size_after / size_before) * 100
                print(f"         {size_after:.0f} KB subset ({saved:.0f}% savings)")
            else:
                print(f"  [FAIL] {result.stderr[:200]}")
        else:
            print(f"  Run with --run to create subset")
            # Estimate savings
            estimated = (len(chars) / 20000) * size_before
            print(f"  Estimated subset: ~{estimated:.0f} KB ({estimated/size_before*100:.0f}% of original)")

    print("\nDone.")


if __name__ == "__main__":
    main()
