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

// Similarly, add handlers for organization and employee profiles...