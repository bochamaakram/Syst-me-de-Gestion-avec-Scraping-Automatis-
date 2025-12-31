-- Seed Data for knowway (PostgreSQL)

-- 1. Insert Users
INSERT INTO users (username, email, password, role, points, avatar_url, bio) VALUES
('Admin User', 'admin@knowway.com', '$2b$10$YourHashedPasswordHere', 'super_admin', 1000, 'https://ui-avatars.com/api/?name=Admin+User&background=cba6f7&color=11111b', 'System Administrator'),
('Jane Teacher', 'jane@knowway.com', '$2b$10$YourHashedPasswordHere', 'teacher', 500, 'https://ui-avatars.com/api/?name=Jane+Teacher&background=89b4fa&color=11111b', 'Senior Instructor specializing in Web Development');

-- 2. Insert Categories
INSERT INTO categories (id, code, name) VALUES
(1, 'dev', 'Development'),
(2, 'design', 'Design'),
(3, 'marketing', 'Marketing');

-- Alternately, if you can't force IDs easily in some setups (though standard SQL allows it), you'd rely on order or subqueries.
-- But for a seed file, explicit IDs are usually fine if sequence is reset or tables are truncated.

-- 3. Insert Courses (10 Courses)
-- Note: Replaced 'category' string with 'category_id' integer
INSERT INTO courses (title, description, short_description, category_id, level, is_free, point_cost, points_reward, duration, image_url, user_id, status, total_lessons, rating, rating_count) VALUES
-- Course 1: Web Dev (Dev -> 1)
('Complete Web Development Bootcamp', 'The only course you need to learn to code and become a full-stack web developer. Covers HTML, CSS, JS, Node, and more.', 'Become a full-stack web developer with just one course.', 1, 'beginner', true, 0, 500, 40, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.8, 120),

