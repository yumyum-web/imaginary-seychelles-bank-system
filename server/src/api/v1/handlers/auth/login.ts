import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { encodeJwt } from "../../helpers/jwt.js";
import { User } from "../../models/User.js";
import { RowDataPacket } from "mysql2";

interface LoginRequestBody {
  username: string;
  password: string;
}

const login: Handler<LoginRequestBody> = async (c, _, res) => {
  const { username, password } = c.request.requestBody;

  const customerQuery = `
        SELECT c.Customer_id, c.Customer_type
        FROM Login l
                 JOIN User u ON l.Login_id = u.Login_id
                 JOIN Customer c ON u.Customer_id = c.Customer_id
        WHERE l.Username = ?
          AND l.Password = ?
          AND (c.Customer_type = 'Individual' OR c.Customer_type = 'Organization');
    `;
  const [customerResult] = await conn.execute<RowDataPacket[]>(customerQuery, [
    username,
    password,
  ]);

  const employeeQuery = `
        SELECT e.Employee_id, e.POSITION
        FROM Login l
                 JOIN User u ON l.Login_id = u.Login_id
                 JOIN Employee e ON u.NIC = e.NIC
        WHERE l.Username = ?
          AND l.Password = ?
          AND e.End_date IS NULL;
    `;
  const [employeeResult] = await conn.execute<RowDataPacket[]>(employeeQuery, [
    username,
    password,
  ]);

  if (customerResult.length === 0 && employeeResult.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = new User([]);

  if (customerResult.length > 0) {
    const { Customer_id, Customer_type } = customerResult[0];
    user.customer = { id: Customer_id, type: Customer_type };
    if (Customer_type === "Individual") {
      user.levels.push("user");
    } else if (Customer_type === "Organization") {
      user.levels.push("organization");
    }
  }

  if (employeeResult.length > 0) {
    const { Employee_id, POSITION } = employeeResult[0];
    user.employee = { id: Employee_id };
    if (POSITION === "Branch Manager") {
      user.levels.push("manager");
    } else {
      user.levels.push("employee");
    }
  }

  const token = encodeJwt(user);
  return res.status(200).json({ token, user });
};

export default login;
