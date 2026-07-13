---
name: numiz-design
description: Numiz's complete design system — color tokens, typography, the radius/spacing scale, button and input recipes, glass/frost surfaces, animation timing and easing, contrast rules, and the full spec for the mascot Numiz. Read this BEFORE building or changing any UI in this app — new screens, components, buttons, colors, themes, layouts, or animations. Triggers on: color, färg, tema, theme, knapp, button, radie, rundning, radius, typsnitt, font, typography, animation, rörelse, maskot, mascot, Numiz, glas, glass, frost, kontrast, contrast, läsbarhet, readability, onboarding, design, UI, skärm, komponent.
---

# Numiz Designsystem

Detta är den fullständiga design-referensen för Numiz (tidigare ZenOS) — appen för hemmaladdning/energihantering. Läs `CLAUDE.md` för produktfilosofin (varför appen ser ut som den gör). Läs **detta** dokument för *hur* — exakta värden, klasser, mönster och (viktigast) de misstag som redan gjorts och fixats, så de inte görs igen.

Allt här är hämtat direkt ur den faktiska koden (`src/index.css`, `tailwind.config.ts`, `src/components/ui/button.tsx` m.fl.) — inga påhittade siffror. Om koden och detta dokument någonsin säger olika saker: koden har rätt, och detta dokument bör uppdateras.

---

## 1. Grundprincipen — bygd av säljare, inte ingenjörer

Detta styr *varje* beslut nedan, så det tål att upprepas kort (fullständig version i `CLAUDE.md`):

- **Lugn och tillit vinner alltid över kontroll och detaljerad data.** Appen ska kännas som att den sköter saker åt kunden, inte som ett tekniskt dashboard.
- **Lekfullhet är en funktion, inte dekoration.** Numiz (maskoten) finns för att appen ska vara kul att öppna, inte bara nödvändig.
- **Minimera. Om en icke-teknisk kund inte direkt förstår varför något är där → ta bort det eller flytta det till Inställningar.**
- **Text är mörk/svart som standard.** `text-foreground` överallt i brödtext. Accentfärg (`text-primary`) är reserverad för: ikoner, aktiva tillstånd (aktiv flik), knappar med färgad bakgrund, och medvetna "hero"-siffror (elpris, procent). **Aldrig** för vanlig brödtext eller länkar — en länk märks genom understrykning/vikt, inte genom att vara teal.
- **Scroll är en sista utväg.** Föredra kompakta tvåkolumns-/gridlayouter framför staplade listor.

---

## 2. Färger

### 2.1 Design tokens — ljust läge (`:root` i `src/index.css`)

Alla färger är HSL-tripletter (`H S% L%`) och konsumeras via `hsl(var(--token))`. Tailwind-klasser som `bg-primary`, `text-foreground` etc. läser dessa automatiskt.

| Token | Värde | Används till |
|---|---|---|
| `--background` | `165 40% 85%` | Sidbakgrund (fallback, de flesta skärmar har en egen bakgrundsbild/gradient ovanpå) |
| `--foreground` | `220 20% 15%` | All vanlig text — nästan svart |
| `--primary` | `173 50% 45%` | Brand-teal ("Mint"). Knappar, aktiva ikoner, ringar. Motsvarar ungefär `#1D8F82` |
| `--primary-glow` | `173 60% 55%` | Ljusare variant av primary — glöd, gradient-stopp |
| `--primary-foreground` | `0 0% 100%` | Text/ikoner *på* en primary-bakgrund (vit) |
| `--accent` | `270 40% 80%` | Mjuk lila — sparsam användning, inte samma som primary |
| `--muted-foreground` | `220 10% 45%` | Hjälptext, sekundär info |
| `--card` / `--glass` | `0 0% 100%` | Bas för glasytor (se §7) |
| `--destructive` | `0 65% 55%` | Farliga/negativa handlingar |
| `--success` | `145 55% 55%` | |
| `--warning` | `45 90% 55%` | |
| `--border` | `165 20% 85%` | |
| `--ring` | `173 50% 45%` | Fokusring — samma som primary |
| `--radius` | `1.25rem` (20px) | Bas för hela radie-skalan, se §4 |

Energiflödesfärger (för laddning/V2H/V2G-visualiseringar): `--energy-charging` (samma som primary), `--energy-discharging` (lila), `--energy-v2h` (grön), `--energy-v2g` (blå).

### 2.2 Mörkt läge (`.dark` och `.bg-nocturne`)

