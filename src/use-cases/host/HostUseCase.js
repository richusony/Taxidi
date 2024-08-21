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

    async getAllBookings(hostId) {
        return await this.hostRepository.getAllBookings(hostId);
    }

    async getBookingDetails(paymentId) {
        return await this.hostRepository.getBookingDetails(paymentId);
    }

    async cancelBooking(paymentId, cancelReason) {
        return await this.hostRepository.cancelBookingByHost(paymentId, cancelReason);
    }

    async getWalletInfo(hostId) {
        return await this.hostRepository.getWalletInfo(hostId);
    }

    async updateVehicle(
        vehicleId,
        mileage,
        seats,
        color,
        rent,
        city,
        pincode,
        pickUpLocation,
        latitude,
        longitude,
        lastServiceDate,
        locationText
    ) {
        return await this.hostRepository.updateVehicle(
            vehicleId,
            mileage,
            seats,
            color,
            rent,
            city,
            pincode,
            pickUpLocation,
            latitude,
            longitude,
            lastServiceDate,
            locationText);
    }
}