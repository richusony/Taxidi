import express from "express";
import { BrandRepository } from "../../../interface-adaptors/repositories/BrandRepository.js";
import { CreateBrand } from "../../../use-cases/CreateBrand.js";
import { BrandController } from "../../../interface-adaptors/controllers/BrandController.js";
import adminProtectRoute from "../middlewares/adminProtectRoute.js";
import { AdminRepository } from "../../../interface-adaptors/repositories/AdminRepository.js";
import LoginAdmin from "../../../use-cases/LoginAdmin.js";
import AdminLoginController from "../../../interface-adaptors/controllers/AdminLoginController.js";

const router = express.Router();

const adminRepository = new AdminRepository();
const adminLogin = new LoginAdmin(adminRepository);
const adminController = new AdminLoginController();

const brandRepository = new BrandRepository();
const createBrand = new CreateBrand(brandRepository);
const brandController = new BrandController(createBrand);

router.post("/login", (req, res) => adminController.login(req, res));

router.get("/", adminProtectRoute, (req, res) => res.status(200));

router.post("/add-brand", adminProtectRoute, (req, res) =>
  brandController.createBrand(req, res)
);

router.get("/brands", adminProtectRoute, (req, res) =>
  brandController.getAllBrands(req, res)
);

router.get("/logout", adminProtectRoute, (req, res) =>
  adminController.logout(req, res)
);

export default router;
