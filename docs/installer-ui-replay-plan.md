# ZenOS UI + Numiz Integration — Replay Plan

**Purpose:** Run this document as an agent prompt starting from `git checkout origin/main` to reproduce **all** current Numiz backend integrations in ZenOS (customer + installer + metrics/prices + schedule + settings), including behavioral nuances discovered during implementation.

**Repos:**
- Frontend: `zenos` (this repo)
- Backend: `numiz-git` (TASK-17 installer APIs + metrics/prices/schedule/settings endpoints)

**Living summary (shorter):** [`INTEGRATION.md`](./INTEGRATION.md)

**Previous scope:** This plan superseded the installer-only replay (2026-07-19). Installer phases are retained as **Part B**; customer/metrics/schedule work is **Part A**.

---

## 1. Goal

From a clean `main` branch, wire ZenOS to Numiz so that:

| Layer | Hook / provider | Backend |
|-------|-----------------|---------|
| Customer bootstrap | `SiteDataProvider` | `/users/me`, `/sites`, devices, sessions, vehicles, entitlements, value summary, installer info |
| Metrics & prices | `MetricsDataProvider` | `/metrics`, `/charging-history`, `/prices` |
| Settings writes | `useChargingSettings` | `GET/PUT /devices/{id}/charging-settings` |
| Charging schedule | `useChargingSchedule` | `GET/PUT /vehicles/{id}/charging-schedules` |
| Installer mode | `useInstallerData` | `/installer/companies/me`, `/installer/installations`, POST add-flow |

Every API-backed control uses **`DataSourceField`** (blue = server, red = mock/missing).

**Still mock / local (do not wire in this replay unless explicitly noted):**
- Home carousel **mode** (`idle`/`charging`/`v2h`/`v2g`) and **battery %** — local `useState` in `Index.tsx`
- Charger lock button — `localStorage`
- Restart charger — toast only (backend 501)
- Installer schedule modal — no `SiteDataProvider` vehicle → red border + save disabled
- `PUT /installer/companies/me` (company edit in installer `EditProfile`)

---

## 2. Backend & demo prerequisites

### 2.1 Env (zenos)

```env
VITE_NUMIZ_API_URL=http://localhost:8080
```

Vite dev proxy: `/numiz-api` → backend. Client: `src/lib/numiz-api.ts` → `numizAuthFetch`.

### 2.2 Demo credentials

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Site owner | `owner@demo.local` | `owner123` | Customer mode, `GET /sites` populated |
| Installer | `installer@demo.local` | `installer123` | No customer site; installer APIs only |

Demo fleet (after backend seed): charger `SN-V2X-0001`, pin `4321`, Tesla Model Y on demo site, `Demo Site 4321`.

### 2.3 Backend seed extras (numiz-git)

Required for Profile/EditProfile acceptance checks:
- `DataSeeder` — demo user phone backfill
- `FleetSeeder.ensureDemoChargerPinCode()` — pin `4321`
- `FleetSeeder.ensureDemoVehicle()` — Tesla Model Y
- `InstallerSeeder` — demo site name prefix `Demo Site`

### 2.4 Demo metrics SQL (zenos — **after** first backend boot)

Statistics/history read from `energy_events`. Apply once fleet exists:

```bash
psql -U numiz -d numiz -f docs/demo-charging-history-seed.sql
```

(`docs/demo-metrics-seed.sql` is an alias.) Source shapes: `src/lib/statistics-data.ts`.

| Mock | API |
|------|-----|
| `chargingHistory` | `GET /charging-history` |
| `dailyData` / `weeklyData` / `monthlyData` / `yearlyData` | `GET /metrics?period=…` |

Cost kr in UI comes from backend spot pricing, not mock kr literals.

### 2.5 Key API endpoints (customer)

