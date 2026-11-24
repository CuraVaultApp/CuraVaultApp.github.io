/* ==========================================================================
   CuraVault – Website Logic (Vanilla JS, no dependencies, no cookies)
   - i18n (DE / FR / IT / EN) with browser detection + localStorage
   - Mobile navigation
   - GitHub-native feature voting (#voting)
   ========================================================================== */
(function () {
  "use strict";

  var LANGS = ["de", "fr", "it", "en"];
  var DEFAULT_LANG = "de";
  var STORAGE_KEY = "curavault.lang";

  var REPO = "CuraVaultApp/CuraVaultApp.github.io";
  var API_URL = "https://api.github.com/repos/" + REPO + "/issues?labels=feature-request&state=all&per_page=50";
  var ISSUES_URL = "https://github.com/" + REPO + "/issues?q=is%3Aissue+label%3Afeature-request";
  var CACHE_KEY = "curavault.issues.v1";
  var CACHE_TTL = 10 * 60 * 1000; // 10 minutes (sessionStorage only)

  /* ------------------------------------------------------------------------
     Translations
     ------------------------------------------------------------------------ */
  var I18N = {
    de: {
      "meta.title": "CuraVault – Dein privater Finanz- & Dokumententresor, 100 % offline",
      "meta.description": "CuraVault ist dein privater Finanz- und Dokumententresor: AES-256-verschlüsselt, 100 % offline, ohne Cloud-Zwang und ohne Tracking. Swiss-QR, OCR und Multiwährung.",
      "a11y.skip": "Zum Inhalt springen",
      "a11y.menu": "Menü öffnen",
      "a11y.lang": "Sprache wählen",
      "nav.features": "Funktionen",
      "nav.storage": "Speicher & Sync",
      "nav.voting": "Feature-Voting",
      "nav.privacy": "Datenschutz",
      "nav.contact": "Kontakt",
      "hero.eyebrow": "Made in Switzerland · Offline-First",
      "hero.title": "Dein privater Finanz- & Dokumententresor – <span class=\"accent\">100 % offline.</span>",
      "hero.lead": "Belege scannen, Rechnungen verwalten, Kontoauszüge prüfen – alles verschlüsselt auf deinem Gerät. Keine Cloud, kein Konto, kein Tracking.",
      "badge.aes": "AES-256 lokal",
      "badge.cloud": "Kein Cloud-Zwang",
      "badge.tracking": "Kein Tracking",
      "badge.qr": "Swiss-QR & Multiwährung",
      "cta.play": "Bald auf Google Play",
      "cta.feature": "Feature wünschen",
      "features.kicker": "Funktionen",
      "features.title": "Alles, was du brauchst. Nichts, was dich ausspioniert.",
      "features.lead": "CuraVault vereint Dokumentenablage und Finanzübersicht – vollständig lokal und unter deiner Kontrolle.",
      "f1.title": "Verschlüsselter Tresor",
      "f1.text": "Alle Dokumente und Daten werden mit AES-256 lokal verschlüsselt und per Biometrie oder PIN geschützt.",
      "f2.title": "Swiss-QR & On-Device OCR",
      "f2.text": "QR-Rechnungen und Belege direkt scannen. Die Texterkennung läuft vollständig auf deinem Gerät.",
      "f3.title": "Multiwährungs-Kontoauszüge",
      "f3.text": "Kontoauszüge in CHF, EUR, USD und mehr importieren – mit automatischer Saldo-Prüfung.",
      "f4.title": "Händler-Gedächtnis & Budgets",
      "f4.text": "CuraVault lernt deine Händler und Kategorien lokal und hilft dir, Budgets im Blick zu behalten.",
      "f5.title": "Steuer-ZIP- & Notfall-Export",
      "f5.text": "Exportiere Unterlagen für die Steuererklärung oder den Notfall als ZIP. Kein Vendor-Lock-in.",
      "f6.title": "Lokale KI",
      "f6.text": "Optionales On-Device-Sprachmodell (SLM) für smarte Zusammenfassungen – ohne dass Daten das Gerät verlassen.",
      "beta": "BETA",
      "mock.alt": "CuraVault App-Vorschau",
      "mock.offline": "100 % Offline",
      "mock.search": "Belege & Volltext durchsuchen …",
      "mock.overview": "Monatsübersicht",
      "mock.checked": "Saldo ✓",
      "mock.recent": "Letzte Belege",
      "mock.item1": "Krankenkasse · Swiss-QR",
      "mock.meta1": "On-Device OCR · Bezahlt",
      "mock.item2": "Garantie · Laptop Pro",
      "mock.meta2": "Elektronik · 24M Garantie",
      "mock.item3": "Steuer-ZIP 2026",
      "mock.meta3": "42 Belege · 1-Klick-Export",
      "mock.tabs.label": "App-Ansicht wählen",
      "mock.tab.overview": "Übersicht",
      "mock.tab.statement": "Kontoauszug",
      "mock.tab.vault": "Tresor",
      "mock.st.title": "Privatkonto · CHF / EUR",
      "mock.st.verified": "Saldo geprüft ✓",
      "mock.st.sub": "PDF / CSV lokal importiert · 0 Abweichungen",
      "mock.st.tx": "Erkannte Buchungen",
      "mock.st.c1": "Lebensmittel · Händler gelernt",
      "mock.st.c2": "Mobilität · Beleg verknüpft",
      "mock.st.c3": "Elektronik · Garantie aktiv",
      "mock.v.title": "Lokaler Tresor",
      "mock.v.bio": "Biometrie ✓",
      "mock.v.count": "148 Dokumente",
      "mock.v.backup": "Backup: Verschlüsselt · Eigenes NAS",
      "mock.v.folders": "Tresor-Ordner",
      "mock.v.f1": "Steuern 2026",
      "mock.v.f1m": "42 Belege · Steuer-ZIP bereit",
      "mock.v.f2": "Garantiebelege",
      "mock.v.f2m": "18 Belege · Volltext-OCR",
      "mock.v.f3": "Notfall- & Backup-Export",
      "mock.v.f3m": "Lokal, NAS oder eigene Cloud",
      "why.kicker": "Warum CuraVault?",
      "storage.kicker": "Speicher & Sync",
      "storage.title": "Du entscheidest, wo deine Daten liegen",
      "storage.lead": "Vom komplett isolierten Smartphone-Tresor bis zum direkten Synology- & QNAP-NAS-Sync – immer ohne CuraVault-Server.",
      "st1.badge": "Standard",
      "st1.title": "100 % Lokal",
      "st1.text": "Alle Daten und Belege bleiben ausschliesslich AES-256-verschlüsselt auf deinem Smartphone. Keine Internetverbindung nötig.",
      "st2.badge": "Kein Lock-in",
      "st2.title": "Manuelles Backup & Notfall-ZIP",
      "st2.text": "Jederzeit lokale, verschlüsselte Backups erstellen oder alle Belege als offenes Steuer-/Notfall-ZIP exportieren – null Vendor-Lock-in.",
      "st3.badge": "SMB & WebDAV",
      "st3.title": "Eigenes NAS / Private Cloud (Synology, QNAP, Nextcloud)",
      "st3.text": "Direkte Dokumenten-Synchronisation mit deinem eigenen Heimserver (z. B. QNAP, Synology, Nextcloud) im Heimnetzwerk oder per WebDAV – ohne Drittanbieter-Cloud.",
      "st4.badge": "Optional",
      "st4.title": "Eigene öffentliche Cloud (Google Drive & OneDrive)",
      "st4.text": "Optionaler direkter Abgleich mit deinem eigenen Google-Drive- oder Microsoft-OneDrive-Konto – verschlüsselt und ohne CuraVault-Zwischenserver.",
      "why.lead": "Entwickelt für alle, die Ordnung in Belegen und Finanzen wollen – ohne IT-Bastelei und ohne fremde Cloud.",
      "why1.tag": "Kein Server nötig",
      "why1.title": "Die einfache Alternative zu Paperless-ngx – ohne eigenen Server oder Docker",
      "why1.text": "Du willst die Kontrolle und Volltextsuche eines privaten Dokumentenarchivs, aber weder NAS noch Docker-Container warten? CuraVault läuft direkt auf deinem Smartphone – sofort startklar, lokal verschlüsselt und ohne laufende Serverkosten.",
      "why1.b1": "Kein Heimserver, kein Docker, kein VPN-Setup",
      "why1.b2": "On-Device OCR & lokale AES-256-Datenbank direkt am Handy",
      "why1.b3": "Jederzeit als verschlüsseltes Backup oder ZIP exportierbar",
      "why2.tag": "100 % Offline-Scan",
      "why2.title": "Belege scannen ohne Cloud-Zwang (Alternative zu Adobe Scan & Genius Scan)",
      "why2.text": "Viele Scanner-Apps verlangen ein Benutzerkonto oder laden deine Belege für OCR in eine Cloud. Bei CuraVault bleiben Rechnungen, Arztbelege und Kontoauszüge auf deinem Gerät – Texterkennung und Swiss-QR-Auslesung arbeiten komplett offline. Und bei Geräteverlust bist du abgesichert: Verschlüsselte Backups lassen sich jederzeit lokal, auf dein eigenes NAS oder in deine eigene Cloud sichern – ganz ohne CuraVault-Server.",
      "why2.b1": "Keine Anmeldung, kein Zwangs-Abo, keine Cloud-Speicherung",
      "why2.b2": "Lokale OCR-Texterkennung & Swiss-QR direkt auf dem Gerät",
      "why2.b3": "Verschlüsselte Backups lokal, auf eigenes NAS oder eigene Cloud",
      "why3.tag": "Alltag & Steuern",
      "why3.title": "Steuererklärung, Garantiebelege & Kassenzettel digitalisieren",
      "why3.text": "Statt Schuhkarton und verblasster Thermopapiere findest du jeden Beleg in Sekunden per Volltextsuche. Für die Steuererklärung stellst du alle relevanten Dokumente mit einem Klick als übersichtliches Steuer-ZIP zusammen.",
      "why3.b1": "Sekundenschnelle Volltextsuche über alle gescannten Belege",
      "why3.b2": "1-Klick-Steuer-ZIP-Export & Notfall-Export ohne Vendor-Lock-in",
      "why3.b3": "Garantiebelege, Kassenzettel & Kontoauszüge an einem Ort",
      "voting.kicker": "Community",
      "voting.title": "Live-Feature-Voting",
      "voting.lead": "Du bestimmst mit, was als Nächstes kommt. Stimme mit 👍 auf GitHub ab oder reiche deine eigene Idee ein.",
      "voting.submit": "Idee auf GitHub einreichen",
      "voting.email": "Per E-Mail vorschlagen",
      "voting.hint": "Für die Abstimmung auf GitHub ist ein kostenloses GitHub-Konto nötig. Ohne Konto kannst du uns deine Idee jederzeit per E-Mail senden.",
      "voting.filters": "Status filtern",
      "filter.all": "Alle",
      "filter.open": "Offen",
      "filter.planned": "Geplant",
      "filter.in-progress": "In Arbeit",
      "filter.released": "Umgesetzt",
      "status.open": "Offen",
      "status.planned": "Geplant",
      "status.in-progress": "In Arbeit",
      "status.released": "Umgesetzt",
      "status.closed": "Geschlossen",
      "voting.vote": "Abstimmen (👍)",
      "voting.votes": "Stimmen",
      "voting.comments": "Kommentare",
      "voting.nopreview": "Keine Beschreibung vorhanden.",
      "voting.loading": "Wünsche werden von GitHub geladen …",
      "voting.empty.title": "Noch keine Wünsche in dieser Kategorie",
      "voting.empty.text": "Sei die erste Person und reiche eine Idee ein – jede Stimme zählt.",
      "voting.rate.title": "GitHub-Abfragelimit erreicht",
      "voting.rate.text": "Die GitHub-API erlaubt nur eine begrenzte Anzahl anonymer Abfragen pro Stunde. Bitte versuche es später erneut oder sieh dir die Wünsche direkt auf GitHub an.",
      "voting.error.title": "Wünsche konnten nicht geladen werden",
      "voting.error.text": "Möglicherweise besteht keine Verbindung zu GitHub. Du kannst alle Wünsche direkt auf GitHub ansehen.",
      "voting.retry": "Erneut versuchen",
      "voting.open_github": "Auf GitHub ansehen",
      "voting.noscript": "Für die Live-Liste wird JavaScript benötigt. Alle Wünsche findest du auch direkt auf GitHub.",
      "privacy.kicker": "Datenschutz",
      "privacy.title": "Privatsphäre ist kein Feature. Sie ist das Fundament.",
      "privacy.lead": "CuraVault ist so gebaut, dass wir deine Daten gar nicht sehen können – selbst wenn wir wollten.",
      "p1.title": "Alles bleibt auf deinem Gerät",
      "p1.text": "Dokumente, OCR-Texte und Kontoauszüge werden lokal mit AES-256 verschlüsselt gespeichert.",
      "p2.title": "Keine Server, volle Backup-Freiheit",
      "p2.text": "Keine Registrierung, keine CuraVault-Server. Bei Geräteverlust bist du trotzdem abgesichert: Verschlüsselte Backups lassen sich jederzeit lokal, auf dein eigenes NAS (SMB/WebDAV) oder in dein eigenes Google Drive bzw. OneDrive sichern.",
      "p3.title": "Kein Tracking, keine Werbung",
      "p3.text": "Keine Analyse-SDKs, keine Werbe-IDs, keine Cookies – weder in der App noch auf dieser Website.",
      "p4.title": "Lokale KI ohne „Nach-Hause-Telefonieren“",
      "p4.text": "Die optionale On-Device-KI (z. B. Qwen 2.5) ist kein KI-Agent und hat weder Netzwerk-, Terminal- noch Tool-Zugriff. Nach dem einmaligen Download läuft sie komplett isoliert in der lokalen Sandbox.",
      "faq.title": "Häufige Fragen zu Offline-Betrieb, NAS-Sync & lokaler KI",
      "faq1.q": "Kann die optionale lokale KI (z. B. Qwen 2.5) nach Hause telefonieren?",
      "faq1.a": "Nein. Das On-Device-Sprachmodell ist kein KI-Agent und besitzt weder Netzwerk-, Terminal- noch Tool-Zugriff. Nach dem optionalen, einmaligen Modell-Download läuft die Textverarbeitung vollständig isoliert in der lokalen App-Sandbox ohne ausgehende Verbindungen – ein „Nach-Hause-Telefonieren“ ist technisch ausgeschlossen.",
      "faq2.q": "Funktioniert CuraVault mit Synology- & QNAP-NAS (SMB / WebDAV)?",
      "faq2.a": "Ja. Du kannst deine verschlüsselten Dokumente direkt über SMB im Heimnetzwerk oder über WebDAV mit deinem eigenen NAS (z. B. Synology, QNAP oder Nextcloud) synchronisieren – ganz ohne Docker-Container und ohne fremde Cloud.",
      "faq3.q": "Was passiert, wenn mein Smartphone verloren geht oder kaputt ist?",
      "faq3.a": "Du bist nicht an ein einzelnes Gerät gebunden: Erstelle jederzeit verschlüsselte Backups lokal, auf deinem eigenen NAS oder synchronisiere verschlüsselt über dein eigenes Google Drive oder Microsoft OneDrive – ohne CuraVault-Zwischenserver.",
      "privacy.link": "Vollständige Datenschutzerklärung lesen",
      "footer.title": "Kontakt",
      "footer.text": "Fragen, Feedback oder Ideen? Schreib uns – wir antworten persönlich.",
      "footer.location": "Entwickelt mit Sorgfalt in der Schweiz 🇨🇭",
      "footer.nav": "Navigation",
      "footer.legal": "Rechtliches",
      "footer.privacy": "Datenschutzerklärung",
      "footer.terms": "Nutzungsbedingungen & Impressum",
      "footer.github": "GitHub-Repository",
      "footer.nocookies": "Diese Website verwendet keine Cookies und kein Tracking.",
      "footer.rights": "Alle Rechte vorbehalten.",
      "legal.back": "Zurück zur Startseite",
      "nf.title": "Seite nicht gefunden",
      "nf.text": "Diese Seite existiert nicht oder wurde verschoben. Deine Daten sind trotzdem sicher – sie sind ja auf deinem Gerät.",
      "nf.back": "Zur Startseite"
    },

    fr: {
      "meta.title": "CuraVault – Ton coffre-fort privé pour finances et documents, 100 % hors ligne",
      "meta.description": "CuraVault est ton coffre-fort privé pour tes finances et documents : chiffré AES-256, 100 % hors ligne, sans cloud obligatoire ni pistage. QR-facture suisse, OCR et multidevise.",
      "a11y.skip": "Aller au contenu",
      "a11y.menu": "Ouvrir le menu",
      "a11y.lang": "Choisir la langue",
      "nav.features": "Fonctions",
      "nav.storage": "Stockage & Sync",
      "nav.voting": "Vote des idées",
      "nav.privacy": "Confidentialité",
      "nav.contact": "Contact",
      "hero.eyebrow": "Made in Switzerland · Offline-First",
      "hero.title": "Ton coffre-fort privé pour finances & documents – <span class=\"accent\">100 % hors ligne.</span>",
      "hero.lead": "Numérise tes justificatifs, gère tes factures, vérifie tes relevés – tout est chiffré sur ton appareil. Pas de cloud, pas de compte, pas de pistage.",
      "badge.aes": "AES-256 en local",
      "badge.cloud": "Sans cloud obligatoire",
      "badge.tracking": "Aucun pistage",
      "badge.qr": "QR-facture suisse & multidevise",
      "cta.play": "Bientôt sur Google Play",
      "cta.feature": "Proposer une fonction",
      "features.kicker": "Fonctions",
      "features.title": "Tout ce dont tu as besoin. Rien qui t'espionne.",
      "features.lead": "CuraVault réunit classement de documents et vue d'ensemble financière – entièrement en local et sous ton contrôle.",
      "f1.title": "Coffre-fort chiffré",
      "f1.text": "Tous les documents et données sont chiffrés localement en AES-256 et protégés par biométrie ou code PIN.",
      "f2.title": "QR-facture suisse & OCR sur l'appareil",
      "f2.text": "Scanne directement QR-factures et justificatifs. La reconnaissance de texte s'exécute entièrement sur ton appareil.",
      "f3.title": "Relevés multidevises",
      "f3.text": "Importe des relevés en CHF, EUR, USD et plus – avec vérification automatique du solde.",
      "f4.title": "Mémoire des commerçants & budgets",
      "f4.text": "CuraVault apprend localement tes commerçants et catégories et t'aide à garder un œil sur tes budgets.",
      "f5.title": "Export ZIP fiscal & d'urgence",
      "f5.text": "Exporte tes documents pour la déclaration d'impôts ou en cas d'urgence au format ZIP. Aucun verrouillage propriétaire.",
      "f6.title": "IA locale",
      "f6.text": "Modèle de langage optionnel sur l'appareil (SLM) pour des résumés intelligents – sans que tes données ne quittent l'appareil.",
      "beta": "BÊTA",
      "mock.alt": "Aperçu de l'application CuraVault",
      "mock.offline": "100 % Hors ligne",
      "mock.search": "Rechercher justificatifs & texte …",
      "mock.overview": "Vue mensuelle",
      "mock.checked": "Solde ✓",
      "mock.recent": "Derniers justificatifs",
      "mock.item1": "Assurance maladie · QR suisse",
      "mock.meta1": "OCR sur l'appareil · Payée",
      "mock.item2": "Garantie · Laptop Pro",
      "mock.meta2": "Électronique · Garantie 24M",
      "mock.item3": "ZIP fiscal 2026",
      "mock.meta3": "42 pièces · Export en 1 clic",
      "mock.tabs.label": "Choisir la vue de l'app",
      "mock.tab.overview": "Aperçu",
      "mock.tab.statement": "Relevé",
      "mock.tab.vault": "Coffre",
      "mock.st.title": "Compte privé · CHF / EUR",
      "mock.st.verified": "Solde vérifié ✓",
      "mock.st.sub": "PDF / CSV importé en local · 0 écart",
      "mock.st.tx": "Opérations reconnues",
      "mock.st.c1": "Alimentation · Commerçant appris",
      "mock.st.c2": "Mobilité · Justificatif lié",
      "mock.st.c3": "Électronique · Garantie active",
      "mock.v.title": "Coffre local",
      "mock.v.bio": "Biométrie ✓",
      "mock.v.count": "148 documents",
      "mock.v.backup": "Sauvegarde : chiffrée · NAS perso",
      "mock.v.folders": "Dossiers du coffre",
      "mock.v.f1": "Impôts 2026",
      "mock.v.f1m": "42 pièces · ZIP fiscal prêt",
      "mock.v.f2": "Garanties",
      "mock.v.f2m": "18 pièces · OCR plein texte",
      "mock.v.f3": "Export d'urgence & sauvegarde",
      "mock.v.f3m": "Local, NAS ou ton propre cloud",
      "why.kicker": "Pourquoi CuraVault ?",
      "storage.kicker": "Stockage & Sync",
      "storage.title": "Tu décides où sont stockées tes données",
      "storage.lead": "Du coffre-fort 100 % isolé sur smartphone à la synchronisation directe avec ton NAS Synology ou QNAP – toujours sans serveur CuraVault.",
      "st1.badge": "Par défaut",
      "st1.title": "100 % Local",
      "st1.text": "Toutes tes données et pièces justificatives restent chiffrées en AES-256 uniquement sur ton smartphone. Aucune connexion Internet requise.",
      "st2.badge": "Sans lock-in",
      "st2.title": "Sauvegarde manuelle & ZIP d'urgence",
      "st2.text": "Crée à tout moment des sauvegardes locales chiffrées ou exporte tous tes justificatifs en ZIP fiscal/d'urgence ouvert – zéro verrouillage propriétaire.",
      "st3.badge": "SMB & WebDAV",
      "st3.title": "Ton propre NAS / Cloud privé (Synology, QNAP, Nextcloud)",
      "st3.text": "Synchronisation directe des documents avec ton serveur domestique (p. ex. QNAP, Synology, Nextcloud) sur le réseau local ou via WebDAV – sans cloud tiers.",
      "st4.badge": "Optionnel",
      "st4.title": "Ton propre cloud public (Google Drive & OneDrive)",
      "st4.text": "Synchronisation directe et chiffrée avec ton propre compte Google Drive ou Microsoft OneDrive – sans aucun serveur intermédiaire CuraVault.",
      "why.lead": "Pensé pour celles et ceux qui veulent des documents et finances en ordre – sans bricolage serveur ni cloud tiers.",
      "why1.tag": "Sans serveur",
      "why1.title": "L'alternative simple à Paperless-ngx – sans serveur personnel ni Docker",
      "why1.text": "Tu veux le contrôle et la recherche plein texte d'une archive privée, sans maintenir de NAS ni de conteneurs Docker ? CuraVault fonctionne directement sur ton smartphone – prêt immédiatement, chiffré en local et sans frais de serveur.",
      "why1.b1": "Aucun serveur domestique, aucun Docker, aucun VPN à configurer",
      "why1.b2": "OCR sur l'appareil et base AES-256 locale directement sur le téléphone",
      "why1.b3": "Exportable à tout moment en sauvegarde chiffrée ou en ZIP",
      "why2.tag": "Scan 100 % hors ligne",
      "why2.title": "Numériser ses justificatifs sans cloud obligatoire (alternative à Adobe Scan & Genius Scan)",
      "why2.text": "De nombreuses apps de scan exigent un compte ou envoient tes justificatifs dans le cloud pour l'OCR. Avec CuraVault, factures, justificatifs médicaux et relevés restent sur ton appareil – OCR et QR-facture suisse fonctionnent totalement hors ligne. Et en cas de perte de l'appareil, tu es protégé : tu peux enregistrer des sauvegardes chiffrées en local, sur ton propre NAS ou dans ton propre cloud – sans aucun serveur CuraVault.",
      "why2.b1": "Aucune inscription, aucun abonnement forcé, aucun stockage cloud",
      "why2.b2": "Reconnaissance OCR locale & QR-facture suisse sur l'appareil",
      "why2.b3": "Sauvegardes chiffrées en local, sur ton NAS ou ton propre cloud",
      "why3.tag": "Quotidien & impôts",
      "why3.title": "Déclaration d'impôts, garanties & tickets de caisse maîtrisés",
      "why3.text": "Fini les boîtes à chaussures et les tickets décolorés : retrouve chaque pièce en quelques secondes par recherche plein texte. Pour la déclaration d'impôts, rassemble tous tes justificatifs en un clic dans un ZIP fiscal clair.",
      "why3.b1": "Recherche plein texte instantanée sur tous les justificatifs scannés",
      "why3.b2": "Export ZIP fiscal en 1 clic & export d'urgence sans verrouillage",
      "why3.b3": "Garanties, tickets de caisse & relevés bancaires réunis au même endroit",
      "voting.kicker": "Communauté",
      "voting.title": "Vote des idées en direct",
      "voting.lead": "Tu décides de la suite. Vote avec 👍 sur GitHub ou propose ta propre idée.",
      "voting.submit": "Proposer une idée sur GitHub",
      "voting.email": "Proposer par e-mail",
      "voting.hint": "Un compte GitHub gratuit est nécessaire pour voter sur GitHub. Sans compte, tu peux nous envoyer ton idée par e-mail à tout moment.",
      "voting.filters": "Filtrer par statut",
      "filter.all": "Toutes",
      "filter.open": "Ouvertes",
      "filter.planned": "Prévues",
      "filter.in-progress": "En cours",
      "filter.released": "Réalisées",
      "status.open": "Ouverte",
      "status.planned": "Prévue",
      "status.in-progress": "En cours",
      "status.released": "Réalisée",
      "status.closed": "Fermée",
      "voting.vote": "Voter (👍)",
      "voting.votes": "votes",
      "voting.comments": "commentaires",
      "voting.nopreview": "Aucune description disponible.",
      "voting.loading": "Chargement des idées depuis GitHub …",
      "voting.empty.title": "Aucune idée dans cette catégorie pour l'instant",
      "voting.empty.text": "Sois la première personne à proposer une idée – chaque voix compte.",
      "voting.rate.title": "Limite de requêtes GitHub atteinte",
      "voting.rate.text": "L'API GitHub n'autorise qu'un nombre limité de requêtes anonymes par heure. Réessaie plus tard ou consulte les idées directement sur GitHub.",
      "voting.error.title": "Impossible de charger les idées",
      "voting.error.text": "La connexion à GitHub semble indisponible. Tu peux consulter toutes les idées directement sur GitHub.",
      "voting.retry": "Réessayer",
      "voting.open_github": "Voir sur GitHub",
      "voting.noscript": "JavaScript est nécessaire pour la liste en direct. Toutes les idées sont aussi disponibles sur GitHub.",
      "privacy.kicker": "Confidentialité",
      "privacy.title": "La confidentialité n'est pas une option. C'est la fondation.",
      "privacy.lead": "CuraVault est conçu de manière à ce que nous ne puissions pas voir tes données – même si nous le voulions.",
      "p1.title": "Tout reste sur ton appareil",
      "p1.text": "Documents, textes OCR et relevés sont stockés localement et chiffrés en AES-256.",
      "p2.title": "Aucun serveur, sauvegarde libre",
      "p2.text": "Aucune inscription, aucun serveur CuraVault. En cas de perte de l'appareil, tu restes protégé : sauvegarde à tout moment en version chiffrée en local, sur ton propre NAS (SMB/WebDAV) ou sur ton Google Drive ou OneDrive.",
      "p3.title": "Aucun pistage, aucune publicité",
      "p3.text": "Aucun SDK d'analyse, aucun identifiant publicitaire, aucun cookie – ni dans l'app ni sur ce site.",
      "p4.title": "IA locale sans « appel à la maison »",
      "p4.text": "L'IA locale optionnelle (p. ex. Qwen 2.5) n'est pas un agent IA et n'a aucun accès réseau, terminal ou outil. Après le téléchargement unique, elle fonctionne totalement isolée dans la sandbox locale.",
      "faq.title": "Questions fréquentes sur le mode hors ligne, la sync NAS & l'IA locale",
      "faq1.q": "L'IA locale optionnelle (p. ex. Qwen 2.5) peut-elle envoyer des données à distance ?",
      "faq1.a": "Non. Le modèle de langage sur l'appareil n'est pas un agent IA et ne dispose d'aucun accès réseau, terminal ou outil. Après le téléchargement unique et facultatif du modèle, le traitement s'exécute totalement isolé dans la sandbox locale sans connexion sortante.",
      "faq2.q": "CuraVault fonctionne-t-il avec un NAS Synology ou QNAP (SMB / WebDAV) ?",
      "faq2.a": "Oui. Tu peux synchroniser tes documents chiffrés directement via SMB sur ton réseau domestique ou via WebDAV avec ton propre NAS (Synology, QNAP, Nextcloud) – sans Docker et sans cloud tiers.",
      "faq3.q": "Que se passe-t-il si mon smartphone est perdu ou cassé ?",
      "faq3.a": "Tu n'es pas dépendant d'un seul appareil : crée à tout moment des sauvegardes chiffrées en local, sur ton propre NAS ou synchronise de manière chiffrée via ton propre Google Drive ou Microsoft OneDrive – sans serveur CuraVault.",
      "privacy.link": "Lire la politique de confidentialité complète",
      "footer.title": "Contact",
      "footer.text": "Questions, retours ou idées ? Écris-nous – nous répondons personnellement.",
      "footer.location": "Développé avec soin en Suisse 🇨🇭",
      "footer.nav": "Navigation",
      "footer.legal": "Mentions légales",
      "footer.privacy": "Politique de confidentialité",
      "footer.terms": "Conditions d'utilisation & Mentions légales",
      "footer.github": "Dépôt GitHub",
      "footer.nocookies": "Ce site n'utilise ni cookies ni pistage.",
      "footer.rights": "Tous droits réservés.",
      "legal.back": "Retour à l'accueil",
      "nf.title": "Page introuvable",
      "nf.text": "Cette page n'existe pas ou a été déplacée. Tes données restent en sécurité – elles sont sur ton appareil.",
      "nf.back": "Retour à l'accueil"
    },

    it: {
      "meta.title": "CuraVault – La tua cassaforte privata per finanze e documenti, 100 % offline",
      "meta.description": "CuraVault è la tua cassaforte privata per finanze e documenti: crittografia AES-256, 100 % offline, senza cloud obbligatorio e senza tracciamento. QR-fattura svizzera, OCR e multivaluta.",
      "a11y.skip": "Vai al contenuto",
      "a11y.menu": "Apri il menu",
      "a11y.lang": "Scegli la lingua",
      "nav.features": "Funzioni",
      "nav.storage": "Archiviazione & Sync",
      "nav.voting": "Votazione idee",
      "nav.privacy": "Privacy",
      "nav.contact": "Contatto",
      "hero.eyebrow": "Made in Switzerland · Offline-First",
      "hero.title": "La tua cassaforte privata per finanze & documenti – <span class=\"accent\">100 % offline.</span>",
      "hero.lead": "Scansiona ricevute, gestisci fatture, verifica estratti conto – tutto crittografato sul tuo dispositivo. Niente cloud, niente account, niente tracciamento.",
      "badge.aes": "AES-256 in locale",
      "badge.cloud": "Nessun cloud obbligatorio",
      "badge.tracking": "Nessun tracciamento",
      "badge.qr": "QR-fattura svizzera & multivaluta",
      "cta.play": "Presto su Google Play",
      "cta.feature": "Suggerisci una funzione",
      "features.kicker": "Funzioni",
      "features.title": "Tutto ciò che ti serve. Niente che ti spii.",
      "features.lead": "CuraVault unisce archivio documenti e panoramica finanziaria – interamente in locale e sotto il tuo controllo.",
      "f1.title": "Cassaforte crittografata",
      "f1.text": "Tutti i documenti e i dati vengono crittografati localmente con AES-256 e protetti tramite biometria o PIN.",
      "f2.title": "QR-fattura svizzera & OCR sul dispositivo",
      "f2.text": "Scansiona direttamente QR-fatture e ricevute. Il riconoscimento del testo avviene interamente sul tuo dispositivo.",
      "f3.title": "Estratti conto multivaluta",
      "f3.text": "Importa estratti conto in CHF, EUR, USD e altre valute – con verifica automatica del saldo.",
      "f4.title": "Memoria esercenti & budget",
      "f4.text": "CuraVault impara localmente i tuoi esercenti e le categorie e ti aiuta a tenere sotto controllo i budget.",
      "f5.title": "Export ZIP fiscale & di emergenza",
      "f5.text": "Esporta i documenti per la dichiarazione dei redditi o per le emergenze in formato ZIP. Nessun vendor lock-in.",
      "f6.title": "IA locale",
      "f6.text": "Modello linguistico opzionale sul dispositivo (SLM) per riassunti intelligenti – senza che i dati lascino il dispositivo.",
      "beta": "BETA",
      "mock.alt": "Anteprima dell'app CuraVault",
      "mock.offline": "100 % Offline",
      "mock.search": "Cerca ricevute e testo completo …",
      "mock.overview": "Riepilogo mensile",
      "mock.checked": "Saldo ✓",
      "mock.recent": "Ultime ricevute",
      "mock.item1": "Cassa malati · QR svizzero",
      "mock.meta1": "OCR sul dispositivo · Pagata",
      "mock.item2": "Garanzia · Laptop Pro",
      "mock.meta2": "Elettronica · Garanzia 24M",
      "mock.item3": "ZIP fiscale 2026",
      "mock.meta3": "42 documenti · Export 1 clic",
      "mock.tabs.label": "Scegli vista app",
      "mock.tab.overview": "Panoramica",
      "mock.tab.statement": "Estratto conto",
      "mock.tab.vault": "Cassaforte",
      "mock.st.title": "Conto privato · CHF / EUR",
      "mock.st.verified": "Saldo verificato ✓",
      "mock.st.sub": "PDF / CSV importato in locale · 0 scarti",
      "mock.st.tx": "Movimenti riconosciuti",
      "mock.st.c1": "Alimentari · Esercente appreso",
      "mock.st.c2": "Mobilità · Ricevuta collegata",
      "mock.st.c3": "Elettronica · Garanzia attiva",
      "mock.v.title": "Cassaforte locale",
      "mock.v.bio": "Biometria ✓",
      "mock.v.count": "148 documenti",
      "mock.v.backup": "Backup: crittografato · NAS personale",
      "mock.v.folders": "Cartelle cassaforte",
      "mock.v.f1": "Tasse 2026",
      "mock.v.f1m": "42 ricevute · ZIP fiscale pronto",
      "mock.v.f2": "Garanzie",
      "mock.v.f2m": "18 ricevute · OCR full-text",
      "mock.v.f3": "Export di emergenza & backup",
      "mock.v.f3m": "Locale, NAS o il tuo cloud",
      "why.kicker": "Perché CuraVault?",
      "storage.kicker": "Archiviazione & Sync",
      "storage.title": "Decidi tu dove risiedono i tuoi dati",
      "storage.lead": "Dalla cassaforte 100 % isolata sullo smartphone fino alla sincronizzazione diretta con NAS Synology & QNAP – sempre senza server CuraVault.",
      "st1.badge": "Predefinito",
      "st1.title": "100 % Locale",
      "st1.text": "Tutti i dati e le ricevute restano crittografati con AES-256 esclusivamente sul tuo smartphone. Nessuna connessione Internet richiesta.",
      "st2.badge": "Nessun lock-in",
      "st2.title": "Backup manuale & ZIP di emergenza",
      "st2.text": "Crea in qualsiasi momento backup locali crittografati o esporta tutti i documenti come ZIP fiscale/di emergenza aperto – zero vendor lock-in.",
      "st3.badge": "SMB & WebDAV",
      "st3.title": "NAS personale / Cloud privato (Synology, QNAP, Nextcloud)",
      "st3.text": "Sincronizzazione diretta dei documenti con il tuo server domestico (es. QNAP, Synology, Nextcloud) in rete locale o via WebDAV – senza cloud di terzi.",
      "st4.badge": "Opzionale",
      "st4.title": "Il tuo cloud pubblico (Google Drive & OneDrive)",
      "st4.text": "Sincronizzazione diretta e crittografata con il tuo account Google Drive o Microsoft OneDrive – senza alcun server intermedio CuraVault.",
      "why.lead": "Progettata per chi vuole ordine tra documenti e finanze – senza gestione server e senza cloud esterni.",
      "why1.tag": "Nessun server",
      "why1.title": "L'alternativa semplice a Paperless-ngx – senza server proprio né Docker",
      "why1.text": "Vuoi il controllo e la ricerca full-text di un archivio privato senza dover gestire un NAS o container Docker? CuraVault gira direttamente sul tuo smartphone – subito pronta, crittografata in locale e senza costi di server.",
      "why1.b1": "Nessun server domestico, nessun Docker, nessuna configurazione VPN",
      "why1.b2": "OCR sul dispositivo e database locale AES-256 direttamente sul telefono",
      "why1.b3": "Esportabile in qualsiasi momento come backup crittografato o ZIP",
      "why2.tag": "Scansione 100 % offline",
      "why2.title": "Scansionare ricevute senza cloud obbligatorio (alternativa ad Adobe Scan & Genius Scan)",
      "why2.text": "Molte app di scansione richiedono un account o caricano i documenti nel cloud per l'OCR. Con CuraVault fatture, spese mediche ed estratti conto restano sul dispositivo – OCR e lettura QR-fattura svizzera funzionano completamente offline. E in caso di smarrimento del dispositivo sei al sicuro: puoi salvare backup crittografati in locale, sul tuo NAS o sul tuo cloud personale – senza alcun server CuraVault.",
      "why2.b1": "Nessuna registrazione, nessun abbonamento forzato, nessun cloud",
      "why2.b2": "Riconoscimento OCR locale & QR-fattura svizzera sul dispositivo",
      "why2.b3": "Backup crittografati in locale, sul tuo NAS o sul tuo cloud",
      "why3.tag": "Quotidiano & tasse",
      "why3.title": "Dichiarazione dei redditi, garanzie & scontrini sotto controllo",
      "why3.text": "Basta scatole di scarpe e scontrini sbiaditi: trovi ogni documento in pochi secondi con la ricerca full-text. Per le imposte raccogli tutti i giustificativi in un clic in un pratico ZIP fiscale.",
      "why3.b1": "Ricerca full-text istantanea su tutte le ricevute scansionate",
      "why3.b2": "Export ZIP fiscale in 1 clic & export di emergenza senza lock-in",
      "why3.b3": "Garanzie, scontrini ed estratti conto in un unico posto",
      "voting.kicker": "Community",
      "voting.title": "Votazione idee in tempo reale",
      "voting.lead": "Decidi tu cosa arriverà dopo. Vota con 👍 su GitHub o proponi la tua idea.",
      "voting.submit": "Proponi un'idea su GitHub",
      "voting.email": "Proponi via e-mail",
      "voting.hint": "Per votare su GitHub serve un account GitHub gratuito. Senza account puoi inviarci la tua idea via e-mail in qualsiasi momento.",
      "voting.filters": "Filtra per stato",
      "filter.all": "Tutte",
      "filter.open": "Aperte",
      "filter.planned": "Pianificate",
      "filter.in-progress": "In corso",
      "filter.released": "Realizzate",
      "status.open": "Aperta",
      "status.planned": "Pianificata",
      "status.in-progress": "In corso",
      "status.released": "Realizzata",
      "status.closed": "Chiusa",
      "voting.vote": "Vota (👍)",
      "voting.votes": "voti",
      "voting.comments": "commenti",
      "voting.nopreview": "Nessuna descrizione disponibile.",
      "voting.loading": "Caricamento delle idee da GitHub …",
      "voting.empty.title": "Ancora nessuna idea in questa categoria",
      "voting.empty.text": "Sii la prima persona a proporre un'idea – ogni voto conta.",
      "voting.rate.title": "Limite di richieste GitHub raggiunto",
      "voting.rate.text": "L'API di GitHub consente solo un numero limitato di richieste anonime all'ora. Riprova più tardi o consulta le idee direttamente su GitHub.",
      "voting.error.title": "Impossibile caricare le idee",
      "voting.error.text": "La connessione a GitHub sembra non disponibile. Puoi consultare tutte le idee direttamente su GitHub.",
      "voting.retry": "Riprova",
      "voting.open_github": "Vedi su GitHub",
      "voting.noscript": "Per l'elenco in tempo reale è necessario JavaScript. Tutte le idee sono disponibili anche su GitHub.",
      "privacy.kicker": "Privacy",
      "privacy.title": "La privacy non è una funzione. È il fondamento.",
      "privacy.lead": "CuraVault è progettata in modo che non possiamo vedere i tuoi dati – nemmeno se volessimo.",
      "p1.title": "Tutto resta sul tuo dispositivo",
      "p1.text": "Documenti, testi OCR ed estratti conto sono salvati localmente e crittografati con AES-256.",
      "p2.title": "Nessun server, backup libero",
      "p2.text": "Nessuna registrazione, nessun server CuraVault. In caso di smarrimento del dispositivo resti comunque al sicuro: salva backup crittografati in locale, sul tuo NAS (SMB/WebDAV) o sul tuo Google Drive o OneDrive.",
      "p3.title": "Nessun tracciamento, nessuna pubblicità",
      "p3.text": "Nessun SDK di analisi, nessun ID pubblicitario, nessun cookie – né nell'app né su questo sito.",
      "p4.title": "IA locale senza invio di dati",
      "p4.text": "L'IA locale opzionale (es. Qwen 2.5) non è un agente IA e non ha alcun accesso a rete, terminale o strumenti. Dopo il download unico opera completamente isolata nella sandbox locale.",
      "faq.title": "Domande frequenti su modalità offline, sync NAS & IA locale",
      "faq1.q": "L'IA locale opzionale (es. Qwen 2.5) può trasmettere dati all'esterno?",
      "faq1.a": "No. Il modello linguistico sul dispositivo non è un agente IA e non possiede accesso alla rete, al terminale né a strumenti esterni. Dopo il download unico e facoltativo del modello, l'elaborazione avviene interamente isolata nella sandbox locale senza connessioni in uscita.",
      "faq2.q": "CuraVault funziona con NAS Synology & QNAP (SMB / WebDAV)?",
      "faq2.a": "Sì. Puoi sincronizzare i tuoi documenti crittografati direttamente via SMB nella rete domestica o via WebDAV con il tuo NAS (Synology, QNAP o Nextcloud) – senza Docker e senza cloud di terze parti.",
      "faq3.q": "Cosa succede se perdo o rompo lo smartphone?",
      "faq3.a": "Non dipendi da un solo dispositivo: crea in ogni momento backup crittografati in locale, sul tuo NAS o sincronizza in modo crittografato sul tuo Google Drive o Microsoft OneDrive – senza server intermedi CuraVault.",
      "privacy.link": "Leggi l'informativa sulla privacy completa",
      "footer.title": "Contatto",
      "footer.text": "Domande, feedback o idee? Scrivici – rispondiamo personalmente.",
      "footer.location": "Sviluppata con cura in Svizzera 🇨🇭",
      "footer.nav": "Navigazione",
      "footer.legal": "Note legali",
      "footer.privacy": "Informativa sulla privacy",
      "footer.terms": "Termini d'uso & Colophon",
      "footer.github": "Repository GitHub",
      "footer.nocookies": "Questo sito non utilizza cookie né tracciamento.",
      "footer.rights": "Tutti i diritti riservati.",
      "legal.back": "Torna alla home",
      "nf.title": "Pagina non trovata",
      "nf.text": "Questa pagina non esiste o è stata spostata. I tuoi dati sono comunque al sicuro – sono sul tuo dispositivo.",
      "nf.back": "Torna alla home"
    },

    en: {
      "meta.title": "CuraVault – Your private finance & document vault, 100% offline",
      "meta.description": "CuraVault is your private finance and document vault: AES-256 encrypted, 100% offline, no forced cloud and no tracking. Swiss QR, OCR and multi-currency.",
      "a11y.skip": "Skip to content",
      "a11y.menu": "Open menu",
      "a11y.lang": "Choose language",
      "nav.features": "Features",
      "nav.storage": "Storage & Sync",
      "nav.voting": "Feature voting",
      "nav.privacy": "Privacy",
      "nav.contact": "Contact",
      "hero.eyebrow": "Made in Switzerland · Offline-First",
      "hero.title": "Your private finance & document vault – <span class=\"accent\">100% offline.</span>",
      "hero.lead": "Scan receipts, manage bills, verify bank statements – all encrypted on your device. No cloud, no account, no tracking.",
      "badge.aes": "AES-256 on device",
      "badge.cloud": "No forced cloud",
      "badge.tracking": "No tracking",
      "badge.qr": "Swiss QR & multi-currency",
      "cta.play": "Coming soon to Google Play",
      "cta.feature": "Request a feature",
      "features.kicker": "Features",
      "features.title": "Everything you need. Nothing that spies on you.",
      "features.lead": "CuraVault combines document storage and financial overview – fully local and under your control.",
      "f1.title": "Encrypted vault",
      "f1.text": "All documents and data are encrypted locally with AES-256 and protected by biometrics or PIN.",
      "f2.title": "Swiss QR & on-device OCR",
      "f2.text": "Scan QR bills and receipts directly. Text recognition runs entirely on your device.",
      "f3.title": "Multi-currency statements",
      "f3.text": "Import bank statements in CHF, EUR, USD and more – with automatic balance verification.",
      "f4.title": "Merchant memory & budgets",
      "f4.text": "CuraVault learns your merchants and categories locally and helps you keep an eye on your budgets.",
      "f5.title": "Tax ZIP & emergency export",
      "f5.text": "Export your documents for tax returns or emergencies as a ZIP. No vendor lock-in.",
      "f6.title": "Local AI",
      "f6.text": "Optional on-device small language model (SLM) for smart summaries – without your data ever leaving the device.",
      "beta": "BETA",
      "mock.alt": "CuraVault app preview",
      "mock.offline": "100% Offline",
      "mock.search": "Search receipts & full text …",
      "mock.overview": "Monthly overview",
      "mock.checked": "Balance ✓",
      "mock.recent": "Recent receipts",
      "mock.item1": "Health insurance · Swiss QR",
      "mock.meta1": "On-device OCR · Paid",
      "mock.item2": "Warranty · Laptop Pro",
      "mock.meta2": "Electronics · 24M warranty",
      "mock.item3": "Tax ZIP 2026",
      "mock.meta3": "42 receipts · 1-click export",
      "mock.tabs.label": "Choose app view",
      "mock.tab.overview": "Overview",
      "mock.tab.statement": "Statement",
      "mock.tab.vault": "Vault",
      "mock.st.title": "Checking account · CHF / EUR",
      "mock.st.verified": "Balance verified ✓",
      "mock.st.sub": "PDF / CSV imported locally · 0 discrepancies",
      "mock.st.tx": "Recognised transactions",
      "mock.st.c1": "Groceries · Merchant learned",
      "mock.st.c2": "Mobility · Receipt linked",
      "mock.st.c3": "Electronics · Warranty active",
      "mock.v.title": "Local vault",
      "mock.v.bio": "Biometrics ✓",
      "mock.v.count": "148 documents",
      "mock.v.backup": "Backup: Encrypted · Personal NAS",
      "mock.v.folders": "Vault folders",
      "mock.v.f1": "Taxes 2026",
      "mock.v.f1m": "42 receipts · Tax ZIP ready",
      "mock.v.f2": "Warranty receipts",
      "mock.v.f2m": "18 receipts · Full-text OCR",
      "mock.v.f3": "Emergency & backup export",
      "mock.v.f3m": "Local, NAS or your own cloud",
      "why.kicker": "Why CuraVault?",
      "storage.kicker": "Storage & Sync",
      "storage.title": "You decide where your data lives",
      "storage.lead": "From a 100% isolated phone vault to direct Synology & QNAP NAS sync – always without CuraVault servers.",
      "st1.badge": "Default",
      "st1.title": "100% Local",
      "st1.text": "All data and receipts remain AES-256 encrypted exclusively on your smartphone. No internet connection required.",
      "st2.badge": "No lock-in",
      "st2.title": "Manual Backup & Emergency ZIP",
      "st2.text": "Create local encrypted backups anytime or export all receipts as an open tax/emergency ZIP – zero vendor lock-in.",
      "st3.badge": "SMB & WebDAV",
      "st3.title": "Own NAS / Private Cloud (Synology, QNAP, Nextcloud)",
      "st3.text": "Direct document synchronisation with your own home server (e.g. QNAP, Synology, Nextcloud) on your local network or via WebDAV – no third-party cloud.",
      "st4.badge": "Optional",
      "st4.title": "Your Public Cloud (Google Drive & OneDrive)",
      "st4.text": "Optional direct sync with your own Google Drive or Microsoft OneDrive account – encrypted and without any CuraVault relay server.",
      "why.lead": "Built for anyone who wants tidy receipts and finances – without server maintenance and without third-party clouds.",
      "why1.tag": "No server needed",
      "why1.title": "The simple alternative to Paperless-ngx – without your own server or Docker",
      "why1.text": "Want the control and full-text search of a private document archive without maintaining a NAS or Docker containers? CuraVault runs directly on your phone – ready out of the box, encrypted locally and with zero server costs.",
      "why1.b1": "No home server, no Docker, no VPN setup required",
      "why1.b2": "On-device OCR & local AES-256 database right on your phone",
      "why1.b3": "Export anytime as an encrypted backup or standard ZIP",
      "why2.tag": "100% offline scan",
      "why2.title": "Scan receipts without forced cloud (alternative to Adobe Scan & Genius Scan)",
      "why2.text": "Many scanner apps require an account or upload your receipts to a cloud for OCR. With CuraVault, bills, medical receipts and bank statements stay on your device – text recognition and Swiss QR parsing work completely offline. And if you lose your phone, you're still covered: save encrypted backups locally, to your own NAS or to your own cloud – with zero CuraVault servers.",
      "why2.b1": "No sign-up, no forced subscription, no cloud storage",
      "why2.b2": "Local OCR text recognition & Swiss QR right on the device",
      "why2.b3": "Encrypted backups locally, to your own NAS or your own cloud",
      "why3.tag": "Everyday & taxes",
      "why3.title": "Tax returns, warranty receipts & paper slips under control",
      "why3.text": "Instead of shoeboxes and faded thermal paper, find any receipt in seconds with full-text search. For tax season, bundle all relevant documents in one click into a clean tax ZIP export.",
      "why3.b1": "Instant full-text search across all scanned receipts",
      "why3.b2": "1-click tax ZIP export & emergency export with no vendor lock-in",
      "why3.b3": "Warranty receipts, paper slips & bank statements in one place",
      "voting.kicker": "Community",
      "voting.title": "Live feature voting",
      "voting.lead": "You help decide what comes next. Vote with 👍 on GitHub or submit your own idea.",
      "voting.submit": "Submit idea on GitHub",
      "voting.email": "Suggest by email",
      "voting.hint": "Voting on GitHub requires a free GitHub account. Without an account, you can always send us your idea by email.",
      "voting.filters": "Filter by status",
      "filter.all": "All",
      "filter.open": "Open",
      "filter.planned": "Planned",
      "filter.in-progress": "In progress",
      "filter.released": "Released",
      "status.open": "Open",
      "status.planned": "Planned",
      "status.in-progress": "In progress",
      "status.released": "Released",
      "status.closed": "Closed",
      "voting.vote": "Vote (👍)",
      "voting.votes": "votes",
      "voting.comments": "comments",
      "voting.nopreview": "No description provided.",
      "voting.loading": "Loading requests from GitHub …",
      "voting.empty.title": "No requests in this category yet",
      "voting.empty.text": "Be the first to submit an idea – every vote counts.",
      "voting.rate.title": "GitHub rate limit reached",
      "voting.rate.text": "The GitHub API only allows a limited number of anonymous requests per hour. Please try again later or view the requests directly on GitHub.",
      "voting.error.title": "Requests could not be loaded",
      "voting.error.text": "GitHub may be unreachable right now. You can view all requests directly on GitHub.",
      "voting.retry": "Try again",
      "voting.open_github": "View on GitHub",
      "voting.noscript": "JavaScript is required for the live list. All requests are also available directly on GitHub.",
      "privacy.kicker": "Privacy",
      "privacy.title": "Privacy isn't a feature. It's the foundation.",
      "privacy.lead": "CuraVault is built so that we can't see your data – even if we wanted to.",
      "p1.title": "Everything stays on your device",
      "p1.text": "Documents, OCR text and bank statements are stored locally, encrypted with AES-256.",
      "p2.title": "No servers, full backup freedom",
      "p2.text": "No sign-up, no CuraVault servers. If you lose your device, you're still protected: save encrypted backups locally, to your own NAS (SMB/WebDAV) or to your own Google Drive or OneDrive anytime.",
      "p3.title": "No tracking, no ads",
      "p3.text": "No analytics SDKs, no advertising IDs, no cookies – neither in the app nor on this website.",
      "p4.title": "Local AI that never calls home",
      "p4.text": "The optional on-device AI (e.g. Qwen 2.5) is not an AI agent and has no network, terminal or tool access. After the one-time download it runs completely isolated in the local sandbox.",
      "faq.title": "FAQ: Offline use, NAS sync & local AI security",
      "faq1.q": "Can the optional local AI (e.g. Qwen 2.5) call home?",
      "faq1.a": "No. The on-device small language model is not an AI agent and has no network, terminal or tool access. After the optional one-time model download, text processing runs completely isolated inside the local app sandbox with zero outgoing connections.",
      "faq2.q": "Does CuraVault work with Synology & QNAP NAS (SMB / WebDAV)?",
      "faq2.a": "Yes. You can sync your encrypted documents directly via SMB on your home network or via WebDAV with your own NAS (e.g. Synology, QNAP or Nextcloud) – with no Docker containers and no third-party cloud.",
      "faq3.q": "What happens if my phone is lost or broken?",
      "faq3.a": "You are never locked to a single device: create encrypted backups locally, on your own NAS, or sync encrypted via your own Google Drive or Microsoft OneDrive – without any CuraVault relay servers.",
      "privacy.link": "Read the full privacy policy",
      "footer.title": "Contact",
      "footer.text": "Questions, feedback or ideas? Write to us – we reply personally.",
      "footer.location": "Carefully developed in Switzerland 🇨🇭",
      "footer.nav": "Navigation",
      "footer.legal": "Legal",
      "footer.privacy": "Privacy policy",
      "footer.terms": "Terms of Use & Legal Notice",
      "footer.github": "GitHub repository",
      "footer.nocookies": "This website uses no cookies and no tracking.",
      "footer.rights": "All rights reserved.",
      "legal.back": "Back to home",
      "nf.title": "Page not found",
      "nf.text": "This page doesn't exist or has been moved. Your data is safe anyway – it's on your device.",
      "nf.back": "Back to home"
    }
  };

  /* ------------------------------------------------------------------------
     Language handling
     ------------------------------------------------------------------------ */
  var currentLang = DEFAULT_LANG;

  function safeStorage(type) {
    try {
      var s = window[type];
      var k = "__cv_test__";
      s.setItem(k, k);
      s.removeItem(k);
      return s;
    } catch (e) {
      return null;
    }
  }
  var local = safeStorage("localStorage");
  var session = safeStorage("sessionStorage");

  function detectLang() {
    // 1) explicit ?lang= parameter (useful for store links)
    var m = /[?&]lang=([a-z]{2})/i.exec(window.location.search);
    if (m && LANGS.indexOf(m[1].toLowerCase()) !== -1) return m[1].toLowerCase();
    // 2) saved choice
    var saved = local && local.getItem(STORAGE_KEY);
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    // 3) browser languages
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || "").slice(0, 2).toLowerCase();
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  function t(key) {
    var dict = I18N[currentLang] || I18N[DEFAULT_LANG];
    return dict[key] != null ? dict[key] : (I18N[DEFAULT_LANG][key] != null ? I18N[DEFAULT_LANG][key] : key);
  }

  function applyLang(lang, persist) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
    currentLang = lang;
    document.documentElement.lang = lang;
    if (persist && local) local.setItem(STORAGE_KEY, lang);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));

    // Trusted, static markup from the dictionary above only.
    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < htmlNodes.length; j++) htmlNodes[j].innerHTML = t(htmlNodes[j].getAttribute("data-i18n-html"));

    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    for (var k = 0; k < attrNodes.length; k++) {
      var pairs = attrNodes[k].getAttribute("data-i18n-attr").split(";");
      for (var p = 0; p < pairs.length; p++) {
        var kv = pairs[p].split(":");
        if (kv.length === 2) attrNodes[k].setAttribute(kv[0].trim(), t(kv[1].trim()));
      }
    }

    // Language-specific content blocks (privacy.html)
    var blocks = document.querySelectorAll("[data-lang-block]");
    for (var b = 0; b < blocks.length; b++) {
      blocks[b].classList.toggle("active", blocks[b].getAttribute("data-lang-block") === lang);
    }

    // Page title / description (per page key via <body data-page>)
    var page = document.body.getAttribute("data-page") || "home";
    var titleKey = page === "home" ? "meta.title" : null;
    if (page === "privacy" || page === "terms") {
      var activeBlock = document.querySelector("[data-lang-block].active");
      if (activeBlock && activeBlock.getAttribute("data-title")) document.title = activeBlock.getAttribute("data-title");
    } else if (page === "404") {
      document.title = t("nf.title") + " – CuraVault";
    } else if (titleKey) {
      document.title = t(titleKey);
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", t("meta.description"));
    }

    var buttons = document.querySelectorAll(".lang-switch button[data-lang]");
    for (var n = 0; n < buttons.length; n++) {
      buttons[n].setAttribute("aria-pressed", buttons[n].getAttribute("data-lang") === lang ? "true" : "false");
    }

    if (votingState.loaded) renderVoting();
  }

  function initLangSwitch() {
    var switches = document.querySelectorAll(".lang-switch");
    for (var i = 0; i < switches.length; i++) {
      switches[i].addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-lang]");
        if (!btn) return;
        applyLang(btn.getAttribute("data-lang"), true);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;
    function setOpen(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     Feature voting
     ------------------------------------------------------------------------ */
  var votingState = { loaded: false, status: "idle", issues: [], filter: "all" };
  var FILTERS = ["all", "open", "planned", "in-progress", "released"];

  function issueStatus(issue) {
    var names = (issue.labels || []).map(function (l) {
      return String(typeof l === "string" ? l : l.name || "").toLowerCase();
    });
    if (names.indexOf("released") !== -1) return "released";
    if (names.indexOf("in-progress") !== -1) return "in-progress";
    if (names.indexOf("planned") !== -1) return "planned";
    if (issue.state === "closed") return "closed";
    return "open";
  }

  function plainPreview(body) {
    if (!body) return "";
    var text = String(body)
      .replace(/<!--[\s\S]*?-->/g, " ")          // HTML comments (issue templates)
      .replace(/```[\s\S]*?```/g, " ")            // code blocks
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")      // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")    // links -> text
      .replace(/<[^>]+>/g, " ")                   // html tags
      .replace(/^#{1,6}\s+/gm, "")                // headings
      .replace(/^\s*[-*+>]\s+/gm, "")             // list/quote markers
      .replace(/[*_`~]+/g, "")                    // emphasis
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 170 ? text.slice(0, 167).replace(/\s+\S*$/, "") + " …" : text;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        if (k === "text") node.textContent = attrs[k];
        else if (k === "className") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function stateBox(titleKey, textKey, actions) {
    var box = el("div", { className: "state-box", role: "status" }, [
      el("h3", { text: t(titleKey) }),
      textKey ? el("p", { text: t(textKey) }) : null
    ]);
    (actions || []).forEach(function (a) { box.appendChild(a); });
    return box;
  }

  function githubButton() {
    return el("a", { className: "btn btn-secondary btn-sm", href: ISSUES_URL, target: "_blank", rel: "noopener noreferrer", text: t("voting.open_github") });
  }

  function renderFilters() {
    var wrap = document.getElementById("voting-filters");
    if (!wrap) return;
    var counts = { all: votingState.issues.length, open: 0, planned: 0, "in-progress": 0, released: 0 };
    votingState.issues.forEach(function (i) { if (counts[i._status] != null) counts[i._status]++; });
    var btns = wrap.querySelectorAll("button[data-filter]");
    for (var b = 0; b < btns.length; b++) {
      var f = btns[b].getAttribute("data-filter");
      btns[b].setAttribute("aria-selected", f === votingState.filter ? "true" : "false");
      btns[b].tabIndex = f === votingState.filter ? 0 : -1;
      var c = btns[b].querySelector(".count");
      if (c) c.textContent = votingState.loaded && votingState.status === "ok" ? String(counts[f]) : "–";
    }
  }

  function renderVoting() {
    var list = document.getElementById("voting-list");
    if (!list) return;
    renderFilters();
    list.setAttribute("aria-busy", votingState.status === "loading" ? "true" : "false");
    list.textContent = "";

    if (votingState.status === "loading") {
      for (var s = 0; s < 4; s++) {
        list.appendChild(el("div", { className: "card skeleton", "aria-hidden": "true" }, [
          el("div", { className: "bar w60" }), el("div", { className: "bar w90" }), el("div", { className: "bar w90" }), el("div", { className: "bar w40" })
        ]));
      }
      list.appendChild(el("p", { className: "visually-hidden", role: "status", text: t("voting.loading") }));
      return;
    }

    if (votingState.status === "ratelimit" || votingState.status === "error") {
      var retry = el("button", { className: "btn btn-ghost btn-sm", type: "button", text: t("voting.retry") });
      retry.addEventListener("click", function () { loadIssues(true); });
      var isRate = votingState.status === "ratelimit";
      list.appendChild(stateBox(isRate ? "voting.rate.title" : "voting.error.title", isRate ? "voting.rate.text" : "voting.error.text", [githubButton(), retry]));
      return;
    }

    var items = votingState.issues.filter(function (i) {
      return votingState.filter === "all" || i._status === votingState.filter;
    });

    if (!items.length) {
      var submit = el("a", {
        className: "btn btn-primary btn-sm", target: "_blank", rel: "noopener noreferrer",
        href: "https://github.com/" + REPO + "/issues/new?labels=feature-request", text: t("voting.submit")
      });
      list.appendChild(stateBox("voting.empty.title", "voting.empty.text", [submit]));
      return;
    }

    items.forEach(function (issue) {
      var votes = (issue.reactions && issue.reactions["+1"]) || 0;
      var preview = plainPreview(issue.body) || t("voting.nopreview");
      var url = /^https:\/\/github\.com\//.test(issue.html_url) ? issue.html_url : ISSUES_URL;

      var card = el("article", { className: "card issue" }, [
        el("div", { className: "issue-top" }, [
          el("h3", null, [el("a", { href: url, target: "_blank", rel: "noopener noreferrer", text: issue.title || "#" + issue.number })]),
          el("span", { className: "status status-" + issue._status, text: t("status." + issue._status) })
        ]),
        el("p", { text: preview }),
        el("div", { className: "issue-bottom" }, [
          el("div", { className: "issue-meta" }, [
            el("span", { className: "votes", title: votes + " " + t("voting.votes"), "aria-label": votes + " " + t("voting.votes"), text: "👍 " + votes }),
            issue.comments ? el("span", { text: "💬 " + issue.comments, title: issue.comments + " " + t("voting.comments"), "aria-label": issue.comments + " " + t("voting.comments") }) : null,
            el("span", { text: "#" + issue.number })
          ]),
          el("a", { className: "btn btn-ghost btn-sm", href: url, target: "_blank", rel: "noopener noreferrer", text: t("voting.vote") })
        ])
      ]);
      list.appendChild(card);
    });
  }

  function processIssues(data) {
    return (Array.isArray(data) ? data : [])
      .filter(function (i) { return i && !i.pull_request; })
      .map(function (i) { i._status = issueStatus(i); return i; })
      .sort(function (a, b) {
        var va = (a.reactions && a.reactions["+1"]) || 0;
        var vb = (b.reactions && b.reactions["+1"]) || 0;
        if (vb !== va) return vb - va;
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }

  function loadIssues(force) {
    if (!document.getElementById("voting-list")) return;

    if (!force && session) {
      try {
        var cached = JSON.parse(session.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.time < CACHE_TTL) {
          votingState.issues = processIssues(cached.data);
          votingState.status = "ok";
          votingState.loaded = true;
          renderVoting();
          return;
        }
      } catch (e) { /* ignore */ }
    }

    votingState.status = "loading";
    votingState.loaded = true;
    renderVoting();

    if (!window.fetch) {
      votingState.status = "error";
      renderVoting();
      return;
    }

    fetch(API_URL, { headers: { Accept: "application/vnd.github+json" }, credentials: "omit", referrerPolicy: "no-referrer" })
      .then(function (res) {
        if (res.status === 403 || res.status === 429) {
          var remaining = res.headers.get("x-ratelimit-remaining");
          var err = new Error("rate");
          err.rate = remaining === "0" || res.status === 429 || remaining === null;
          throw err;
        }
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (session) {
          try { session.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: slim(data) })); } catch (e) { /* quota */ }
        }
        votingState.issues = processIssues(data);
        votingState.status = "ok";
        renderVoting();
      })
      .catch(function (err) {
        votingState.status = err && err.rate ? "ratelimit" : "error";
        renderVoting();
      });
  }

  // Keep cached payload small
  function slim(data) {
    return (Array.isArray(data) ? data : []).map(function (i) {
      return {
        number: i.number, title: i.title, body: i.body ? String(i.body).slice(0, 600) : "",
        html_url: i.html_url, state: i.state, comments: i.comments, created_at: i.created_at,
        pull_request: i.pull_request ? true : undefined,
        labels: (i.labels || []).map(function (l) { return { name: typeof l === "string" ? l : l.name }; }),
        reactions: { "+1": (i.reactions && i.reactions["+1"]) || 0 }
      };
    });
  }

  function initVoting() {
    var wrap = document.getElementById("voting-filters");
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      votingState.filter = btn.getAttribute("data-filter");
      renderVoting();
    });
    // Arrow-key navigation for tabs
    wrap.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var idx = FILTERS.indexOf(votingState.filter);
      idx = (idx + (e.key === "ArrowRight" ? 1 : FILTERS.length - 1)) % FILTERS.length;
      votingState.filter = FILTERS[idx];
      renderVoting();
      var next = wrap.querySelector('button[data-filter="' + votingState.filter + '"]');
      if (next) next.focus();
      e.preventDefault();
    });

    // Load lazily when the section approaches the viewport (saves API quota)
    var section = document.getElementById("voting");
    if ("IntersectionObserver" in window && section) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          io.disconnect();
          loadIssues(false);
        }
      }, { rootMargin: "400px 0px" });
      io.observe(section);
    } else {
      loadIssues(false);
    }
  }

  /* ------------------------------------------------------------------------
     Hero app preview image + interactive CSS mockup tabs (CSP-safe)
     ------------------------------------------------------------------------ */
  function initAppPreview() {
    var img = document.getElementById("app-preview-img");
    var tabs = document.getElementById("mock-tabs");
    if (!img) return;
    function show() {
      if (img.naturalWidth > 0) {
        img.classList.add("is-loaded");
        if (tabs) tabs.setAttribute("hidden", "");
      }
    }
    function hide() {
      img.classList.remove("is-loaded");
      img.setAttribute("hidden", "");
    }
    if (img.complete) {
      if (img.naturalWidth > 0) show();
      else hide();
    } else {
      img.addEventListener("load", show, { once: true });
      img.addEventListener("error", hide, { once: true });
    }
  }

  function initMockTabs() {
    var wrap = document.getElementById("mock-tabs");
    var fallback = document.getElementById("phone-fallback");
    if (!wrap || !fallback) return;
    var order = ["overview", "statement", "vault"];

    function select(name, focusBtn) {
      var btns = wrap.querySelectorAll("button[data-mock-tab]");
      for (var i = 0; i < btns.length; i++) {
        var active = btns[i].getAttribute("data-mock-tab") === name;
        btns[i].setAttribute("aria-selected", active ? "true" : "false");
        btns[i].tabIndex = active ? 0 : -1;
        if (active && focusBtn) btns[i].focus();
      }
      var views = fallback.querySelectorAll("[data-mock-view]");
      for (var v = 0; v < views.length; v++) {
        views[v].classList.toggle("is-active", views[v].getAttribute("data-mock-view") === name);
      }
    }

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-mock-tab]");
      if (!btn) return;
      select(btn.getAttribute("data-mock-tab"), false);
    });
    wrap.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var cur = wrap.querySelector('button[aria-selected="true"]');
      var idx = cur ? order.indexOf(cur.getAttribute("data-mock-tab")) : 0;
      idx = (idx + (e.key === "ArrowRight" ? 1 : order.length - 1)) % order.length;
      select(order[idx], true);
      e.preventDefault();
    });
  }

  /* ------------------------------------------------------------------------
     Subtle scroll reveal (350ms fade-up, respects prefers-reduced-motion)
     ------------------------------------------------------------------------ */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("is-visible");
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.06 });

    for (var n = 0; n < nodes.length; n++) io.observe(nodes[n]);
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    var yearNodes = document.querySelectorAll("[data-year]");
    for (var y = 0; y < yearNodes.length; y++) yearNodes[y].textContent = String(new Date().getFullYear());
    initNav();
    initLangSwitch();
    initAppPreview();
    initMockTabs();
    initReveal();
    initVoting();
    applyLang(detectLang(), false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
