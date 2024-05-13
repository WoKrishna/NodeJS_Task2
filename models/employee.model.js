import mongoose from 'mongoose';
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, validate: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
  password: { type: String, required: true },
  designation: { type: String, enum: ["MANAGER", "TEAM_LEADER", "DEVELOPER"], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  isVerified: { type: Boolean, required: true }
});

userSchema.pre('save', async function (next) {
  try {
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(this.password, salt);
      this.password = hashPwd;
      next();
  } catch (error) {
      next(error);
  }
});

userSchema.methods.isInvalidPassword = async function (password) {
  try {
      return await bcrypt.compare(password, this.password);
  } catch (error) {
      throw error;
  }
}

const Employee = mongoose.model('Employee', userSchema);

export default Employee;