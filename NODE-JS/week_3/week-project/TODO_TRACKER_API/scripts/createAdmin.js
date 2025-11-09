/**
 * Script pour créer un utilisateur administrateur
 * Usage: node scripts/createAdmin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/todo-tracker";

async function createAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("✓ Connecté à MongoDB");

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Un administrateur existe déjà :", existingAdmin.email);
      process.exit(0);
    }

    // Créer l'admin
    const adminData = {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    };

    const admin = await User.create(adminData);
    console.log("✓ Administrateur créé avec succès !");
    console.log("  Email:", admin.email);
    console.log("  Mot de passe: admin123");
    console.log("  Rôle:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

createAdmin();
