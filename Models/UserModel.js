import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/bonba/image/upload/v1653611341/avatar/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f3836735954786e67304e714c43773d3d2d3639303836323532312e313538303039636436323762653066643531393237363736313233302e6a7067_rhtio5.jpg',
    },
  },
  { timestamps: true }
);

// Login
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// register
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
