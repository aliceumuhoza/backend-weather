const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./config");
const mongoose = require("mongoose");
const translations = require("./translations");
const Market = require("./models/marketModel");
const District = require("./models/districtModel");
const Product = require("./models/productModel");
const cors = require("cors");
const { rwandaDistricts, nigeriaStates } = require("./locations");

//routes
const districtRoutes = require("./routes/districtRoutes");
const staffRoutes = require("./routes/staffRoutes");
const marketRoutes = require("./routes/marketRoutes");
const productRoutes = require("./routes/productRoutes");


//dels/
const rolesRoutes = require("./routes/roles");
const marketProductsRoutes = require("./routes/marketProducts");
const productMarketPriceRoutes = require("./routes/productMarketPrice");




//use middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // This ensures JSON data works
app.use(express.json());

// DB connection
mongoose
  .connect(
    "mongodb+srv://aumuhoza72:rc5iikZM76uEpBkN@cluster0.ko8kl.mongodb.net/priceUpdate?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error", err));

// Basic health check route
app.get("/", async (req, res) => {
  res.json("Hello, world!");
});

// Success test route
app.get("/ussd", async (req, res) => {
  res.json("success");
});
// Routes
app.use("/districts", districtRoutes);
app.use("/staffs", staffRoutes);
app.use("/markets", marketRoutes);
app.use("/products", productRoutes);

app.use("/roles", rolesRoutes);
app.use("/market-products", marketProductsRoutes);
app.use("/product-market-prices", productMarketPriceRoutes);

