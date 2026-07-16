# Numiz (tidigare ZenOS)

## Vad appen är
Numiz är en app för hemmaladdning/energihantering (laddning, V2H, V2G) byggd med Vite + React + TypeScript, shadcn-ui, Tailwind och Capacitor (för mobil). Se README.md för grundläggande kommandon.

Kör lokalt: `npm install && npm run dev` (Vite väljer ledig port, t.ex. 8090/8091).

## Design- och produktfilosofi

Detta är styrande för alla UX/UI-beslut i appen — läs detta innan du föreslår eller bygger nya vyer, grafer eller inställningar.

- **Byggd av säljare, inte ingenjörer.** De flesta konkurrerande energi-/laddappar är byggda av ingenjörer och blir tekniska dashboards. Numiz ska kännas tryggt och begripligt även för kunder som inte kan eller bryr sig om tekniken.
- **Appen ska ta hand om allt.** Målet är inte att göra kunden till sin egen energianalytiker. Målet är medvetenhet ("det är smart att tänka på det här") kombinerat med tillit ("men Numiz sköter det åt dig"). Automation och trygghet vinner alltid över kontroll och detaljerad data i huvudvyn.
- **Interaktivitet ska vara kul, inte bara funktionell.** Appen ska vara tillräckligt lekfull/interaktiv för att folk faktiskt gillar att öppna den — inte bara ett nödvändigt verktyg.
- **Minimera information i huvudflödet.** Undvik grafer, siffror eller datapunkter som en vanlig kund inte bryr sig om. Om något är "nördigt" eller avancerat hör det hemma i **Inställningar**, inte på Home/Statistik-ytan.
- **Praktisk tumregel innan du lägger till en graf/siffra/kort:** Skulle en icke-teknisk kund direkt förstå varför detta är här och vad de ska göra med informationen? Om svaret är nej eller "bara om man är intresserad av detaljer" → flytta det bakom Inställningar eller ta bort det.
- **Undvik scroll så ofta som möjligt.** Scroll är förvirrande UI. Föredra kompakta layouter (t.ex. tvåkolumnsrader för korta fält) framför staplade listor som kräver scroll. Scroll är en sista utväg, inte standard.
- **Text är svart/mörk (`text-foreground`) som standard.** Reservera `text-primary`/accentfärger för ikoner, aktiva tillstånd (t.ex. aktiv flik), knappar med färgad bakgrund och medvetna "hero"-siffror (t.ex. elpris, procentvärden) — inte för vanlig brödtext eller inline-länkar. En länk ska synas genom understrykning/vikt, inte genom att vara teal.

För den fullständiga, detaljerade design-referensen (exakta färgtokens, radie-skala, knapp-/fältrecept, animationstimings, kontrastregler och hela specen för maskoten Numiz) — se skillen `numiz-design` (`.claude/skills/numiz-design/SKILL.md`). Det här dokumentet är produktfilosofin (*varför*); den skillen är *hur*.

Detta är ett levande dokument — uppdatera det när Milton förfinar eller ändrar riktningen.
