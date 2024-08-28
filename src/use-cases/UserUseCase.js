export class UserUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllAvailableCars(
        brand,
        bodyType,
        fuel,
        priceRange,
        bookingStarts,
        bookingEnds,
        latitude,
        longitude,
        limit,
        skip
    ) {
        return await this.repository.getAllAvailableCars(
            brand,
            bodyType,
            fuel,
            priceRange,
            bookingStarts,
            bookingEnds,
            latitude,
            longitude,
            limit,
            skip
        );
    }

    async getCarDetails(vehicleRegistrationNumber) {
        return await this.repository.getCarDetails(vehicleRegistrationNumber);
    }

    async getAllBookings(userId) {
        return await this.repository.getAllUserBookings(userId);
    }

    async getBookingDetails(paymentId) {
        return await this.repository.getBookingDetails(paymentId);
    }

    async cancelBooking(paymentId) {
        return await this.repository.cancelBooking(paymentId);
    }
}