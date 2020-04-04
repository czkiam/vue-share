const mongoose = require("mongoose");
const md5 = require("md5");
const bcryt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  joinDate: { type: Date, default: Date.now },

  favorites: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});

//Create and add avatar to user
UserSchema.pre("save", function(next) {
  this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`;
  next();
});

//hash password so it cant be seen
UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcryt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcryt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      console.log(hash);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
