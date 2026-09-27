const supabase = require("./client");

export async function getReservationsByEmail(email: string) {
  if (!email) throw badRequest("email 쿼리가 필요합니다.");

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      customer_name,
      customer_email,
      reserved_at,
      seats(
        id,
        row_label,
        seat_number,
        performances(id, title, venue, starts_at, price)
      )
    `,
    )
    .eq("customer_email", email)
    .order("reserved_at", { ascending: false });

  if (error) throw error;

  return data.map((r) => ({
    reservation_id: r.id,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    reserved_at: r.reserved_at,
    seat: r.seats
      ? {
          seat_id: r.seats.id,
          row_label: r.seats.row_label,
          seat_number: r.seats.seat_number,
        }
      : null,
    performance: r.seats?.performances ?? null,
  }));
}
