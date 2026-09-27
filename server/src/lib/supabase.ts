import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase 환경 변수가 필요합니다.");
}

export const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
