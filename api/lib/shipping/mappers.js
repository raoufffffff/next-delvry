const formatToswift = require("./swift")
const formatToEcomDelivery = require("./ecom")
const formatTonoest = require("./noest");
const formatToyalidine = require("./yalidine");

const transformOrderForProvider = (order, provider) => {
  switch (provider) {
    case 'ecom_delivery':
      return formatToEcomDelivery(order);
    case "swift express":
      return formatToswift(order);
     case "Dhd Livraison":
      return formatToswift(order);  
     case "Imir Logistics":
      return formatToswift(order);  
    case "noas express":
      return formatTonoest(order);
     case "yalidine":
      return formatToyalidine(order);
    default:
      throw new Error('Unknown Provider');
  }
};

module.exports = transformOrderForProvider