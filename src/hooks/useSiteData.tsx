import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readBasicSession } from "@/lib/auth-config";
import {
  findChargerDer,
  findChargerDevice,
  findMeterDer,
  findMeterDevice,
  findSessionForDer,
  firstNameFromEmail,
  mapBatteryLevel,
  mapChargerModel,
  mapChargingMode,
  mapFirmwareVersion,
  mapFuseFromAttributes,
  mapIsPremium,
  mapVehicleLabel,
  mapValueSummaryToStats,
} from "@/lib/numiz-mappers";
import {
  fetchDevice,
  fetchEntitlements,
  fetchSessions,
  fetchSiteDevices,
  fetchSiteInstaller,
  fetchSites,
  fetchUserMe,
  fetchValueSummary,
  fetchVehicles,
  NumizAuthError,
} from "@/lib/numiz-api";
import type {
  Der,
  Device,
  EntitlementView,
  MeResponse,
  Site,
  SiteInstallerResponse,
  ValueSummary,
  Vehicle,
  VehicleSession,
} from "@/lib/numiz-types";
import type { ChargingMode } from "@/lib/installer-mock-data";
import { mockUser } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

export interface SiteDashboardView {
  email: string | null;
  displayName: string | null;
  firstName: string;
  phone: string | null;
  carModel: string | null;
  vehicleVin: string | null;
  isPremium: boolean;
  chargerModel: string | null;
  chargerSerial: string | null;
  chargerPinCode: string | null;
  chargerVersion: string | null;
  isOnline: boolean;
  batteryLevel: number;
  chargingMode: ChargingMode;
  fuse: string | null;
  address: string | null;
  siteName: string | null;
  gridArea: string | null;
  currency: string | null;
  gridCompany: string | null;
  electricityProvider: string | null;
  /** Site installer company name (customer-facing). */
  installer: string | null;
  installerPhone: string | null;
  installerContactName: string | null;
  /** DER SoC limits for settings (from charger port). */
  maxChargeSoc: number | null;
  minDischargeSoc: number | null;
  derStatus: string | null;
  apiTotals: { charged: number; v2h: number; cost: number } | null;
  fromApi: {
    email: boolean;
    displayName: boolean;
    phone: boolean;
    carModel: boolean;
    isPremium: boolean;
    chargerModel: boolean;
    chargerSerial: boolean;
    chargerPinCode: boolean;
    chargerVersion: boolean;
    fuse: boolean;
    address: boolean;
    gridCompany: boolean;
    electricityProvider: boolean;
    installer: boolean;
    derLimits: boolean;
  };
}