Appen har **två** parallella sätt att gå i mörkt läge som råkar dela samma värden:
- `.dark` — Tailwinds `darkMode: ["class"]`, klassisk dark-mode-klass.
- `.bg-nocturne` — appens *egna* "Mörk"-tema (ett av de 4 bakgrundsvalen, se §2.3). Detta är vad som faktiskt används i produkten idag.

Båda skriver om samma tokens: `--background`, `--foreground` (→ ljus, `210 26% 95%`), `--card`, `--muted-foreground` (→ `214 14% 72%`, fortfarande ljus), `--primary` (→ `172 62% 54%`, en piggare teal anpassad för mörk bakgrund), `--primary-foreground` (→ mörk, `220 35% 10%`, eftersom den nu ljusare primary-ytan behöver mörk text för kontrast).

`.bg-nocturne` lägger också på en egen bakgrundsbild (flerlagers `radial-gradient` + `linear-gradient`, se index.css rad ~238) och skriver om `.glass-main`, `.glass`, `.glass-strong`, `.glass-subtle` var för sig så att glasytorna blir mörka/frostade istället för ljusa (annars skulle en "ljus glasruta" se konstig ut ovanpå en mörk bakgrund).

**Lärdom:** Om du lägger till en ny glasyta/komponent-klass, kolla om den behöver en `.bg-nocturne .din-klass { ... }`-variant. Testa alltid mot "Mörk" innan något anses klart.

### 2.3 De fyra bakgrunds-/temavalen — ETT system, inte två

Det finns **exakt fyra** val, definierade i `src/hooks/useBackground.ts` (`BackgroundOption`). Detta är samtidigt appens *bakgrund* och dess *tema* — de är inte separata koncept. Samma val styrs från onboardingens "Gör appen till din"-steg och från Profil → Bakgrund; det är bokstavligen samma `localStorage`-nyckel (`zenio-background`) och samma `useBackground()`-hook.

| id | Etikett | `style`-klass | Vad den gör |
|---|---|---|---|
| `default` | **Mint** | `bg-gradient-mesh` | Standardutseendet — bildfil (`/images/background.png`), ingen tokenändring |
| `colorful` | **Färgrik** | (bild) | `bg-colorful.png` — livlig, flerfärgad foto-bakgrund |
| `white` | **Ljus** | `bg-lumen` | Ljus/vit sida. Skriver om glasytornas border/skugga (se nedan) |
| `black` | **Mörk** | `bg-nocturne` | Se §2.2 — enda av de fyra som byter tokens |

**Varför "Ljus" inte bara är `bg-white`:** en helt vit sida gjorde att alla glasytor (nav, kort, fält) — som *också* är genomskinligt vita — försvann in i bakgrunden; bara en svag skugga skilde dem åt. `.bg-lumen` (index.css rad ~296) lägger en aning kall ton på sidan (`hsl(210 30% 96%)`) och förstärker border/skugga på `.glass-main`, `.glass`, `.glass-strong`, `.glass-subtle` och `.active-nav-pill` specifikt för det läget, så ytorna får något att kontrastera mot.

**Regel:** när du bygger en ny yta som ska synas ovanpå bakgrunden (kort, knapp, chip) — testa den mot **alla fyra** teman, inte bara standard-Mint. "Färgrik" (foto, oförutsägbar ljushet) och "Ljus" (allt genomskinligt vitt smälter ihop) är de två som faktiskt avslöjar kontrastproblem. Se §10 för checklistan.

### 2.4 Textfärgsregeln

- Rubriker, brödtext, hjälptext: **alltid** `text-foreground` / `text-muted-foreground`. Aldrig `text-primary` på vanlig text.
- Länkar: `underline underline-offset-2` + `text-foreground/80–90`, inte färgbyte. Se `LoginScreen.tsx`s "Inget konto? Skapa ett".
- Primary-färg är reserverad för: fylld knapp-bakgrund (`bg-primary text-primary-foreground`), ikoner i aktivt tillstånd, fokus/val-ringar (`ring-primary`), och "hero"-siffror (batteriprocent, kW).

### 2.5 KRITISKT — fasta ljusa ytor vs temamedvetna tokens

Detta är den mest lömska bugg-klassen i hela appen, och den *kommer* att dyka upp igen om den här regeln glöms bort.

**Problemet:** många ytor är *alltid* ljusa oavsett vilket av de fyra bakgrundsvalen som är aktivt — t.ex. en frostad chip (`bg-white/70`), ett inputfält (`bg-white/75`), en ikonknapp (`.glass-subtle`, `bg-white/40`). Om du sätter texten i en sådan yta till `text-foreground` eller `text-muted-foreground` **ser det rätt ut i Mint/Färgrik/Ljus** — men i **Mörk** har `.bg-nocturne` skrivit om `--foreground` till en *ljus* färg (för texten som ligger direkt på den mörka sidan). Eftersom CSS custom properties ärvs rakt igenom DOM-trädet, ärver din ljusa chip samma ljusa `--foreground` — och du får **ljus text på en ljus yta**. Nästan osynligt.

