const supabase = require('../config/database');

exports.getQuiz = async (req, res) => {
    try {
        const { data: quizzes, error } = await supabase
            .from('course_quizzes')
            .select('*')
            .eq('course_id', req.params.courseId);

        if (error) throw error;
        if (!quizzes || quizzes.length === 0) {
            return res.json({ success: true, quiz: null });
        }

        const quiz = quizzes[0];

        const { data: questions } = await supabase
            .from('quiz_questions')
            .select('id, question, options, order_index')
            .eq('quiz_id', quiz.id)
            .order('order_index', { ascending: true });

        // Parse options from JSON if needed
        const parsedQuestions = questions?.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        })) || [];

        res.json({ success: true, quiz: { ...quiz, questions: parsedQuestions } });
    } catch (err) {
        console.error('Get quiz error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const quizId = parseInt(req.params.quizId, 10);
        const { answers } = req.body;
        const userId = req.user.id;

        const { data: quizzes } = await supabase.from('course_quizzes').select('*').eq('id', quizId);
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const quiz = quizzes[0];

        // Check enrollment
        const { data: purchases } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', quiz.course_id);

        if (!purchases || purchases.length === 0) {
            return res.status(403).json({ success: false, message: 'Must be enrolled to take quiz' });
        }

        // Get questions with correct answers
        const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId);
        if (!questions || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'No questions in quiz' });
        }

        // Calculate score
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct_index) {
                correct++;
            }
        });

        const score = Math.round((correct / questions.length) * 100);
        const passed = score >= quiz.passing_score;

        // Record attempt
        await supabase.from('quiz_attempts').insert({
            user_id: userId, quiz_id: quizId, course_id: quiz.course_id,
            score, passed, answers: JSON.stringify(answers)
        });

        // Update purchase if passed
        if (passed) {
            await supabase.from('purchases')
                .update({ quiz_passed: true, quiz_score: score })
                .eq('user_id', userId)
                .eq('course_id', quiz.course_id);
        }

        res.json({
            success: true, score, passed,
            correct, total: questions.length,
            message: passed ? 'Congratulations! You passed!' : `You need ${quiz.passing_score}% to pass. Try again!`
        });
    } catch (err) {
        console.error('Submit quiz error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAttempts = async (req, res) => {
    try {
        const { data: quizzes } = await supabase.from('course_quizzes').select('id').eq('course_id', req.params.courseId);
        if (!quizzes || quizzes.length === 0) {
            return res.json({ success: true, attempts: [] });
        }

        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('quiz_id', quizzes[0].id)
            .order('completed_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, attempts: attempts || [] });
    } catch (err) {
        console.error('Get attempts error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.saveQuiz = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId, 10);
        const { title, passing_score, questions } = req.body;

        // Check existing quiz
        const { data: existing } = await supabase.from('course_quizzes').select('id').eq('course_id', courseId);

        let quizId;
        if (existing && existing.length > 0) {
            quizId = existing[0].id;
            await supabase.from('course_quizzes').update({ title, passing_score }).eq('id', quizId);
            await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
        } else {
            const { data } = await supabase.from('course_quizzes')
                .insert({ course_id: courseId, title, passing_score })
                .select('id')
                .single();
            quizId = data.id;
        }

        // Insert questions
        if (questions && questions.length > 0) {
            const questionsData = questions.map((q, i) => ({
                quiz_id: quizId,
                question: q.question,
                options: JSON.stringify(q.options),
                correct_index: q.correct_index,
                order_index: i
            }));
            await supabase.from('quiz_questions').insert(questionsData);
        }

        res.json({ success: true, message: 'Quiz saved', quizId });
    } catch (err) {
        console.error('Save quiz error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
