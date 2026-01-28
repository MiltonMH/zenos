

## Haptic Feedback för Karusellnavigering

### Översikt
Lägger till haptic feedback (vibration) när användaren swiper mellan sektioner i karusellerna. Detta ger en mer native app-känsla på iOS och Android.

### Vad som händer
När du swiper mellan slides på hem- eller inställningssidan kommer telefonen ge en lätt "knäpp"-känsla - samma typ av feedback som när du scrollar genom en lista i en native app.

---

## Teknisk Implementation

### 1. Installera Capacitor Haptics Plugin
```bash
npm install @capacitor/haptics
```

### 2. Skapa en återanvändbar haptics-hook
**Ny fil: `src/hooks/useHaptics.ts`**

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export function useHaptics() {
  const isNative = Capacitor.isNativePlatform();

  const lightImpact = async () => {
    if (isNative) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  const selectionChanged = async () => {
    if (isNative) {
      await Haptics.selectionChanged();
    }
  };

  return { lightImpact, selectionChanged };
}
```

### 3. Integrera i HomeCarousel
**Fil: `src/components/home/HomeCarousel.tsx`**

- Importera `useHaptics`
- Anropa `selectionChanged()` när slide ändras via swipe
- Anropa `lightImpact()` vid tap på dot-indikatorer

### 4. Integrera i SettingsCarousel
**Fil: `src/components/settings/SettingsCarousel.tsx`**

- Samma mönster som HomeCarousel
- Haptic feedback vid swipe och tab-klick

---

## Sammanfattning av ändringar

| Fil | Ändring |
|-----|---------|
| `package.json` | Lägg till `@capacitor/haptics` |
| `src/hooks/useHaptics.ts` | Ny hook för haptic feedback |
| `src/components/home/HomeCarousel.tsx` | Trigga haptics vid navigation |
| `src/components/settings/SettingsCarousel.tsx` | Trigga haptics vid navigation |

---

## Notera
- Haptic feedback fungerar endast på fysiska enheter (iOS/Android)
- I webbläsaren/preview ignoreras anropen utan fel
- Efter implementation, kör `npx cap sync` för att synka plugin till native-projekten

