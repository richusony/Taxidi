class AuthUseCase {
  constructor(userRepo, adminRepo, hostRepo) {
    this.userRepo = userRepo;
    this.adminRepo = adminRepo;
    this.hostRepo = hostRepo;
  }

  async findUser(userId, role) {
    try {
      if (role == "user") {
        return await this.userRepo.findById(userId);
      } else if (role == "admin") {
        return await this.adminRepo.findById(userId);
      } else if (role == "host") {
        return await this.hostRepo.findById(userId);
      } else {
        throw new Error("Role is not defined or allowed - AuthUseCase");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