// USSD Route
app.post("/ussd", async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Log the received request
    console.log(`Received request: ${JSON.stringify(req.body)}`);

    if (!sessionId || !serviceCode || !phoneNumber) {
      return res.status(400).send("Missing required fields.");
    }

    let response = "";
    let language = "en"; // Default language is English
    const textArray = text ? text.split("*") : [];
    const userInput = textArray.length ? textArray[textArray.length - 1] : "";

    // Step 1: Language Selection
    if (text === "") {
      response = `CON ${translations[language].welcome}`;
    } else if (["1", "2", "3"].includes(textArray[0])) {
      // Set language based on user's choice
      switch (textArray[0]) {
        case "1":
          language = "en";
          break;
        case "2":
          language = "rw";
          break;
        case "3":
          language = "fr";
          break;
      }
      // Step 2: Choose between weather and price updates
      if (textArray.length === 1) {
        response = `CON ${translations[language].chooseService}`;
      }
      // If Weather is chosen
      else if (textArray[1] === "1") {
        if (textArray.length === 2) {
          // Step 3: Let user choose a country
          response = `CON ${translations[language].chooseCountry}`;
        } else if (textArray.length === 3) {
          // Step 4: List districts or states based on the selected country
          if (textArray[2] === "1") {
            // Rwanda
            const districtsList = rwandaDistricts
              .map((district, index) => `${index + 1}. ${district}`)
              .join("\n");
            response = `CON ${translations[language].chooseStateOrDistrict}\n${districtsList}`;
          } else if (textArray[2] === "2") {
            // Nigeria
            const statesList = nigeriaStates
              .map((state, index) => `${index + 1}. ${state}`)
              .join("\n");
            response = `CON ${translations[language].chooseStateOrDistrict}\n${statesList}`;
          } else {
            response = `END ${translations[language].invalidOption}`;
          }
        } else if (textArray.length === 4) {
          // Step 5: Process the selected district/state and fetch weather
          const country = textArray[2] === "1" ? "Rwanda" : "Nigeria";
          const locationList =
            textArray[2] === "1" ? rwandaDistricts : nigeriaStates;
          const userInput = parseInt(textArray[3]);

          // Check if the user input is valid
          if (userInput < 1 || userInput > locationList.length) {
            response = `END ${translations[language].invalidOption}`;
          } else {
            const selectedLocation = locationList[userInput - 1]; // Get district or state name
            const location = `${selectedLocation}, ${country}`;

            try {
              const weather = await getWeather(location);
              response = `END ${translations[language].weather(
                location,
                weather.description,
                weather.temp
              )}`;
            } catch (error) {
              response = `END ${translations[language].error} ${location}`;
            }
          }
        }
      }
      // If Price updates is chosen
      else if (textArray[1] === "2") {
        if (textArray.length === 2) {
          // Step 1: Fetch all districts and display them as options
          const districtsList = await District.find(); // Fetch all districts

          // Map each district with index for display
          const districtOptions = districtsList
            .map((district, index) => `${index + 1}. ${district.name}`) // Display district names with numbers
            .join("\n");

          // Send response to user to choose district
          response = `CON ${translations[language].chooseDistrict}\n${districtOptions}`;
        } else if (textArray.length === 3) {
          // Step 2: User selects a district by index
          const selectedDistrictIndex = parseInt(textArray[2] - 1); // Get index from USSD input
          // Fetch all districts to get the full object
          const districtsList = await District.find();

          // Validate the selected district index
          if (
            selectedDistrictIndex < 0 ||
            selectedDistrictIndex >= districtsList.length
          ) {
            response = `END ${translations[language].errorDistrict}`;
            res.set("Content-Type", "text/plain");
            return res.send(response); // Immediately respond if invalid input
          }

          // Get the selected district based on the user's input index
          const selectedDistrict = districtsList[selectedDistrictIndex];

          console.log(`Selected District: ${selectedDistrict.name}`); // Debugging statement

          try {
            // Fetch markets linked to the selected district
            const markets = await Market.find({
              district_id: selectedDistrict._id,
            });

            console.log(
              `Markets found: ${markets.map((m) => m.name).join(", ")}`
            ); // Debugging

            if (markets.length === 0) {
              response = `END ${translations[language].noMarketsFound}`;
            } else {
              const marketOptions = markets
                .map((market, index) => `${index + 1}. ${market.name}`)
                .join("\n");

              response = `CON ${translations[language].chooseMarket}\n${marketOptions}`;
            }
          } catch (error) {
            console.error(`Error fetching markets: ${error.message}`);
            response = `END ${translations[language].errorMarkets}`;
          }
        } else if (textArray.length === 4) {
          // Step 4: List products in the selected market
          const selectedDistrictIndex = parseInt(textArray[2]) - 1; // District index from earlier
          const marketIndex = parseInt(textArray[3]) - 1; // Market index from user input

          // Fetch all districts and markets again to get the full objects
          const districtsList = await District.find();
          const selectedDistrict = districtsList[selectedDistrictIndex];
          const markets = await Market.find({
            district_id: selectedDistrict._id,
          });
          const selectedMarket = markets[marketIndex]; // Get the selected market

          console.log(`Selected Market: ${selectedMarket.name}`); // Debugging statement

          try {
            const products = await Product.find({
              market_id: selectedMarket._id, // Assuming products are linked to the market by its ID
            });

            const productOptions = products
              .map((product, index) => `${index + 1}. ${product.name}`) // Map product names
              .join("\n");

            if (products.length === 0) {
              response = `END ${translations[language].noProductsFound}`;
            } else {
              response = `CON ${translations[language].chooseProduct}\n${productOptions}`; // Add new translation for choosing product
            }
          } catch (error) {
            console.error(`Error fetching products: ${error.message}`);
            response = `END ${translations[language].errorProducts}`;
          }
        } else if (textArray.length === 5) {
          // Step 5: Get product price from the selected market and product
          const selectedDistrictIndex = parseInt(textArray[2]) - 1; // District index
          const marketIndex = parseInt(textArray[3]) - 1; // Market index
          const productIndex = parseInt(textArray[4]) - 1; // Product index

          // Fetch all districts, markets, and products again to get the full objects
          const districtsList = await District.find();
          const selectedDistrict = districtsList[selectedDistrictIndex];
          const markets = await Market.find({
            district_id: selectedDistrict._id,
          });
          const selectedMarket = markets[marketIndex];
          const products = await Product.find({
            market_id: selectedMarket._id,
          });
          const selectedProduct = products[productIndex];

          try {
            const productPrice = selectedProduct.price; // Assuming the product has a price field
            response = `END ${translations[language].priceUpdate(
              selectedProduct.name,
              selectedMarket.name,
              `$${productPrice}` // Add $ symbol to represent dollars
            )}`;
          } catch (error) {
            console.error(`Error fetching product price: ${error.message}`);
            response = `END ${translations[language].errorPrice}`;
          }
        }
      } else {
        response = `END ${translations[language].invalidOption}`;
      }
    } else {
      response = `END ${translations[language].invalidOption}`;
    }
    // Send response back
    res.set("Content-Type", "text/plain");
    res.send(response);
  } catch (err) {
    console.error(`Error handling USSD request: ${err.message}`);
    res.status(500).send("Server error.");
  }
});

// Function to get weather for a given location
const getWeather = async (location) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}&units=metric`;
    const response = await axios.get(url);
    const { weather, main } = response.data;

    return {
      description: weather[0].description,
      temp: main.temp,
    };
  } catch (err) {
    console.error(`Error fetching weather: ${err.message}`);
    throw new Error("Weather service error");
  }
};
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
