

# Plan: Statisk laddbox vid idle + Dynamisk visualisering vid aktivitet

## Koncept
När laddboxen är i **idle-läge** (inget händer) visas den befintliga statiska produktbilden precis som idag. När ett aktivt läge är igång (charging, V2H eller V2G) ersätts bilden med den dynamiska energiflödes-visualiseringen.

## Logik

```text
mode === "idle"     → Statisk laddbox-bild (befintlig design)
mode === "charging" → Dynamisk: Laddbox → pulser → Bil
mode === "v2h"      → Dynamisk: Bil → pulser → Hus
mode === "v2g"      → Dynamisk: Bil → pulser → Elnät
```

## Teknisk implementation

### 1. Ny komponent: `EnergyFlowVisualization.tsx`
Hanterar de tre aktiva lägena med animerade pulser och ikoner.

### 2. Uppdatering av `ChargerSlide.tsx`
Villkorlig rendering baserat på mode:

```text
{mode === "idle" ? (
  // Befintlig statisk laddbox-bild
  <StaticChargerImage />
) : (
  // Ny dynamisk visualisering
  <EnergyFlowVisualization mode={mode} />
)}
```

### 3. Uppdatering av lägesknappen
Cykla genom alla fyra lägen för simulering:
`idle → charging → v2h → v2g → idle`

### 4. Startläge i Index.tsx
Ändra standardvärdet från `"charging"` till `"idle"` så att appen startar i viloläge (mer realistiskt).

## Visuell sammanfattning

```text
┌─────────────────────────────────────────┐
│              IDLE-LÄGE                  │
│                                         │
│         [Statisk laddbox-bild]          │
│              (som idag)                 │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           AKTIVT LÄGE                   │
│                                         │
│   [Källa]  ● ● ● →  [Destination]      │
│            animerade pulser             │
│                                         │
└─────────────────────────────────────────┘
```

## Filer som skapas/ändras

| Fil | Åtgärd |
|-----|--------|
| `src/components/home/EnergyFlowVisualization.tsx` | Skapa ny |
| `src/components/home/slides/ChargerSlide.tsx` | Uppdatera med villkorlig rendering |
| `src/pages/Index.tsx` | Ändra startläge till "idle" |

## Fördelar med denna lösning
- **Igenkänning**: Kunden ser sin bekanta laddbox när allt är lugnt
- **Tydlig indikation**: När något händer syns det direkt genom den animerade visualiseringen
- **Smidig övergång**: Animerad transition mellan statisk och dynamisk vy

