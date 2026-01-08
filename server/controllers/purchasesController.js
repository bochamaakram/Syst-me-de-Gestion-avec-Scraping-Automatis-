const supabase = require('../config/database');

exports.purchaseCourse = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId, 10);
        const userId = req.user.id;

        // Get course info
        const { data: courses } = await supabase.from('courses').select('id, title, is_free, point_cost').eq('id', courseId);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const course = courses[0];

        // Check if already purchased
        const { data: existing } = await supabase.from('purchases').select('id').eq('user_id', userId).eq('course_id', courseId);
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        // Get user points
        const { data: users } = await supabase.from('users').select('points').eq('id', userId);
        const userPoints = users?.[0]?.points || 0;

        const cost = course.is_free ? 0 : course.point_cost;
        if (userPoints < cost) {
            return res.status(400).json({
                success: false,
                message: `Not enough points. You need ${cost} points but have ${userPoints}.`
            });
        }

        // Deduct points
        if (cost > 0) {
            await supabase.from('users').update({ points: userPoints - cost }).eq('id', userId);
            await supabase.from('point_transactions').insert({
                user_id: userId, amount: -cost, type: 'course_purchase',
                course_id: courseId, description: `Enrolled in: ${course.title}`
            });
        }

        // Insert purchase
        await supabase.from('purchases').insert({ user_id: userId, course_id: courseId, points_paid: cost });

        // Increment total_students
        const { data: courseData } = await supabase.from('courses').select('total_students').eq('id', courseId);
        await supabase.from('courses').update({ total_students: (courseData?.[0]?.total_students || 0) + 1 }).eq('id', courseId);

        res.json({ success: true, message: cost > 0 ? `Enrolled for ${cost} points` : 'Enrolled successfully', pointsSpent: cost });
    } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyPurchases = async (req, res) => {
    try {
        const { data: purchases, error } = await supabase
            .from('purchases')
            .select('*, courses(*)')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten the result
        const result = purchases?.map(p => ({
            ...p.courses,
            progress: p.progress,
            points_paid: p.points_paid,
            quiz_passed: p.quiz_passed,
            quiz_score: p.quiz_score,
            purchased_at: p.created_at
        })) || [];

        res.json({ success: true, purchases: result });
    } catch (err) {
        console.error('Get purchases error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyPurchaseIds = async (req, res) => {
    try {
        const { data, error } = await supabase.from('purchases').select('course_id').eq('user_id', req.user.id);
        if (error) throw error;
        res.json({ success: true, purchaseIds: data?.map(r => r.course_id) || [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        const { error } = await supabase
            .from('purchases')
            .update({ progress })
            .eq('user_id', req.user.id)
            .eq('course_id', req.params.courseId);

        if (error) throw error;
        res.json({ success: true, message: 'Progress updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
