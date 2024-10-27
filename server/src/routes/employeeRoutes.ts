// src/api/v1/routes/employeeRoutes.ts
import express from 'express';
import { getEmployeeProfile, updateEmployeeProfile } from '../handlers/employeeHandlers'; // Adjust path as necessary

const router = express.Router();

// Employee profile routes
router.get('/employee/:emp_id', getEmployeeProfile);
router.put('/employee/:emp_id', updateEmployeeProfile);

export default router;