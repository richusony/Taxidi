export class AdminUseCase {
    constructor(adminRepo) {
        this.repository = adminRepo
    }

    async getCounts() {
        return await this.repository.getCounts();
    }

    async getChartData(filter) {
        return await this.repository.getChartData(filter)
    }
}