-- Seed data for knowway (Points-based system)
-- Run after schema.sql

-- Users (password: 123456 - bcrypt hash)
INSERT INTO users (username, email, password, role, points) VALUES
('admin', 'admin@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'super_admin', 5000),
('john_teacher', 'john@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'teacher', 10000),
('sarah_teacher', 'sarah@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'teacher', 10000),
('mike_learner', 'mike@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'learner', 0)
ON DUPLICATE KEY UPDATE username=username;

-- =====================
-- COURSE 1: JavaScript Fundamentals (FREE)
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, is_free, point_cost, points_reward, duration, image_url, status) VALUES
(1, 2, 'JavaScript Fundamentals', 
'Master the core concepts of JavaScript from scratch',
'A comprehensive introduction to JavaScript programming. Learn variables, functions, objects, arrays, and modern ES6+ features. Perfect for beginners who want to start their web development journey.',
'dev', 'beginner', TRUE, 0, 500, 8, 
'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800', 'active')
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO course_lessons (course_id, title, content, video_url, order_index) VALUES
(1, 'Introduction to JavaScript', 
'# Welcome to JavaScript!

JavaScript is the programming language of the web. It powers interactive websites, web applications, and even server-side applications.

## What You Will Learn

In this course, you will learn:
- Variables and data types
- Functions and scope
- Objects and arrays
- DOM manipulation
- Modern ES6+ features

## Why JavaScript?

JavaScript is everywhere:
- **Frontend**: React, Vue, Angular
- **Backend**: Node.js, Express
- **Mobile**: React Native, Ionic
- **Desktop**: Electron

Let''s get started!', 
'https://www.youtube.com/watch?v=W6NZfCO5SIk', 1),

(1, 'Variables and Data Types',
'# Variables in JavaScript

Variables are containers for storing data values.

## Declaring Variables

```javascript
// Modern way (ES6+)
let name = "John";
const age = 25;

// Old way (avoid)
var oldWay = "deprecated";
```

## Data Types

JavaScript has several data types:

1. **String**: Text values
2. **Number**: Numeric values
3. **Boolean**: true or false
4. **Array**: List of values
5. **Object**: Key-value pairs

Practice these concepts before moving on!',
NULL, 2),

(1, 'Functions',
'# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration

```javascript
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("World")); // Hello, World!
```

## Arrow Functions (ES6)

```javascript
const greet = (name) => {
    return `Hello, ${name}!`;
};

// Short syntax
const double = x => x * 2;
```

## Best Practices

- Use descriptive function names
- Each function should do one thing
- Keep functions small and focused',
NULL, 3);

-- Quiz for JavaScript course
INSERT INTO course_quizzes (id, course_id, title, passing_score) VALUES
(1, 1, 'JavaScript Fundamentals Quiz', 85);

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index) VALUES
(1, 'Which keyword is used to declare a constant in JavaScript?', '["var", "let", "const", "define"]', 2, 1),
(1, 'What will console.log(typeof []) output?', '["array", "object", "undefined", "list"]', 1, 2),
(1, 'Which of the following is NOT a JavaScript data type?', '["String", "Boolean", "Float", "Undefined"]', 2, 3),
(1, 'What is the correct syntax for an arrow function?', '["function => {}", "() => {}", "=> function()", "arrow() {}"]', 1, 4),
(1, 'How do you create a comment in JavaScript?', '["<!-- comment -->", "# comment", "// comment", "** comment **"]', 2, 5);

-- =====================
-- COURSE 2: React for Beginners (PAID - 2000 points)
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, is_free, point_cost, points_reward, duration, image_url, status) VALUES
(2, 2, 'React for Beginners',
'Build modern user interfaces with React',
'Learn React from the ground up. Understand components, state, props, hooks, and build real-world applications. This course will take you from zero to building production-ready React apps.',
'dev', 'intermediate', FALSE, 2000, 0, 12,
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'active')
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO course_lessons (course_id, title, content, video_url, order_index) VALUES
(2, 'What is React?',
'# Introduction to React

React is a JavaScript library for building user interfaces, developed by Facebook.

## Why React?

- **Component-Based**: Build encapsulated components
- **Declarative**: Describe what you want, React handles the how
- **Learn Once, Write Anywhere**: Web, mobile, desktop

## Key Concepts

1. **Components**: Building blocks of React apps
2. **JSX**: HTML-like syntax in JavaScript
3. **Props**: Data passed to components
4. **State**: Dynamic data within components
5. **Hooks**: Functions to use React features',
'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 1),

(2, 'Components and Props',
'# React Components

Components are the building blocks of React applications.

## Function Components

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="John" />
```

## Props

Props are read-only data passed from parent to child.

```jsx
function Card({ title, description }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}
```',
NULL, 2),

(2, 'State and Hooks',
'# State Management with Hooks

State allows components to manage dynamic data.

## useState Hook

```jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

## Rules of Hooks

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Hooks must be called in the same order',
NULL, 3);

-- Quiz for React course
INSERT INTO course_quizzes (id, course_id, title, passing_score) VALUES
(2, 2, 'React Fundamentals Quiz', 85);

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index) VALUES
(2, 'What is React primarily used for?', '["Database management", "Building user interfaces", "Server configuration", "File management"]', 1, 1),
(2, 'Which hook is used to manage state in functional components?', '["useEffect", "useState", "useContext", "useReducer"]', 1, 2),
(2, 'What is JSX?', '["A database query language", "A CSS preprocessor", "JavaScript syntax extension for React", "A testing framework"]', 2, 3),
(2, 'Props in React are:', '["Mutable and can be changed by child components", "Read-only data passed from parent to child", "Only used for styling", "Automatically updated by React"]', 1, 4),
(2, 'Which company developed React?', '["Google", "Microsoft", "Facebook/Meta", "Amazon"]', 2, 5);

-- =====================
-- COURSE 3: UI/UX Design Basics (FREE)
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, is_free, point_cost, points_reward, duration, image_url, status) VALUES
(3, 3, 'UI/UX Design Basics',
'Learn the fundamentals of user interface and experience design',
'Discover the principles of great design. Learn about color theory, typography, layout, user research, and prototyping. Create beautiful and functional designs that users love.',
'design', 'beginner', TRUE, 0, 500, 6,
'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'active')
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO course_lessons (course_id, title, content, video_url, order_index) VALUES
(3, 'Introduction to UI/UX',
'# UI/UX Design Fundamentals

## What is UI?

**User Interface (UI)** is about how a product looks and feels:
- Colors, fonts, icons
- Buttons, inputs, layouts
- Visual hierarchy
- Brand identity

## What is UX?

**User Experience (UX)** is about how a product works:
- User research
- Information architecture
- Wireframing
- Usability testing',
NULL, 1),

(3, 'Color Theory',
'# Color Theory for Designers

## The Color Wheel

Understanding color relationships is essential for design.

### Primary Colors
- Red, Yellow, Blue

### Secondary Colors
- Orange, Green, Purple

## Color Psychology

- **Red**: Energy, passion, urgency
- **Blue**: Trust, calm, professional
- **Green**: Growth, nature, health
- **Yellow**: Optimism, happiness
- **Purple**: Luxury, creativity',
NULL, 2),

(3, 'Typography Essentials',
'# Typography in Design

Good typography makes content readable and enjoyable.

## Font Categories

1. **Serif**: Traditional, formal (Times New Roman)
2. **Sans-serif**: Modern, clean (Arial, Helvetica)
3. **Display**: Decorative, headlines only
4. **Monospace**: Code, technical content

## Typography Rules

- Body text: 16-18px
- Headlines: 24-48px
- Line height: 1.5-1.7
- Maximum 2-3 fonts per project',
NULL, 3);

-- Quiz for UI/UX course
INSERT INTO course_quizzes (id, course_id, title, passing_score) VALUES
(3, 3, 'UI/UX Design Quiz', 85);

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index) VALUES
(3, 'What does UI stand for?', '["User Interaction", "User Interface", "Universal Integration", "Unified Input"]', 1, 1),
(3, 'What does UX focus on?', '["Visual appearance only", "Code quality", "User experience and usability", "Marketing strategies"]', 2, 2),
(3, 'Which color is associated with trust and professionalism?', '["Red", "Yellow", "Blue", "Green"]', 2, 3),
(3, 'Which font type is best for body text?', '["Display fonts", "Sans-serif or Serif", "Decorative fonts", "Script fonts"]', 1, 4),
(3, 'What is the recommended line height for readability?', '["1.0", "1.5-1.7", "2.5-3.0", "0.8"]', 1, 5);

