const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
    username: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Username must be at least 2 characters',
        'string.max': 'Username cannot exceed 50 characters',
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

// Course validation schemas
const courseSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
    }),
    description: Joi.string().max(5000).allow('').optional(),
    short_description: Joi.string().max(500).allow('').optional(),
    category: Joi.string().valid('dev', 'design', 'marketing').default('dev'),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
    price: Joi.number().min(0).max(9999).default(0),
    duration: Joi.number().min(0).max(1000).default(0),
    image_url: Joi.string().uri().allow('', null).optional(),
    what_you_learn: Joi.string().max(2000).allow('').optional(),
    requirements: Joi.string().max(2000).allow('').optional(),
    status: Joi.string().valid('active', 'draft', 'archived').optional()
});

// Role validation
const roleSchema = Joi.object({
    role: Joi.string().valid('teacher', 'learner').required().messages({
        'any.only': 'Role must be teacher or learner',
        'any.required': 'Role is required'
    })
});

// Scraping validation
const scrapingSchema = Joi.object({
    url: Joi.string().uri().required().messages({
        'string.uri': 'Please provide a valid URL',
        'any.required': 'URL is required'
    }),
    category: Joi.string().max(100).default('general')
});

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            const messages = error.details.map(d => d.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                errors: messages
            });
        }

        req.body = value; // Use validated/sanitized values
        next();
    };
};

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    courseSchema,
    roleSchema,
    scrapingSchema
};
