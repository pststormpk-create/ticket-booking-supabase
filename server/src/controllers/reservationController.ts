import { supabase } from "../lib/supabase";
import { badRequest, notFound } from "../lib/httpError";

type CreateReservationInput = {
  seatId: number;
  customerName: string;
  customerEmail: string;
};

export async function createReservation({
  seatId,
  customerName,
  customerEmail,
}: CreateReservationInput) {
  if (!seatId || !customerName || !customerEmail) {
    throw badRequest("seatId, customerName, customerEmail이 필요합니다.");
  }

  const { data, error } = await supabase.rpc("reserve_seat", {
    p_seat_id: seatId,
    p_customer_name: customerName,
    p_customer_email: customerEmail,
  });

  if (error) throw badRequest(error.message);

  return {
    success: true,
    reservation_id: data?.[0]?.reservation_id,
    message: "예매 완료",
  };
}

export async function cancelReservation(
  reservationId: number,
  customerEmail: string,
) {
  if (!reservationId || !customerEmail) {
    throw badRequest("reservationId와 customerEmail이 필요합니다.");
  }

  const { data, error } = await supabase.rpc("cancel_reservation", {
    p_reservation_id: reservationId,
    p_customer_email: customerEmail,
  });

  if (error) throw notFound(error.message);

  return {
    success: true,
    reservation_id: data?.[0]?.reservation_id,
    message: "예매가 취소되었습니다.",
  };
}
