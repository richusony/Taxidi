export class HostUseCase{
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
}