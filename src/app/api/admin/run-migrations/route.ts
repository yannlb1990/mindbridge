import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin migration helper endpoint.
 * Protected by CRON_SECRET header.
 * Run with:
 *   curl -X POST https://your-domain/api/admin/run-migrations \
 *     -H "x-cron-secret: YOUR_CRON_SECRET"
 */

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  // Validate secret
  const secret = req.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error: 'SUPABASE_SERVICE_ROLE_KEY not configured',
        instructions: [
          '1. Go to your Supabase project → Settings → API',
          '2. Copy the "service_role" key (keep this secret!)',
          '3. Add SUPABASE_SERVICE_ROLE_KEY=<key> to your .env.local',
          '4. Also add CRON_SECRET=<any-random-string> to .env.local',
          '5. Redeploy or restart your dev server',
          '6. Run the SQL from supabase/migrations/005_remaining_tables.sql',
          '   directly in your Supabase SQL Editor',
        ],
      },
      { status: 503 }
    );
  }

  try {
    // Test connectivity with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: 'Supabase service role connection verified.',
      note: 'Run the SQL from supabase/migrations/005_remaining_tables.sql in your Supabase SQL Editor to apply the schema changes.',
      userCount: data?.length ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
