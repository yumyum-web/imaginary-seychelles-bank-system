import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const employeeProfile: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const employeeQuery = `
        SELECT e.Employee_id   AS id,
               u.NIC,
               u.First_Name    AS firstName,
               u.Last_Name     AS lastName,
               u.Address       AS address,
               u.Phone_number  AS phoneNumber,
               u.Date_of_Birth AS dateOfBirth,
               e.POSITION      AS position,
               b.Branch_id     AS branchId,
               b.Name          AS branchName
        FROM Employee e
                 JOIN Branch b USING (Branch_id)
                 JOIN User u USING (NIC)
        WHERE e.Employee_id = ?;
    `;
    const [employeeResult] = await conn.execute<RowDataPacket[]>(
      employeeQuery,
      [user.employee?.id],
    );

    return res.status(200).json(employeeResult[0]);
  } catch (error) {
    console.error("Failed to retrieve employee profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve employee profile." });
  }
};

export default employeeProfile;
