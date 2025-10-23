## Root Directory Files:

- package.json: The Node.js project configuration file that contains project metadata, dependencies, and scripts.
- README.md: Documentation file that likely contains project setup and usage instructions.
- Data Directory (data):
  - products.json: JSON file for storing product data/inventory information
  - orders.json: JSON file for storing order information
- Source Directory (src):
  - server.js: The main entry point of the application that sets up and starts the HTTP server
  - router.js: Handles route definitions and request routing for the application
- Controllers Directory (controllers):
  - productsController.js: Handles product-related request processing and business logic
  - ordersController.js: Handles order-related request processing and business logic
- Services Directory (services):
  - productsService.js: Contains business logic for product operations (CRUD operations)
  - ordersService.js: Contains business logic for order operations (CRUD operations)
- Utils Directory (utils):
  - logger.js: Utility for application logging
  - parseQuery.js: Utility for parsing query parameters from requests
  - sendJson.js: Utility for sending JSON responses with proper formatting
    The project follows a common architectural pattern:
  - The server.js initializes the application
  - Requests are routed through router.js
  - Controllers handle request/response logic
  - Services contain business logic
  - Utils provide shared functionality
  - Data is stored in JSON files in the data directory

## Role of each script file

This structure suggests a RESTful API service that manages products and orders, with a clean separation of concerns:

- Routing logic (router.js)
- Request handling (controllers)
- Business logic (services)
- Data storage (JSON files)
  U- tility functions (utils)
