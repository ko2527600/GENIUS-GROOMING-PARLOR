# DEPRECATED - This Backend is No Longer Used

This Express backend has been replaced by Vercel Serverless Functions located in the `/api` directory.

All booking, notification, and admin functionality is now handled by:
- `/api/bookings.js` - Create and list bookings
- `/api/bookings/[id].js` - Update booking status
- `/api/availability.js` - Check slot availability
- `/api/analytics.js` - Get booking analytics
- `/api/admin/*` - Admin authentication
- `/api/customers.js` - Customer management
- `/api/cron/reminders.js` - Automated reminders

## Why Deprecated?

- Vercel serverless functions are simpler to deploy and maintain
- No need for separate hosting
- Better integration with Vercel Blob storage
- Automatic scaling
- Unified deployment pipeline with frontend

## Safe to Delete?

Yes, this entire `/backend` directory can be safely deleted. All functionality has been migrated to `/api`.
