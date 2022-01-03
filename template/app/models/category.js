const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  ancestorsIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }
  ]
},
{ timestamps: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
