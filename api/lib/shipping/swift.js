const etat = require("../../algeria_cities.json");
const states = require("../../states.json");

const formatToswift = (order) => {

const removeEmojis = (str) =>
  str?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim() ?? "";

    const isStopDesk = order.home ? 0 : 1;
 const cleanName = removeEmojis(order.productData?.name);
  const cleanNote = removeEmojis(order.offerNmae || order.note);

  // Join name and note with " | ", only if both exist
  const articleName = [cleanName, cleanNote]
    .filter(Boolean)
    .join(" | ");
    // 1. Get Product Name safely

    // 2. Helper to get Wilaya Code
    
 
    const wilayaCode =   states.find(e => e.name == order.state).id  ;
      // 3. Use URLSearchParams to handle spaces and special characters automatically
    const params = new URLSearchParams();
    params.append("nom_client", String(order.name));
    params.append("telephone", order.phone);
    params.append("telephone_2", "");
    params.append("adresse", `${order.city || ''}`);
    params.append("code_postal", "");
    params.append("produit", articleName || "Products");
    params.append("commune",order.city); // This will auto-convert "Bir El Djir" to "Bir+El+Djir"
    params.append("code_wilaya", wilayaCode);
    params.append("montant", order.total);
    params.append("remarque", order.note || "");
    params.append("type", "1");
    params.append("stop_desk", isStopDesk);

    return params.toString();
};


module.exports = formatToswift;