| Endpoint | Used by |
|----------|---------|
| `GET /users/me` | `useSiteData`, role gates |
| `GET /sites` | `useSiteData` — **empty for pure INSTALLER** |
| `GET /sites/{id}/devices`, `/sessions`, `/vehicles`, `/entitlements` | `useSiteData` |
| `GET /value/summary?siteId=&currency=` | `useSiteData` — pass `site.currency ?? "SEK"` |
| `GET /sites/{id}/installer` | `useSiteData` (404 → null) |
| `GET /devices/{id}` | Charger/meter DER + `pinCode` |
| `GET /devices/{id}/charging-settings` | `useChargingSettings` |
| `PUT /devices/{id}/charging-settings` | Settings sliders/toggles |
| `GET /metrics?siteId=&currency=&period=` | `useMetricsData` |
| `GET /charging-history?siteId=&start=&end=` | `useMetricsData` (30d window) |
| `GET /prices?from=&to=&siteId=` | `useMetricsData` (today + tomorrow) |
| `GET /vehicles/{id}/charging-schedules` | `useChargingSchedule` |
| `PUT /vehicles/{id}/charging-schedules` | Schedule modal save — **replaces all** schedules |

### 2.6 Key API endpoints (installer)

See **Part B §B.1** — unchanged from TASK-17.

---

## 3. Architecture

```mermaid
flowchart TB
  subgraph app [App.tsx authenticated route]
    SDP[SiteDataProvider]
    MDP[MetricsDataProvider]
    IDX[Index]
    SDP --> MDP --> IDX
  end

  subgraph customer [Customer data]
    SDP --> ME[GET /users/me + sites fan-out]
    MDP --> MET[GET /metrics + history + prices]
    SCH[useChargingSchedule on modal open]
    SCH --> VSCH[GET/PUT vehicle charging-schedules]
    SET[useChargingSettings in Settings]
    SET --> CS[GET/PUT charging-settings]
  end

  subgraph installer [Installer mode - Index gate]
    UID[useInstallerData when mode=installer]
    UID --> INS[/installer/*]
  end

  subgraph stable [HMR-stable context]
    SDC[site-data-context.ts SiteDataContext]
    SDP --> SDC
    MDP --> SDC
    SCH --> SDC
  end
```

**Provider order (mandatory):** `SiteDataProvider` → `MetricsDataProvider` → `Index`.

`MetricsDataProvider` must **not** call `useSiteData()` (throws). Use `useContext(SiteDataContext)` with safe fallbacks so HMR and partial trees do not crash.

**Separate context module:** `src/hooks/site-data-context.ts` exports `SiteDataContext` so Vite HMR does not recreate context identity when `useSiteData.tsx` hot-reloads.

---

## 4. Mandatory UI rule: DataSourceField

Component: `src/components/ui/data-source-field.tsx`. Settings alias: `src/components/settings/ApiField.tsx`.

| Outline | Meaning |
|---------|---------|
| Blue `ring-sky-500/80` | Value from API |
| Red `ring-red-500/80` | Mock / missing / fetch failed |

Drive `fromApi` from explicit flags (`view.fromApi.*`, `useMetricsData().fromApi.*`, hook `fromApi`), never from “page loaded”.

**Wrap:** Profile, EditProfile, Settings, Statistics, MonthStatsSlide, EnergyPriceSlide (stats + chart), ChargingScheduleModal form, installer cards.

**Do not wrap:** Language, background picker, local home mode/battery, charger lock.

---

## Part A — Customer integrations (2026-07 / metrics & schedule wave)

Execute phases **A1 → A10** in order. Each phase should compile (`npm run build`).

### Phase A1 — Types (`src/lib/numiz-types.ts`)

Add/fix:

- **ValueSummary** nested shape: `{ total, charge, discharge, eventCount }` each `ValueAmount` `{ kwh, price }`
- **MetricsSummary**, **MetricsPeriod**, **ChargingHistoryEvent**
- **PricePoint** — `time: Date` (parsed after fetch); **PricePointResponse** for wire JSON
- **ChargingSettings**, **UpdateChargingSettingsRequest**, **OptimizationMode**, **SocLimitSource**
- **ChargingSchedule**, **UpdateChargingSchedulesRequest**, **ChargingScheduleWrite**
- Installer types (if missing on main): §Part B

