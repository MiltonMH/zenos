// Centralized mock data for consistent user information across the app

export const mockUser = {
  name: "Max Andersson",
  firstName: "Max",
  email: "max@example.com",
  phone: "+46 70 123 45 67",
  address: "Storgatan 1, 123 45 Stockholm",
  carModel: "Tesla Model Y",
  isPremium: true,
  charger: {
    model: "Zenion Arc",
    serialNumber: "ZEN-2024-ABC123",
    pinCode: "1234",
    version: "2.1.4",
  },
  installer: "ElTech Solutions AB",
  fuse: "20A",
  gridCompany: "Vattenfall Eldistribution",
  electricityProvider: "Tibber",
};

export const fuseOptions = ["10A", "16A", "20A", "25A", "32A"];

export const gridCompanies = [
  "Vattenfall Eldistribution",
  "E.ON Energidistribution",
  "Ellevio",
  "Göteborg Energi Nät",
  "Kraftringen Nät",
  "Öresundskraft Nät",
];

export const electricityProviders = [
  "Tibber",
  "Fortum",
  "Vattenfall",
  "E.ON",
  "GodEl",
  "Greenely",
  "Bixia",
];
