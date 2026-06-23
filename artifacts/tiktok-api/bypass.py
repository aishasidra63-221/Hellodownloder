"""
4-Layer Bypass: Proxy + User-Agent + Accept-Language + Referer
Each proxy country gets the browsers actually popular in that country.
"""
import asyncio
import random
from typing import Optional

# ── Country fingerprint database ──────────────────────────────────────────────
# (User-Agent, Accept-Language, platform-hint)

_FINGERPRINTS: dict[str, list[dict]] = {
    "ID": [  # Indonesia — Chrome Android dominant
        {"ua": "Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.80 Mobile Safari/537.36", "lang": "id-ID,id;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; SM-A155F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36", "lang": "id-ID,id;q=0.9"},
        {"ua": "Mozilla/5.0 (Linux; Android 12; POCO X4 Pro 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36", "lang": "id-ID,id;q=0.9,en-US;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Infinix X6739) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36", "lang": "id-ID,id;q=0.9,en;q=0.8"},
    ],
    "BR": [  # Brazil — Chrome Android + Chrome Windows
        {"ua": "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "pt-BR,pt;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; motorola moto g54 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "pt-BR,pt;q=0.9"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "pt-BR,pt;q=0.9,en-US;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; Redmi 12C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.118 Mobile Safari/537.36", "lang": "pt-BR,pt;q=0.9,en;q=0.8"},
    ],
    "PH": [  # Philippines — Chrome Android dominant
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A236B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "en-PH,en;q=0.9,fil;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; TECNO KJ6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36", "lang": "fil-PH,fil;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; vivo Y16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36", "lang": "en-PH,en;q=0.9,fil;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/120.0.0.0 Mobile Safari/537.36", "lang": "en-PH,en;q=0.9"},
    ],
    "VN": [  # Vietnam — Chrome Windows + Chrome Android
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi Note 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "vi-VN,vi;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0", "lang": "vi-VN,vi;q=0.9,en-US;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; OPPO A77 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36", "lang": "vi-VN,vi;q=0.9,en-US;q=0.8"},
    ],
    "TH": [  # Thailand — Chrome Android
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; OPPO Find X6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36", "lang": "th-TH,th;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "th-TH,th;q=0.9,en-US;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36", "lang": "th-TH,th;q=0.9,en;q=0.8"},
    ],
    "IN": [  # India — Chrome Android + Samsung Browser
        {"ua": "Mozilla/5.0 (Linux; Android 14; SM-M546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi Note 12 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; vivo V29e) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "en-IN,en;q=0.9,hi;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/120.0.0.0 Mobile Safari/537.36", "lang": "en-IN,en;q=0.9"},
        {"ua": "Mozilla/5.0 (Linux; Android 12; Realme C33) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.193 Mobile Safari/537.36", "lang": "en-IN,en-GB;q=0.9,en-US;q=0.8"},
    ],
    "TR": [  # Turkey — Chrome Windows + Firefox
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.5"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A235F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "tr-TR,tr;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0", "lang": "tr-TR,tr;q=0.9,en-US;q=0.8"},
    ],
    "MX": [  # Mexico — Chrome Android
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A135M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "es-MX,es;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 14; motorola moto g84 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "es-MX,es;q=0.9,en-US;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi 12C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36", "lang": "es-MX,es;q=0.9"},
    ],
    "RU": [  # Russia — Chrome Windows + Yandex Browser
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 YaBrowser/24.4.0.0 Safari/537.36", "lang": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "ru-RU,ru;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.5"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "ru-RU,ru;q=0.9"},
    ],
    "US": [  # United States — Chrome, Firefox, Safari
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-US,en;q=0.9"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "en-US,en;q=0.9"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "en-US,en;q=0.9"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-US,en;q=0.9"},
        {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1", "lang": "en-US,en;q=0.9"},
    ],
    "GB": [  # United Kingdom
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-GB,en;q=0.9,en-US;q=0.8"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "en-GB,en;q=0.9"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "en-GB,en;q=0.9,en-US;q=0.8"},
    ],
    "DE": [  # Germany — Firefox dominant, Chrome
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "de-DE,de;q=0.9,en;q=0.8"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "de-DE,de;q=0.9,en-US;q=0.8"},
    ],
    "FR": [  # France
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.5"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "fr-FR,fr;q=0.9,en;q=0.8"},
    ],
    "CA": [  # Canada
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "en-CA,en;q=0.9"},
    ],
    "BD": [  # Bangladesh — Chrome Android
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi 10C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 12; Samsung SM-A035F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.134 Mobile Safari/537.36", "lang": "bn-BD,bn;q=0.9,en;q=0.8"},
    ],
    "PK": [  # Pakistan
        {"ua": "Mozilla/5.0 (Linux; Android 13; TECNO KH7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36", "lang": "ur-PK,ur;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Linux; Android 13; Redmi 10A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36", "lang": "en-PK,en;q=0.9,ur;q=0.8"},
    ],
    "AR": [  # Argentina
        {"ua": "Mozilla/5.0 (Linux; Android 13; motorola moto g32) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "es-AR,es;q=0.9,en;q=0.8"},
    ],
    "CO": [  # Colombia
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A145M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36", "lang": "es-CO,es;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "es-CO,es;q=0.9,en;q=0.8"},
    ],
    "SG": [  # Singapore
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-SG,en-GB;q=0.9,en-US;q=0.8,zh-SG;q=0.7"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "en-SG,en;q=0.9"},
    ],
    "JP": [  # Japan
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15", "lang": "ja-JP,ja;q=0.9,en;q=0.8"},
    ],
    "KR": [  # South Korea
        {"ua": "Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36", "lang": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "ko-KR,ko;q=0.9,en;q=0.8"},
    ],
    "MY": [  # Malaysia
        {"ua": "Mozilla/5.0 (Linux; Android 13; OPPO A96) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "ms-MY,ms;q=0.9,en-MY;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-MY,en-GB;q=0.9,ms;q=0.8"},
    ],
    "NG": [  # Nigeria — Chrome Android
        {"ua": "Mozilla/5.0 (Linux; Android 13; TECNO LG7n) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36", "lang": "en-NG,en;q=0.9,yo;q=0.8"},
        {"ua": "Mozilla/5.0 (Linux; Android 12; Infinix X6816D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36", "lang": "en-NG,en-GB;q=0.9,en-US;q=0.8"},
    ],
    "EG": [  # Egypt
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A136B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "ar-EG,ar;q=0.9,en;q=0.8"},
    ],
    "NL": [  # Netherlands
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7"},
        {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "nl-NL,nl;q=0.9,en;q=0.8"},
    ],
    "PE": [  # Peru
        {"ua": "Mozilla/5.0 (Linux; Android 13; motorola moto g23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36", "lang": "es-PE,es;q=0.9,en-US;q=0.8,en;q=0.7"},
    ],
    "CL": [  # Chile
        {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A325M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36", "lang": "es-CL,es;q=0.9,en-US;q=0.8,en;q=0.7"},
    ],
    "EC": [  # Ecuador
        {"ua": "Mozilla/5.0 (Linux; Android 12; Redmi 9A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.193 Mobile Safari/537.36", "lang": "es-EC,es;q=0.9,en-US;q=0.8,en;q=0.7"},
    ],
    "GH": [  # Ghana
        {"ua": "Mozilla/5.0 (Linux; Android 12; TECNO Pop 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.60 Mobile Safari/537.36", "lang": "en-GH,en-GB;q=0.9,en-US;q=0.8,en;q=0.7"},
    ],
}