### Phase A2 — API client (`src/lib/numiz-api.ts`)

Add/fix:

- `fetchMetrics(siteId, currency, period)`
- `fetchChargingHistory(siteId, start, end)`
- `fetchPrices(from, to, siteId?)` + `fetchCurrentPrice` — normalize via `normalizePricePoint`
- `fetchValueSummary(siteId, currency, …)` — **currency required**
- `fetchChargingSettings` / `updateChargingSettings`
- `fetchChargingSchedules` / `updateChargingSchedules`
- Installer endpoints + `NumizForbiddenError` (Part B)

All price responses: map through `normalizePricePoint` so `time` becomes `Date`.

### Phase A3 — Mappers (`src/lib/numiz-mappers.ts`)

**Stats / metrics:**
- `mapValueSummaryToStats` — `v2h` = **`summary.discharge.kwh`** (not charge)
- `mapUiPeriodToMetricsPeriod` — D→TODAY, W→THIS_WEEK, M→THIS_MONTH, Y→THIS_YEAR
- `mapMetricsBreakdownToChart(breakdown, period, dayLabels, …)` → `ChartRow[]`
- `mapChargingHistoryToUi(events, locale)`
- `statsFromMetricsSummary`

**Prices (critical nuances):**
- `normalizePricePoint` / `parsePriceTime` — ISO without `Z` parses as **local** time
- `pricePointMinutesSinceMidnight` — chart X must use **minutes**, not `getHours()` only (API returns **15‑min** slots)
- `filterPricePointsForLocalDay` — drop next-day midnight spillover (e.g. `2026-07-30T00:00:00` in “today” payload)
- `findCurrentPricePoint` — nearest slot within 15 min, else latest point ≤ now
- `fillPricePointsDay` — filter to calendar day; fallback hourly mock only when empty + no API
- `formatPricePointClock` — `HH:MM` for min/max/current labels
- `buildPriceDayRange("today" | "tomorrow")`

**Schedule (critical nuances):**
- `mapChargingSchedulesToUi` / `mapUiScheduleToApi`
- **Charge target order:** 1st = **start time → charge 0**, 2nd = **end time → charge 100**
- **Do not sort targets by clock time** — preserves UI start/end semantics (backend `ControlLoop.targetCharge` uses max of elapsed targets)
- `PUT` body replaces **entire** schedule list; UI sends single schedule `{ days, target: [start, end] }`
- Day mapping: `KEY_TO_DAY` / `DAY_TO_KEY` (`MONDAY` ↔ `mon`)

### Phase A4 — Stable site context

**New file:** `src/hooks/site-data-context.ts`

```typescript
export const SiteDataContext = createContext<SiteDataContextValue | null>(null);
```

**Update `useSiteData.tsx`:** import context from above; export `useSiteData()` unchanged.

### Phase A5 — `useSiteData` fixes (verify on main)

- `fetchValueSummary(primarySite.id, primarySite.currency ?? "SEK")`
- Phone: `fromApi.phone = hasApiData ? Boolean(me) : Boolean(apiPhone)`; EditProfile must not show mock phone when `hasApiData`
- `chargerPinCode` from `GET /devices/{id}` (`Device.pinCode`)
- `mapVehicleLabel` → `carModel` + `fromApi.carModel`
- `view.fromApi.*` per field for Profile/Settings borders

### Phase A6 — `useMetricsData` + provider

**New file:** `src/hooks/useMetricsData.tsx`

- Context: `MetricsDataContextValue` with `period`, `stats`, `chartData`, `chartXKey`, `history`, `pricesToday`, `pricesTomorrow`, `loading`, `fromApi: { stats, history, prices }`, `refetch`
- Read site via `useContext(SiteDataContext)` — **not** `useSiteData()`
- When `!isAuthenticated || !site || !hasApiData`: clear API state, use mocks from `statistics-data.ts`, `fromApi` all false
- On success: parallel fetch metrics (mapped period), history (30d), prices today + tomorrow
- `stats`: API `statsFromMetricsSummary(metrics)` ?? `getStatsForPeriod(period)` mock
- `chartData`: API breakdown ?? localized mock chart
- `history`: mapped API ?? mock history with string ids
- `fromApi.stats` = metrics has `eventCount > 0`; `history` = API returned rows; `prices` = today length > 0