Detta hände på riktigt: inputfältens platshållartext, hint-chips och tema-kortens etiketter blev alla oläsbara i Mörk-läge tills de fixades.

**Regeln:**
- **Yta som ALLTID är ljus** (chip, fält, `.glass-subtle`-knapp) → text ska ha en **fast** mörk färg som inte reagerar på tema, t.ex. `text-slate-800` (primär text i ytan) eller `text-slate-600` / `text-slate-400` (sekundär/placeholder). *Inte* `text-foreground`.
- **Yta som ligger DIREKT på sidans bakgrund** (rubriker, wordmark, länkar utan egen bakgrund) → använd `text-foreground` som vanligt. Den *ska* flippa ljus/mörk med temat, för den sitter på samma bakgrund som temat styr.

```tsx
// FEL — bakgrunden är alltid ljus, men texten är temamedveten och blir
// osynlig i Mörk-läge när --foreground flippar till ljust:
<div className="bg-white/70 rounded-full px-3 py-1">
  <p className="text-muted-foreground">Hjälptext</p>
</div>

// RÄTT — fast mörk text, oavsett aktivt tema:
<div className="bg-white/70 rounded-full px-3 py-1">
  <p className="text-slate-600">Hjälptext</p>
</div>

// RÄTT — ingen egen bakgrund, ska flippa med temat:
<h1 className="text-foreground">Rubrik direkt på sidan</h1>
```

Se `src/components/auth/OnboardingFlow.tsx` (`fieldClass`, `hintClass`) och `WelcomeScreen.tsx` för fler exempel med kommentarer som förklarar exakt varför.

---

## 3. Typografi

- **Typsnitt: Poppins**, satt på `html` i `index.css` (`font-family: 'Poppins', system-ui, sans-serif`). Detta är vad som faktiskt renderas överallt.
  - `tailwind.config.ts` definierar `fontFamily.sans` som `['Outfit', ...]`, men ingen komponent använder `font-sans`-klassen, så Outfit-inställningen är död kod just nu. Om du någonsin ser Outfit renderas istället för Poppins, eller vice versa oväntat — det är därför. Städa upp eller använd `font-sans` medvetet, men blanda inte in ett tredje typsnitt utan att uppdatera båda ställena.
- **Vikt-konvention:**
  - `font-bold` — enda "hero"-wordmark (`numiz`-logotypen på Welcome-skärmen, `text-4xl`).
  - `font-semibold` — alla skärmrubriker (`text-xl` för onboarding-frågor, `text-2xl` för firande-skärmen, `text-lg` för "Hej, {namn}").
  - `font-medium` — knapptext, etiketter, chip-text.
  - Brödtext/hjälptext: ingen explicit vikt (regular), `text-xs`–`text-sm`, alltid `text-muted-foreground` (eller fast slate-variant, se §2.5).
- Undvik att gå under `text-xs` (12px) — hjälptexter i onboardingen ligger redan där, mindre blir svårt att läsa på mobil.

---

## 4. Form & rundhet — radie-skalan

Basen är `--radius: 1.25rem` (20px), och Tailwinds skala är omdefinierad i `tailwind.config.ts` relativt den:

| Klass | Faktiskt värde | Använd till |
|---|---|---|
| `rounded-sm` | 16px | Sällan använd |
| `rounded` (DEFAULT) | 4px *(Tailwind-standard, ej omdefinierad)* | I princip aldrig — för litet för appens språk |
| `rounded-md` | 18px | Kompakta kontroller (`Select`, mindre fält i inställningar) |
| `rounded-lg` | 20px | = `--radius` självt |
| `rounded-xl` | 24px | Sekundära kort/kontroller |
| `rounded-2xl` | 28px | **Standard för primära knappar och inputfält.** Detta är arbetshästen. |
| `rounded-3xl` | 24px *(Tailwind-standard — råkar bli samma som `xl` i denna app)* | Stora "hero"-ytor: modal-kort (`ChargingScheduleModal`), kamera-viewfinder, tema-/bakgrundsval-kort |
| `rounded-full` | pill | **Endast** för: små indikatorprickar, badges/chips, och de specifika `glass`/`glassBold`-knappvarianterna (se §5) |

