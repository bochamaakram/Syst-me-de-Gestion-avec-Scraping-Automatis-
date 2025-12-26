const supabase = require('../config/database');

exports.getBalance = async (req, res) => {
    try {
        const { data: users, error } = await supabase.from('users').select('points').eq('id', req.user.id);
        if (error) throw error;
        res.json({ success: true, points: users?.[0]?.points || 0 });
    } catch (err) {
        console.error('Get balance error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { data: transactions, error } = await supabase
            .from('point_transactions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, transactions: transactions || [] });
    } catch (err) {
        console.error('Get history error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const { data: courses } = await supabase.from('courses').select('id, title, is_free, point_cost').eq('id', courseId);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const course = courses[0];

        const { data: existing } = await supabase.from('purchases').select('id').eq('user_id', userId).eq('course_id', courseId);
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        const { data: users } = await supabase.from('users').select('points').eq('id', userId);
        const userPoints = users?.[0]?.points || 0;
        const cost = course.is_free ? 0 : course.point_cost;

        if (userPoints < cost) {
            return res.status(400).json({ success: false, message: `Not enough points. Need ${cost}, have ${userPoints}.` });
        }

        if (cost > 0) {
            await supabase.from('users').update({ points: userPoints - cost }).eq('id', userId);
            await supabase.from('point_transactions').insert({
                user_id: userId, amount: -cost, type: 'course_purchase',
                course_id: parseInt(courseId), description: `Enrolled in: ${course.title}`
            });
        }

        await supabase.from('purchases').insert({ user_id: userId, course_id: parseInt(courseId), points_paid: cost });

        res.json({ success: true, message: cost > 0 ? `Enrolled for ${cost} points` : 'Enrolled successfully', pointsSpent: cost });
    } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.completeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const { data: purchases } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId);

        if (!purchases || purchases.length === 0) {
            return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
        }

        const purchase = purchases[0];
        if (!purchase.quiz_passed) {
            return res.status(400).json({ success: false, message: 'Must pass the quiz first' });
        }

        if (purchase.completed_at) {
            return res.status(400).json({ success: false, message: 'Already completed' });
        }

        const { data: courses } = await supabase.from('courses').select('*').eq('id', courseId);
        const course = courses[0];

        let reward;
        if (course.is_free) {
            reward = course.points_reward || 500;
        } else {
            reward = Math.round(purchase.points_paid * 1.25);
        }

        const { data: users } = await supabase.from('users').select('points').eq('id', userId);
        const currentPoints = users?.[0]?.points || 0;

        await supabase.from('users').update({ points: currentPoints + reward }).eq('id', userId);
        await supabase.from('point_transactions').insert({
            user_id: userId, amount: reward, type: 'course_complete',
            course_id: parseInt(courseId), description: `Completed: ${course.title}`
        });
        await supabase.from('purchases').update({ completed_at: new Date().toISOString() }).eq('user_id', userId).eq('course_id', courseId);

        res.json({ success: true, message: `Congratulations! You earned ${reward} points!`, pointsEarned: reward });
    } catch (err) {
        console.error('Complete course error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
