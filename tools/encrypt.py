#!/usr/bin/env python3
"""Build the password-gated deploy/ folder for the BSM workshop site.

Reads SITE_PASSWORD from the environment first, then from a gitignored .env.local
in the repo root. Inlines the full app (index.html, styles.css, prompts.js,
script.js, Alpine, logo) into one HTML document, encrypts it with AES-256-GCM
(key = PBKDF2-HMAC-SHA256, 200,000 iterations, random 16-byte salt, random
12-byte IV, no associated data) and writes deploy/index.html: a small branded
gate page that decrypts in the browser with WebCrypto. Public, non-secret
assets (font, sw.js) are copied into deploy/. Only deploy/ is served by Vercel
(see vercel.json), so the plaintext app files are never public.

Usage:  python3 tools/encrypt.py        (requires: pip install cryptography)
"""
import base64
import os
import re
import shutil
import sys
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "deploy"
ITERATIONS = 200_000
TEMPLATE = ROOT / "tools" / "gate.template.html"
SW_SRC = ROOT / "tools" / "sw.gate.js"


def read_password() -> str:
    pw = os.environ.get("SITE_PASSWORD")
    if not pw:
        env = ROOT / ".env.local"
        if env.exists():
            for line in env.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                if key.strip() == "SITE_PASSWORD":
                    pw = val.strip().strip('"').strip("'")
    if not pw:
        sys.exit("SITE_PASSWORD not set (export it or put SITE_PASSWORD=... in .env.local)")
    return pw


def js_inline(src: str) -> str:
    # Never let inlined code close the surrounding <script> element early.
    return re.sub(r"</(script)", r"<\\/\1", src, flags=re.I)


def build_app() -> str:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    prompts = (ROOT / "prompts.js").read_text(encoding="utf-8")
    script = (ROOT / "script.js").read_text(encoding="utf-8")
    alpine = (ROOT / "vendor" / "alpine-3.17.5.min.js").read_text(encoding="utf-8")
    logo = (ROOT / "assets" / "bsm-logo-white.svg").read_bytes()
    logo_uri = "data:image/svg+xml;base64," + base64.b64encode(logo).decode()

    def sub_once(pattern, repl, text):
        new, n = re.subn(pattern, lambda m: repl, text, count=1, flags=re.S)
        if n != 1:
            sys.exit(f"build: pattern not found in index.html: {pattern}")
        return new

    html = sub_once(r'<link rel="stylesheet" href="styles.css">', "<style>\n" + css + "\n</style>", html)
    # Alpine goes at the end of <body> (after prompts/script) so it starts once the DOM exists.
    html = sub_once(r'<!--[^>]*Alpine[^>]*-->\s*<script defer src="vendor/alpine-3\.17\.5\.min\.js"></script>\s*', "", html)
    html = html.replace('src="assets/bsm-logo-white.svg"', 'src="' + logo_uri + '"')
    # The gate page registers the service worker; drop the app's own registration.
    html = sub_once(r'<script src="prompts.js"></script>\s*<script src="script.js"></script>\s*<script>.*?</script>',
                    "<script>\n" + js_inline(prompts) + "\n</script>\n"
                    "<script>\n" + js_inline(script) + "\n</script>\n"
                    "<script>\n" + js_inline(alpine) + "\n</script>", html)
    return html


def encrypt(plaintext: bytes, password: str):
    salt = os.urandom(16)
    iv = os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERATIONS).derive(password.encode("utf-8"))
    ct = AESGCM(key).encrypt(iv, plaintext, None)
    b64 = lambda b: base64.b64encode(b).decode()
    return b64(salt), b64(iv), b64(ct)


def main():
    password = read_password()
    app = build_app()
    s, i, c = encrypt(app.encode("utf-8"), password)
    gate = TEMPLATE.read_text(encoding="utf-8")
    gate = gate.replace("__ITER__", str(ITERATIONS))
    gate = gate.replace('const S="",I="",C="";', f'const S="{s}",I="{i}",C="{c}";')
    if f'const S="{s}"' not in gate:
        sys.exit("build: placeholder missing in gate template")

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "fonts").mkdir(parents=True)
    (OUT / "index.html").write_text(gate, encoding="utf-8")
    shutil.copy2(ROOT / "fonts" / "inter-latin-wght-normal.woff2", OUT / "fonts")
    shutil.copy2(ROOT / "fonts" / "OFL.txt", OUT / "fonts")
    shutil.copy2(SW_SRC, OUT / "sw.js")
    print(f"Wrote {OUT / 'index.html'} ({len(gate):,} bytes, app {len(app):,} bytes encrypted)")


if __name__ == "__main__":
    main()
