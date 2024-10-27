import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const organizationProfile: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const organizationQuery = `
      SELECT o.Customer_id           AS id,
             o.Organization_name     AS name,
             o.Type                  AS type,
             o.Address               AS address,
             o.Phone_number          AS phoneNumber,
             o.Date_of_incorporation AS dateOfIncorporation
      FROM Organization o
      WHERE o.Customer_id = ?;
    `;
    const [organizationResult] = await conn.execute<RowDataPacket[]>(
      organizationQuery,
      [user.customer?.id],
    );

    return res.status(200).json(organizationResult[0]);
  } catch (error) {
    console.error("Failed to retrieve organization profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve organization profile." });
  }
};

export default organizationProfile;
