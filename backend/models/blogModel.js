import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numviews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isDisliked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: {
      type: String,
      default:
        'https://www.istockphoto.com/photo/retro-blog-bookshelf-with-cozy-interior-gm1146554418-308978674',
    },
    author: { type: String, default: 'admin' },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toOject: {
      virtuals: true,
    },
    timestamps: true,
  }
);
const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