-- =====================
-- COURSE 4: Digital Marketing (PAID - 2500 points)
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, is_free, point_cost, points_reward, duration, image_url, status) VALUES
(4, 3, 'Digital Marketing Mastery',
'Complete guide to digital marketing strategies',
'Learn SEO, social media marketing, email campaigns, and paid advertising. Build comprehensive marketing strategies that drive results and grow businesses.',
'marketing', 'intermediate', FALSE, 2500, 0, 15,
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'active')
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO course_lessons (course_id, title, content, video_url, order_index) VALUES
(4, 'Digital Marketing Overview',
'# Welcome to Digital Marketing

## What is Digital Marketing?

Digital marketing encompasses all marketing efforts using electronic devices or the internet.

## Key Channels

1. **Search Engine Optimization (SEO)**
2. **Pay-Per-Click (PPC)**
3. **Social Media Marketing**
4. **Content Marketing**
5. **Email Marketing**

## Why Digital Marketing?

- Measurable results
- Cost-effective
- Targeted reach
- Global audience',
NULL, 1),

(4, 'SEO Fundamentals',
'# Search Engine Optimization

## What is SEO?

SEO is the practice of optimizing content to rank higher in search engine results.

## On-Page SEO

- **Title Tags**: Include keywords, 50-60 characters
- **Meta Descriptions**: Compelling, 150-160 characters
- **Headers**: Use H1, H2, H3 hierarchy
- **Content**: Quality, relevant, keyword-rich

## Off-Page SEO

- Backlink building
- Social signals
- Brand mentions
- Guest posting',
NULL, 2),

