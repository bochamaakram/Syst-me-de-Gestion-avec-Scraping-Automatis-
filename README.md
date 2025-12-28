# knowway - Course Management System

A full-stack web application for managing online courses with user authentication, course marketplace, points system, quizzes, and in-person course search powered by n8n automation.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with **JWT tokens**
- Password hashing using **bcrypt**
- Role-based access control (Super Admin, Teacher, Learner)
- User credentials stored in cookies for seamless experience
- Protected API routes with authentication middleware

### 📖 Course Management
- Full CRUD operations for courses
- Course categories (Development, Design, Marketing)
- Skill levels (Beginner, Intermediate, Advanced)
- Lesson management with markdown content support
- Image uploads for course thumbnails
- Search, filter, and sorting (Newest, Popular, A-Z)

### 📚 Lesson System
- Create and manage lessons per course
- Rich text lesson content with markdown support
- Course progress tracking per lesson
- Mark lessons as complete/incomplete
- Sequential lesson navigation

### 🏆 Points System
- Earn points by completing courses
- Spend points to unlock premium courses
- Points balance displayed in navbar
- Transaction history tracking

### � Quiz System
- Create quizzes for courses
- Multiple choice questions
- Quiz scoring and attempts tracking
- Pass/fail thresholds

### 🏢 In-Person Course Search
- Search for local training centers and workshops
- Powered by n8n webhook + SerpAPI integration
- Google Maps data for real places
- User search logging to Google Sheets
- Quick search tags for common topics

### 💬 Course Chat Room
- Real-time discussion for enrolled users
- Per-course chat rooms
- New message notification badge
- Mobile floating chat button
- Auto-refresh messages
- Persistent read status across sessions

### ❤️ Favorites System
- Add/remove courses to favorites
- View all favorited courses
- Quick access to saved content

### 🛒 Purchase System
- Course purchasing with points
- Free and paid courses support
- Track enrolled courses
- Progress tracking per course

### 👥 User Management
- User profiles with stats
- Admin dashboard for user management
- Role management (promote/demote users)
- Course creation for teachers

### 🎨 Modern UI Design
- Catppuccin Mocha color theme
- Responsive design (Desktop, Tablet, Mobile)
- SVG icon system (no emojis)
- Clean dropdown filters
- Horizontal course row layouts

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | JWT, bcryptjs |
| **Validation** | Joi |
| **File Upload** | Multer |
| **Automation** | n8n webhooks |
| **External APIs** | SerpAPI (Google Maps) |
| **Frontend** | Vanilla HTML, CSS, JavaScript |

## 📁 Project Structure

```
├── public/                 # Frontend static files
│   ├── css/
│   │   ├── main.css        # Global styles & components
│   │   ├── icons.css       # SVG icon definitions
│   │   ├── course.css      # Course viewer styles
│   │   ├── in-person.css   # In-person search styles
│   │   └── ...
│   ├── js/
│   │   ├── api.js          # API client
│   │   ├── utils.js        # Shared utilities
│   │   └── pages/          # Page-specific JS
│   ├── index.html          # Landing page
│   ├── explore.html        # Course marketplace
│   ├── learning.html       # My Learning dashboard
│   ├── course.html         # Course viewer
│   ├── in-person.html      # In-person course search
│   ├── profile.html        # User profile
│   ├── admin.html          # Admin panel
│   └── course-editor.html  # Course creation/editing
├── server/
│   ├── config/
│   │   ├── database.js     # Supabase client
│   │   └── db.js           # Query helper
│   ├── controllers/        # Route handlers
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   ├── upload.js       # File upload config
│   │   └── validation.js   # Input validation
│   └── routes/             # API route definitions
├── n8n-workflows/          # n8n workflow JSON files
├── schema-postgres.sql     # PostgreSQL schema
├── seed-postgres.sql       # Sample data
├── server.js               # Application entry point
├── package.json
└── .env                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Supabase account (or PostgreSQL)
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
   
   Run `schema-postgres.sql` in your Supabase SQL editor, then optionally run `seed-postgres.sql` for sample data.

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=7d
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

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/course/:id` | Get lessons for course |
| POST | `/api/lessons` | Create lesson |
| PUT | `/api/lessons/:id` | Update lesson |
| DELETE | `/api/lessons/:id` | Delete lesson |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/course/:id` | Get course progress |
| POST | `/api/progress/lesson/:id/complete` | Mark lesson complete |
| DELETE | `/api/progress/lesson/:id/complete` | Mark lesson incomplete |

### Points
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/points/balance` | Get points balance |
| GET | `/api/points/history` | Get points history |
| POST | `/api/points/purchase/:id` | Purchase course with points |
| POST | `/api/points/complete/:id` | Complete course (earn points) |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/course/:id` | Get quiz for course |
| POST | `/api/quiz/:id/submit` | Submit quiz answers |
| GET | `/api/quiz/attempts/:id` | Get quiz attempts |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites/my-favorites` | Get user's favorites |
| POST | `/api/favorites/:courseId` | Add to favorites |
| DELETE | `/api/favorites/:courseId` | Remove from favorites |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/my-role` | Get current user role |
| PUT | `/api/users/:id/role` | Update user role |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/:courseId` | Get chat messages (enrolled only) |
| POST | `/api/chat/:courseId` | Send chat message (enrolled only) |

## 🔗 n8n Integration

The In-Person course search feature uses an n8n webhook to:
1. Receive search requests (keyword + city + user info)
2. Query SerpAPI for Google Maps results
3. Log searches to Google Sheets
4. Return filtered place results

Webhook URL: `https://n8n.zackdev.io/webhook/search-logs`

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Input validation with Joi
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ SQL injection prevention (parameterized queries)
- ✅ Cookie-based user session storage

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Akram Bochama**

- GitHub: [@bochamaakram](https://github.com/bochamaakram)

---

⭐ Star this repository if you find it helpful!
