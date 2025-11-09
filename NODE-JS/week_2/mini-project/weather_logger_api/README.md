# Weather Logger API

Advanced Express.js REST API for weather data logging and analysis.

## Features

- **Advanced Filtering**: Filter observations by city, country, date range, conditions, and temperature
- **Multi-field Sorting**: Sort by multiple fields with custom order (asc/desc)
- **Pagination**: Efficient pagination with customizable page size
- **Statistics & Analytics**: Aggregate data by city, ranking, daily stats, and global summary
- **Performance**: LRU caching, compression, ETag support
- **Security**: CORS, Helmet, rate limiting
- **Event Logging**: EventEmitter-based logging system
- **Unit Conversion**: Support for metric and imperial units
- **Export**: Compressed gzip export with HMAC signature
- **NDJSON Streaming**: Stream observations as newline-delimited JSON

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DATA_FILE=./data/weather-data.json
HMAC_SECRET=your-secret-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Usage

Start the server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Weather Observations
- `GET /api/weather` - List observations with filters
  - Query params: `city`, `country`, `from`, `to`, `conditions`, `minTemp`, `maxTemp`, `page`, `limit`, `sort`, `units`
- `GET /api/weather/:id` - Get observation by ID
- `GET /api/weather/stream` - Stream observations as NDJSON

### Statistics & Analytics
- `GET /api/stats/city` - City aggregation stats
  - Query params: `city`, `from`, `to`, `units`
- `GET /api/stats/cities` - Cities ranking
  - Query params: `metric`, `top`, `from`, `to`, `units`
- `GET /api/stats/summary` - Global summary
  - Query params: `from`, `to`, `units`
- `GET /api/stats/daily` - Daily stats grouping
  - Query params: `city`, `from`, `to`, `units`

### Export
- `GET /export.gz` - Compressed gzip export with HMAC signature
  - Query params: `city`, `country`, `from`, `to`, `conditions`

## Examples

### Get observations for a city
```bash
curl "http://localhost:3000/api/weather?city=Casablanca&page=1&limit=10"
```

### Get city statistics
```bash
curl "http://localhost:3000/api/stats/city?city=Paris&from=2025-10-01T00:00:00Z&to=2025-10-31T23:59:59Z"
```

### Get cities ranking
```bash
curl "http://localhost:3000/api/stats/cities?metric=temp.avg&top=5"
```

### Export filtered data
```bash
curl "http://localhost:3000/export.gz?city=London" -o export.json.gz
```

## Project Structure

```
weather-logger-api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middlewares/     # Express middlewares
│   ├── utils/          # Utility functions
│   ├── routes/         # Route definitions
│   ├── config/         # Configuration
│   └── app.js          # Express app setup
├── data/               # Data storage
├── server.js           # Entry point
└── package.json
```

## Architecture

The project follows a clean architecture pattern:

- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic and data processing
- **Middlewares**: Cross-cutting concerns (logging, error handling, rate limiting)
- **Utils**: Reusable utility functions (validation, conversion, caching)

## Technologies

- Express.js
- Node.js fs.promises for async file operations
- LRU cache for query optimization
- Express Rate Limit
- CORS & Helmet for security
- Compression middleware
- EventEmitter for logging
- Zlib for gzip compression
- Crypto for HMAC signatures
