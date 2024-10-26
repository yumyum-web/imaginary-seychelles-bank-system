import { Ajv } from "ajv";

class User {
  levels: string[];
  customer?: { id: number; type: string };
  employee?: { id: number };

  constructor(
    levels: string[],
    customer?: { id: number; type: string },
    employee?: { id: number },
  ) {
    this.levels = levels;
    this.customer = customer;
    this.employee = employee;
  }
}

const userSchema = {
  type: "object",
  properties: {
    levels: { type: "array", items: { type: "string" } },
    customer: {
      type: "object",
      properties: { id: { type: "number" }, type: { type: "string" } },
    },
    employee: { type: "object", properties: { id: { type: "number" } } },
  },
  required: ["levels"],
  anyOf: [{ required: ["customer"] }, { required: ["employee"] }],
  additionalProperties: false,
};

const ajvInstance = new Ajv();
const validateUser = ajvInstance.compile(userSchema);

export { User, validateUser, userSchema };
