import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log(" Hourly Bump Check job started at " + new Date().toISOString());

Deno.serve(async (req) => {
    try {
        // 1. Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 2. Fetch active multi-bump listings that need bumping NOW
        // Logic: Find listings where (created_at + N days) <= NOW()
        // But since we update created_at on every bump, we just need to check:
        // created_at <= NOW() - 24 hours.

        // We run this check every hour (or even every minute optimally, but hour is safe for load).
        // It captures any listing that was last bumped more than 24 hours ago.
        // So if user bought at 14:00, tomorrow at 14:00+ (when job runs) it gets bumped.

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: listingsToBump, error: fetchError } = await supabaseClient
            .from('listings')
            .select('id, title, created_at')
            .in('package_type', ['multi-bump', 'z_multi_bump'])
            .eq('status', 'active')
            .gt('promotion_expiry', new Date().toISOString())
            .lt('created_at', twentyFourHoursAgo);

        if (fetchError) {
            throw fetchError;
        }

        if (!listingsToBump || listingsToBump.length === 0) {
            console.log('No listings need bumping right now.');
            return new Response(JSON.stringify({ message: 'No listings to bump', count: 0 }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`Found ${listingsToBump.length} listings to bump (Last Bumped < ${twentyFourHoursAgo}).`);

        // 3. Update them all to NOW()
        const listingIds = listingsToBump.map(l => l.id);

        // Using a loop or Promise.all might be safer to ensure we don't hit limits, 
        // but a single update for <1000 items is fine.
        const { error: updateError } = await supabaseClient
            .from('listings')
            .update({ created_at: new Date().toISOString() })
            .in('id', listingIds);

        if (updateError) {
            throw updateError;
        }

        // 4. Log Success
        console.log(`Successfully bumped ${listingsToBump.length} listings.`);

        return new Response(
            JSON.stringify({
                message: 'Success',
                bumped_count: listingsToBump.length,
                bumped_ids: listingIds
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error executing bump check:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
