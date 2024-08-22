import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import { getReceiverSocketId, io } from "../../socket.js";

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
        password,
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
      pincode,
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
        pincode,
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
    const { licenseNumber } = req.body;
    const licenseFrontImage = req?.files?.licenseFrontImage[0].path;
    const licenseBackImage = req?.files?.licenseBackImage[0].path;

    try {
      const upload = await this.userUseCase.uploadUserLicense(
        userId,
        licenseNumber,
        licenseFrontImage,
        licenseBackImage,
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
      const licenseRequest =
        await this.userUseCase.getLicenseRequest(licenseNumber);
      res.status(200).json(licenseRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async saveApprovedLicense(req, res) {
    const { userId, licenseNumber, licenseBackImage, licenseFrontImage } =
      req.body;

    try {
      const saveLicense = await this.userUseCase.saveLicense(
        userId._id,
        licenseNumber,
        licenseFrontImage,
        licenseBackImage,
      );
      const receiverId = await getReceiverSocketId(userId._id);

      if (receiverId) {
        io.to(receiverId).emit("notify", "Your license has been approved. Happy Booking");
      }

      console.log("saved user license");
      res.status(200).json(saveLicense);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllAvailableCars(req, res) {
    const { brand, bodyType, fuel, priceRange, bookingStarts, bookingEnds } = req.query;
    // console.log("query::",req.query)
    if (!bookingStarts || !bookingEnds) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    try {
      const availableCars = await this.userUseCase.getAllAvailableCars(
        brand,
        bodyType,
        fuel,
        priceRange,
        bookingStarts,
        bookingEnds,
      );
      // console.log(availableCars);
      console.log("fetched all available vechiles in", bookingStarts, "-", bookingEnds);
      res.status(200).json(availableCars);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getCarDetails(req, res) {
    const { vehicleRegistrationNumber } = req.params;
    try {
      const carDetails = await this.userUseCase.getCarDetails(
        vehicleRegistrationNumber,
      );
      console.log("fetched vehicle Details of ", vehicleRegistrationNumber);
      res.status(200).json(carDetails);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async bookVehicle(req, res) {
    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY_ID,
      key_secret: process.env.RAZOR_PAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: "receipt#1",
      payment_capture: 1,
    };

    try {
      const response = await razorpay.orders.create(options);
      // console.log(response);
      // const savePaymentDetails = await this.userUseCase.bookVehicle(response);
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async verifyBooking(req, res) {
    const userId = req.user._id;
    const { paymentDetails, vehicleId, queryStartDate, queryEndDate } =
      req.body;
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_SECRET_KEY,
      });

      const verifyPayment = await razorpay.payments.fetch(
        paymentDetails.razorpay_payment_id,
      );

      const saveTransactions = await this.userUseCase.saveTransactions(
        userId,
        vehicleId,
        queryStartDate,
        queryEndDate,
        verifyPayment,
      );
      console.log("booking of vehicle :", vehicleId, "by", userId, "has been successfull");
      res.status(200);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async addMoneyToWallet(req, res) {
    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY_ID,
      key_secret: process.env.RAZOR_PAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: "wallet_reciept#1",
      payment_capture: 1,
    };

    try {
      const response = await razorpay.orders.create(options);
      // console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async verifyPaymentForAddToWallet(req, res) {
    const userId = req.user._id;
    const { razorpay_payment_id } = req.body;
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_SECRET_KEY,
      });

      const verifyPayment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log("payment verified");
      const amount = verifyPayment.amount / 100;
      const addToWallet = await this.userUseCase.addMoneyToWallet(
        userId,
        verifyPayment.id,
        amount,
        verifyPayment.method,
        "Added to Wallet",
      );
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async postReviewAndRating(req, res) {
    const userId = req.user._id;
    const { vehicleId, reviewMsg, rating } = req.body;
    // console.log(req.body);
    try {
      const addReview = await this.userUseCase.postReviewAndRating(userId, vehicleId, reviewMsg, rating);
      console.log("review posted successfully!!");
      res.status(200).json(addReview);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getVehicleReviewsAndRating(req, res) {
    const { vehicleRegistrationNumber } = req.body;
    // console.log(req.body);
    try {
      const vehicleReviews = await this.userUseCase.getVehicleReviewsAndRating(vehicleRegistrationNumber);
      console.log("fetched vehicle reviews of ", vehicleRegistrationNumber);
      res.status(200).json(vehicleReviews);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getWallet(req, res) {
    const userId = req.user._id;
    try {
      const walletDetails = await this.userUseCase.getWallet(userId);
      console.log("fetched user wallet of ", userId);
      res.status(200).json(walletDetails);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBookings(req, res) {
    const userId = req.user._id;
    try {
      const bookings = await this.userUseCase.getAllBookings(userId);
      console.log("fetched bookings...");
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }

  async getBookingDetails(req, res) {
    const { paymentId } = req.params;
    try {
      const bookingDetails = await this.userUseCase.getBookingDetails(paymentId);
      console.log("fetched payment details of ", paymentId);
      res.status(200).json(bookingDetails);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }

  async getAllNotifications(req, res) {
    const userId = req.user._id;
    try {
      const notifications = await this.userUseCase.getAllUserNotifications(userId);
      console.log("fetched user notifications");
      res.status(200).json(notifications);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }

  async getAllBodyTypes(req, res) {
    try {
      const bodyTypes = await this.userUseCase.getAllBodyTypes();
      res.status(200).json(bodyTypes);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }

  async getWalletHistory(req, res) {
    const userId = req.user._id;
    try {
      const walletHistory = await this.userUseCase.getWalletHistory(userId);
      console.log("fetched user wallet History", walletHistory);
      res.status(200).json(walletHistory);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }

  async cancelVehicleBooking(req, res) {
    const userId = req.user._id;
    const { paymentId } = req.body;
    try {
      const cancelBooking = await this.userUseCase.cancelBooking(paymentId);
      const receiverId = await getReceiverSocketId(userId);

      if (receiverId) {
        io.to(receiverId).emit("notify", "Booking has been cancelled. Amount will be credited to your wallet soon.");
      }

      console.log("booking cancelled of ", paymentId);
      res.status(200).json(cancelBooking);
    } catch (error) {
      console.log(error.message);
      res.status(400).status({ error: error.message });
    }
  }
}
