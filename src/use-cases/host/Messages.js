export class Messages {
    constructor(hostRepo) {
        this.hostRepo = hostRepo;
    }

    async sendMessageToAdmin(from, msg, to) {
        return await this.hostRepo.sendMessageToAdmin(from, msg, to);
    }

    async getAdminMessages(hostEmail) {
        return await this.hostRepo.getAdminMessages(hostEmail);
    }
}