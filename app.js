import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false }
});

// Test-route
app.get("/", (req, res) => {
  res.json({
    message: "DT207G Lab2 REST API är igång :)"
  });
});

// GET
app.get("/api/workexperience", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dt207g_lab2_workexperience"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Något gick fel vid hämtning av data."
    });
  }
});

// POST
app.post("/api/workexperience", async (req, res) => {
  try {
    const {
      companyname,
      jobtitle,
      location,
      startdate,
      enddate,
      description
    } = req.body;

    if (
      !companyname ||
      !jobtitle ||
      !location ||
      !startdate ||
      !description
    ) {
      return res.status(400).json({
        error: "Alla obligatoriska fält måste vara ifyllda."
      });
    }

    const result = await pool.query(
      `INSERT INTO dt207g_lab2_workexperience
      (companyname, jobtitle, location, startdate, enddate, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        companyname,
        jobtitle,
        location,
        startdate,
        enddate || null,
        description
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Något gick fel vid sparning."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});