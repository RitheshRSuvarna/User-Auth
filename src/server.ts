import { connectDB } from "./config/db";
import app from "./app"

const PORT = 3000;

const startServer = async () => {
  await connectDB(); 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();

app.get("/", (req, res) => {
  res.send("Server is running ");
});
export default app;
