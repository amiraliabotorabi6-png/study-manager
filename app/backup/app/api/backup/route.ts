import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const tables = [
  "profiles",
  "subjects",
  "topics",
  "resources",
  "study_sessions",
  "daily_availability",
  "daily_activities",
  "exams",
  "tests",
  "test_questions",
  "mistake_categories",
  "mistakes",
  "tasks",
  "goals",
  "planner_items",
  "journal_entries",
  "sleep_records",
  "notification_settings",
  "notifications",
  "achievements",
  "study_streaks",
];

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const backup: Record<string, unknown> = {
      version: 1,
      created_at: new Date().toISOString(),
      user_id: user.id,
      email: user.email ?? null,
      data: {},
    };

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        /*
         * profiles با id کاربر شناسایی می‌شود،
         * نه user_id.
         */
        if (table === "profiles") {
          const { data: profile, error: profileError } =
            await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

          if (!profileError) {
            (
              backup.data as Record<string, unknown>
            )[table] = profile ? [profile] : [];
          }
        }

        continue;
      }

      (
        backup.data as Record<string, unknown>
      )[table] = data ?? [];
    }

    const json = JSON.stringify(
      backup,
      null,
      2
    );

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="study-manager-backup-${new Date()
          .toISOString()
          .slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Backup error:",
      error
    );

    return NextResponse.json(
      {
        error: "Backup failed",
      },
      {
        status: 500,
      }
    );
  }
}