**Wire in `App.tsx`:**

```tsx
<SiteDataProvider>
  <MetricsDataProvider>
    <Index … />
  </MetricsDataProvider>
</SiteDataProvider>
```

### Phase A7 — Settings write path

**File:** `src/hooks/useChargingSettings.ts`

- Load `GET /devices/{chargerDevice.id}/charging-settings`
- Debounced PUT (500ms) for SoC sliders; immediate PUT for toggles/mode
- `canWrite` = role `SITE_OWNER` | `ADMIN`
- `socLocked` when `socLimitSource === "defaults"` (unknown vehicle)
- `SettingsCarousel`: combine `useSiteData` (status/firmware read-only) + `useChargingSettings` (writable fields)
- Per-control `fromApi` + `DataSourceField` on StatusSlide / OptimizationSlide

### Phase A8 — Charging schedule

**New file:** `src/hooks/useChargingSchedule.ts`

- On modal open: if `vehicleId` + `hasApiData`, `GET …/charging-schedules`
- Save: `PUT …/charging-schedules` via `mapUiScheduleToApi`
- No vehicle / installer context / fetch error → `FALLBACK_UI_CHARGING_SCHEDULE`, `fromApi: false`, save disabled

**Update:** `src/components/schedule/ChargingScheduleModal.tsx`
- Wrap scheduler form in `DataSourceField fromApi={fromApi}`
- Loading spinner while fetching; saving state on button

### Phase A9 — UI wiring

| File | Change |
|------|--------|
| `src/pages/Statistics.tsx` | `useMetricsData`; sync local period state; `DataSourceField` on stats/chart/history |
| `src/components/home/slides/MonthStatsSlide.tsx` | `useMetricsData`; set period `"M"`; borders |
| `src/components/home/slides/EnergyPriceSlide.tsx` | Prices from `useMetricsData`; today/tomorrow tabs; min/**current**/max cards (current today only); chart nuances below |
| `src/pages/Profile.tsx`, `EditProfile.tsx` | Already wired — verify borders |
| `src/pages/Index.tsx` | Schedule modal unchanged entry point |

**EnergyPriceSlide chart nuances:**
- Default box width **260px**; user resizes by dragging **right edge of outer glass card** (not a separate grip)
- Chart SVG width tracks inner content via `ResizeObserver` on chart area
- 15‑min API data: X = `minutesSinceMidnight / 1440`
- Min/max/current marker indices from array scan, not `hour === …`

### Phase A10 — Docs & seeds

| File | Action |
|------|--------|
| `docs/demo-charging-history-seed.sql` | PostgreSQL seed for owner demo fleet |
| `docs/demo-metrics-seed.sql` | `\i` alias |
| `docs/INTEGRATION.md` | Screen matrix + seed instructions |

### Phase A11 — Router HMR (optional but current)

`BrowserRouter` future flags: `v7_startTransition`, `v7_relativeSplatPath` — silences v6 deprecation warnings.

---

## Part B — Installer integration (2026-07-19, TASK-17)

Execute **after** Part A provider bootstrap exists. Phases B1–B7 match the original installer replay.

### B.1 Backend prerequisite

| Endpoint | Who |
|----------|-----|
| `GET /installer/companies/me` | INSTALLER, ADMIN |
| `GET /installer/installations` | INSTALLER, ADMIN |
| `POST /installer/installations` | INSTALLER |

Pure INSTALLER: `GET /sites` returns `[]` — installations only via `/installer/installations`.

### B.2 Phase B1 — Installer types, API, mappers

Same as original plan §5 Phase A (installer types, `fetchInstaller*`, `mapInstallationToUnit`, etc.).

