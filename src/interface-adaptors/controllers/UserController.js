export class UserController {
  constructor(signUpUserUseCase) {
    this.signUpUserUseCase = signUpUserUseCase;
  }

  async signUp(req, res) {
    let {
      firstName,
      secondName,
      email,
      phone,
      city,
      pincode,
      password,
      googleLogin,
    } = req.body;
    // res.send("working")
    console.log(req.body);
    if (googleLogin) {
      // Generate a random number between 1000 and 9999
      const number = Math.floor(1000 + Math.random() * 9000);
      password = firstName + number;
    }

    try {
      // const userExists = await this.signUpUserUseCase.userExists(email)
      // if(userExists) {
      //   return res.status(400).json({err: "User already exists"});
      // }
  
      const user = await this.signUpUserUseCase.executeUser(
        firstName,
        secondName,
        email,
        phone,
        city,
        pincode,
        null,
        false,
        password
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
