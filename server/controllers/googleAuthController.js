/**
 * Google OAuth Controller
 * Handles Google authentication using Passport.js
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

// Configure Google Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('✅ Google OAuth configured');

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const username = profile.displayName || email.split('@')[0];

            // Check if user already exists
            const { data: existingUsers } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase());

            let user;

            if (existingUsers && existingUsers.length > 0) {
                // User exists - update google_id if not set
                user = existingUsers[0];
                if (!user.google_id) {
                    await supabase
                        .from('users')
                        .update({ google_id: profile.id })
                        .eq('id', user.id);
                }
            } else {
                // Create new user with random placeholder password (Google users don't use passwords)
                const bcrypt = require('bcryptjs');
                const randomPassword = await bcrypt.hash('google_oauth_' + profile.id + Date.now(), 10);

                const { data: newUser, error } = await supabase
                    .from('users')
                    .insert({
                        username: username,
                        email: email.toLowerCase(),
                        password: randomPassword, // Random password for Google users (they use OAuth)
                        google_id: profile.id,
                        role: 'learner',
                        points: 0
                    })
                    .select('*')
                    .single();

                if (error) throw error;
                user = newUser;
            }

            done(null, user);
        } catch (error) {
            console.error('Google auth error:', error);
            done(error, null);
        }
    }));

    // Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const { data: users } = await supabase.from('users').select('*').eq('id', id);
            done(null, users[0]);
        } catch (error) {
            done(error, null);
        }
    });
} else {
    console.log('⚠️ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

/**
 * Initiate Google OAuth flow
 */
exports.googleAuth = (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.redirect('/login.html?error=google_not_configured');
    }
    // prompt: 'select_account' forces Google to show the account chooser
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
};

/**
 * Handle Google OAuth callback
 */
exports.googleCallback = (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.redirect('/login.html?error=google_not_configured');
    }

    passport.authenticate('google', { session: false }, (err, user) => {
        if (err || !user) {
            console.error('Google callback error:', err);
            return res.redirect('/login.html?error=google_auth_failed');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '7d' }
        );

        // Set token in cookie and redirect
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        res.setHeader('Set-Cookie', `auth_token=${token}; Expires=${expires}; Path=/; SameSite=Strict`);

        res.redirect('/learning.html');
    })(req, res, next);
};

module.exports.passport = passport;
