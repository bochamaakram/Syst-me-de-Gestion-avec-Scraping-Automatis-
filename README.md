# 📚 Course Management System with Automated Scraping

A full-stack web application for managing online courses with user authentication, course marketplace, favorites system, and automated web scraping capabilities.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with **JWT tokens**
- Password hashing using **bcrypt**
- Role-based access control (Super Admin, Teacher, Learner)
- Protected API routes with authentication middleware

### 📖 Course Management
- Full CRUD operations for courses
- Course categories (Development, Design, Marketing)
- Skill levels (Beginner, Intermediate, Advanced)
- Course status management (Active, Draft, Archived)
- Image uploads for course thumbnails
- Search, filter, and pagination support

### ❤️ Favorites System
- Add/remove courses to favorites
- View all favorited courses
- Quick access to saved content

### 🛒 Purchase System
- Course purchasing functionality
- Track purchased courses
- Progress tracking per course

### 🤖 Automated Web Scraping
- Integration with external scraping services
- Store and manage scraped data
- Category-based organization

### 👥 User Management
- User profiles with avatars and bios
- Admin dashboard for user management
- Role management (promote/demote users)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JWT, bcryptjs |
| **Validation** | Joi |
| **File Upload** | Multer |
| **HTTP Client** | Axios |
| **Frontend** | Vanilla HTML, CSS, JavaScript |

## 📁 Project Structure

```
├── public/                 # Frontend static files
│   ├── index.html          # Landing page
│   ├── login.html          # Authentication page
│   ├── dashboard.html      # User dashboard
│   ├── hub.html            # Course marketplace
│   ├── course.html         # Course details
│   ├── manage.html         # Course management (teachers)
│   ├── admin.html          # Admin panel
│   ├── app.js              # Frontend JavaScript
│   ├── styles.css          # Global styles
│   └── uploads/            # Uploaded files
├── server/
│   ├── config/
│   │   └── database.js     # MySQL connection
│   ├── controllers/        # Route handlers
│   │   ├── authController.js
│   │   ├── coursesController.js
│   │   ├── favoritesController.js
│   │   ├── purchasesController.js
│   │   ├── scrapingController.js
│   │   ├── uploadController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   ├── upload.js       # File upload config
│   │   └── validation.js   # Input validation
│   └── routes/             # API route definitions
├── schema.sql              # Database schema
├── seed.sql                # Sample data
├── server.js               # Application entry point
├── package.json
└── .env                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bochamaakram/Syst-me-de-Gestion-avec-Scraping-Automatis-.git
   cd Syst-me-de-Gestion-avec-Scraping-Automatis-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   mysql -u root -p < schema.sql
   mysql -u root -p course_management < seed.sql  # Optional: load sample data
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=course_management
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses (with filters) |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites/:courseId` | Add to favorites |
| DELETE | `/api/favorites/:courseId` | Remove from favorites |

### Purchases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchases` | Get user's purchases |
| POST | `/api/purchases/:courseId` | Purchase a course |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Input validation with Joi
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ SQL injection prevention (parameterized queries)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Akram Bochama**

- GitHub: [@bochamaakram](https://github.com/bochamaakram)

---

⭐ Star this repository if you find it helpful!
