import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    comment: { type: String, required: true },
    status:{
      type:'String',
      default:"Submitted",
      enum:["Submitted", 'Contacted', 'In Progress', 'Resolved']
    }
  },
  {
    timestamps: true,
  }
);
const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
