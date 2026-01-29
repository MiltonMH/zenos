

# Schemaläggning för Laddning

## Översikt

Skapar en snygg och användarvänlig schemaläggningsfunktion för laddning med tre olika komplexitetsnivåer. Designen följer appens befintliga glasmorfism-estetik och är tydligt märkt för LADDNING.

---

## De tre lägena

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         LÄGE 1: Enkla dagar                             │
│                                                                         │
│   "Vilka dagar vill du ladda?"                                         │
│                                                                         │
│   [ Mån ] [ Tis ] [ Ons ] [ Tor ] [ Fre ] [ Lör ] [ Sön ]              │
│     ✓             ✓                       ✓                            │
│                                                                         │
│   Laddar: Måndag, Onsdag, Lördag                                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     LÄGE 2: Dagar + gemensam tid                        │
│                                                                         │
│   "Välj dagar och en laddtid som gäller alla valda dagar"              │
│                                                                         │
│   [ Mån ] [ Tis ] [ Ons ] [ Tor ] [ Fre ] [ Lör ] [ Sön ]              │
│     ✓             ✓                       ✓                            │
│                                                                         │
│   ┌─────────────────────────────────────┐                              │
│   │  Laddtid för alla valda dagar       │                              │
│   │  Start: [21:00 ▼]  Slut: [06:00 ▼]  │                              │
│   └─────────────────────────────────────┘                              │
│                                                                         │
│   Laddar: Mån, Ons, Lör kl 21:00-06:00                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   LÄGE 3: Individuella tider per dag                    │
│                                                                         │
│   "Ställ in unik laddtid för varje dag"                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────┐              │
│   │ ⚡ Måndag                                           │              │
│   │    Start: [21:00 ▼]    Slut: [06:00 ▼]             │              │
│   └─────────────────────────────────────────────────────┘              │
│                                                                         │
│   ┌─────────────────────────────────────────────────────┐              │
│   │ ⚡ Tisdag                                           │              │
│   │    Start: [22:00 ▼]    Slut: [06:00 ▼]             │              │
│   └─────────────────────────────────────────────────────┘              │
│                                                                         │
│   ┌─────────────────────────────────────────────────────┐              │
│   │ + Lägg till dag                                     │              │
│   └─────────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Design

### Visuella element

| Element | Stil |
|---------|------|
| Header | Ikon (Zap/BatteryCharging) + "Laddschema" |
| Lägeval | Pill-toggle med 3 val |
| Dagväljare | Cirkulära knappar med check-animation |
| Tidväljare | Select-dropdowns (00:00-23:00) |
| Aktiv dag | Primary-färg med glow-effekt |
| Inaktiv dag | Subtil glass-effekt |

### Färgkodning

- **Aktiv ladddag**: `bg-primary` (teal)
- **Inaktiv dag**: `bg-white/20`
- **Tidsval**: `glass-subtle` bakgrund
- **Header-ikon**: BatteryCharging i primary-färg

---

## Komponentstruktur

```text
ChargingSchedulePage/
├── ChargingScheduleHeader     # Titel med laddningsikon
├── ScheduleModeSelector       # Pill-toggle för 3 lägen
├── DaySelector                # Cirkulära dagknappar
├── TimeRangePicker            # Start/slut-tid dropdowns
├── IndividualDaySchedule      # Lista med dag + egen tid
└── ScheduleSummary            # Visar aktuellt schema
```

---

## Teknisk Implementation

### Nya filer

| Fil | Beskrivning |
|-----|-------------|
| `src/pages/ChargingSchedule.tsx` | Huvudsida för schemaläggning |
| `src/components/schedule/ScheduleModeSelector.tsx` | Pill-toggle för lägeval |
| `src/components/schedule/DaySelector.tsx` | Interaktiva dagknappar |
| `src/components/schedule/TimeRangePicker.tsx` | Tid-väljare med dropdowns |
| `src/components/schedule/IndividualDaySchedule.tsx` | Lista för läge 3 |
| `src/components/schedule/ScheduleSummary.tsx` | Sammanfattning av schema |

### Uppdaterade filer

| Fil | Ändring |
|-----|---------|
| `src/pages/Index.tsx` | Lägg till navigation till schemaläggning |
| `src/components/charger/ChargingScheduleCard.tsx` | Länka till schemaläggningssida |

### State-struktur

```typescript
interface ScheduleState {
  mode: "days-only" | "days-with-time" | "individual-times";
  selectedDays: string[]; // ["mon", "wed", "sat"]
  globalTimeRange: {
    start: string; // "21:00"
    end: string;   // "06:00"
  };
  individualSchedules: {
    day: string;
    start: string;
    end: string;
  }[];
}
```

---

## Användarflöde

1. Användaren öppnar schemaläggningen via "Se hela schemat" i ChargingScheduleCard
2. Väljer läge med pill-toggle högst upp
3. Beroende på läge:
   - **Läge 1**: Klicka på dagar att aktivera
   - **Läge 2**: Klicka på dagar + ställ in gemensam tid
   - **Läge 3**: Lägg till dagar individuellt med egna tider
4. Sparar schemat med knapp längst ner
5. Återgår till huvudskärmen

---

## Interaktioner och feedback

- **Haptic feedback** vid dagval och lägesbyten
- **Animerade övergångar** med Framer Motion
- **Tydlig bekräftelse** när schema sparas
- **Sammanfattningsvy** som visar aktuellt schema

