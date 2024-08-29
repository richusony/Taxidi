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
    const { limit, skip } = req.query;

    try {
      const walletHistory = await this.adminUseCase.getWalletHistory(
        adminId,
        limit,
        skip,
      );
      console.log("fetched admin wallet history", adminId);
      res.status(200).json(walletHistory);
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
    const {limit,skip} = req.query;
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
    const { limit, skip } = req.query;
    try {
      const bookings = await this.adminUseCase.getBookingHistory(limit, skip);
      console.log("admin fetched booking history");
      res.status(200).json(bookings);
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
}
