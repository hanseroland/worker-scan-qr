// server.ts
import 'dotenv/config'
import 'reflect-metadata'
import app from './src/app'



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})