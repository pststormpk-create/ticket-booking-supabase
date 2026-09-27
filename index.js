const express = require("express");

const {
  listPerformances,
  getPerformance,
} = require("./controllers/performanceController");

const {
  createReservation,
  cancelReservation,
} = require("./controllers/reservationController");

const { getReservationsByEmail } = require("./controllers/userController");

const app = express();

app.use(express.json());

app.get("/performances", async (req, res) => {
  try {
    const data = await listPerformances();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/performances/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await getPerformance(id);
    res.json({ success: true, data });
  } catch (error) {
    const status = error.status || 404;
    res.status(status).json({ success: false, message: error.message });
  }
});

app.get("/reservations", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await getReservationsByEmail(email);
    res.json({ success: true, data });
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
});

app.post("/reservations", async (req, res) => {
  try {
    const { seatId, customerName, customerEmail } = req.body;
    const result = await createReservation({
      seatId,
      customerName,
      customerEmail,
    });
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
});

app.patch("/reservations/:id/cancel", async (req, res) => {
  try {
    const reservationId = Number(req.params.id);
    const { customerEmail } = req.body;

    const result = await cancelReservation(reservationId, customerEmail);
    res.json(result);
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`서버가 실행 중입니다: http://localhost:${PORT}`);
});
