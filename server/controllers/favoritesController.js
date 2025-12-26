const supabase = require('../config/database');

exports.addFavorite = async (req, res) => {
    try {
        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: req.user.id, course_id: req.params.courseId });

        if (error && error.code !== '23505') throw error; // Ignore duplicate
        res.json({ success: true, message: 'Added to favorites' });
    } catch (err) {
        console.error('Add favorite error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', req.user.id)
            .eq('course_id', req.params.courseId);

        if (error) throw error;
        res.json({ success: true, message: 'Removed from favorites' });
    } catch (err) {
        console.error('Remove favorite error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyFavorites = async (req, res) => {
    try {
        const { data: favorites, error } = await supabase
            .from('favorites')
            .select('*, courses(*)')
            .eq('user_id', req.user.id);

        if (error) throw error;

        const courses = favorites?.map(f => f.courses) || [];
        res.json({ success: true, favorites: courses });
    } catch (err) {
        console.error('Get favorites error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyFavoriteIds = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('course_id')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ success: true, favoriteIds: data?.map(f => f.course_id) || [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
