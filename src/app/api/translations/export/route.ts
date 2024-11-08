import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '../../auth/[...nextauth]/route';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // First get the user's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    // Then get their translations
    const { data: translations, error: translationsError } = await supabase
      .from('translations')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (translationsError) throw translationsError;

    // Convert to CSV
    const headers = ['Date', 'English', 'Chinese', 'Pinyin'];
    const rows = translations.map(t => [
      new Date(t.created_at).toLocaleString(),
      t.input_text,
      t.translated_text,
      t.pinyin
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell?.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Return as downloadable CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="translations-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}
