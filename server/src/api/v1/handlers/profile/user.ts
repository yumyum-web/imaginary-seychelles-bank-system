import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const userProfile: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const userQuery = `
      SELECT u.Customer_id   AS id,
             u.NIC,
             u.First_Name    AS firstName,
             u.Last_Name     AS lastName,
             u.Address       AS address,
             u.Phone_number  AS phoneNumber,
             u.Date_of_Birth AS dateOfBirth
      FROM User u
      WHERE u.Customer_id = ?;
    `;
    const [userResult] = await conn.execute<RowDataPacket[]>(userQuery, [
      user.customer?.id,
    ]);

    return res.status(200).json(userResult[0]);
  } catch (error) {
    console.error("Failed to retrieve user profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user profile." });
  }
};

export default userProfile;
