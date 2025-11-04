# Car Rental API

A simple car rental management system built with Node.js and Express.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
APP_PORT=3000
API_CARS_URL="/api/cars"
API_RENTS_URL="/api/rentals"
API_TOKEN="secret123"
```

## Running the Application

```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Cars

#### Get All Cars
- **GET** `/api/cars`
- Query Parameters:
  - `category` - Filter by category (sedan, suv, van, eco)
  - `available` - Filter by availability (true/false)
  - `minpricePerDay` - Minimum price per day
  - `maxpricePerDay` - Maximum price per day
  - `q` - Search by plate or model
  - `page` - Page number for pagination
  - `limit` - Items per page

#### Get Car by ID
- **GET** `/api/cars/:id`

#### Create Car (requires authentication)
- **POST** `/api/cars`
- Headers: `Authorization: secret123`
- Body:
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "category": "sedan",
  "pricePerDay": 50
}
```

#### Update Car (requires authentication)
- **PUT** `/api/cars/:id`
- Headers: `Authorization: secret123`
- Body:
```json
{
  "pricePerDay": 60,
  "available": true
}
```

#### Delete Car (requires authentication)
- **DELETE** `/api/cars/:id`
- Headers: `Authorization: secret123`

### Rentals

#### Get All Rentals
- **GET** `/api/rentals`
- Query Parameters:
  - `status` - Filter by status (active, returned, cancelled)
  - `carId` - Filter by car ID
  - `from` - Filter by start date (YYYY-MM-DD)
  - `to` - Filter by end date (YYYY-MM-DD)
  - `page` - Page number for pagination
  - `limit` - Items per page

#### Get Rental by ID
- **GET** `/api/rentals/:id`

#### Create Rental (requires authentication)
- **POST** `/api/rentals`
- Headers: `Authorization: secret123`
- Body:
```json
{
  "carId": 1,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "from": "2025-11-10",
  "days": 5
}
```

#### Return Rental (requires authentication)
- **PUT** `/api/rentals/:id`
- Headers: `Authorization: secret123`

#### Cancel Rental (requires authentication)
- **DELETE** `/api/rentals/:id`
- Headers: `Authorization: secret123`

## Project Structure

```
CAR_RENTAL/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # Route definitions
│   ├── middlewares/      # Custom middlewares
│   ├── data/             # JSON data files
│   ├── public/           # Static files
│   └── server.js         # Application entry point
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## Technologies Used

- Node.js
- Express.js
- Morgan (HTTP request logger)
- dotenv (Environment variables)