-- Course 2: React (Dev -> 1)
('React - The Complete Guide', 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!', 'Master React.js and build modern web apps.', 1, 'intermediate', false, 2000, 0, 25, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.9, 85),

-- Course 3: UI/UX (Design -> 2)
('UI/UX Design Masterclass', 'Learn how to design beautiful interfaces and user experiences. Covers Figma, prototyping, and design theory.', 'Design beautiful user interfaces and experiences.', 2, 'beginner', true, 0, 300, 15, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.7, 45),

-- Course 4: Python (Dev -> 1)
('Python for Data Science', 'Learn Python programming for data science and machine learning. Pandas, NumPy, Matplotlib, and more.', 'Master Python for data analysis and ML.', 1, 'advanced', false, 3000, 0, 30, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.6, 200),

-- Course 5: Digital Marketing (Marketing -> 3)
('Digital Marketing Strategy', 'Master digital marketing strategies: SEO, social media marketing, email marketing, and analytics.', 'Grow your business with digital marketing.', 3, 'beginner', true, 0, 400, 10, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.5, 90),

-- Course 6: Graphic Design (Design -> 2)
('Graphic Design Survival Guide', 'Essential graphic design principles. Typography, color theory, layout, and branding.', 'Learn the fundamentals of graphic design.', 2, 'beginner', true, 0, 250, 8, 'https://images.unsplash.com/photo-1626785774573-4b799312c95d?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.8, 60),

-- Course 7: JavaScript (Dev -> 1)
('JavaScript: The Advanced Concepts', 'Deep dive into JS: closures, prototypes, async/await, and modern ES6+ features.', 'Take your JavaScript skills to the next level.', 1, 'advanced', false, 2500, 0, 20, 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.9, 150),

-- Course 8: Content Marketing (Marketing -> 3)
('Content Marketing Masterclass', 'Learn how to create content that sells. Copywriting, storytelling, and content strategy.', 'Create content that drives engagement and sales.', 3, 'intermediate', true, 0, 350, 12, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.7, 75),

-- Course 9: Flutter (Dev -> 1)
('Flutter & Dart - The Complete Guide', 'Build native iOS and Android apps with a single codebase using Flutter and Dart.', 'Build mobile apps with Flutter.', 1, 'intermediate', false, 1500, 0, 35, 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.8, 110),

-- Course 10: SEO (Marketing -> 3)
('SEO Training 2024', 'Become an SEO expert. Learn link building, technical SEO, and keyword research.', 'Rank #1 on Google with advanced SEO strategies.', 3, 'advanced', false, 1000, 0, 14, 'https://images.unsplash.com/photo-1571786256017-aee7cf323d1b?auto=format&fit=crop&w=800&q=80', 2, 'active', 3, 4.6, 95);

-- 4. Insert Lessons (3 per course for demo)
INSERT INTO course_lessons (course_id, title, content, video_url, order_index) VALUES
-- Course 1 Lessons
(1, 'Introduction to Web Development', 'Welcome to the course! Here is what we will cover...', 'https://www.youtube.com/watch?v=zJSY8tbf_ys', 1),
(1, 'HTML Basics', 'Learning the structure of the web.', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 2),
(1, 'CSS Styling', 'Making things look good with CSS.', 'https://www.youtube.com/watch?v=1PnVor36_40', 3),

-- Course 2 Lessons
(2, 'React Introduction', 'Why React? Let us explore.', 'https://www.youtube.com/watch?v=bMknfKXIFA8', 1),
(2, 'Components & Props', 'Building blocks of React.', 'https://www.youtube.com/watch?v=m7OWXtbiXX8', 2),
(2, 'State Management', 'Handling data in React.', 'https://www.youtube.com/watch?v=35lXWvCuM8o', 3),

-- Course 3 Lessons
(3, 'What is UX?', 'Understanding User Experience.', 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 1),
(3, 'Figma Crash Course', 'Getting started with Figma.', 'https://www.youtube.com/watch?v=FT FaQWZBqQ', 2),
(3, 'Wireframing', 'Planning your design.', 'https://www.youtube.com/watch?v=P2p8Z-Mj7sE', 3),

-- Add lessons for other courses similarly (simplified for brevity)
(4, 'Python Setup', 'Installing Python and VSCode.', 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', 1),
(4, 'Variables & Types', 'Python basics.', 'https://www.youtube.com/watch?v=khCvL-tR4eI', 2),
(4, 'Data Structures', 'Lists, Dictionaries, and Tuples.', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 3),

(5, 'Digital Marketing 101', 'Overview of the landscape.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 1),
(5, 'Social Media Strategy', 'Winning on social.', 'https://www.youtube.com/watch?v=H4p6njjPV_o', 2),
(5, 'Email Marketing', 'Building your list.', 'https://www.youtube.com/watch?v=p4Q6-Q-fF8w', 3),

(6, 'Design Principles', 'Contrast, Repetition, Alignment, Proximity.', 'https://www.youtube.com/watch?v=YqQx75OPRa0', 1),
(6, 'Color Theory', 'Choosing the right colors.', 'https://www.youtube.com/watch?v=_2LLXnUdUIc', 2),
(6, 'Typography', 'Selecting fonts.', 'https://www.youtube.com/watch?v=sByzHoiYFX0', 3),

(7, 'JS Engine', 'How JS works under the hood.', 'https://www.youtube.com/watch?v=8aGhZQkoFbQ', 1),
(7, 'Closures', 'Understanding scope and closures.', 'https://www.youtube.com/watch?v=vDX4-k-yZf4', 2),
(7, 'Promises & Async', 'Handling asynchronous operations.', 'https://www.youtube.com/watch?v=VNfPZ4mFExM', 3),

(8, 'Copywriting 101', 'Writing content that converts.', 'https://www.youtube.com/watch?v=XhV54G4y4G4', 1),
(8, 'Content Strategy', 'Planning your content calendar.', 'https://www.youtube.com/watch?v=n9H8j6g4rM8', 2),
(8, 'Distribution', 'Getting eyeballs on your content.', 'https://www.youtube.com/watch?v=5_MT5tVvQdY', 3),

(9, 'Flutter Setup', 'Installing Flutter SDK.', 'https://www.youtube.com/watch?v=1ukSR1GRtMU', 1),
(9, 'Dart Basics', 'Language fundamentals.', 'https://www.youtube.com/watch?v=Ej_Pcr4uC2Q', 2),
(9, 'Building Layouts', 'Widgets and Flexbox.', 'https://www.youtube.com/watch?v=x0uinJvhNxI', 3),

(10, 'How Search Works', 'Crawling, Indexing, and Ranking.', 'https://www.youtube.com/watch?v=BNHR6IQJGZs', 1),
(10, 'Keyword Research', 'Finding the right terms.', 'https://www.youtube.com/watch?v=x5IJ09F_scc', 2),
(10, 'On-Page SEO', 'Optimizing your content.', 'https://www.youtube.com/watch?v=R2h1v9Y16p4', 3);

-- 5. Create Initial Quizzes for courses
INSERT INTO course_quizzes (course_id, title) VALUES
(1, 'Web Dev Final Quiz'),
(2, 'React Final Quiz'),
(3, 'UI/UX Final Quiz'),
(4, 'Python Final Quiz'),
(5, 'Marketing Final Quiz'),
(6, 'Design Final Quiz'),
(7, 'JS Advanced Quiz'),
(8, 'Content Assessment'),
(9, 'Flutter Quiz'),
(10, 'SEO Proficiency Test');

-- Reset sequences to ensure next inserts don't conflict
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