(4, 'Social Media Strategy',
'# Social Media Marketing

## Platform Selection

Choose platforms based on your audience:

- **Facebook**: B2C, community
- **Instagram**: Visual brands
- **LinkedIn**: B2B, professional
- **Twitter**: News, engagement
- **TikTok**: Gen Z, viral content

## Content Strategy

- **80/20 Rule**: 80% value, 20% promotion
- **Consistency**: Regular posting schedule
- **Engagement**: Respond to comments
- **Hashtags**: Research and use strategically',
NULL, 3);

-- Quiz for Marketing course
INSERT INTO course_quizzes (id, course_id, title, passing_score) VALUES
(4, 4, 'Digital Marketing Quiz', 85);

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index) VALUES
(4, 'What does SEO stand for?', '["Social Engine Optimization", "Search Engine Optimization", "Site Enhancement Option", "Search Enhancement Operation"]', 1, 1),
(4, 'Which platform is best for B2B marketing?', '["TikTok", "Instagram", "LinkedIn", "Snapchat"]', 2, 2),
(4, 'What is the recommended 80/20 rule in content marketing?', '["80% sales, 20% content", "80% value, 20% promotion", "80% images, 20% text", "80% ads, 20% organic"]', 1, 3),
(4, 'What is a meta description?', '["A long blog post", "A brief summary of page content for search results", "A social media post", "An email subject line"]', 1, 4),
(4, 'Which is NOT a key digital marketing channel?', '["SEO", "Email Marketing", "Print Advertising", "Social Media"]', 2, 5);

SELECT 'Seed data inserted successfully!' as message;
