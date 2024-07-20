export default class HostController {
  constructor(hostUseCase) {
    this.hostUseCase = hostUseCase;
  }

  async hostRequest(req, res) {
    const {
      fullname,
      email,
      phone,
      city,
      pincode,
      licenseNumber,
      registrationNumber,
      model,
    } = req.body;
    // console.log(req.files);

    const licenseFrontImage = req.files.licenseFrontImage[0].path;
    const licenseBackImage = req.files.licenseBackImage[0].path;
    const registrationCertificateFrontImage =
      req.files.registrationCertificateFrontImage[0].path;
    const registrationCertificateBackImage =
      req.files.registrationCertificateBackImage[0].path;
    const insuranceCertificateImage =
      req.files.insuranceCertificateImage[0].path;
    const pollutionCertificateImage =
      req.files.pollutionCertificateImage[0].path;

    try {
      const hostRequest = await this.hostUseCase.execute(
        fullname,
        email,
        phone,
        city,
        pincode,
        licenseNumber,
        registrationNumber,
        model,
        licenseFrontImage,
        licenseBackImage,
        registrationCertificateFrontImage,
        registrationCertificateBackImage,
        insuranceCertificateImage,
        pollutionCertificateImage
      );
      res.status(200).json(hostRequest);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