# Fallback for unknown countries
_DEFAULT_FINGERPRINTS = [
    {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-US,en;q=0.9"},
    {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "lang": "en-US,en;q=0.9"},
    {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0", "lang": "en-US,en;q=0.9"},
]

_REFERERS = [
    "https://www.tiktok.com/",
    "https://www.google.com/search?q=tiktok+downloader",
    "https://www.google.com/",
    "https://www.bing.com/search?q=tiktok",
    "https://t.co/",
    "https://www.tiktok.com/foryou",
    "https://www.tiktok.com/trending",
]


def get_bypass_headers(country: Optional[str] = None) -> dict:
    """
    Build a full 4-layer bypass header set:
    - UA matched to country's popular browser
    - Accept-Language matched to country
    - Referer rotated
    - Standard browser Accept/Encoding headers
    """
    pool = _FINGERPRINTS.get(country or "", _DEFAULT_FINGERPRINTS)
    fp = random.choice(pool)
    return {
        "User-Agent":      fp["ua"],
        "Accept-Language": fp["lang"],
        "Referer":         random.choice(_REFERERS),
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Connection":      "keep-alive",
        "Sec-Fetch-Dest":  "document",
        "Sec-Fetch-Mode":  "navigate",
        "Sec-Fetch-Site":  "cross-site",
        "Upgrade-Insecure-Requests": "1",
    }


async def random_delay():
    """Random 0.5–2.5 s delay to mimic human browsing."""
    await asyncio.sleep(random.uniform(0.5, 2.5))
