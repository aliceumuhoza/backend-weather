const translations = {
  en: {
    welcome: "Choose language:\n1. English\n2. Kinyarwanda\n3. French",
    chooseService: "Choose a service:\n1. Weather\n2. Price updates",
    chooseCountry: "Enter your country:\n1. Rwanda\n2. Nigeria",
    chooseStateOrDistrict: "Choose your location:", // This will be used for both states and districts
    weather: (location, weather, temp) =>
      `Weather in ${location}:\n${weather}, Temp: ${temp}°C`,
    priceUpdate: (product, market, price) =>
      `Price of ${product} at ${market}:\n${price}`,
    chooseDistrict: "Select your district:", // Step 2: Choosing the district
    chooseMarket: "Select market in the district:", // Step 3: Choosing the market
    chooseProduct: "Select a product from the market:", // Step 4: Choosing the product
    errorDistrict: "Could not find the district",
    noMarketsFound: "No Markets Found",
    errorMarkets: "Could not fetch markets for the district",
    errorProducts: "Could not fetch products for the market",
    errorPrice: "Could not fetch price for the product",
    invalidOption: "Invalid option",
    thankYou: "Thank you for using our service!", // New phrase
  },
  rw: {
    welcome: "Hitamo ururimi:\n1. Icyongereza\n2. Ikinyarwanda\n3. Igifaransa",
    chooseService: "Hitamo serivisi:\n1. Igihe cy’ikirere\n2. Ibiciro bishya",
    chooseCountry: "Hitamo igihugu:\n1. U Rwanda\n2. Nigeria",
    chooseStateOrDistrict: "Hitamo akarere/leta:", // This will be used for both states and districts
    weather: (location, weather, temp) =>
      `Igihe cy’ikirere muri ${location}:\n${weather}, Ubushyuhe: ${temp}°C`,
    priceUpdate: (product, market, price) =>
      `Igiciro cya ${product} mu isoko rya ${market}:\n${price}`,
    chooseDistrict: "Hitamo akarere:", // Step 2: Choosing the district
    chooseMarket: "Hitamo isoko riri mu karere:", // Step 3: Choosing the market
    chooseProduct: "Hitamo igicuruzwa mu isoko:", // Step 4: Choosing the product
    errorDistrict: "Ntibyakunze kubona akarere",
    noMarketsFound: "Nta masoko aboneka",
    errorMarkets: "Ntibyakunze kubona amasoko y'akarere",
    errorProducts: "Ntibyakunze kubona ibicuruzwa by'isoko",
    errorPrice: "Ntibyakunze kubona igiciro cya",
    invalidOption: "Amahitamo adakwiye",
    thankYou: "Murakoze gukoresha serivisi yacu!", // New phrase
  },
  fr: {
    welcome: "Choisissez la langue:\n1. Anglais\n2. Kinyarwanda\n3. Français",
    chooseService: "Choisissez un service:\n1. Météo\n2. Mise à jour des prix",
    chooseCountry: "Choisissez votre pays:\n1. Rwanda\n2. Nigeria",
    chooseStateOrDistrict: "Choisissez votre région/district:", // This will be used for both states and districts
    weather: (location, weather, temp) =>
      `Météo à ${location}:\n${weather}, Temp: ${temp}°C`,
    priceUpdate: (product, market, price) =>
      `Prix de ${product} au marché de ${market}:\n${price}`,
    chooseDistrict: "Choisissez votre district:", // Step 2: Choosing the district
    chooseMarket: "Choisissez un marché dans le district:", // Step 3: Choosing the market
    chooseProduct: "Choisissez un produit dans le marché:", // Step 4: Choosing the product
    errorDistrict: "Impossible de trouver le district",
    noMarketsFound: "Aucun marché trouvé",
    errorMarkets: "Impossible d'obtenir les marchés pour le district",
    errorProducts: "Impossible d'obtenir les produits pour le marché",
    errorPrice: "Impossible d'obtenir le prix pour le produit",
    invalidOption: "Option invalide",
    thankYou: "Merci d'utiliser notre service!", // New phrase
  },
};

module.exports = translations;