**Regel — blanda aldrig rundhets-språk inom samma knapprad.** En primär CTA (`rounded-2xl`) och en sekundär knapp direkt under den ska ha *samma* radie. Att stapla en `rounded-2xl`-knapp ovanpå en `rounded-full`-pill ser trasigt/oavsiktligt ut, även om båda är "korrekta" var för sig i andra sammanhang.

**Regel — använd aldrig godtyckliga pixelvärden** (`h-[58px]`, `rounded-[22px]`) när ett skalvärde redan finns. Detta hände tidigare i onboarding-flödet (kopierat rakt av från en extern designspec) och ledde till att knapparna kändes "fel" jämfört med resten av appen. Etablerad standard för en primär CTA-knapp: `h-12 rounded-2xl`. Se `EditProfile.tsx`s "Spara"-knapp, `LockedQuestionShell.tsx`, `DoneStep.tsx` för de kanoniska exemplen.

---

## 5. Knappar

Bas-komponenten är `src/components/ui/button.tsx` (shadcn `cva`). Varianter:

| `variant` | Utseende | Radie | Använd till |
|---|---|---|---|
| `default` | `bg-primary text-primary-foreground` | ärver (sätt `rounded-2xl` via `className`) | **Primär CTA.** De flesta knappar i appen. |
| `destructive` | `bg-destructive` | | Farliga handlingar |
| `outline` | `border border-input bg-background` | | Sällan använd i denna app (för opak för ytor som ligger direkt på en bakgrundsbild) |
| `secondary` | `bg-secondary` | | |
| `ghost` | ingen egen bakgrund/börder | | Bas för anpassade knappar där du själv lägger på bakgrund via `className` (se frost-knapp nedan) |
| `link` | `text-primary underline` | | Undvik — bryter mot §2.4:s "länkar ska synas via understrykning, inte färg"-regel om den används rakt av. Bygg egna underline-länkar med `text-foreground` istället. |
| `glass` | `.btn-gradient-stroke`, genomskinlig fyllning, 1px gradient-kant | `rounded-full` (inbyggt i klassen) | Sekundära fristående pill-actions, t.ex. "+ Lägg till laddbox" (`InstallerDashTab.tsx`). **Inte** för en knapp som står bredvid en `rounded-2xl`-primärknapp (se rundhets-regeln i §4). |
| `glassBold` | Fylld primary-bakgrund + mjuk glöd | `rounded-full` | Samma begränsning som `glass` |

**Storlek:** sätt `h-12` explicit via `className` för primära CTA:er (matchar `EditProfile`, `LockedQuestionShell`, `DoneStep`, hela onboarding-flödet). `size`-propen (`sm`/`default`/`lg`) behövs sällan eftersom `className` ändå vinner via `cn()`/`tailwind-merge`.

**Sekundär "frostad" knapp som ligger direkt på en bakgrundsbild** (inget kort under den) — bygg den inte med `variant="glass"` (fel radie, se ovan). Den beprövade uppskrivningen från Welcome-skärmen:

```tsx
<Button
  variant="ghost"
  className="w-full h-12 rounded-2xl text-slate-800 bg-white/55 backdrop-blur-xl border-2 border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.10)] hover:bg-white/65"
>
  Logga in
</Button>
```
Notera `text-slate-800` (fast, se §2.5) — inte `text-foreground`.

**Ett tidigare försök** använde `.glass-strong` (nästan opak vit fyllning + inset-highlights) för samma knapp. Det såg trasigt ut — inset-highlighterna är designade för att synas mot en mörkare/livligare bakgrund, och på en ljus bakgrund blev kanten otydlig. **Lärdom:** inset box-shadow-highlights fungerar inte universellt; en riktig `border` + vanlig (icke-inset) `box-shadow` är mer robust över olika bakgrunder.

**Inaktiverat/valideringsberoende tillstånd:** använd inte en hård `disabled`-CSS-opacity-hopp. Det etablerade mönstret (från onboarding-flödets "Fortsätt"-knapp) är en `motion.div`-wrapper som mjukt tonar opacity och en liten `translateY`:

```tsx
<motion.div
  animate={{ opacity: isActive ? 1 : 0.25, y: isActive ? 0 : 6 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
  style={{ pointerEvents: isActive ? "auto" : "none" }}
>
  <Button disabled={!canContinue} ...>Fortsätt</Button>
</motion.div>
```

---

## 6. Fält / inputs

Bas: `src/components/ui/input.tsx`. Dess inbyggda platshållarfärg är `placeholder:text-muted-foreground` — **kom ihåg §2.5-regeln** om du bygger ett fält som alltid ska ha ljus bakgrund; override:a med `placeholder:text-slate-400`.