### B.3 Phase B2 — `useInstallerData`

Fetch when `enabled === true` only; fallback to `installer-mock-data` on error.

### B.4 Phase B3 — `useInstallerApp`

UI state only; accept `units` from parent.

### B.5 Phase B4 — `Index.tsx` installer wiring

```typescript
const canUseInstallerApis = me?.role === "INSTALLER" || me?.role === "ADMIN";
const installerData = useInstallerData(mode === "installer" && canUseInstallerApis);
```

### B.6 Phase B5 — Mode switching (E1–E4)

Critical behaviors — **must match exactly:**

| Id | Behavior |
|----|----------|
| E1 | INSTALLER + no site → auto `setMode("installer")` after `verifyInstallerAccess`, informational toast |
| E2 | `trySwitchToCustomerView()` blocks when `!site` |
| E3 | Customer → installer: verify access; 403 toast on failure |
| E4 | SITE_OWNER with stale `localStorage numiz-dev-app-mode=installer` → reset to customer, **no** installer API calls |

Strings: `src/lib/profile-i18n.ts` → `devMode.*`

### B.7 Phase B6 — Installer UI components

- `InstallerDashTab` / `InstallerHemTab` — `DataSourceField` per unit/card
- `InstallerProfilTab` — **match** customer `Profile.tsx` layout (language, background, dashed DEV rows, single edit footer)
- `InstallerAddFlow` — POST `createInstallerInstallation`, `buildCreateInstallationRequest` defaults (`gridArea: SE3`, `currency: SEK`, `deviceType: v2x_charger`)

### B.8 Phase B7 — Toast duration

`use-toast.ts` + `sonner.tsx`: **10s** default duration.

---

## 5. Complete file checklist

| File | Part | Action |
|------|------|--------|
| `src/lib/numiz-types.ts` | A,B | All types above |
| `src/lib/numiz-api.ts` | A,B | All fetch/put helpers |
| `src/lib/numiz-mappers.ts` | A,B | Metrics, prices, schedule, installer mappers |
| `src/hooks/site-data-context.ts` | A | **Create** stable context |
| `src/hooks/useSiteData.tsx` | A | Context import; currency on value summary; view flags |
| `src/hooks/useMetricsData.tsx` | A | **Create** provider + hook |
| `src/hooks/useChargingSettings.ts` | A | Settings GET/PUT |
| `src/hooks/useChargingSchedule.ts` | A | **Create** schedule GET/PUT |
| `src/hooks/useInstallerData.tsx` | B | **Create** |
| `src/hooks/useInstallerApp.ts` | B | UI-only state |
| `src/App.tsx` | A | Provider nesting + router future flags |
| `src/pages/Statistics.tsx` | A | Metrics hook |
| `src/components/home/slides/MonthStatsSlide.tsx` | A | Metrics hook |
| `src/components/home/slides/EnergyPriceSlide.tsx` | A | Prices + chart UX |
| `src/components/schedule/ChargingScheduleModal.tsx` | A | Schedule hook + border |
| `src/components/settings/SettingsCarousel.tsx` | A | Charging settings |
| `src/pages/Index.tsx` | B | Installer gates + mode effects |
| `src/components/installer/*` | B | Installer UI |
| `src/pages/EditProfile.tsx` | A | Phone/pin mock suppression |
| `docs/demo-charging-history-seed.sql` | A | Demo DB seed |
| `docs/INTEGRATION.md` | A | Integration summary |

---

## 6. Test plan (acceptance)

### 6.1 SITE_OWNER (`owner@demo.local`)

**Bootstrap**
- [ ] Network: `/users/me`, `/sites`, devices, vehicles, value summary (with currency query param)
- [ ] No `/installer/*` unless dev toggle attempted

**Profile / Settings**
- [ ] Blue borders on wired Profile/EditProfile fields
- [ ] Phone from API (empty string if null — not mock)
- [ ] Charger PIN `4321` blue from device detail
- [ ] Settings SoC/V2H/V2G/mode blue; sliders persist after reload

