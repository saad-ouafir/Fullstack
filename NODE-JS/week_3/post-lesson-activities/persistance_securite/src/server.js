require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/dataBase');

const PORT = process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI || 'mongodb://localhost:27017/smart_inventory_db'

const authRouter = require('./routes/user.routes.js');
const productRouter= require('./routes/products.routes.js');

app.use('/api/auth', authRouter);
app.use('/api/products',productRouter);
async function start() {
  try {
    // 1. Connexion à MongoDB
    await connectToDatabase(MONGO_URI);
  
app.listen(PORT, () => {
  console.log(`Smart Inventory v2 démarré sur http://localhost:${PORT}`);
});
} catch (err) {
    console.error('Échec du démarrage de l’application :', err.message);
    process.exit(1);
  }
}
start()