Etablerad "hero"-fältstil (ett fält som är huvudfokus på en hel skärm, t.ex. varje onboarding-fråga):

```tsx
const fieldClass =
  "h-12 rounded-2xl bg-white/75 text-center text-base font-medium text-slate-800 placeholder:text-slate-400";
```

`bg-white/75`, inte `/50` — en svagare opacitet lät den "Färgrik"-bakgrunden (foto) blöda igenom för mycket, vilket gjorde ifylld/platshållar-text svårare att läsa.

Kompakt fältstil för täta formulär (flera fält i samma vy, t.ex. `EditProfile.tsx`, `OptionalDetailsStep.tsx`): `h-10 rounded-xl bg-white/50`. Notera den mindre höjden/radien — en hel skärm med ETT stort fält (onboarding) ska kännas som en "hero", ett tätt inställnings-formulär ska kännas kompakt. Använd inte hero-stilen i ett tätt formulär eller vice versa.

---

## 7. Glas- och frost-ytor

Fem etablerade nivåer, alla i `src/index.css` `@layer components`:

| Klass | Recept | Använd till |
|---|---|---|
| `.glass-subtle` | `bg-white/40 backdrop-blur-lg border border-white/30`, svag skugga | Ikonknappar/chrome som flyter direkt på en oförutsägbar bakgrund (bakåtpil, progress-dots track i onboarding) |
| `.glass` | `bg-white/30 backdrop-blur-2xl border border-white/50` | Standard-kort (`GlassCard` default-variant) |
| `.glass-strong` | `bg-white/85 backdrop-blur-3xl border border-white/60` + inset-highlights | Ytor som behöver stå för sig själva utan kort under — **men se varningen i §5** om inset-highlights på ljusa bakgrunder |
| `.glass-dark` | Mörk gradient, för inre kort (laddbox-visualisering) | |
| `.glass-main` | Appens huvudkort (`rounded-[3rem]`, `backdrop-filter: blur(24px) saturate(180%)`) | Det stora kortet som omsluter Hem/Profil/Statistik. Har egna `.bg-nocturne .glass-main` och `.bg-lumen .glass-main`-varianter. |

**Prestandaregel:** stapla inte flera `backdrop-blur`-lager ovanpå varandra, särskilt inte ovanpå något som animerar kontinuerligt (t.ex. laddnings-visualiseringen). Detta orsakade mätbar jank tidigare — tre `ActionButton`s hade var sin `backdrop-blur-xl` ovanpå ett redan blurrat `.glass-main`-kort. Fixen var att ta bort blur från de inre knapparna och lita på kortets egen blur + en starkare `bg-white/`-opacitet istället. En knapp behöver sällan sin egen blur om den redan ligger ovanpå en blurrad yta.

---

## 8. Animation & rörelse

### 8.1 Grundkänslan

Appens rörelser ska kännas **mjuka och lugna**, aldrig studsiga eller stressade (se §1). Standard-easing för de flesta övergångar:

```
cubic-bezier(.3, 1, .35, 1)   // "glid och landa" — mjuk, ingen studs
```

### 8.2 Etablerade timings

| Vad | Duration | Easing |
|---|---|---|
| Skärmbyte (Welcome→Login→Onboarding) | `0.25s` | `easeOut` |
| Onboarding-stegbyte (fråga till fråga) | `0.26s` | `easeOut` |
| Knapp fade in/ur (validering) | `0.35s` | `easeOut` |
| Maskotens flygning mellan positioner | `1.3s` | `cubic-bezier(.3,1,.35,1)` |
| Maskotens "blink" (ögon stängs) | `0.3s` | `ease-out` |
| Maskotens kontinuerliga andning/lean-loop | `4.8s` | `ease-in-out`, oändlig |

### 8.3 Prestandaregler — animera aldrig dessa kontinuerligt

Att animera `filter`/`backdrop-filter`, `box-shadow`, `width`/`height` eller `left`/`top` tvingar fram omritning varje frame — dyrt, särskilt i en mobil webview. Detta orsakade riktiga buggar som fixades under utveckling:

- En SMIL-animerad `feGaussianBlur` på batteri-vattenanimationen animerade om hela filtret varje frame → bytt mot ett statiskt `stdDeviation`-värde.
- En pulserande glöd animerade `box-shadow` direkt → bytt mot ett separat lager som animerar `opacity`/`scale` (compositor-only, mycket billigare).
- Tre `ActionButton`s hade `backdrop-blur-xl` ovanpå en redan blurrad bakgrund (se §7).

