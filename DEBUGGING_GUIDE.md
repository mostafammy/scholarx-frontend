# Event Interest Hook - Network Tab Debugging Guide

## How to Verify Authorization Header

### Step 1: Open Chrome DevTools

1. Press `F12` or right-click and select "Inspect"
2. Navigate to the **Network** tab

### Step 2: Filter Requests

1. In the filter box, type: `event-interest`
2. Or select the **Fetch/XHR** filter button

### Step 3: Navigate to Services Page

1. Make sure you're **logged in** (have a valid `sx_auth` cookie)
2. Navigate to `/services` page
3. The status check request should appear automatically

### Step 4: Inspect the Request

1. Look for a request to: `/api/event-interest/status/000000000000000000000000`
2. Click on the request to view details
3. Go to the **Headers** tab

### Step 5: Verify Authorization Header

Under **Request Headers**, you should see:

```
Authorization: Bearer <your-token-value>
```

### Step 6: Check Response

1. Go to the **Response** tab
2. You should see:

```json
{
  "success": true,
  "data": {
    "isRegistered": true // or false
  }
}
```

## Console Logs to Monitor

The refactored hook outputs detailed debug logs. Open the **Console** tab to see:

### When Query is Disabled (Guest User)

```
[useEventInterest] Query disabled: missing token, missing user ID
```

### When Query Runs (Authenticated User)

```
[useEventInterest] Fetching status for eventId: 000000000000000000000000
[useEventInterest] Token found: true (eyJhbGciOi...)
[useEventInterest] User ID: 507f1f77bcf86cd799439011
[useEventInterest] Status response: { success: true, data: { isRegistered: true } }
```

### On Error (Silent Failure)

```
[useEventInterest] Status check failed: Unauthorized
[useEventInterest] Error (silent): Unauthorized
```

### After Successful Registration

```
[useEventInterest] Refreshing status after submission for eventId: 000000000000000000000000
[useEventInterest] Fetching status for eventId: 000000000000000000000000
...
```

## Common Issues and Solutions

### Issue 1: No Authorization Header

**Symptom:** Request is made but Authorization header is missing

**Solution:**

- Check if cookie exists: `Cookies.get('sx_auth')`
- Verify user is logged in: Check UserContext
- Ensure query is enabled: `enabled: !!token && !!userId && !!eventId && !userLoading`

### Issue 2: 401 Unauthorized

**Symptom:** Response status is 401

**Solution:**

- Token might be expired - try logging in again
- Token format might be wrong - should be JWT
- Backend might not be accepting the token

### Issue 3: Query Not Running

**Symptom:** No network request is made at all

**Solution:**

- Check console for: `[useEventInterest] Query disabled: ...`
- verify the logged reasons (e.g., "missing token", "missing user ID")
- Verify `sx_auth` cookie is present.

### Issue 4: Wrong Response Structure

**Symptom:** `isRegistered` is always false even when registered

**Solution:**

- Check the actual response structure in Network tab
- Verify backend returns: `{ success: true, data: { isRegistered: boolean } }`
- Hook expects: `data?.data?.isRegistered`

## Testing Checklist

### Guest User (Not Logged In)

- [ ] No status check request is made
- [ ] Console shows: "Query disabled"
- [ ] "Register Interest" button is shown
- [ ] No errors in console

### Authenticated User (Logged In)

- [ ] Status check request is made automatically
- [ ] Authorization header is present
- [ ] Response is received successfully
- [ ] Button state reflects registration status

### After Registration

- [ ] Status refreshes automatically
- [ ] Button changes from "Register Interest" to "Already Registered"
- [ ] Console shows: "Refreshing status after submission"

### Error Handling

- [ ] 500 error doesn't block UI
- [ ] Error is logged to console
- [ ] User can still attempt registration
- [ ] No crash or white screen

## React Query DevTools

In development mode, you'll see a floating React Query icon in the bottom-right corner.

Click it to:

- View all active queries
- See query status (loading, success, error)
- Inspect cached data
- Manually refetch queries
- View query timeline

### Useful DevTools Features:

1. **Query Inspector**: See the exact data returned by the query
2. **Query Status**: Check if query is enabled/disabled
3. **Refetch Button**: Manually trigger a refetch
4. **Cache Time**: See when data will be garbage collected
