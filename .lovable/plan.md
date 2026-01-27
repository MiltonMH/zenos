

## Plan: Lägg till Safe Area Inset för iPhone-stöd

### Bakgrund
Appen har redan förberedd CSS för safe-area-insets (`safe-top` och `safe-bottom` klasser) och korrekt viewport-inställning i HTML. Vi behöver bara applicera klasserna på rätt komponenter.

### Ändringar

**1. Uppdatera huvudcontainern i `src/pages/Index.tsx`**
- Lägg till `safe-top` klass på huvudcontainern så att innehållet automatiskt flyttas ner förbi kameran/notchen

**2. Uppdatera navigationen i `src/components/layout/AppBottomNav.tsx`**
- Navigationen har redan `safe-bottom` klass - inga ändringar behövs här

### Tekniska detaljer

```text
src/pages/Index.tsx
├── Rad 14: Lägg till "safe-top" i className
│   Från: "flex-1 flex flex-col px-5 pt-2 pb-28"
│   Till: "flex-1 flex flex-col px-5 pt-2 pb-28 safe-top"
```

### Resultat
- Innehållet kommer automatiskt få tillräckligt med padding högst upp på iPhones med notch (iPhone X och senare)
- Fungerar även på iPad Pro med avrundade hörn
- Inga visuella förändringar på enheter utan notch

