export class UserWalletUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async addMoneyToWallet(
    userId,
    paymentId,
    amount,
    paymentMethod,
    paymentMessage,
  ) {
    return await this.userRepository.addMoneyToWallet(
      userId,
      paymentId,
      amount,
      paymentMethod,
      paymentMessage
    );
  }

  async getWallet(userId) {
    try {
      return await this.userRepository.getWallet(userId);
    } catch (error) {
      console.log(error.message);
    }
  }
}
