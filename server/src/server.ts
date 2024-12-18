import "dotenv/config";

import app from "./app.js";

// GPort defaults to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
