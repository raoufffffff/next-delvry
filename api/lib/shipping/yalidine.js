const states = require("../../states.json");

const formatToyalidine = (order) => {
   
  const isStopDesk = order.home ? 0 : 1;
const state =  () =>{
  if(order.state === "Tbessa"){
    return "Tébessa"
  }
  if(order.state === "Oum elbouaghi"){
    return "Oum El Bouaghi"
  }
  if(order.state === "Sidi belabbes"){
    return  "Sidi Bel Abbès"
  }

  if(order.state === "El Meniaa"){
    return "El Menia"
  }

  
  return order.state
}
   

// الاستخدام
const removeEmojis = (str) => 
  str?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim() ?? '';

// دمج القيم مع التأكد من وجود مسافات صحيحة وتجنب القيم الفارغة
const articleName = [
  removeEmojis(order.productData?.name),
  order.offerNmae,
  order.color,
  order.size
]
  .filter(Boolean) // يقوم بحذف أي قيمة undefined أو null أو نص فارغ
  .join(' ');      // يدمج الباقي بمسافة واحدة فقط بينهم
  const getstatenumber = (s) => {
    return states.find(e => e.ar_name == s || e.name == s) 
  }
  // 3. بناء الكائن حسب وثيقتهم
  const nameParts = order.name.trim().split(/\s+/);
const firstname = nameParts[0];
const familyname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];
  return [{
    order_id: order._id,
    firstname: firstname,
    familyname: familyname,
    contact_phone: order.phone,
    address:  `${order.city || ''} - ${order.state || ''}`,
    to_commune_name:order.city,
    to_wilaya_name: state(),
    product_list: articleName,
    price: order.price,
    do_insurance: false,
    declared_value: order.total,
    freeshipping: true,
    is_stopdesk: order.home ? false : true,
     has_exchange: 0
   }]
};

module.exports = formatToyalidine
