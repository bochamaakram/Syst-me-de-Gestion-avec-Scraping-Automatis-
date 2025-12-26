-- Seed data for knowway
-- Run after schema.sql

-- Clear existing data (optional - comment out if you want to keep data)
-- DELETE FROM course_lessons;
-- DELETE FROM purchases;
-- DELETE FROM favorites;
-- DELETE FROM courses;
-- DELETE FROM users WHERE id > 1;

-- Users (password: 123456 - bcrypt hash)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'super_admin'),
('john_teacher', 'john@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'teacher'),
('sarah_teacher', 'sarah@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'teacher'),
('mike_learner', 'mike@knowway.com', '$2a$10$rDkPvvAFV8kqwevKYqNBNOVnHX7id8JKDj2Z5E5xRJxRJxRJxRJx6', 'learner')
ON DUPLICATE KEY UPDATE username=username;

-- =====================
-- COURSE 1: JavaScript Fundamentals
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, price, duration, image_url, status) VALUES
(1, 2, 'JavaScript Fundamentals', 
'Master the core concepts of JavaScript from scratch',
'A comprehensive introduction to JavaScript programming. Learn variables, functions, objects, arrays, and modern ES6+ features. Perfect for beginners who want to start their web development journey.',
'dev', 'beginner', 0, 8, 
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
6. **Null**: Intentional absence
7. **Undefined**: Uninitialized

## Examples

```javascript
let message = "Hello World";  // String
let count = 42;               // Number
let isActive = true;          // Boolean
let colors = ["red", "blue"]; // Array
let user = { name: "John" };  // Object
```

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

## Parameters and Arguments

```javascript
function add(a, b) {
    return a + b;
}

add(5, 3); // Returns 8
```

## Best Practices

- Use descriptive function names
- Each function should do one thing
- Keep functions small and focused
- Use arrow functions for callbacks',
NULL, 3),

(1, 'Objects and Arrays',
'# Objects and Arrays

## Arrays

Arrays store multiple values in a single variable.

```javascript
const fruits = ["apple", "banana", "orange"];

// Access elements
console.log(fruits[0]); // apple

// Array methods
fruits.push("grape");    // Add to end
fruits.pop();            // Remove from end
fruits.length;           // Get length
```

## Objects

Objects store key-value pairs.

```javascript
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Access properties
console.log(person.name);     // John
console.log(person["age"]);   // 30
```

## Combining Both

```javascript
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];
```',
NULL, 4);

-- =====================
-- COURSE 2: React for Beginners
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, price, duration, image_url, status) VALUES
(2, 2, 'React for Beginners',
'Build modern user interfaces with React',
'Learn React from the ground up. Understand components, state, props, hooks, and build real-world applications. This course will take you from zero to building production-ready React apps.',
'dev', 'intermediate', 29.99, 12,
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
5. **Hooks**: Functions to use React features

## Your First React App

```jsx
function App() {
    return (
        <div>
            <h1>Hello React!</h1>
            <p>Welcome to your first React app.</p>
        </div>
    );
}
```',
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
function Card({ title, description, image }) {
    return (
        <div className="card">
            <img src={image} alt={title} />
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

// Usage
<Card 
    title="Learn React"
    description="Build amazing UIs"
    image="react.png"
/>
```

## Component Composition

```jsx
function App() {
    return (
        <div>
            <Header />
            <MainContent />
            <Footer />
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

## useEffect Hook

```jsx
import { useState, useEffect } from "react";

function DataFetcher() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch("/api/data")
            .then(res => res.json())
            .then(data => setData(data));
    }, []);
    
    return <div>{data ? data.message : "Loading..."}</div>;
}
```

## Rules of Hooks

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Hooks must be called in the same order',
NULL, 3);

-- =====================
-- COURSE 3: UI/UX Design Basics
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, price, duration, image_url, status) VALUES
(3, 3, 'UI/UX Design Basics',
'Learn the fundamentals of user interface and experience design',
'Discover the principles of great design. Learn about color theory, typography, layout, user research, and prototyping. Create beautiful and functional designs that users love.',
'design', 'beginner', 19.99, 6,
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
- Usability testing

## The Design Process

1. **Research**: Understand users and goals
2. **Define**: Create personas and user flows
3. **Design**: Wireframes and prototypes
4. **Test**: Validate with real users
5. **Iterate**: Improve based on feedback

![Design Process](https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600)',
NULL, 1),

(3, 'Color Theory',
'# Color Theory for Designers

## The Color Wheel

Understanding color relationships is essential for design.

### Primary Colors
- Red, Yellow, Blue

### Secondary Colors
- Orange, Green, Purple

### Tertiary Colors
- Mix of primary and secondary

## Color Harmonies

- **Complementary**: Opposite colors (high contrast)
- **Analogous**: Adjacent colors (harmony)
- **Triadic**: Three colors equally spaced

## Color Psychology

- **Red**: Energy, passion, urgency
- **Blue**: Trust, calm, professional
- **Green**: Growth, nature, health
- **Yellow**: Optimism, happiness
- **Purple**: Luxury, creativity

## Best Practices

1. Use 60-30-10 rule
2. Consider accessibility (contrast)
3. Be consistent with brand colors
4. Test in different contexts',
NULL, 2),

(3, 'Typography Essentials',
'# Typography in Design

Good typography makes content readable and enjoyable.

## Font Categories

1. **Serif**: Traditional, formal (Times New Roman)
2. **Sans-serif**: Modern, clean (Arial, Helvetica)
3. **Display**: Decorative, headlines only
4. **Monospace**: Code, technical content

## Hierarchy

Create visual hierarchy with:
- **Size**: Larger = more important
- **Weight**: Bold for emphasis
- **Color**: Contrast for attention
- **Spacing**: Breathing room

## Typography Rules

```
H1: 32-48px
H2: 24-32px
H3: 18-24px
Body: 16-18px
Caption: 12-14px
```

## Pairing Fonts

- One serif + one sans-serif
- Same font family, different weights
- Maximum 2-3 fonts per project

## Line Height & Spacing

- Body text: 1.5-1.7 line height
- Headlines: 1.1-1.3 line height
- Paragraph spacing: 1.5em',
NULL, 3);

-- =====================
-- COURSE 4: Digital Marketing
-- =====================
INSERT INTO courses (id, user_id, title, short_description, description, category, level, price, duration, image_url, status) VALUES
(4, 3, 'Digital Marketing Mastery',
'Complete guide to digital marketing strategies',
'Learn SEO, social media marketing, email campaigns, and paid advertising. Build comprehensive marketing strategies that drive results and grow businesses.',
'marketing', 'intermediate', 49.99, 15,
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
6. **Affiliate Marketing**

## Why Digital Marketing?

- Measurable results
- Cost-effective
- Targeted reach
- Global audience
- Real-time adjustments

## The Marketing Funnel

```
Awareness → Interest → Consideration → Conversion → Retention
```

This course will cover strategies for each stage.',
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
- **URLs**: Short, descriptive, include keywords

## Technical SEO

- Site speed optimization
- Mobile responsiveness
- SSL certificate (HTTPS)
- XML sitemaps
- Robots.txt

## Off-Page SEO

- Backlink building
- Social signals
- Brand mentions
- Guest posting

## Tools

- Google Search Console
- Google Analytics
- Ahrefs / SEMrush
- Moz',
NULL, 2),

(4, 'Social Media Strategy',
'# Social Media Marketing

## Platform Selection

Choose platforms based on your audience:

| Platform | Best For |
|----------|----------|
| Facebook | B2C, community |
| Instagram | Visual brands |
| LinkedIn | B2B, professional |
| Twitter | News, engagement |
| TikTok | Gen Z, viral |

## Content Strategy

- **80/20 Rule**: 80% value, 20% promotion
- **Consistency**: Regular posting schedule
- **Engagement**: Respond to comments
- **Hashtags**: Research and use strategically

## Content Types

1. Educational posts
2. Behind-the-scenes
3. User-generated content
4. Stories and reels
5. Live videos

## Metrics to Track

- Reach and impressions
- Engagement rate
- Click-through rate
- Follower growth
- Conversion rate',
NULL, 3);

SELECT 'Seed data inserted successfully!' as message;
