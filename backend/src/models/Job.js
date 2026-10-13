import mongoose from 'mongoose';

const ApplicantSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  coverNote: { type: String },
  appliedAt: { type: Date, default: Date.now },
});

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    experience: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Exec'],
      default: 'Mid Level',
    },
    salary: { type: String },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    poster: {
      id: { type: String },
      name: { type: String },
      avatar: { type: String },
      email: { type: String },
    },
    applicants: [ApplicantSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