**Regel:** animera `transform` (`x`, `y`, `scale`, `rotate`) och `opacity`. Om du *måste* animera position över en yta (t.ex. maskotens `left`/`top` i procent) — gör det, men vet att det är ett medvetet undantag (maskoten rör sig sällan och kort, inte kontinuerligt varje frame som en laddningsanimation gör).

### 8.4 Framer Motion + statisk Tailwind-transform — en fälla

Om ett element både har en `motion`-styrd transform (t.ex. `animate={{ y: ... }}`) OCH en Tailwind-klass som också sätter `transform` (t.ex. `-translate-x-1/2` för centrering) — **framer-motion vinner alltid** och den statiska klassen ignoreras helt, tyst, utan fel. Detta orsakade en riktig bugg (`DoneScreen`s text hamnade utanför skärmen).

**Fixen:** separera statisk positionering (en vanlig `<div>` med `-translate-x-1/2`) från den animerade elementet (en `motion.div` som barn, utan egen positionerings-transform):

```tsx
// Statisk centrering på en vanlig div:
<div className="absolute left-1/2 top-[54%] -translate-x-1/2">
  {/* Animerat barn utan egen transform-styrande klass: */}
  <motion.div animate={{ opacity: 1, y: 0 }}>...</motion.div>
</div>
```

### 8.5 Tailwind purge-fällan för dynamiska klassnamn

Om ett klassnamn byggs dynamiskt i JS (t.ex. `` `theme-${id}` ``) och aldrig skrivs ut som en bokstavlig sträng någonstans i en skannad `.tsx`-fil, kommer Tailwinds content-scanner att **rensa bort** motsvarande `@layer`-regel i produktion — CSS:en försvinner helt utan varning eller fel, klassen appliceras men gör ingenting. Om du bygger ett system med dynamiska klassnamn: lägg antingen till dem i `safelist` i `tailwind.config.ts`, eller (bättre) undvik helt genom att styra med CSS custom properties istället för hela klassnamn.

---

## 9. Numiz — maskoten

### 9.1 Vem är Numiz

Numiz är appens maskot och samtidigt appens namn. Tänk på Numiz som en god ande i appen — den som ser till att allt är klart, laddat och optimerat innan kunden ens tänkt på det. Maskoten är den visuella representationen av löftet i taglinen: *"Din laddning. På autopilot."*

Personlighet: vänlig, diskret, aldrig påträngande. Den är alltid närvarande men tar aldrig över — stor och central när den "har scenen" (välkomstskärmar, firande), liten och undanskymd när användaren ska fokusera på något annat (en fråga i onboardingen). Den försvinner aldrig, den flyttar bara på sig.

### 9.2 Utseende

100% CSS, inga bilder. Komponent: `src/components/auth/NumizGhost.tsx`.

- **Kropp:** en organisk "spöke/droppe"-blob, `border-radius: 52% 48% 46% 54% / 62% 64% 38% 40%` som morfar kontinuerligt (se §9.4). Gradient vit upptill som tonar till temats glödfärg nedtill: `linear-gradient(180deg, #ffffff 48%, {glow}4d 100%)`.
- **Glöd:** ett separat lager bakom kroppen (rör sig INTE med kroppens andning — annars "skakar" ljuset): `radial-gradient(circle, {glow}40 0%, transparent 70%)` + en mjuk `box-shadow`-glöd i samma färg.
- **Ögon:** två runda former (`15% × 19%` av kroppens storlek), mörka (`#23262e`), med en vit "glint" (glansprick) uppe till vänster i varje öga för liv.
- **Mun:** en liten nedåtvänd halvcirkel (`border-radius: 0 0 999px 999px`).
- **Färg:** Numiz glöder alltid i **Mint-teal** (`#6fdccb`), oavsett vilket av de fyra bakgrundstemana som är aktivt. Detta är medvetet — en ljus mintglöd läser bra även mot en mörk bakgrund (`.bg-nocturne`), så det finns ingen anledning att komplicera med per-tema-färger.

### 9.3 Uttryck — "shy" (blyga, slutna ögon)

Utöver standardansiktet ("open") finns ett andra uttryck: **"shy"**, där ögonen ersätts med en liten flack "kupol"-form (samma teknik som munnen, fast upp-och-ner) — läses som ett hopklämt, blygt `^ ^`. Byts via `expression`-propen på `NumizGhost`. En engångs-"blink"-keyframe (`nmzBlink`, `scaleY 0.15 → 1`, 0.3s) spelas automatiskt varje gång uttrycket växlar till "shy", eftersom ögon-elementen då monteras om.

