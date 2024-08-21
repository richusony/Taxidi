export class UserNotifications {
    constructor(userRespo) {
        this.repository = userRespo;
    }

    async getAllUserNotifications(userId) {
        return await this.repository.getAllUserNotifications(userId);
    }
}