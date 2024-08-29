export class AdminUseCase {
  constructor(adminRepo) {
    this.repository = adminRepo;
  }

  async getCounts() {
    return await this.repository.getCounts();
  }

  async getChartData(filter) {
    return await this.repository.getChartData(filter);
  }

  async getBookings(limit, skip) {
    return await this.repository.getBookings(limit, skip);
  }

  async getBookingHistory(limit, skip) {
    return await this.repository.getBookingHistory(limit, skip);
  }

  async getBookingDetails(paymentId) {
    return await this.repository.getBookingDetails(paymentId);
  }

  async cancelBooking(paymentId, cancelReason, adminId) {
    return await this.repository.cancelBooking(
      paymentId,
      cancelReason,
      adminId,
    );
  }
}
