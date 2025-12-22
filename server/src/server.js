import "dotenv/config";
import app from "./app.js";

console.log("🟢 server.js cargado");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🟢 Server corriendo en puerto ${PORT}`);
});

