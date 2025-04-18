// models/forum.js
import mongoose from 'mongoose';

// Schema for forum categories
const forumCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    topics: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Schema for forum topics
const forumTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: { type: Number, default: 0 },
    isSticky: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    lastReplyDate: { type: Date },
    lastReplyUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Schema for replies to topics
const forumReplySchema = new mongoose.Schema({
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAnswer: { type: Boolean, default: false },  // For Q&A sections to mark official answers
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumReply' }, // For threaded replies
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware to update topic when reply is added
forumReplySchema.post('save', async function (doc) {
    try {
        const topic = await mongoose.model('ForumTopic').findById(doc.topic);
        if (topic) {
            topic.replies = await mongoose.model('ForumReply').countDocuments({ topic: doc.topic });
            topic.lastReplyDate = Date.now();
            topic.lastReplyUser = doc.author;
            await topic.save();
        }
    } catch (err) {
        console.error("Error updating topic after reply:", err);
    }
});

// Create the models
const ForumCategory = mongoose.model('ForumCategory', forumCategorySchema);
const ForumTopic = mongoose.model('ForumTopic', forumTopicSchema);
const ForumReply = mongoose.model('ForumReply', forumReplySchema);

export { ForumCategory, ForumTopic, ForumReply };