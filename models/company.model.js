import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, validate: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: Number, required: true }
  },
  contact: { type: Number, required: true, validate: /^\d{10}$/ },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], required: true }
});

const Company = mongoose.model('company', CompanySchema);

export default Company;