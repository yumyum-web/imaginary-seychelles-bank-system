// src/routes/profileRoutes.ts
import express from 'express';
import { getUser Profile, updateUser Profile } from '../handlers/profileHandlers';
import { getOrganizationProfile, updateOrganizationProfile } from '../handlers/profileHandlers';
import { getEmployeeProfile, updateEmployeeProfile } from '../handlers/profileHandlers';

const router = express.Router();

// User profile routes
router.get('/profile/user/:user_id', getUser Profile);
router.put('/profile/user/:user_id', updateUser Profile);

// Organization profile routes
router.get('/profile/organization/:org_id', getOrganizationProfile);
router.put('/profile/organization/:org_id', updateOrganizationProfile);

// Employee profile routes
router.get('/profile/employee/:employee_id', getEmployeeProfile);
router.put('/profile/employee/:employee_id', updateEmployeeProfile);

export default router;