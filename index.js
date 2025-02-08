const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const postRoutes = require("./routes/postRoutes");

app.use(cors());
app.use(express.json());
app.use("/api", postRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
