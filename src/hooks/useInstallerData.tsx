import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildCreateInstallationRequest,
  mapCompanyMeToProfile,
  mapInstallationToUnit,
} from "@/lib/numiz-mappers";
import {
  createInstallerInstallation,
  fetchInstallerCompanyMe,
  fetchInstallerInstallations,
  NumizAuthError,
} from "@/lib/numiz-api";
import type { CreateInstallationRequest, InstallationCreateResponse } from "@/lib/numiz-types";
import {
  initialInstalledUnits,
  mockInstaller,
  type InstalledUnit,
} from "@/lib/installer-mock-data";
import { useLanguage } from "@/lib/i18n";

export interface InstallerCompanyView {
  companyName: string;
  contactName: string;
  phone: string;
  certification: string;
  fromApi: {
    companyName: boolean;
    contactName: boolean;
    phone: boolean;
    certification: boolean;
    installations: boolean;
  };
}

export interface UseInstallerDataResult {
  units: InstalledUnit[];
  company: InstallerCompanyView;
  loading: boolean;
  error: string | null;
  hasApiData: boolean;
  refetch: () => void;
  createInstallation: (
    params: CreateInstallationRequest,
  ) => Promise<InstallationCreateResponse>;
  addUnitFromApi: (unit: InstalledUnit) => void;
}

const mockCompanyView: InstallerCompanyView = {
  companyName: mockInstaller.companyName,
  contactName: mockInstaller.contactName,
  phone: mockInstaller.phone,
  certification: mockInstaller.certification,
  fromApi: {
    companyName: false,
    contactName: false,
    phone: false,
    certification: false,
    installations: false,
  },
};

export function useInstallerData(enabled: boolean): UseInstallerDataResult {
  const { language } = useLanguage();
  const [units, setUnits] = useState<InstalledUnit[]>(initialInstalledUnits);
  const [company, setCompany] = useState<InstallerCompanyView>(mockCompanyView);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiData, setHasApiData] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [companyMe, installations] = await Promise.all([
          fetchInstallerCompanyMe(),
          fetchInstallerInstallations(),
        ]);

        if (cancelled) return;

        const profile = mapCompanyMeToProfile(companyMe);
        setCompany({
          ...profile,
          fromApi: {
            companyName: true,
            contactName: !!companyMe.contactName,
            phone: !!(companyMe.phone || companyMe.contactPhone),
            certification: !!companyMe.certification,
            installations: true,
          },
        });
        setUnits(
          installations.map((installation) =>
            mapInstallationToUnit(installation, language === "en" ? "en-GB" : "sv-SE"),
          ),
        );
        setHasApiData(true);
      } catch (err) {
        if (cancelled) return;

        if (err instanceof NumizAuthError) {
          setError("UNAUTHORIZED");
        } else {
          setError(err instanceof Error ? err.message : "REQUEST_FAILED");
        }

        setHasApiData(false);
        setCompany(mockCompanyView);
        setUnits(initialInstalledUnits);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled, language, reloadToken]);

  const createInstallation = useCallback(async (params: CreateInstallationRequest) => {
    const response = await createInstallerInstallation(params);
    const unit = mapInstallationToUnit(response.installation);
    setUnits((prev) => [unit, ...prev.filter((existing) => existing.id !== unit.id)]);
    setHasApiData(true);
    setCompany((prev) => ({
      ...prev,
      fromApi: { ...prev.fromApi, installations: true },
    }));
    return response;
  }, []);

  const addUnitFromApi = useCallback((unit: InstalledUnit) => {
    setUnits((prev) => [unit, ...prev.filter((existing) => existing.id !== unit.id)]);
  }, []);

  return useMemo(
    () => ({
      units,
      company,
      loading,
      error,
      hasApiData,
      refetch,
      createInstallation,
      addUnitFromApi,
    }),
    [
      units,
      company,
      loading,
      error,
      hasApiData,
      refetch,
      createInstallation,
      addUnitFromApi,
    ],
  );
}

export { buildCreateInstallationRequest };
