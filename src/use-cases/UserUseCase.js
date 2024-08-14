export class UserUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllAvailableCars(bookingStarts, bookingEnds) {
        return await this.repository.getAllAvailableCars(bookingStarts, bookingEnds)
    }

    async getCarDetails(vehicleRegistrationNumber) {
        return await this.repository.getCarDetails(vehicleRegistrationNumber);
    }

    async getAllBookings(userId) {
        return await this.repository.getAllUserBookings(userId);
    }

    async getBookingDetails(paymentId){
        return await this.repository.getBookingDetails(paymentId);
    }
}