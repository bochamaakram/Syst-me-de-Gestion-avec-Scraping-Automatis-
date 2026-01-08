/**
 * Chat Controller
 * ================
 * Handles course discussion/chat functionality.
 * Users can only access chat if they are enrolled in the course.
 * 
 * Endpoints:
 * - GET /api/chat/:courseId - Get all messages for a course
 * - POST /api/chat/:courseId - Send a new message
 */

// Import Supabase client for database operations
const supabase = require('../config/database');

/**
 * Get Messages for a Course
 * -------------------------
 * Retrieves all chat messages for a specific course.
 * Only enrolled users can access the chat.
 * 
 * @route GET /api/chat/:courseId
 * @param {number} courseId - The course ID from URL params
 * @returns {Array} messages - Array of message objects with user info
 */
exports.getMessages = async (req, res) => {
    try {
        // Extract course ID from URL parameters
        const courseId = parseInt(req.params.courseId, 10);

        // Get current user's ID from JWT token (set by auth middleware)
        const userId = req.user.id;

        // STEP 1: Verify user is enrolled in this course
        // Query the purchases table to check enrollment
        const { data: purchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        // If no purchase record found, user is not enrolled
        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled to access chat'
            });
        }

        // STEP 2: Fetch messages with user information
        // Uses Supabase's relational query to join with users table
        const { data: messages, error } = await supabase
            .from('course_messages')
            .select(`
                id,
                message,
                created_at,
                user_id,
                users (
                    id,
                    username
                )
            `)
            .eq('course_id', courseId)           // Filter by course
            .order('created_at', { ascending: true })  // Oldest first
            .limit(100);                         // Limit to last 100 messages

        // Throw error if database query failed
        if (error) throw error;

        // STEP 3: Format messages for frontend
        // Add isOwn flag to identify current user's messages
        const formattedMessages = messages.map(m => ({
            id: m.id,
            message: m.message,
            created_at: m.created_at,
            user_id: m.user_id,
            username: m.users?.username || 'Unknown',  // Handle null user
            isOwn: m.user_id === userId  // True if message is from current user
        }));

        // Return success response with messages
        res.json({ success: true, messages: formattedMessages });

    } catch (err) {
        // Log error for debugging
        console.error('Get messages error:', err);

        // Return generic error response
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Send a Message
 * --------------
 * Creates a new chat message in a course discussion.
 * Only enrolled users can send messages.
 * 
 * @route POST /api/chat/:courseId
 * @param {number} courseId - The course ID from URL params
 * @body {string} message - The message content
 * @returns {object} message - The created message object
 */
exports.sendMessage = async (req, res) => {
    try {
        // Extract course ID from URL parameters
        const courseId = parseInt(req.params.courseId, 10);

        // Extract message content from request body
        const { message } = req.body;

        // Get current user's ID from JWT token
        const userId = req.user.id;

        // VALIDATION 1: Check if message content exists
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // VALIDATION 2: Check message length limit
        if (message.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Message too long (max 1000 characters)'
            });
        }

        // STEP 1: Verify user is enrolled in this course
        const { data: purchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        // If no purchase record found, user cannot send messages
        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled to send messages'
            });
        }

        // STEP 2: Insert the new message into database
        const { data, error } = await supabase
            .from('course_messages')
            .insert({
                course_id: courseId,  // Already parsed as integer
                user_id: userId,
                message: message.trim()         // Remove whitespace
            })
            .select(`
                id,
                message,
                created_at,
                user_id
            `)
            .single();  // Return single inserted record

        // Throw error if insert failed
        if (error) throw error;

        // STEP 3: Get username for response
        const { data: user } = await supabase
            .from('users')
            .select('username')
            .eq('id', userId)
            .single();

        // STEP 4: Return created message with 201 Created status
        res.status(201).json({
            success: true,
            message: {
                id: data.id,
                message: data.message,
                created_at: data.created_at,
                user_id: data.user_id,
                username: user?.username || 'Unknown',
                isOwn: true  // Always true since user just sent it
            }
        });

    } catch (err) {
        // Log error for debugging
        console.error('Send message error:', err);

        // Return generic error response
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
