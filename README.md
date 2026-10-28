# Zulo

Schichtkalender mit Zuschlägen. Schichten eintragen, Zuschläge nach Tarif automatisch berechnen und sehen, was netto aufs Konto kommt.

**App öffnen:** https://elyasimpulslabs.github.io/Zulo/

## Was Zulo kann

* Schichten eintippen (zum Beispiel 1100 und 2200), Früh, Spät oder Nacht wird automatisch erkannt
* Zuschläge für Nacht, Samstag, Sonntag und Feiertage aller 16 Bundesländer
* Tarifvorlagen: Deutsche Bahn mit EVG oder GDL, TVöD, TV-L, Chemie, kein Tarif, eigene Werte
* Netto nach dem Lohnsteuer Ablaufplan 2026 und den Sozialversicherungswerten 2026, inklusive Gehaltsumwandlung (Firmenrad, Leasing)
* Zulagen aus dem Vormonat werden zum richtigen Zahltag eingerechnet
* Lohnabrechnung als PDF oder Foto einlesen (Texterkennung direkt auf dem Gerät), inklusive DB Abrechnungsformat und Summenprobe
* News zu Tarifverhandlungen von 13 Gewerkschaften

## Datenschutz

Schichten, Gehalt und Abrechnungen bleiben auf deinem Gerät. Die App lädt keine Schriften, Skripte oder Bilder von fremden Servern. Vom Server kommen nur die App selbst und die öffentliche Datei `news.json`.

## Als App installieren

* **Android (Chrome):** Seite öffnen, Menü, „App installieren“ oder „Zum Startbildschirm hinzufügen“
* **iPhone (Safari):** Seite öffnen, Teilen, „Zum Home Bildschirm“

Danach funktioniert Zulo auch ohne Internet.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Die komplette App |
| `news.json` | Aktuelle Tarifmeldungen, wird regelmäßig aktualisiert |
| `sw.js` | Offline Speicher |
| `manifest.webmanifest`, `icons/` | Installation als App |
| `lib/` | PDF Leser (pdf.js, Apache 2.0 Lizenz) |
| `lib/ocr/` | Texterkennung für Fotos (Tesseract, Apache 2.0 Lizenz), deutsches Sprachmodell |

Die berechneten Werte sind Schätzungen. Maßgeblich ist immer die eigene Lohnabrechnung.

## Rechte

© 2026 Elyas Saciri. Alle Rechte vorbehalten. Der Code ist einsehbar, darf aber ohne schriftliche Erlaubnis nicht kopiert, verändert oder weiterverwendet werden. Details in [LICENSE](LICENSE). Die Bibliotheken im Ordner `lib/` stehen unter ihren eigenen Lizenzen (Apache 2.0).