**Metrics (after SQL seed)**
- [ ] Statistics page: blue borders; chart/history change by period
- [ ] Home month stats slide: blue when API has events
- [ ] History list shows seeded sessions

**Prices**
- [ ] Energy price slide: blue when `/prices` returns data
- [ ] Chart smooth left-to-right (no zigzag from hourly X on 15‑min data)
- [ ] Today tab: min / **current** / max cards; current only on today
- [ ] “Current” matches nearest 15‑min slot

**Schedule**
- [ ] Open schedule modal → `GET …/charging-schedules` (blue if vehicle linked)
- [ ] Save → `PUT` with targets `[{ start, charge: 0 }, { end, charge: 100 }]` in UI order
- [ ] Re-open modal → persisted days/times

**Still mock**
- [ ] Home charger mode/battery — red/no API border on mode control

### 6.2 INSTALLER (`installer@demo.local`)

- [ ] Auto installer view + toast (no customer site)
- [ ] `/installer/companies/me` + `/installations` only in installer mode
- [ ] Dash/Hem blue borders when API ok
- [ ] Profil layout matches customer Profile
- [ ] Dev toggle to customer blocked (no site)
- [ ] Schedule modal: red border, save disabled (no vehicle in installer context)

### 6.3 Stale localStorage

- [ ] SITE_OWNER + `numiz-dev-app-mode=installer` → resets customer, no installer calls

### 6.4 HMR dev

- [ ] Edit arbitrary file (e.g. `EditProfile.tsx`) — no `useSiteData must be used within SiteDataProvider` crash

### 6.5 Build

- [ ] `npm run build` passes

---

## 7. Agent prompt template

Copy into a new chat on `zenos` checked out from `origin/main` (backend running, demo seed applied):

```
Implement all ZenOS ↔ Numiz UI integrations exactly as specified in
docs/installer-ui-replay-plan.md (Part A phases A1–A11, then Part B B1–B7).

Constraints:
- Start from origin/main; follow CLAUDE.md product philosophy and numiz-design skill.
- DataSourceField on every API-backed field (blue/red borders).
- Provider order: SiteDataProvider → MetricsDataProvider → Index.
- site-data-context.ts for HMR-stable SiteDataContext.
- MetricsDataProvider uses useContext(SiteDataContext), not useSiteData().
- Price chart: 15-min X-axis by minutes; filter spillover midnight; resizable card edge default 260px.
- Schedule PUT: start→charge 0, end→charge 100, no time sort on targets.
- Do NOT wire home mode/battery to API.
- Installer mode gates E1–E4 must match plan table.
- Apply demo SQL seed docs; document in INTEGRATION.md.
- Do not commit unless asked.

After implementation, run npm run build and verify section 6 test plan.
```

---

## 8. Known limitations / follow-ups

1. **Home mode & battery** — local simulation; sessions exist in API but not bound to carousel.
2. **Installer customer view** — `GET /sites` empty for pure installer; no shared customer bootstrap.
3. **EditProfile in installer mode** — customer-centric; company PUT not wired.
4. **Overnight schedule window** — backend `targetCharge` uses same-calendar-day LocalTime; overnight UI ranges may not match control-loop semantics perfectly.
5. **Single schedule entry** — UI edits one combined schedule; PUT replaces full list.
6. **Metrics fallback** — partial API failure falls back to mocks per resource with red borders.
7. **Duplicate `verifyInstallerAccess` + `useInstallerData` fetch** on installer login — acceptable dev cost.

---

## 9. History reference

| Date | Work |
|------|------|
| 2026-07-19 | Installer UI + TASK-17 (Part B) |
| 2026-07-20 | EditProfile phone/PIN, demo vehicle seed |
| 2026-07-29+ | Metrics, prices, statistics, schedule, settings, price chart fixes, SQL seeds, site-data-context HMR |

Backend archive: `numiz-git/docs/chat-archives/task-17-installer-backend-2026-07-18.md`
