import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password, googleLogin) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (googleLogin) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { user, token };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  }

  // async checkPassword(password){
  //  const user = await this.userRepository.findByEmail(email);
  //   if (!user) {
  //     return "User doesn't exists"
  //   }

  //   if (googleLogin) {
  //       return true
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     return "Invalid Password"
  //   }
  // }
}

export default LoginUser;