export interface SiteDataContextValue {
  me: MeResponse | null;
  site: Site | null;
  siteInstaller: SiteInstallerResponse | null;
  devices: Device[];
  chargerDevice: Device | null;
  chargerDer: Der | null;
  meterDer: Der | null;
  session: VehicleSession | null;
  vehicle: Vehicle | null;
  entitlement: EntitlementView | null;
  valueSummary: ValueSummary | null;
  view: SiteDashboardView;
  loading: boolean;
  error: string | null;
  hasApiData: boolean;
  refetch: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

function sessionEmailFallback(): string | null {
  return readBasicSession()?.email ?? null;
}

function resolveDisplayName(
  me: MeResponse | null,
  email: string | null,
  hasApiData: boolean,
): { displayName: string | null; firstName: string; fromApi: boolean } {
  const apiName = me?.displayName?.trim() || null;
  if (apiName) {
    const first = apiName.split(/\s+/)[0] ?? apiName;
    return { displayName: apiName, firstName: first, fromApi: true };
  }
  if (email) {
    return {
      displayName: firstNameFromEmail(email),
      firstName: firstNameFromEmail(email),
      fromApi: Boolean(me),
    };
  }
  if (hasApiData) {
    return { displayName: null, firstName: "", fromApi: Boolean(me) };
  }
  return { displayName: mockUser.name, firstName: mockUser.firstName, fromApi: false };
}

function buildView(
  me: MeResponse | null,
  site: Site | null,
  siteInstaller: SiteInstallerResponse | null,
  chargerDevice: Device | null,
  chargerDer: Der | null,
  meterDer: Der | null,
  session: VehicleSession | null,
  vehicle: Vehicle | null,
  entitlement: EntitlementView | null,
  valueSummary: ValueSummary | null,
  hasApiData: boolean,
): SiteDashboardView {
  const email = me?.email ?? sessionEmailFallback() ?? (hasApiData ? null : mockUser.email);
  const { displayName, firstName, fromApi: displayNameFromApi } = resolveDisplayName(
    me,
    email,
    hasApiData,
  );

  const apiPhone = me?.phoneNumber?.trim() || null;
  const apiCar = mapVehicleLabel(vehicle);
  const apiChargerModel = mapChargerModel(chargerDevice);
  const apiSerial = chargerDevice?.hardwareId ?? null;
  const apiPinCode = chargerDevice?.pinCode?.trim() || null;
  const apiVersion = mapFirmwareVersion(chargerDer);
  const apiFuse = mapFuseFromAttributes(meterDer) ?? mapFuseFromAttributes(chargerDer);
  const apiAddress = site?.address?.trim() || null;
  const apiGridCompany = site?.gridCompany?.trim() || null;
  const apiElectricityProvider = site?.electricityProvider?.trim() || null;
  const apiInstaller =
    siteInstaller?.companyName?.trim() ||
    me?.installerCompany?.name?.trim() ||
    null;
  const apiInstallerPhone =
    siteInstaller?.phone?.trim() ||
    siteInstaller?.contactPhone?.trim() ||
    me?.installerCompany?.phone?.trim() ||
    null;
  const apiInstallerContact = siteInstaller?.contactName?.trim() || null;
  const maxChargeSoc =
    typeof chargerDer?.maxSocPercent === "number" ? chargerDer.maxSocPercent : null;
  const minDischargeSoc =
    typeof chargerDer?.minSocPercent === "number" ? chargerDer.minSocPercent : null;

  return {
    email,
    displayName,
    firstName,
    phone: apiPhone ?? (hasApiData ? null : mockUser.phone),
    carModel: apiCar ?? (hasApiData ? null : mockUser.carModel),
    vehicleVin: vehicle?.vin ?? null,
    isPremium: entitlement ? mapIsPremium(entitlement) : hasApiData ? false : mockUser.isPremium,
    chargerModel: apiChargerModel ?? (hasApiData ? null : mockUser.charger.model),
    chargerSerial: apiSerial ?? (hasApiData ? null : mockUser.charger.serialNumber),
    chargerPinCode: apiPinCode ?? (hasApiData ? null : mockUser.charger.pinCode),
    chargerVersion: apiVersion,
    isOnline: chargerDevice ? chargerDevice.status === "ONLINE" : hasApiData ? false : true,
    batteryLevel: hasApiData
      ? mapBatteryLevel(session, chargerDer)
      : mapBatteryLevel(session, chargerDer) || 50,
    chargingMode: hasApiData
      ? mapChargingMode(session, chargerDer)
      : mapChargingMode(session, chargerDer) || "idle",
    fuse: apiFuse ?? (hasApiData ? null : mockUser.fuse),
    address: apiAddress ?? (hasApiData ? null : mockUser.address),
    siteName: site?.name ?? null,
    gridArea: site?.gridArea ?? null,
    currency: site?.currency ?? null,
    gridCompany: apiGridCompany ?? (hasApiData ? null : mockUser.gridCompany),
    electricityProvider:
      apiElectricityProvider ?? (hasApiData ? null : mockUser.electricityProvider),
    installer: apiInstaller ?? (hasApiData ? null : mockUser.installer),
    installerPhone: apiInstallerPhone,
    installerContactName: apiInstallerContact,
    maxChargeSoc,
    minDischargeSoc,
    derStatus: chargerDer?.status ?? session?.state ?? null,
    apiTotals: mapValueSummaryToStats(valueSummary),
    fromApi: {
      // /me fields: once me is loaded, empty values are live empties (not mocks).
      email: hasApiData ? Boolean(me) : Boolean(me?.email),
      displayName: hasApiData ? Boolean(me) : displayNameFromApi,
      phone: hasApiData ? Boolean(me) : Boolean(apiPhone),
      carModel: Boolean(apiCar),
      isPremium: Boolean(entitlement),
      chargerModel: Boolean(apiChargerModel),
      chargerSerial: Boolean(apiSerial),
      chargerPinCode: Boolean(apiPinCode),
      chargerVersion: Boolean(apiVersion),
      fuse: Boolean(apiFuse),
      address: Boolean(apiAddress),
      gridCompany: Boolean(apiGridCompany),
      electricityProvider: Boolean(apiElectricityProvider),
      installer: Boolean(apiInstaller),
      derLimits: maxChargeSoc !== null || minDischargeSoc !== null,
    },
  };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [siteInstaller, setSiteInstaller] = useState<SiteInstallerResponse | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [chargerDevice, setChargerDevice] = useState<Device | null>(null);
  const [chargerDer, setChargerDer] = useState<Der | null>(null);
  const [meterDer, setMeterDer] = useState<Der | null>(null);
  const [session, setSession] = useState<VehicleSession | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [entitlement, setEntitlement] = useState<EntitlementView | null>(null);
  const [valueSummary, setValueSummary] = useState<ValueSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiData, setHasApiData] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    if (!isAuthenticated) {
      setMe(null);
      setSite(null);
      setSiteInstaller(null);
      setDevices([]);
      setChargerDevice(null);
      setChargerDer(null);
      setMeterDer(null);
      setSession(null);
      setVehicle(null);
      setEntitlement(null);
      setValueSummary(null);
      setHasApiData(false);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // User + sites first — profile can render even before device fan-out.
        const [userMe, sites] = await Promise.all([fetchUserMe(), fetchSites()]);
        if (cancelled) return;

        setMe(userMe);

        const primarySite = sites[0] ?? null;
        if (!primarySite) {
          setSite(null);
          setSiteInstaller(null);
          setDevices([]);
          setChargerDevice(null);
          setChargerDer(null);
          setMeterDer(null);
          setSession(null);
          setVehicle(null);
          setEntitlement(null);
          setValueSummary(null);
          setHasApiData(true);
          return;
        }

        const [siteDevices, sessions, vehicles, entitlements, summary, installer] =
          await Promise.all([
            fetchSiteDevices(primarySite.id),
            fetchSessions(),
            fetchVehicles(),
            fetchEntitlements(primarySite.id),
            fetchValueSummary(primarySite.id),
            fetchSiteInstaller(primarySite.id),
          ]);

        if (cancelled) return;

        const charger = findChargerDevice(siteDevices);
        const meterDevice = findMeterDevice(siteDevices);

        const [chargerView, meterView] = await Promise.all([
          charger ? fetchDevice(charger.id) : Promise.resolve(null),
          meterDevice && meterDevice.id !== charger?.id
            ? fetchDevice(meterDevice.id)
            : Promise.resolve(null),
        ]);
        if (cancelled) return;

        const der = chargerView ? findChargerDer(chargerView.ders) : null;
        const meter = meterView
          ? findMeterDer(meterView.ders)
          : chargerView
            ? findMeterDer(chargerView.ders)
            : null;

        const activeSession = findSessionForDer(sessions, der?.id);
        const siteVehicle =
          vehicles.find((v) => v.siteId === primarySite.id) ?? vehicles[0] ?? null;

        setSite(primarySite);
        setSiteInstaller(installer);
        setDevices(siteDevices);
        setChargerDevice(chargerView?.device ?? charger);
        setChargerDer(der);
        setMeterDer(meter);
        setSession(activeSession);
        setVehicle(siteVehicle);
        setEntitlement(entitlements);
        setValueSummary(summary);
        setHasApiData(true);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof NumizAuthError) {
          setError("UNAUTHORIZED");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load site data");
        }
        setHasApiData(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, fetchKey]);

  const view = useMemo(
    () =>
      buildView(
        me,
        site,
        siteInstaller,
        chargerDevice,
        chargerDer,
        meterDer,
        session,
        vehicle,
        entitlement,
        valueSummary,
        hasApiData,
      ),
    [
      me,
      site,
      siteInstaller,
      chargerDevice,
      chargerDer,
      meterDer,
      session,
      vehicle,
      entitlement,
      valueSummary,
      hasApiData,
    ],
  );

  const value = useMemo<SiteDataContextValue>(
    () => ({
      me,
      site,
      siteInstaller,
      devices,
      chargerDevice,
      chargerDer,
      meterDer,
      session,
      vehicle,
      entitlement,
      valueSummary,
      view,
      loading,
      error,
      hasApiData,
      refetch,
    }),
    [
      me,
      site,
      siteInstaller,
      devices,
      chargerDevice,
      chargerDer,
      meterDer,
      session,
      vehicle,
      entitlement,
      valueSummary,
      view,
      loading,
      error,
      hasApiData,
      refetch,
    ],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}
