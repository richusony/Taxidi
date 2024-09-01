import { getReceiverSocketId, io } from "../../socket.js";

export class AdminController {
  constructor(adminUseCase) {
    this.adminUseCase = adminUseCase;
  }

  async sendMessageToHost(req, res) {
    const { to, message } = req.body;
    const msgFrom = req.admin.email;

    try {
      const sending = await this.adminUseCase.sendMessage(to, msgFrom, message);
      console.log("tesing to", to);
      const receiverId = await getReceiverSocketId(to);

      if (receiverId) {
        io.to(receiverId).emit("newMessage", sending);
      }

      console.log("admin sent a message to", receiverId);
      res.status(200).json(sending);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getHostMessages(req, res) {
    const { email } = req.params;
    try {
      const messages = await this.adminUseCase.getHostMessages(email);
      console.log("fetch messages of", email);
      res.status(200).json(messages);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getWallet(req, res) {
    const adminId = req.admin._id;
    try {
      const wallet = await this.adminUseCase.getWalletInfo(adminId);
      console.log("fetched admin wallet", adminId);
      res.status(200).json(wallet);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getWalletHistory(req, res) {
    const adminId = req.admin._id;
    const page = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = (page) * limit;
    
    const paginatedData = {};

    try {
      const walletHistory = await this.adminUseCase.getWalletHistory(adminId);
      console.log("fetched admin wallet history", adminId);
      if (lastIndex < walletHistory.length) {
        paginatedData.next = { page: page + 1 }
      }
      
      if (startIndex > 0) {
        paginatedData.prev = { page: page - 1 }
      }
      paginatedData.totalList= walletHistory.length;
      paginatedData.pageCount = Math.ceil(walletHistory.length / limit);

      paginatedData.result = walletHistory.slice(startIndex, lastIndex);
      res.status(200).json(paginatedData);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getCounts(req, res) {
    try {
      const counts = await this.adminUseCase.getCounts();
      console.log("fetched dashboard counts");
      res.status(200).json(counts);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getChartData(req, res) {
    const { filter } = req.params;
    try {
      const data = await this.adminUseCase.getChartData(filter);
      // console.log("host chart data");
      res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBookings(req, res) {
    const { limit, skip } = req.query;
    try {
      const bookings = await this.adminUseCase.getBookings(limit, skip);
      console.log("admin fetched today's bookings");
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBookingHistory(req, res) {
    const page = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = (page) * limit;
    
    const paginatedData = {};
    
    try {
      const bookings = await this.adminUseCase.getBookingHistory();
      
      if (lastIndex < bookings.length) {
        paginatedData.next = { page: page + 1 }
      }
      
      if (startIndex > 0) {
        paginatedData.prev = { page: page - 1 }
      }
      paginatedData.totalList= bookings.length;
      paginatedData.pageCount = Math.ceil(bookings.length / limit);

      paginatedData.result = bookings.slice(startIndex, lastIndex);
      console.log("admin fetched booking history");
      res.status(200).json(paginatedData);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBookingDetails(req, res) {
    const { paymentId } = req.params;
    try {
      const bookings = await this.adminUseCase.getBookingDetails(paymentId);
      console.log("admin fetched booking details of", paymentId);
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async cancelBooking(req, res) {
    const adminId = req.admin._id;
    const { paymentId, cancelReason } = req.body;
    try {
      const bookings = await this.adminUseCase.cancelBooking(
        paymentId,
        cancelReason,
        adminId,
      );
      console.log("admin cancelled booking of ", paymentId);
      const receiverId = await getReceiverSocketId(bookings?.paidBy);

      if (receiverId) {
        io.to(receiverId).emit("notify", cancelReason);
        console.log("booking cancel notification send to user", receiverId);
      }
      res.status(200).json(bookings);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async updateVehicle(req, res) {
    try {
      const {
        vehicleId,
        color,
        mileage,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText,
      } = req.body;

      const update = await this.adminUseCase.updateVehicle(
        vehicleId,
        color,
        mileage,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText,
      );
      console.log(update?.model, "vehilce updated");
      res.status(200).json(update);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async listVehicle(req, res) {
    const { vehicleId } = req.params;
    try {
      const list = await this.adminUseCase.listVehicle(vehicleId);
      console.log("vehicle listed", vehicleId);
      res.status(200).json(list);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async unListVehicle(req, res) {
    const { vehicleId } = req.params;
    try {
      const list = await this.adminUseCase.unListVehicle(vehicleId);
      console.log("vehicle unlisted", vehicleId);
      res.status(200).json(list);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
