export class AdminWalletUseCase {
    constructor(adminRepo) {
        this.repository = adminRepo;
    }

    async getWalletInfo(adminId) {
        return await this.repository.getWalletInfo(adminId);
    }

    async getWalletHistory(adminId,limit, skip) {
        return await this.repository.getWalletHistory(adminId, limit, skip);
    }
}