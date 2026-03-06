# E-commerce Microservice

A simple e-commerce application built with microservices architecture.

## What is this?

Three independent services that work together:
- **Auth Service** - User login and registration
- **Product Service** - Create and buy products
- **Order Service** - Process orders from product purchases

## Setup

### Requirements
- Node.js
- MongoDB (local or cloud)
- RabbitMQ (for messaging between services)
- Docker (to run RabbitMQ easily)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/harcastic/Microservice-Ecommerce-Api.git
   cd Ecommerce-Microservice
   ```

2. **Install dependencies** (do this in each service folder)
   ```bash
   cd auth-service && npm install
   cd ../order-service && npm install
   cd ../product-service && npm install
   ```

3. **Setup environment variables**
   - Copy `.env.example` to `.env` in each service folder
   - Fill in your MongoDB connection string
   - Set a SECRET_KEY for auth service

4. **Start RabbitMQ** (using Docker)
   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

## Running the Services

Start each service in a separate terminal:

```bash
# Terminal 1 - Auth Service
cd auth-service
npm run dev

# Terminal 2 - Order Service
cd order-service
npm run dev

# Terminal 3 - Product Service
cd product-service
npm run dev
```

## API Endpoints

### Auth Service (Port 5000)
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Product Service (Port 5002)
- `POST /product/create` - Create product (needs token)
- `POST /product/buy` - Buy product (needs token)

### Order Service (Port 5001)
- `GET /order/orders` - Get all orders (needs token)

## How it Works

1. User registers and logs in → Gets JWT token
2. User creates products
3. User buys products → Message sent to RabbitMQ
4. Order service processes the order → Message sent back
5. Product service receives order confirmation

## Monitor RabbitMQ

Open browser: `http://localhost:15672`
- Username: `guest`
- Password: `guest`

See messages flowing between services!

## File Structure

```
├── auth-service/       # User authentication
├── order-service/      # Order processing
├── product-service/    # Products management
├── middleware/         # Shared JWT verification
└── .gitignore         # Don't commit secrets!
```

## Notes

- Never commit `.env` files
- Use `.env.example` as template
- RabbitMQ must be running for services to communicate
- MongoDB must be running locally or use cloud URI
