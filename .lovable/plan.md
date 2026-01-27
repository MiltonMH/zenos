

# Plan: Förbättra menyns UI/UX

## Mål
Göra bottenmenyn mer visuellt tilltalande genom rundare hörn och större ikoner.

## Ändringar

### 1. Rundare hörn
- **Yttre container**: Öka från `rounded-[2rem]` till `rounded-[2.5rem]` (40px) för att matcha huvudkortets rundning
- **Aktiv indikator**: Öka från `rounded-xl` till `rounded-2xl` för mjukare känsla

### 2. Större ikoner
- **Ikonstorlek**: Öka från `w-5 h-5` (20px) till `w-6 h-6` (24px)
- **Text**: Behålla `text-xs` för balans, alternativt öka till `text-sm` om det ser bättre ut

### 3. Förbättrad spacing (valfritt)
- Justera padding för att ge ikonerna mer utrymme med den nya storleken

## Teknisk implementation

**Fil:** `src/components/layout/AppBottomNav.tsx`

```text
Före:
- rounded-[2rem] → rounded-[2.5rem]
- rounded-xl → rounded-2xl  
- w-5 h-5 → w-6 h-6
```

## Visuellt resultat
Menyn kommer kännas mer konsekvent med appens övriga design (huvudkortet har redan `rounded-[2.5rem]`) och ikonerna blir tydligare och lättare att trycka på.

