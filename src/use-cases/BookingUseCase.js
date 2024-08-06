export class BookingUseCase {
  constructor(userRepo, adminRepo, vehicleRepo, hostRepo) {
    this.userRepository = userRepo;
    this.adminRepository = adminRepo;
    this.vehicleRepository = vehicleRepo;
    this.hostRepository = hostRepo;
  }

  async saveTransactions(
    userId,
    vehicleId,
    queryStartDate,
    queryEndDate,
    paymentDetails,
  ) {
    const ADMIN_COMMISSION = 20; // percetange
    const paymentId = paymentDetails.id;
    const paymentMethod = paymentDetails.method;
    const totalAmount = Math.floor(paymentDetails.amount / 100);
    const commissionToAdmin = Math.floor(
      (totalAmount / 100) * ADMIN_COMMISSION,
    );
    const balanceAfterCommission = Math.floor(totalAmount - commissionToAdmin);
    try {
      const user = await this.userRepository.findById(userId);
      const vehicle = await this.vehicleRepository.findById(vehicleId);
      const host = await this.hostRepository.findById(vehicle.host);
      const admin = await this.adminRepository.findByEmail("admin@gmail.com");

      if (!user) {
        throw new Error("user not found - BookingUseCase");
      }

      if (!vehicle) {
        throw new Error("vehicle not found - BookingUseCase");
      }

      if (!host) {
        throw new Error("host not found - BookingUseCase");
      }

      if (!admin) {
        throw new Error("admin not found - BookingUseCase");
      }

      await this.hostRepository.addToHostWalletAndHistory(
        host._id,
        paymentId,
        user._id,
        vehicle._id,
        totalAmount,
        commissionToAdmin,
        balanceAfterCommission,
        paymentMethod,
      );

      await this.adminRepository.addToAdminWalletAndHistory(
        admin._id,
        host._id,
        paymentId,
        user._id,
        vehicle._id,
        totalAmount,
        commissionToAdmin,
        balanceAfterCommission,
        paymentMethod,
      );

      await this.vehicleRepository.bookVehicle(vehicle._id, queryStartDate, queryEndDate);

      return true;
    } catch (error) {
      console.log(error.message);
    }
  }
}
