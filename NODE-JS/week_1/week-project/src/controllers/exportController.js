const productsService = require("../services/productsService");
const zlib = require("zlib");
const crypto = require("crypto");
const logger = require("../utils/logger");

function exportProductsController(req, res) {
  try {
    const products = productsService.getAllProducts();
    const jsonData = JSON.stringify(products);
    
    const compressedData = zlib.gzipSync(jsonData);
    
    // Sign with HMAC SHA256
    const hmacKey = process.env.HMAC_KEY;
    const signature = crypto.createHmac("sha256", hmacKey).update(compressedData).digest("hex");
    
    // Set headers
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/gzip");
    res.setHeader("Content-Disposition", 'attachment; filename="products.json.gz"');
    res.setHeader("X-Signature", signature);
    
    res.end(compressedData);
    
    logger.emit("response:sent", { 
      statusCode: 200, 
      url: req.url,
      headers: { "X-Signature": signature }
    });
  } catch (error) {
    console.error("Error exporting products:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
    logger.emit("response:sent", { statusCode: 500, url: req.url });
  }
}

module.exports = {
  exportProductsController,
};

