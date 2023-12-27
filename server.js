const app = require("./app")
const dbConfig = require("./dbConfig")

dbConfig()

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{console.log(`server is running on http://localhost:${PORT}`)})