class Profile {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    return { user };
  }
}

export default Profile;
