import { User } from "../entities/User.js";
import { passwordHashing } from "../frameworks-and-drivers/external-lib/passwordHashing.js";

export class SignUpUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // async userExists(email){
  //     const userExists = this.userRepository.findByEmail(email)
  //   if(userExists) {
  //     console.log("exists...")
  //     return true
  //   }
  // }

  async executeUser(
    firstName,
    secondName,
    email,
    phone,
    city,
    pincode,
    licenseNumber,
    blocked,
    password
  ) {
    // Hash Password
    const passwordHash = await passwordHashing(password);
    const user = new User(
      null,
      firstName,
      secondName,
      email,
      phone,
      city,
      pincode,
      licenseNumber,
      blocked,
      passwordHash
    );

    // Validate user data
    user.validate();

    // Save the user
    return this.userRepository.save(user);
  }
}
