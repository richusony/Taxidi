class UserLicenseVerify{
    constructor(id, licenseNumber, licenseFrontImage, licenseBackImage, userId){
    this.id = id;
    this.licenseNumber = licenseNumber;
    this.licenseFrontImage = licenseFrontImage;
    this.licenseBackImage = licenseBackImage;
    this.userId = userId;
    }

    validate() {
        if(!this.licenseFrontImage || !this.licenseBackImage){
            throw new Error("Fill all the required fields - UserLicenseVerify Entity");
        }
    }
}

export default UserLicenseVerify