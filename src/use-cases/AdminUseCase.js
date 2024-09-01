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

  async getBookings() {
    return await this.repository.getBookings();
  }

  async getBookingHistory() {
    return await this.repository.getBookingHistory();
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

  async updateVehicle(
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
  ) {
    return await this.repository.updateVehicle(
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
  }

   async listVehicle(vehicleId) {
    return await this.repository.listVehicle(vehicleId);
  }

  async unListVehicle(vehicleId) {
    return await this.repository.unListVehicle(vehicleId);
  }
}
