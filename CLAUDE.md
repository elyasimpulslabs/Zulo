# Hinweise für Claude

## Offline zuerst (gilt für diese und alle künftigen Apps)

Jede App muss sich **ohne Internet öffnen und vollständig benutzen lassen**, online wie offline.
Daten (Schichten, Lohnabrechnungen, Einstellungen) liegen sowieso auf dem Gerät, also darf
nichts davon vom Netz abhängen.

* Service Worker (`sw.js`) speichert beim ersten Öffnen alles, was die App braucht:
  Seite, Manifest, Symbole und alle Bibliotheken (`lib/`, auch PDF Leser und Texterkennung).
* App Start: erst Netz mit kurzer Wartezeit (3 s), danach der gespeicherte Stand.
  Schlechtes Netz darf den Start nicht blockieren.
* Nichts von fremden Servern laden (keine CDNs, keine Webfonts). Alles liegt im Repo.
* Online Inhalte (z. B. `news.json`) zusätzlich lokal merken und offline den letzten Stand zeigen.
* Bei jeder Änderung an `index.html` oder anderen gespeicherten Dateien `CACHE` in `sw.js`
  hochzählen, damit Nutzer die neue Version bekommen. Neue Dateien in `SHELL` oder `LIBS` eintragen.
