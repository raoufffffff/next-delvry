const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios');
const getapi = require('./lib/getapi/getapi');
const transformOrderForProvider = require('./lib/shipping/mappers');
const fetchAllYalidineHistories = require('./tracking/yalidinTraking');
const app = express();

app.use(cors());
app.use(express.json());


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

app.listen(3010, () => console.log("✅ Server running on port 3010."));
// mongodb+srv://nextcommercehelp_db_user:tYMjafBuI8TXteJL@cluster0.sgrxnb2.mongodb.net/?appName=Cluster0

