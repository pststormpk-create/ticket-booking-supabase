const express = require("express");

// 컨트롤러 함수 불러오기 (CommonJS 방식)
// * 파일 경로는 프로젝트 구조에 맞게 수정해주세요 (예: ./controllers/performanceController)
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

// 요청 본문(req.body)의 JSON을 읽기 위한 미들웨어
app.use(express.json());

// ==========================================
// 1. 공연 관련 API (Performance Routes)
// ==========================================

// GET http://localhost:3001/performances (전체 공연 목록 조회)
app.get("/performances", async (req, res) => {
  try {
    const data = await listPerformances();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET http://localhost:3001/performances/:id (특정 공연 상세 조회)
app.get("/performances/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await getPerformance(id);
    res.json({ success: true, data });
  } catch (error) {
    // 404 에러 처리 (공연을 찾을 수 없는 경우 등)
    const status = error.status || 404;
    res.status(status).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. 예약 관련 API (Reservation Routes)
// ==========================================

// GET http://localhost:3001/reservations?email=minsu@example.com (이메일별 예약 내역 조회)
// * POST/PATCH보다 위에 위치해야 /reservations 라우팅을 정상적으로 처리합니다.
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

// POST http://localhost:3001/reservations (좌석 예약 생성)
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

// PATCH http://localhost:3001/reservations/:id/cancel (예약 취소)
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

// ==========================================
// 서버 실행
// ==========================================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`서버가 실행 중입니다: http://localhost:${PORT}`);
});
