# FERTON.uz — Avtoklav gazobeton zavodi sayti

Website for **FERTON**, an autoclaved aerated concrete (gazobeton) block plant in Toshloq district, Farg'ona region, Uzbekistan. The manufacturer is **"VODIY MARHABO" MCHJ**.

It is a static site with no build step: plain HTML, CSS and JS. It works on Netlify, GitHub Pages, or any web host.

## Languages

There are four languages: **UZ** (default), **RU**, **EN** and **TR**.
- The Uzbek text is written directly in `index.html`.
- The other three languages are in `assets/js/i18n.js`.
- The site remembers the chosen language. You can also link to a language directly, e.g. `?lang=ru`.

## Sections

| # | Section | Content |
|---|---|---|
| — | Hero | Positioning, call button, key specs (B2.5 / D500 / F35 / A1) |
| 01 | Afzalliklar | 6 benefits (strength, heat, weight, fire, frost, eco) |
| 02 | Mahsulot | Block sizes 600×300×100/150/200/250, use cases, blocks per m³ and m², spec table |
| 03 | Kalkulyator | Wall length/height/openings/thickness → blocks, m³, glue bags, weight, comparison with brick; "send request with this estimate" |
| 04 | Zavod | 4-step production process, factory photos |
| 05 | Sertifikat | Certificate of conformity № UZ.SMT-01-0010-59570 (valid to 15.07.2028), downloadable PDF, product label |
| 06 | Buyurtma | How to order (3 steps) |
| 07 | Savollar | FAQ |
| 08 | Aloqa | Phones, address, map, order form |

## Order form

The form uses **Netlify Forms** (`data-netlify="true"`):
- When the site is hosted on Netlify, requests appear in the Netlify dashboard under **Forms → order**.
- In the Netlify settings you can turn on email notifications for new requests.
- If the site is hosted elsewhere, the form shows an error message with the phone numbers. To fix that, connect another form handler (e.g. a Telegram bot or Formspree).

## Files

```
index.html                  page (Uzbek text + structure)
assets/css/style.css        styles
assets/js/i18n.js           RU / EN / TR translations
assets/js/main.js           language switch, calculator, form, navigation
assets/img/                 photos, block images, certificate preview, og.jpg, favicon
assets/docs/                certificate PDF
netlify.toml, robots.txt, sitemap.xml
```

To run locally: `python3 -m http.server` and open http://localhost:8000.

## Key product data (from the product label and the certificate)

- Density D500 · Strength B2.5 · Frost F35 · Fire A1 (non-combustible)
- λ = 0.12–0.14 W/(m·K), dry state
- Standard on the label: GOST 31360-2024. The certificate is issued to GOST 31360-2007.
- Certified grades: D500/B2.5/F35, D600/B1.5/F35, D600/B3.5/F35
- Address: Farg'ona viloyati, Toshloq tumani, Qanjirg'a MFY, Dasht ko'chasi, 387-uy
- 📞 90 707 50 00 · 99 119 50 00
