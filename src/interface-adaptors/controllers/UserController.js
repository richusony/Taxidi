export class UserController {
  constructor(userUseCase) {
    this.userUseCase = userUseCase;
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
      const userExists = await this.userUseCase.userExists(email)
      if(userExists) {
        return res.status(400).json({error: "User already exists"});
      }

      const user = await this.userUseCase.executeUser(
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

  async update(req, res) {
    const { firstName, secondName, email, phone, city, pincode } = req.body;
    console.log("reached update controller", firstName, secondName, email, phone, city, pincode);

    if (!firstName || !email || !pincode) {
      res.status(400).json({ error: "Enter all required fields - UpdateUser" });
    }

    try {
      const updatedUser = await this.userUseCase.update(firstName, secondName, email, phone, city, pincode);
      if(!updatedUser) {
        res.status(400).json({error: "Error while updating - UserController"})
        return;
      };

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
