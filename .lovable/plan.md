
# Plan: Volvo-inspirerad pulserande batterinivå-indikator

## Koncept
Lägga till ett subtilt pulserande grönt block som bakgrund bakom batterinivå-sektionen. Blocket ska vara positionerat **mellan** texten "Laddar..." (ovan) och "Batterinivå" (under) – alltså omsluta bara själva progress-baren.

## Visuell referens (från Volvo-appen)

```text
┌─────────────────────────────────────┐
│  Batterinivå            Laddar...   │  ← Text ovanför (UTANFÖR blocket)
├─────────────────────────────────────┤
│  ╔═══════════════════════════════╗  │
│  ║   ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░   ║  │  ← Pulserande grönt block
│  ╚═══════════════════════════════╝  │     med progress-bar inuti
├─────────────────────────────────────┤
│  52%                      ~2h kvar  │  ← Text under (UTANFÖR blocket)
└─────────────────────────────────────┘
```

## Teknisk implementation

### Fil: `src/components/home/EnergyFlowVisualization.tsx`

**Ändringar i batterinivå-sektionen (rad 173-207):**

1. **Ny wrapper-struktur:**
   - Flytta ut "Batterinivå" och "Laddar..." texten ovanför det gröna blocket
   - Flytta ut "52%" och "~2h kvar" texten under det gröna blocket

2. **Skapa det gröna pulserande blocket:**
   - Omsluter bara progress-baren
   - Använder `framer-motion` för subtil pulsande animation (opacity/scale)
   - Rundade hörn med `rounded-xl` för mjuk look
   - Semi-transparent grön bakgrund som matchar `--energy-charging` färgen

3. **Animations-specifikation:**
   ```tsx
   <motion.div
     animate={{
       opacity: [0.6, 0.8, 0.6],
       scale: [1, 1.01, 1],
     }}
     transition={{
       duration: 2.5,
       repeat: Infinity,
       ease: "easeInOut",
     }}
     className="rounded-xl px-4 py-3"
     style={{ backgroundColor: `${config.color}25` }}
   >
     {/* Progress bar här */}
   </motion.div>
   ```

## Slutlig layout

```text
Batterinivå               Laddar...     ← Vanlig text (ej i blocket)

╭─────────────────────────────────────╮
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░   │  ← Pulserande grönt block
╰─────────────────────────────────────╯     med progress-bar inuti

52%                          ~2h kvar     ← Vanlig text (ej i blocket)
```

## Filer som ändras

| Fil | Åtgärd |
|-----|--------|
| `src/components/home/EnergyFlowVisualization.tsx` | Uppdatera batterinivå-sektionen med pulserande bakgrundsblock |

## Fördelar
- **Volvo-känsla**: Följer samma designspråk som referensbilden
- **Subtilt**: Blocket täcker inte för mycket, bara det viktiga
- **Pulserande**: Ger liv åt laddningsindikatorn utan att vara för distraherande
- **Konsekvent**: Använder samma gröna färg som resten av laddnings-UI:t
