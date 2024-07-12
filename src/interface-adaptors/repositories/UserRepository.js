import { UserModel } from "../../frameworks-and-drivers/database/mongoose/models/UserModel.js";

export class UserRepository {
  async save(user) {
    const userModel = new UserModel({
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      pincode: user.pincode,
      licenseNumber: user.licenseNumber,
      blocked: user.blocked,
      password: user.password,
    });

    await userModel.save();
    return userModel;
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
}
