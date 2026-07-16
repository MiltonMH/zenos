import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const installerTexts = {
  sv: {
    hem: {
      emptyTitle: "Inga installationer än.",
      emptyCta: "Gå till Dash för att lägga till en",
      ariaPreviousCharger: "Föregående laddbox",
      ariaNextCharger: "Nästa laddbox",
      ariaShowCustomer: "Visa {name}",
    },

    dash: {
      eyebrow: "Dash",
      title: "Alla installationer",
      installedDate: "Installerad {date}",
      installedToday: "Idag",
      statusActive: "Aktiv",
      statusPending: "Väntar",
      statusOffline: "Offline",
      empty: "Inga installationer än.",
      addCharger: "Lägg till laddbox",
    },

    profil: {
      contactPerson: "Kontaktperson",
      phone: "Telefon",
      installations: "Installationer",
      installationsCount: "{count} st",
      certification: "Certifiering",
      devModeTitle: "Utvecklarläge",
      devModeSubtitle:
        "Just nu: Installatörsvy — tryck för att byta till kundvy",
    },

    scan: {
      title: "Skanna QR",
      cameraFound: "Laddbox hittad",
      cameraHint: "Rikta kameran mot QR-koden på laddboxen",
      scanning: "Skannar…",
      simulateScan: "Simulera skanning",
      enterPinInstead: "Ange pinkod istället",
      pinPrompt: "Vad är laddboxens pinkod?",
      pinHint:
        "Den sitter på en dekal utanpå laddboxen — bra att veta om kameran krånglar",
      scanQrInstead: "Skanna QR istället",
      productName: "Zenion Arc",
      serialTemplate: "Serienr {serial}",
      configure: "Konfigurera",
    },

    configure: {
      title: "Konfigurera",
      sectionCharger: "Laddbox",
      connectInternet: "Ansluter till internet",
      connectInstalling: "Installerar Numiz",
      connectReady: "Numiz är redo att kopplas till kund",
      sectionCustomer: "Rikta mot kund",
      fieldInstallAddress: "Installationsadress",
      placeholderAddress: "Gatuadress, ort",
      fieldCustomerEmail: "Kundens e-post",
      placeholderEmail: "kund@exempel.se",
      confirmExisting:
        "Konto hittat – laddboxen kopplas direkt till kundens konto i Numiz.",
      confirmNew:
        "Nytt konto – kunden får ett mejl för att slutföra sin registrering i Numiz.",
      confirmPrompt: "Skicka aktivering till {email} — stämmer detta?",
      confirmEdit: "Redigera",
      confirmYes: "Ja, stämmer",
      confirmCustomer: "Bekräfta kund",
      next: "Nästa",
    },

    locked: {
      fusePrompt: "Vilken säkring har kunden?",
      fuseHint: "Står på elcentralen",
      fuseUnit: "A",
      consumptionPrompt: "Hur mycket förbrukar kunden per år?",
      consumptionHint: "Står på elfakturan",
      consumptionUnit: "kWh/år",
      consumptionPlaceholder: "0",
      evPrompt: "Vilken elbil har kunden?",
      evSearchPlaceholder: "Sök eller välj märke…",
      evAllBrands: "← Alla märken",
      continue: "Fortsätt",
    },

    optional: {
      title: "Elavtal",
      intro: "Om du inte har uppgifterna kan kunden fylla i själv",
      fieldElectricityProvider: "Elhandelsbolag",
      fieldGridCompany: "Elnätsbolag",
      skip: "Hoppa över",
      fillInNow: "Fyll i nu",
      deferredHint: "Kunden fyller i detta själv",
      selectPlaceholder: "Välj…",
      complete: "Slutför installation",
    },

    done: {
      title: "Installationen är klar",
      subtitleExisting:
        "Laddboxen är kopplad till kundens konto och redo att användas.",
      subtitleNew:
        "Kunden har fått ett mejl för att slutföra sin registrering i Numiz.",
      infoInstaller:
        "Kunden ser automatiskt {company} som installatör i sin app.",
      infoContact:
        "Installatörens kontaktuppgifter läggs till automatiskt — kunden behöver inte fylla i det.",
      toInstallations: "Till mina installationer",
      addAnother: "Konfigurera en till",
    },
  },
  en: {
    hem: {
      emptyTitle: "No installations yet.",
      emptyCta: "Go to Dash to add one",
      ariaPreviousCharger: "Previous charger",
      ariaNextCharger: "Next charger",
      ariaShowCustomer: "Show {name}",
    },

    dash: {
      eyebrow: "Dash",
      title: "All installations",
      installedDate: "Installed {date}",
      installedToday: "Today",
      statusActive: "Active",
      statusPending: "Pending",
      statusOffline: "Offline",
      empty: "No installations yet.",
      addCharger: "Add charger",
    },

    profil: {
      contactPerson: "Contact person",
      phone: "Phone",
      installations: "Installations",
      installationsCount: "{count}",
      certification: "Certification",
      devModeTitle: "Developer mode",
      devModeSubtitle:
        "Currently: Installer view — tap to switch to customer view",
    },

    scan: {
      title: "Scan QR",
      cameraFound: "Charger found",
      cameraHint: "Point the camera at the QR code on the charger",
      scanning: "Scanning…",
      simulateScan: "Simulate scan",
      enterPinInstead: "Enter PIN instead",
      pinPrompt: "What's the charger's PIN?",
      pinHint:
        "It's on a sticker on the charger — handy if the camera acts up",
      scanQrInstead: "Scan QR instead",
      productName: "Zenion Arc",
      serialTemplate: "Serial {serial}",
      configure: "Configure",
    },

    configure: {
      title: "Configure",
      sectionCharger: "Charger",
      connectInternet: "Connecting to the internet",
      connectInstalling: "Installing Numiz",
      connectReady: "Numiz is ready to connect to the customer",
      sectionCustomer: "Link to customer",
      fieldInstallAddress: "Installation address",
      placeholderAddress: "Street address, city",
      fieldCustomerEmail: "Customer email",
      placeholderEmail: "customer@example.com",
      confirmExisting:
        "Account found – the charger will be linked straight to the customer's Numiz account.",
      confirmNew:
        "New account – the customer will get an email to finish signing up in Numiz.",
      confirmPrompt: "Send activation to {email} — does this look right?",
      confirmEdit: "Edit",
      confirmYes: "Yes, that's right",
      confirmCustomer: "Confirm customer",
      next: "Next",
    },

    locked: {
      fusePrompt: "What fuse size does the customer have?",
      fuseHint: "It's on the electrical panel",
      fuseUnit: "A",
      consumptionPrompt: "How much does the customer use per year?",
      consumptionHint: "It's on the electricity bill",
      consumptionUnit: "kWh/year",
      consumptionPlaceholder: "0",
      evPrompt: "Which EV does the customer have?",
      evSearchPlaceholder: "Search or pick a brand…",
      evAllBrands: "← All brands",
      continue: "Continue",
    },

    optional: {
      title: "Electricity contract",
      intro: "If you don't have the details, the customer can fill them in",
      fieldElectricityProvider: "Electricity provider",
      fieldGridCompany: "Grid company",
      skip: "Skip",
      fillInNow: "Fill in now",
      deferredHint: "The customer will fill this in themselves",
      selectPlaceholder: "Select…",
      complete: "Finish installation",
    },

    done: {
      title: "Installation complete",
      subtitleExisting:
        "The charger is linked to the customer's account and ready to use.",
      subtitleNew:
        "The customer has received an email to finish signing up in Numiz.",
      infoInstaller:
        "The customer will automatically see {company} as their installer in the app.",
      infoContact:
        "The installer's contact details are added automatically — the customer doesn't need to enter them.",
      toInstallations: "To my installations",
      addAnother: "Configure another",
    },
  },
} as const;

export type InstallerTexts = (typeof installerTexts)[AppLanguage];

export function getInstallerTexts(
  language: AppLanguage = getStoredLanguage(),
): InstallerTexts {
  return installerTexts[language];
}
