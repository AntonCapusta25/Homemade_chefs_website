-- Enable the pg_cron extension (required for scheduling jobs)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the weekly newsletter for every Monday at 9:00 AM UTC
-- NOTE: Replace 'YOUR_PROJECT_REF' and 'YOUR_SERVICE_ROLE_KEY' with your actual Supabase details.
-- You can find these in your Supabase Dashboard -> Project Settings -> API.

SELECT cron.schedule(
    'send-weekly-newsletter',
    '0 9 * * 1',  -- Cron syntax: Minute (0), Hour (9), Day of Month (*), Month (*), Day of Week (1 = Monday)
    $$
    SELECT
      net.http_post(
          url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-newsletter',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
      ) as request_id;
    $$
);

-- To check if it's scheduled:
-- select * from cron.job;

-- To test it immediately (without waiting for Monday):
-- select * from net.http_post(
--     url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-newsletter',
--     headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
-- );