**Användning:** det enda stället "shy" används idag är lösenords-steget i onboardingen — Numiz krymper, tonas ner och drar sig undan till ett hörn **med slutna ögon**, som om den artigt tittar bort medan användaren skriver sitt lösenord. En liten, konkret berättelse ("Numiz vill inte se ditt lösenord") istället för en abstrakt animation.

### 9.4 Den kontinuerliga livs-loopen

Oavsett var Numiz befinner sig eller vilket uttryck den har, kör kroppen **alltid** en 4.8s oändlig loop (`@keyframes nmzGhost`, CSS-klass `.numiz-ghost-body`) som kombinerar fyra saker samtidigt:

1. **Svävning** — `translateY` mellan 0 och -12px
2. **Lutning** — `rotate` mellan -2° och +2.5°
3. **Squash & stretch** — `scale(x, y)` som andas ut/in (t.ex. `scale(0.96, 1.06)`)
4. **Blob-morf** — `border-radius` glider mellan fyra organiska varianter i takt med rörelsen

Detta är vad som gör att Numiz känns levande även när den står "still" — den står aldrig helt still.

### 9.5 Resan — en instans, aldrig återskapad

**Numiz är EN komponent, monterad EN gång** högst upp i `AuthFlow.tsx` — inte en ny instans per skärm. När skärmen byts ändras bara dess mål-position (`x`, `y`, `size`, `opacity` — allt uttryckt i **procent** av skärmen, inte pixlar, så det skalar proportionellt till alla skärmstorlekar), och en CSS-transition (`left/top/width 1.3s`, `opacity 1s`, samma mjuka easing som §8.1) glider den dit. Det är därför den känns som *samma karaktär* som följer med, inte en ny bubbla som dyker upp på varje skärm.

Positionerna definieras i `src/components/auth/ghostJourney.ts`, uttryckta som procent konverterat från en referensram på 393×852px (skala proportionellt om er faktiska ram skiljer sig).

**Per skärm/stadie** (`GHOST_JOURNEY`):

| Stadie | Storlek | Opacitet | Känsla |
|---|---|---|---|
| `start` (Welcome) | 150px-ekvivalent (stor) | 0.95 | Hjälten på scenen, ovanför ordmärket |
| `login` | 70px (medel) | 0.85 | Kliver åt sidan, väntar artigt ovanför rubriken |
| `flow` (bas för onboarding-frågor) | 58px (liten) | 0.9 | Ovanför frågan, stör inte |
| `welcome` (firande efter registrering) | 190px (störst) | 1.0 | Växer, tar mitten av skärmen |
| `home` (landning i riktiga appen) | 36px (minst) | 0.85 | Krymper, "landar" uppe till höger |

**Per onboarding-fråga** (`GHOST_FLOW_STEPS`) — istället för att stå still på EN punkt genom alla sex frågor, flyger Numiz till en tydligt annorlunda plats för varje fråga: större/närmare/mer synlig känns som "kommer nära dig", mindre/genomskinligare/längre bort känns som "flyger iväg". Exempel: tema-frågan har den stor och centrerad (introducerar sig), namn-frågan har den mindre och åt vänster (lite blyg när den lär känna dig), mejl-frågan svischar in stor och nära på höger sida (praktisk, närvarande), adress-frågan flyger långt upp till höger (distraherad, nyfiken), och lösenords-frågan är den speciella "shy"-stunden beskriven i §9.3.

**Regel om ni lägger till fler skärmar/frågor:** ge Numiz en ny post i journey-filen. Den ska alltid: vara med (aldrig helt försvinna, `opacity` går ner mot `0.3` som lägst, aldrig `0`), ha `pointer-events: none` (den är ren dekoration, ska aldrig blockera en tryckning), och resa dit med samma mjuka transition som allt annat.

---

## 10. Läsbarhet & kontrast — checklista

Kör igenom denna **för varje ny skärm eller komponent**, mot **alla fyra teman** (Mint, Färgrik, Ljus, Mörk) — inte bara standardtemat:

