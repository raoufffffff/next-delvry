const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios');
const getapi = require('./lib/getapi/getapi');
const transformOrderForProvider = require('./lib/shipping/mappers');
const fetchAllYalidineHistories = require('./tracking/yalidinTraking');
const app = express();

app.use(cors());
app.use(express.json());
 


// const p = require('./communes/packers.json');
// const fs = require('fs');
// const path = require('path');

// app.get('/', (req, res) => {
//     const outputPath = path.join(__dirname, './communes/communes_new.json');

//     const result = Object.keys(p)
//         .sort((a, b) => Number(a) - Number(b))
//         .map(key => ({
//             ...p[key] 
             
//         }));

//     fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    
//     res.send('✅ تم إنشاء الملف communes_new.json');
// });
 

app.get('/', (req, res) => {
    
    res.send("hello")
})

 
 

  

app.post("/auth", async (req, res) => {
    const { name, Key, Token } = req.body
     
    try {
        let result;
        
         if ( name === "yalidine"){
           
            
            result = await axios.get("https://api.yalidine.app/v1/wilayas/", {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-ID': Key,
                    'X-API-TOKEN': Token
                }
            })
            
        } else if (name === "Dhd Livraison"){
                result = await axios.get(`https://dhd.ecotrack.dz/api/v1/validate/token?api_token=${Token}`, {
                headers: {
                     'Content-Type': 'application/json',
                   
                }
            })
        }
         else if (name === "packers"){
                result = await axios.get(`https://packers.ecotrack.dz/api/v1/validate/token?api_token=${Token}`, {
                headers: {
                     'Content-Type': 'application/json',
                   
                }
            })
        }
         else if (name === "Imir Logistics"){
           result = await axios.get(`https://imir.ecotrack.dz/api/v1/validate/token?api_token=${Token}`, {
                headers: {
                     'Content-Type': 'application/json',
                    
                }
            })
        }
         else if (name === "swift express"){
           result = await axios.get(`https://swift.ecotrack.dz/api/v1/validate/token?api_token=${Token}`, {
                headers: {
                     'Content-Type': 'application/json',
                    
                }
            })
        }


        console.log("API Response:", result.data);
        res.json({
            result: result.data, // خذ البيانات فقط
            good: true
        });
        // 4. FIXED: Send result.data, not the whole result object

    } catch (error) {
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:", error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})


app.post("/send-order", async (req, res) => {
    const { company, order } = req.body
  console.log(company);
  
    const finalorder = transformOrderForProvider(order, company.name)
    console.log(finalorder);
    
     try {
        let result;
       
  
       if (company.name === "yalidine"){
           
            console.log(company);
            
            result = await axios.post("https://api.yalidine.app/v1/parcels/",finalorder,  {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-ID': company.Key,
                    'X-API-TOKEN':company.Token
                }
            })
            
        }  else if (company.name === "Dhd Livraison"){
                result = await axios.post (`https://platform.dhd-dz.com/api/v1/create/order?api_token=${company.Token}&${finalorder}`, {
                headers: {
                     'Content-Type': 'application/json',
                   
                }
            })
        }
         else if (company.name === "Imir Logistics"){
           result = await axios.post(`https://imir.ecotrack.dz/api/v1/create/order?api_token=${company.Token}&${finalorder}`, {
                headers: {
                     'Content-Type': 'application/json',
                    
                }
            })
        }
         else if (company.name === "packers"){
           result = await axios.post(`https://packers.ecotrack.dz/api/v1/create/order?api_token=${company.Token}&${finalorder}`, {
                headers: {
                     'Content-Type': 'application/json',
                    
                }
            })
        }
         else if (company.name === "swift express"){
           result = await axios.post(`https://swift.ecotrack.dz/api/v1/create/order?api_token=${company.Token}&${finalorder}`, {
                headers: {
                     'Content-Type': 'application/json',
                    
                }
            })
        }


 
         res.json({
            result: result.data, // خذ البيانات فقط
            good: true
        });
    } catch (error) {
        console.log(error);
        
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:", error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})


app.post("/track-order", async (req, res) => {  
    const { name, key, token } = req.body
  console.log(name, key, token);
  
      try {
         let result;
       if ( name === "yalidine") {
    result = await fetchAllYalidineHistories(name, key, token);
    console.log(`تم جلب ${result.length} طلب`);
}

 
         res.json({
             length: result.length,   
             good: true,
            result: result,
        });
    } catch (error) {
        console.log(error);
        
        // Improved error logging to see exactly what failed
        if (error.response) {
            console.log("Server Error:" );
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
})

// غيّر هذا السطر:
app.listen(3010, () => console.log("✅ Server running on port 3010."));

// إلى هذا:
if (require.main === module) {
    app.listen(3010, () => console.log("✅ Server running on port 3010."));
}

module.exports = app; // ← أضف هذا