const axios = require("axios");

async function fetchAllYalidineHistories(name, Key, Token) {
    let allData = [];
    let currentUrl = "https://api.yalidine.app/v1/parcels/";
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await axios.get(currentUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-ID': Key,
                    'X-API-TOKEN': Token
                }
            });

            // Yalidine API عادة ما تعيد البيانات داخل كائن يحتوي على "data"
            const { data, links } = response.data;

            if (data && Array.isArray(data)) {
                // دمج البيانات الجديدة في المصفوفة الشاملة
                const remainingSpace = 1000 - allData.length;
                allData = allData.concat(data.slice(0, remainingSpace));
            }

            // التوقف إذا وصلنا لـ 1000 عنصر أو لم يعد هناك صفحات تالية
            hasMore = false
            currentUrl = links?.next;
        }
    } catch (error) {
        console.error("Error fetching Yalidine data:", error.message);
    }

    return allData; // مصفوفة واحدة تحتوي على كل الطرود
}

module.exports = fetchAllYalidineHistories;