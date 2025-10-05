# BookShop Management API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Books

#### Get All Books
```http
GET /api/books?page=1&limit=10&search=title&category=fiction
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `category` (optional): Filter by category
- `sort` (optional): Sort by field (price, title, createdAt)

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A classic American novel...",
        "price": 12.99,
        "stock": 50,
        "category": "fiction",
        "image": "book_image_url",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

#### Get Book by ID
```http
GET /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel...",
      "price": 12.99,
      "stock": 50,
      "category": "fiction",
      "image": "book_image_url",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Create Book (Admin Only)
```http
POST /api/books
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "New Book",
  "author": "Author Name",
  "description": "Book description",
  "price": 15.99,
  "stock": 100,
  "category": "fiction",
  "image": "book_image_url"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "book": {
      "id": "new_book_id",
      "title": "New Book",
      "author": "Author Name",
      "description": "Book description",
      "price": 15.99,
      "stock": 100,
      "category": "fiction",
      "image": "book_image_url",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Book (Admin Only)
```http
PUT /api/books/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Updated Book Title",
  "price": 18.99,
  "stock": 75
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "book": {
      "id": "book_id",
      "title": "Updated Book Title",
      "author": "Author Name",
      "description": "Book description",
      "price": 18.99,
      "stock": 75,
      "category": "fiction",
      "image": "book_image_url",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Delete Book (Admin Only)
```http
DELETE /api/books/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

### Orders

#### Get User Orders
```http
GET /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "user": "user_id",
        "books": [
          {
            "book": {
              "id": "book_id",
              "title": "The Great Gatsby",
              "price": 12.99
            },
            "quantity": 2
          }
        ],
        "totalAmount": 25.98,
        "status": "pending",
        "shippingAddress": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Create Order
```http
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "books": [
    {
      "bookId": "book_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "new_order_id",
      "user": "user_id",
      "books": [
        {
          "book": {
            "id": "book_id",
            "title": "The Great Gatsby",
            "price": 12.99
          },
          "quantity": 2
        }
      ],
      "totalAmount": 25.98,
      "status": "pending",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": "order_id",
      "status": "shipped",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Users (Admin Only)

#### Get All Users
```http
GET /api/users
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per 15 minutes

## File Upload

### Upload Book Image
```http
POST /api/books/upload-image
```

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://example.com/uploads/book_image.jpg"
  }
}
```

## WebSocket Events (Future Implementation)

### Real-time Notifications
- Order status updates
- Stock level alerts
- New book notifications

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install axios
```

### Python
```bash
pip install requests
```

### PHP
```bash
composer require guzzlehttp/guzzle
```

## Support

For API support, please contact:
- Email: api-support@bookshop.com
- Documentation: https://docs.bookshop.com
- GitHub Issues: https://github.com/your-repo/issues

