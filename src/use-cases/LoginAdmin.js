import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class LoginAdmin {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(email, password) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }

    // if (googleLogin) {
    //   const token = jwt.sign(
    //     { id: user._id, email: user.email },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "1h" }
    //   );
    //   return { user, token };
    // }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new Error("Incorrect Password");
    // }

    const isPasswordValid = password == admin.password;
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { admin, token };
  }
}

export default LoginAdmin;
