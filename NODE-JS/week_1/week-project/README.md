# Smart Inventory System

A RESTful API service for managing products and orders with advanced filtering capabilities.

## 🚀 Features

- **Product Management**: Select operations for products and orders
- **Advanced Filtering**: Filter products by category, price range, stock status, and quantity ...
- **Pagination**: Efficient data pagination for large datasets
- **Order Management**: Handle order operations
- **Health Monitoring**: API health check endpoints

## 📁 Project Structure

```
smartinventory/
├── data/                         # Data storage
│   ├── products.json             # Product inventory data
│   └── orders.json               # Order data
│
├── src/                          # Source code
│   ├── controllers/              # Request handlers
│   │   ├── productsController.js # Product request logic
│   │   └── ordersController.js   # Order request logic
│   │
│   ├── services/                 # Business logic layer
│   │   ├── productsService.js    # Product business logic
│   │   └── ordersService.js      # Order business logic
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.js             # Logging utilities (Events)
│   │   ├── parseQuery.js         # Query parameter parsing
│   │   └── sendJson.js           # JSON response helper
│   │
│   ├── router.js                 # Route definitions
│   └── server.js                 # Application entry point
│
├── package.json                  # Project configuration
└── README.md                     # Project documentation
```

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

```
┌─────────────────┐
│   Controllers   │ ← Handle HTTP requests/responses
├─────────────────┤
│    Services     │ ← Business logic and data processing
├─────────────────┤
│     Utils       │ ← Shared utility functions
├─────────────────┤
│   Data Layer    │ ← JSON file storage
└─────────────────┘
```

### Layer Responsibilities

- **Controllers**: Handle HTTP requests, validate input, call services, format responses
- **Services**: Contain business logic, data processing, and validation rules
- **Utils**: Provide reusable functions for logging, parsing, and response formatting
- **Data Layer**: Store and retrieve data from JSON files

## 🛠️ Installation & Setup

### Prerequisites

- Node.js
- npm

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/saad-ouafir/Fullstack/tree/main/NODE-JS/week_1/week-project
   cd "WEEK-PROJECT"
   ```

2. **Environment Setup**
   Setup your `.env` file in the root directory:

   ```env
   API_PRODUCTS=/api/products
   API_ORDERS=/api/orders
   API_HEALTH=/api/health
   PORT_APP=3000
   ```

3. **Start the server**

   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. **Products API**

**GET** `/api/products`

Retrieve products with optional filtering and pagination.

**Query Parameters:**

- `category` (string): Filter by product category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Filter by stock availability
- `quantity` (number): Minimum quantity filter
- `page` (number): Page number for pagination (by default is undefined)
- `limit` (number): Items per page (default: 10)

**Example Requests:**

```bash
# Get all products
GET /api/products

# Filter by category
GET /api/products?category=Food

# Price range filter
GET /api/products?minPrice=100&maxPrice=1000

# Stock availability
GET /api/products?inStock=true

# Pagination
GET /api/products?page=2&limit=5

# Combined filters
GET /api/products?category=Food&minPrice=500&inStock=true&page=1&limit=10
```

**Response Format:**

```json
{
  "data": [
    {
      "id": 1,
      "grocery": "Product Name",
      "category": "Food - Snacks",
      "quantity": 63,
      "price": 1126.08,
      "inStock": false,
      "description": "Product description"
    }
  ]
}
```

#### 2. **Health Check**

**GET** `/api/health`
Retrieve orders with optional filtering and pagination.

**Query Parameters:**

- `orderNumber` (string): Filter by order number
- `status` (string): filter by order status
- `from` (date): date start  
- `to` (date): date end
- `page` (number): Page number for pagination 
- `limit` (number): Items per page (default: 10)

**Example Requests:**

```bash
# Get all orders
GET /api/orders

# Filter by status delivered
GET /api/orders?status=delivered

# filter order number 
GET /api/orders?orderNumber=ORD-010

# Pagination
GET /api/orders?page=2&limit=5

# Combined filters
GET /api/orders?status=paid&from=2024-01-01&to=2024-12-31&limit=20
```
**Response Format:**

```json
   {
    "data": [
        {
            "id": "6",
            "orderNumber": "ORD-006",
            "status": "delivered",
            "from": "2025-09-08",
            "to": "2025-09-13"
        },
        {
            "id": "7",
            "orderNumber": "ORD-007",
            "status": "shipped",
            "from": "2025-09-09",
            "to": "2025-09-14"
        }
   ]
}
```

Check API health status.

**Response:**

```
Health Check - OK
```

#### 3. **Orders API** (Coming Soon)

**GET** `/api/orders`

Order management endpoints (under development).

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Endpoints
API_PRODUCTS=/api/products
API_ORDERS=/api/orders
API_HEALTH=/api/health

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Data Structure

#### Product Schema

```json
{
  "id": "number",
  "grocery": "string",
  "category": "string",
  "quantity": "number",
  "price": "number",
  "inStock": "boolean",
  "description": "string"
}
```
#### Order Schema

```json
{
   "id": "number",
   "orderNumber": "string",
   "status": "string",
   "from": "date",
   "to": "date"
}
```

## 🚀 Usage Examples

### Filtering Products

```bash
# Get food products under $1000
curl "http://localhost:3000/api/products?category=Food&maxPrice=1000"

# Get in-stock products with pagination
curl "http://localhost:3000/api/products?inStock=true&page=1&limit=5"

# Get products with minimum quantity of 50
curl "http://localhost:3000/api/products?quantity=50"
```

### JavaScript/Node.js Client Example

```javascript
const fetch = require("node-fetch");

async function getProducts(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3000/api/products?${params}`);
  return await response.json();
}

// Usage examples
getProducts({ category: "Food", inStock: true }).then((products) =>
  console.log(products)
);

getProducts({ minPrice: 100, maxPrice: 500, page: 1, limit: 10 }).then(
  (products) => console.log(products)
);
```

## 🛡️ Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid query parameters
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Server-side errors

**Error Response Format:**

```json
{
  "error": "Error message description"
}
```

## 🔄 Caching Strategy

The application implements in-memory caching for products data:

- **Cache Duration**: 5 minutes
- **Cache Invalidation**: Automatic refresh after cache expiry
- **Performance**: Reduces file I/O operations

## 🧪 Testing

### Manual Testing

Test the API endpoints using curl or Postman:

```bash
# Test basic functionality
curl http://localhost:3000/api/products

# Test filtering
curl "http://localhost:3000/api/products?category=Food&inStock=true"

# Test pagination
curl "http://localhost:3000/api/products?page=1&limit=5"
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## 🚀 Performance Optimizations

1. **Data Caching**: In-memory caching reduces file I/O
2. **Pagination**: Efficient data pagination for large datasets
3. **Filtering**: Server-side filtering reduces data transfer
4. **Error Handling**: Graceful error handling prevents crashes

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Logging and monitoring
- [ ] Order management features

## 📝 Development Guidelines

### Code Structure

- Follow the layered architecture pattern
- Keep controllers thin, services thick
- Use proper error handling
- Implement input validation

### Adding New Features

1. Add business logic in services
2. Create controller methods
3. Update router with new routes
4. Add proper error handling
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.
