// src/handlers/profileHandlers.ts
import { Handler } from "openapi-backend";
import conn from "../helpers/db.js";
import { RowDataPacket } from "mysql2";

// Get User Profile
export const getUser Profile: Handler = async (c, _, res) => {
  const userId = c.request.params.user_id;

  const userQuery = `
        SELECT * FROM Customer
        WHERE Customer_id = ?;
    `;
  const [userResult] = await conn.execute<RowDataPacket[]>(userQuery, [userId]);

  if (userResult.length === 0) {
    return res.status(404).json({ message: "User  profile not found" });
  }

  return res.status(200).json(userResult[0]);
};

// Update User Profile
export const updateUser Profile: Handler = async (c, _, res) => {
  const userId = c.request.params.user_id;
  const { name, email } = c.request.requestBody; // Example fields

  const updateQuery = `
        UPDATE Customer
        SET Name = ?, Email = ?
        WHERE Customer_id = ?;
    `;
  await conn.execute(updateQuery, [name, email, userId]);

  return res.status(200).json({ message: "User  profile updated successfully" });
};

// Get Organization Profile
export const getOrganizationProfile: Handler = async (c, _, res) => {
  const orgId = c.request.params.org_id;

  const orgQuery = `
        SELECT * FROM Organization
        WHERE Organization_id = ?;
    `;
  const [orgResult] = await conn.execute<RowDataPacket[]>(orgQuery, [orgId]);

  if (orgResult.length === 0) {
    return res.status(404).json({ message: "Organization profile not found" });
  }

  return res.status(200).json(orgResult[0]);
};

// Update Organization Profile
export const updateOrganizationProfile: Handler = async (c, _, res) => {
  const orgId = c.request.params.org_id;
  const { name, address } = c.request.requestBody; // Example fields

  const updateQuery = `
        UPDATE Organization
        SET Name = ?, Address = ?
        WHERE Organization_id = ?;
    `;
  await conn.execute(updateQuery, [name, address, orgId]);

  return res.status(200).json({ message: "Organization profile updated successfully" });
};

// Get Employee Profile
export const getEmployeeProfile: Handler = async (c, _, res) => {
  const empId = c.request.params.emp_id;

  const empQuery = `
        SELECT * FROM Employee
        WHERE Employee_id = ?;
    `;
  const [empResult] = await conn.execute<RowDataPacket[]>(empQuery, [empId]);

  if (empResult.length === 0) {
    return res.status(404).json({ message: "Employee profile not found" });
  }

  return res.status(200).json(empResult[0]);
};

// Update Employee Profile
export const updateEmployeeProfile: Handler = async (c, _, res) => {
  const empId = c.request.params.emp_id;
  const { name, email } = c.request.requestBody; // Example fields

  const updateQuery = `
        UPDATE Employee
        SET Name = ?, Email = ?
        WHERE Employee_id = ?;
    `;
  await conn.execute(updateQuery, [name, email, empId]);

  return res.status(200).json({ message: "Employee profile updated successfully" });
};