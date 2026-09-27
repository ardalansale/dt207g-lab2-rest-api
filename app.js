import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const app = express();

// Middlewares - VIKTIGT: cors() först!
app.use(cors());
app.use(express.json());

// Databaskoppling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false }
});

// Test-route för rotadressen
app.get("/", (req, res) => {
  res.json({
    message: "DT207G Lab2 REST API är igång :)"
  });
});

// 1. GET - Hämta alla poster
app.get("/api/workexperience", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workexperience ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "Något gick fel vid hämtning av data." });
  }
});

// 2. POST - Skapa ny post
app.post("/api/workexperience", async (req, res) => {
  try {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;
    if (!companyname || !jobtitle || !location || !startdate || !description) {
      return res.status(400).json({ error: "Alla obligatoriska fält måste vara ifyllda." });
    }
    const result = await pool.query(
      `INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [companyname, jobtitle, location, startdate, enddate || null, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST error:", error);
    res.status(500).json({ error: "Något gick fel vid sparning." });
  }
});

// 3. PUT - Uppdatera post
app.put("/api/workexperience/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    if (!companyname || !jobtitle || !location || !startdate || !description) {
      return res.status(400).json({ error: "Alla obligatoriska fält måste vara ifyllda." });
    }

    const result = await pool.query(
      `UPDATE workexperience
       SET companyname = $1, jobtitle = $2, location = $3, startdate = $4, enddate = $5, description = $6
       WHERE id = $7 RETURNING *`,
      [companyname, jobtitle, location, startdate, enddate || null, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Posten hittades inte." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ error: "Något gick fel vid uppdatering." });
  }
});

// 4. DELETE - Radera post
app.delete("/api/workexperience/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM workexperience WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Posten hittades inte." });
    }
    res.json({ message: "Post borttagen." });
  } catch (error) {
    console.error("DELETE error:", error);
    res.status(500).json({ error: "Något gick fel." });
  }
});

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});