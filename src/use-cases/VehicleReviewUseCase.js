export class VehicleReviewUseCase {
  constructor(userRepository, vehicleRepository) {
    this.userRepository = userRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async postReview(userId, vehicleId, reviewMsg) {
    try {
      const user = await this.userRepository.findById(userId);
      const vehicle = await this.vehicleRepository.findById(vehicleId);

      if (!user) throw new Error("user not found - VehicleReviewUseCase");
      if (!vehicle) throw new Error("vehicle not found - VehicleReviewUseCase");

      return await this.vehicleRepository.postReview(
        user._id,
        vehicle._id,
        reviewMsg,
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async getVehicleReviews(vehicleRegistrationNumber) {
    try {
      return await this.vehicleRepository.getReviews(vehicleRegistrationNumber);
    } catch (error) {
      console.log(error.message);
    }
  }
}
