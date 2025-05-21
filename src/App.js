const express = require("express");
const whatsappRoutes = require("./routes/whatsappRoutes");
const path = require("path");
const connectDB = require("./config/database");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/whatsapp", whatsappRoutes);

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err);
  });