1. **Sitter texten direkt på sidans bakgrund** (ingen egen chip/kort)? → använd temamedvetna tokens (`text-foreground`), lägg gärna på en mjuk vit halo-skugga för extra läsbarhet mot "Färgrik" (`[text-shadow:0_1px_16px_rgba(255,255,255,0.9)]`) — den syns knappt mot ljusa bakgrunder och hjälper mot mörka/blandade.
2. **Sitter texten i en yta som ALLTID är ljus** (chip, fält, `.glass-subtle`-knapp)? → fast mörk text (`text-slate-800`/`600`/`400`), **aldrig** `text-foreground`/`text-muted-foreground`. Se §2.5.
3. **Är ytan själv tillräckligt synlig mot en likfärgad bakgrund?** T.ex. en vit swatch/kort på "Ljus"-temat (allt vitt) behöver en egen `border` för att inte försvinna — testa specifikt mot sitt eget tema, inte bara mot de andra tre.
4. **Håller knappar/fält samma rundhet inom samma rad/skärm?** Se §4.
5. **Är kontrasten på platshållartext (`placeholder:`) medvetet satt**, inte bara ärvd? Standard-Input-komponentens platshållarfärg är temamedveten och kan bryta regel 2 ovan.
6. **Om något animerar kontinuerligt** (laddningsvisualisering, pulserande indikator) — kör det ovanpå eller bredvid text? Se till att kontrasten håller genom hela animationscykeln, inte bara i en stillbild.

---

## 11. Vanliga misstag — gör inte om dessa

Allt nedan är riktiga buggar som byggdes in och sedan fixades under utvecklingen av onboarding-/inloggningsflödet. Om något av detta känns bekant medan du bygger något nytt — stanna upp.

- **Godtyckliga pixelvärden** (`h-[58px]`, `rounded-[22px]`) istället för den etablerade skalan (§4). Kopierat rakt av från en extern designspec utan att anpassas till appens egen skala.
- **Temamedveten text i en alltid-ljus yta** → osynlig text i mörkt läge (§2.5). Den enskilt lömskaste buggen — syns inte förrän du faktiskt testar mot "Mörk".
- **Blandad rundhet i samma knapprad** (`rounded-full`-pill bredvid en `rounded-2xl`-knapp).
- **`inset` box-shadow-highlights på en yta som kan hamna på en ljus bakgrund** — designade för mörkare/livligare bakgrunder, blir en "trasig kant" på ljust.
- **Stapla flera `backdrop-blur`-lager** ovanpå varandra, särskilt ovanpå något som animerar kontinuerligt.
- **Animera `box-shadow`/`filter`/`width` direkt** istället för `transform`/`opacity`.
- **Motion-styrd transform + statisk Tailwind-transform-klass på samma element** → den statiska klassen tystas (§8.4).
- **Dynamiskt byggda klassnamn utan `safelist`** → hela CSS-regeln försvinner i produktion utan fel (§8.5).
- **En ny orb/maskot-instans per skärm** istället för en enda persistent instans som reser mellan positioner — bryter känslan av att Numiz "följer med" (§9.5).
- **Forcera ett fast tema på en skärm** "för säkerhets skull" istället för att lösa det faktiska kontrastproblemet — provades en gång (tvinga Mint på Welcome/Login) men motsäger principen "hela appen ska ändras med temat". Lös kontrasten istället för att gömma temat.

---

## 12. Snabbreferens

```
Primär CTA-knapp:        h-12 rounded-2xl, variant="default" (bg-primary text-primary-foreground)
Sekundär frostad knapp:   h-12 rounded-2xl, bg-white/55 backdrop-blur-xl border-2 border-white/80
                          shadow-[0_8px_20px_rgba(0,0,0,0.10)], text-slate-800 (FAST, ej text-foreground)
Hero-fält (en fråga):     h-12 rounded-2xl bg-white/75 text-slate-800 placeholder:text-slate-400
Tätt fält (formulär):     h-10 rounded-xl bg-white/50
Chip/hint på ljus yta:    bg-white/65 backdrop-blur-sm rounded-full px-3 py-1, text-slate-600 (FAST)
Ikonknapp på bakgrund:    .glass-subtle rounded-full, text-slate-700 (FAST)
Rubrik direkt på sidan:   text-xl/2xl font-semibold text-foreground (temamedveten, OK)
                          + valfri halo: [text-shadow:0_1px_16px_rgba(255,255,255,0.9)]
Tema-/hero-kort:          rounded-3xl
Progress-dots:            h-1.5 rounded-full, bg-primary / bg-primary/50 / bg-primary/25

Easing (nästan allt):     cubic-bezier(.3, 1, .35, 1)
Skärmbyte:                0.25s
Stegbyte:                 0.26s
Knapp-fade (validering):  0.35s
Numiz flyger:             1.3s
Numiz blinkar:            0.3s
Numiz andas (loop):       4.8s, oändlig

De fyra teman:            Mint (default) · Färgrik (colorful) · Ljus (white/bg-lumen) · Mörk (black/bg-nocturne)
Numiz glödfärg:           alltid #6fdccb, oavsett tema
```
