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
}
