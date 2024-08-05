import express from "express";
import { UserRepository } from "../../../interface-adaptors/repositories/UserRepository";
import { HostRepository } from "../../../interface-adaptors/repositories/HostRepository";
import { AdminRepository } from "../../../interface-adaptors/repositories/AdminRepository";

const router = express.Router();

const userRepo = new UserRepository();
const adminRepo = new AdminRepository();
const hostRepo = new HostRepository();

const authUseCase = new AuthUseCase(userRepo, adminRepo, hostRepo);

const authController = new AuthController(authUseCase);

