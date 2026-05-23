const states = require("../../states.json");

const removeEmojis = (str) =>
  str?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim() ?? "";

const STATE_NAME_MAP = {
  "Tbessa": "Tébessa",
  "Oum elbouaghi": "Oum El Bouaghi",
  "Sidi belabbes": "Sidi Bel Abbès",
  "El Meniaa": "El Menia",
};

const normalizeStateName = (name) => STATE_NAME_MAP[name] ?? name;

const formatToyalidine = (order) => {
  const cleanName = removeEmojis(order.productData?.name);
  const cleanNote = removeEmojis(order.note);

  // Join name and note with " | ", only if both exist
  const articleName = [cleanName, cleanNote]
    .filter(Boolean)
    .join(" | ");

  const nameParts = order.name.trim().split(/\s+/);
  const firstname = nameParts[0];
  const familyname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];

  return [
    {
      order_id: order._id,
      firstname,
      familyname,
      contact_phone: order.phone,
      address: `${order.city || ""} - ${order.state || ""}`,
      to_commune_name: order.city,
      to_wilaya_name: normalizeStateName(order.state),
      product_list: articleName,
      price: order.total,
      do_insurance: false,
      declared_value: order.total,
      freeshipping: true,
      is_stopdesk: !order.home,
      has_exchange: 0,
    },
  ];
};

module.exports = formatToyalidine;