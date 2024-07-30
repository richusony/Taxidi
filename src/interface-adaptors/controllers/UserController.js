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
      const userExists = await this.userUseCase.userExists(email);
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
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
    const userId = req.user._id;
    const { firstName, secondName, email, phone, city, pincode } = req.body;
    console.log(
      "reached update controller",
      firstName,
      secondName,
      email,
      phone,
      city,
      pincode
    );

    if (!firstName || !email || !pincode) {
      res.status(400).json({ error: "Enter all required fields - UpdateUser" });
    }

    try {
      const updatedUser = await this.userUseCase.update(
        userId,
        firstName,
        secondName,
        email,
        phone,
        city,
        pincode
      );
      if (!updatedUser) {
        res
          .status(400)
          .json({ error: "Error while updating - UserController" });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async uploadLicense(req, res) {
    const userId = req.user._id;
    const {licenseNumber} = req.body;
    const licenseFrontImage = req?.files?.licenseFrontImage[0].path;
    const licenseBackImage = req?.files?.licenseBackImage[0].path;

    try {
      const upload = await this.userUseCase.uploadUserLicense(
        userId,
        licenseNumber,
        licenseFrontImage,
        licenseBackImage
      );
      res.status(200).json(upload);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllLicenseVerifyRequest(req, res) {
    try {
      const allRequest = await this.userUseCase.getAllLicenseVerifyRequest();
      res.status(200).json(allRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLicenseRequest(req, res) {
    const { licenseNumber } = req.params;

    try {
      const licenseRequest = await this.userUseCase.getLicenseRequest(licenseNumber);
      res.status(200).json(licenseRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async saveApprovedLicense(req, res) {
    const {userId, licenseNumber, licenseBackImage, licenseFrontImage} = req.body;

    try {
      const saveLicense = await this.userUseCase.saveLicense(userId._id, licenseNumber, licenseFrontImage, licenseBackImage);
      res.status(200).json(saveLicense);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllAvailableCars(req, res) {
    const { bookingStarts, bookingEnds } = req.query;
    if (!bookingStarts || !bookingEnds) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    try {
      const availableCars = await this.userUseCase.getAllAvailableCars(bookingStarts, bookingEnds);
      // console.log(availableCars);
      res.status(200).json(availableCars);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getCarDetails(req, res) {
    const {vehicleRegistrationNumber} = req.params;
    try {
      const carDetails = await this.userUseCase.getCarDetails(vehicleRegistrationNumber);
      res.status(200).json(carDetails);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
