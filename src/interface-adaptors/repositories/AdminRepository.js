import { AdminModel } from "../../frameworks-and-drivers/database/mongoose/models/AdminModel.js";

export class AdminRepository {
  async save(admin) {
    const adminModel = new AdminModel({
      email: admin.email,
      password: admin.password,
    });

    await adminModel.save();
    return adminModel;
  }

  async findById(adminId) {
    try {
      return AdminModel.findById(adminId);
    } catch (error) {
      console.log("admin repo", error.message);
    }
  }

  async findByEmail(email) {
    return AdminModel.findOne({ email });
  }
}
