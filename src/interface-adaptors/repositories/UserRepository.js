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
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById({ id });
  }

  async update(user) {
    const userExist = await this.findById(user.id);
    if (!userExist) {
      console.log("user not found while updating");
      return false;
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userExist._id },
      {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        pincode: user.pincode,
      },
      { new: true }
    );

    return updatedUser;
  }
}
