export class GetAllBodyTypes {
    constructor(userRepo) {
        this.repository = userRepo;
    }

    async getAllBodyTypes() {
        return await this.repository.getAllBodyTypes();
    }
}