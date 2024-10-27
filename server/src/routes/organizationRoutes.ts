// src/api/v1/routes/organizationRoutes.ts
import express from 'express';
import { getOrganizationProfile, updateOrganizationProfile } from '../handlers/organizationHandlers'; // Adjust path as necessary

const router = express.Router();

// Organization profile routes
router.get('/organization/:org_id', getOrganizationProfile);
router.put('/organization/:org_id', updateOrganizationProfile);

export default router;