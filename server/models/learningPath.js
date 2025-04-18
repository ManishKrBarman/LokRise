import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    color: {
        type: String,
        default: 'from-blue-600 to-indigo-600'
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced', 'All Levels'],
        default: 'All Levels'
    },
    duration: {
        type: String
    }, // e.g. "6 months"
    courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        order: {
            type: Number
        }
    }],
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tags: [{
        type: String
    }],
    featured: {
        type: Boolean,
        default: false
    },
    popularity: {
        type: Number,
        default: 0
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0
    },
    pricing: {
        price: { type: Number }, // Bundle price - less than sum of individual courses
        originalPrice: { type: Number },
        isFreeTrial: { type: Boolean, default: false },
        trialDuration: { type: Number } // In days
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Automatically populate courseCount based on courses array length
learningPathSchema.virtual('courseCount').get(function () {
    return this.courses ? this.courses.length : 0;
});

// Pre-save hook to generate slug if not already provided
learningPathSchema.pre('save', function (next) {
    if (this.isNew && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    next();
});

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
export default LearningPath;