import mongoose from "mongoose";
import { Password } from "../services/password";

//interface that provides the user object
interface UserProps {
  email: string;
  password: string;
}

//interface that describes
// the user model properties
interface UserModel extends mongoose.Model<UserDoc> {
  build(props: UserProps): UserDoc;
}

//interface that describes
//the user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (props: UserProps) => {
  return new User(props);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
