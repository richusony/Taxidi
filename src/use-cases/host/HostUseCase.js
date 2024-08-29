export class HostUseCase {
  constructor(hostRepository) {
    this.hostRepository = hostRepository;
  }

  async getHostVehicles(hostId) {
    // console.log("reached usecase");
    return await this.hostRepository.getHostVehicles(hostId);
  }

  async getHostCarDetails(vehicleNumber) {
    // console.log("reached usecase");
    return await this.hostRepository.getCarDetails(vehicleNumber);
  }

  async getTodayBookings(hostId, limit, skip) {
    return await this.hostRepository.getTodayBookings(hostId, limit, skip);
  }

  async getAllBookings(hostId, limit, skip) {
    return await this.hostRepository.getAllBookings(hostId, limit, skip);
  }

  async getBookingDetails(paymentId) {
    return await this.hostRepository.getBookingDetails(paymentId);
  }

  async cancelBooking(paymentId, cancelReason) {
    return await this.hostRepository.cancelBookingByHost(
      paymentId,
      cancelReason,
    );
  }

  async getWalletInfo(hostId) {
    return await this.hostRepository.getWalletInfo(hostId);
  }

  async getWalletHistory(hostId, limit, skip) {
    return await this.hostRepository.getWalletHistory(hostId, limit, skip);
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
    return await this.hostRepository.updateVehicle(
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
    return await this.hostRepository.listVehicle(vehicleId);
  }

  async unListVehicle(vehicleId) {
    return await this.hostRepository.unListVehicle(vehicleId);
  }

  async getCounts(hostId) {
    return await this.hostRepository.getCounts(hostId);
  }

  async getChartData(filter, hostId) {
    return await this.hostRepository.getChartData(filter, hostId);
  }

  async getProfile(hostId) {
    return await this.hostRepository.getProfile(hostId);
  }

  async updateHost(hostId, fullname, email, phone) {
    return await this.hostRepository.updateHost(hostId, fullname, email, phone);
  }

  async updateHostProfileImage(hostId, profileImage) {
    return await this.hostRepository.updateHostProfileImage(
      hostId,
      profileImage,
    );
  }

  async getBrands() {
    return await this.hostRepository.getBrands();
  }

  async getBodyTypes() {
    return await this.hostRepository.getBodyTypes();
  }
}
