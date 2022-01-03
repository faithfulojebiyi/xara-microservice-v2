const mongoose = require('mongoose')

const templateSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true
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

const Template = mongoose.model('Template', templateSchema)

module.exports = Template
