import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const profileTexts = {
  sv: {
    editProfile: "Redigera Profil",
    email: "E-post",
    subscription: "Prenumeration",
    subscriptionPremium: "Premium",
    subscriptionFree: "Gratis",
    subscriptionManage: "Hantera",
    subscriptionUpgrade: "Uppgradera",
    charger: "Laddbox",
    versionTemplate: "Version {version}",
    car: "Bil",
    installer: "Installatör",
    contactInstaller: "Kontakta",

    language: "Språk",
    swedish: "Svenska",
    english: "Engelska",

    edit: {
      title: "Redigera Profil",
      sectionPersonal: "Personuppgifter",
      fieldName: "Namn",
      fieldEmail: "E-post",
      fieldPhone: "Telefon",
      fieldAddress: "Adress",
      sectionCharger: "Laddbox",
      fieldChargerModel: "Laddboxmodell",
      fieldSerialNumber: "Serienummer",
      fieldPinCode: "Pinkod",
      fieldHomeFuse: "Säkring på hemmet",
      sectionElectricity: "Elnät + Elhandel",
      fieldGridCompany: "Elnätsbolag",
      fieldElectricityProvider: "Elhandelsbolag",
      sectionSecurity: "Säkerhet",
      changePassword: "Byt lösenord",
      shareCharger: "Dela laddbox",
      save: "Spara",
      logOut: "Logga ut",
    },

    background: {
      title: "Bakgrund",
      default: "Mint",
      black: "Mörk",
      white: "Ljus",
      colorful: "Färgrik",
    },

    devMode: {
      title: "Utvecklarläge",
      subtitle: "Just nu: {mode} — tryck för att byta",
      installerView: "Installatörsvy",
      customerView: "Kundvy",
    },
    devLogin: {
      title: "Visa inloggning (dev)",
      subtitle: "Loggar ut och visar Skapa konto / Logga in / Numiz",
    },
  },
  en: {
    editProfile: "Edit Profile",
    email: "Email",
    subscription: "Subscription",
    subscriptionPremium: "Premium",
    subscriptionFree: "Free",
    subscriptionManage: "Manage",
    subscriptionUpgrade: "Upgrade",
    charger: "Charger",
    versionTemplate: "Version {version}",
    car: "Car",
    installer: "Installer",
    contactInstaller: "Contact",

    language: "Language",
    swedish: "Swedish",
    english: "English",

    edit: {
      title: "Edit Profile",
      sectionPersonal: "Personal details",
      fieldName: "Name",
      fieldEmail: "Email",
      fieldPhone: "Phone",
      fieldAddress: "Address",
      sectionCharger: "Charger",
      fieldChargerModel: "Charger model",
      fieldSerialNumber: "Serial number",
      fieldPinCode: "PIN code",
      fieldHomeFuse: "Home fuse",
      sectionElectricity: "Grid + electricity",
      fieldGridCompany: "Grid company",
      fieldElectricityProvider: "Electricity provider",
      sectionSecurity: "Security",
      changePassword: "Change password",
      shareCharger: "Share charger",
      save: "Save",
      logOut: "Log out",
    },

    background: {
      title: "Background",
      default: "Mint",
      black: "Dark",
      white: "Light",
      colorful: "Colorful",
    },

    devMode: {
      title: "Developer mode",
      subtitle: "Currently: {mode} — tap to switch",
      installerView: "Installer view",
      customerView: "Customer view",
    },
    devLogin: {
      title: "Show login (dev)",
      subtitle: "Logs out and shows Create account / Sign in / Numiz",
    },
  },
} as const;

export type ProfileTexts = (typeof profileTexts)[AppLanguage];

export function getProfileTexts(
  language: AppLanguage = getStoredLanguage(),
): ProfileTexts {
  return profileTexts[language];
}
