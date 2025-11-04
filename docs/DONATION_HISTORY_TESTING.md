# Testing Donation History Feature

## Quick Start

### 1. Make Some Test Donations

Before testing the history page, create some donation data:

```bash
# Start the dev server if not running
npm run dev
```

1. Go to any project page
2. Make 2-3 donations with different amounts:
   - $10-49 (Bronze badge)
   - $50-99 (Silver badge)
   - $100+ (Gold/Platinum badge)
3. Wait for transactions to confirm

### 2. Navigate to History Page

```
http://localhost:9002/history
```

Or click "History" in the bottom navigation.

### 3. Verify Features

## ✅ Feature Checklist

### Basic Display

- [ ] Page loads without errors
- [ ] Statistics cards show correct totals
- [ ] All donations appear in chronological order
- [ ] Each card shows:
  - [ ] Project name
  - [ ] Date and time
  - [ ] Amount in USD and CELO
  - [ ] Badge earned (if applicable)
  - [ ] Transaction hash link

### Search Functionality

- [ ] Type project name → filters list
- [ ] Type partial tx hash → filters list
- [ ] Clear button (X) works
- [ ] "No results" shows when nothing matches

### Filter Sheet

- [ ] Filter button opens sheet
- [ ] Sort by Date → orders correctly
- [ ] Sort by Amount → orders correctly
- [ ] Sort by Project → orders alphabetically
- [ ] Ascending/Descending toggle works
- [ ] Min amount filter works
- [ ] Max amount filter works
- [ ] Badge tier filter works
- [ ] "Clear All Filters" resets everything
- [ ] Active filters show as chips

### Statistics

- [ ] Total Donated shows sum in USD
- [ ] CELO amount matches USD conversion
- [ ] Badges Earned count is correct
- [ ] Projects count is correct

### Export

- [ ] Download icon in header
- [ ] Clicking downloads CSV file
- [ ] CSV contains all visible donations
- [ ] CSV has correct headers
- [ ] CSV data is formatted properly

### Transaction Links

- [ ] Clicking hash opens Celoscan
- [ ] Opens in new tab
- [ ] Shows correct transaction

### States

- [ ] Loading spinner shows while fetching
- [ ] Empty state shows when no donations
- [ ] Error state shows on failure (disconnect internet to test)
- [ ] Retry button refetches data

## 🧪 Manual Test Scenarios

### Scenario 1: First-Time User

```
Steps:
1. Connect wallet with no donation history
2. Observe empty state

Expected:
- "No Donations Yet" message
- Calendar icon
- "Browse Projects" button
- No statistics cards
```

### Scenario 2: User with Donations

```
Steps:
1. Connect wallet with 3+ donations
2. Observe donation list

Expected:
- Statistics cards at top
- All donations listed
- Correct badge indicators
- Working transaction links
```

### Scenario 3: Search Functionality

```
Steps:
1. Type "Water" in search box
2. Verify only water projects show
3. Clear search
4. Type partial transaction hash
5. Verify matching donations show

Expected:
- Real-time filtering
- "X donations" count updates
- Clear button works
- No lag or jank
```

### Scenario 4: Amount Filtering

```
Steps:
1. Open filter sheet
2. Set Min: $50
3. Close sheet
4. Verify only $50+ donations show
5. Set Max: $100
6. Verify $50-100 donations show

Expected:
- Filter applies immediately
- Active filter chip shows "Min: $50"
- Count updates correctly
```

### Scenario 5: Badge Filtering

```
Steps:
1. Open filter sheet
2. Select "Silver" from Badge Tier
3. Close sheet
4. Verify only Silver badge donations show

Expected:
- Only Silver badges visible
- Active filter chip shows "Silver"
- Other donations hidden
```

### Scenario 6: Sorting

```
Steps:
1. Open filter sheet
2. Change sort to "Amount"
3. Change order to "Ascending"
4. Verify smallest donation is first
5. Change to "Descending"
6. Verify largest donation is first

Expected:
- List reorders instantly
- Correct sort direction
- No errors
```

### Scenario 7: Export

```
Steps:
1. Click download icon
2. Open downloaded CSV
3. Verify data matches screen

Expected:
- File downloads as paysmile-donations-[date].csv
- Contains Date, Project, Amounts, Badge, TxHash
- Data is accurate and complete
- Can open in Excel/Numbers
```

### Scenario 8: Wallet Switching

```
Steps:
1. View history with Wallet A
2. Switch to Wallet B in MetaMask
3. Observe page updates

Expected:
- Loading state briefly
- Different donations appear
- Statistics update
- No errors in console
```

## 🐛 Edge Cases to Test

### Edge Case 1: Very Long Project Names

```
Test: Project name exceeds card width
Expected: Text truncates with ellipsis
```

### Edge Case 2: Very Small Amounts

```
Test: Donate 0.01 CELO ($0.005)
Expected:
- Shows 0.01 CELO
- Shows $0.01 USD
- No badge earned
- Still appears in list
```

### Edge Case 3: Very Large Amounts

```
Test: Donate 10,000 CELO
Expected:
- Formats with commas: 10,000.0000
- USD shows $5,000.00
- Platinum badge
```

### Edge Case 4: No Badges Earned

```
Test: Donate $5 (below $10 threshold)
Expected:
- No badge indicator shows
- Still appears in history
- No errors
```

### Edge Case 5: Same-Day Multiple Donations

```
Test: Make 5 donations on same day
Expected:
- All appear separately
- Timestamps differentiate them
- Sort order correct
```

### Edge Case 6: Network Errors

```
Test: Disconnect internet, reload page
Expected:
- Error state shows
- Error message displayed
- "Try Again" button works
- Reconnecting internet allows retry
```

## 📊 Performance Tests

### Test 1: Load Time

```
Measure: Time from page load to data displayed
Target: < 3 seconds
Steps:
1. Open DevTools Network tab
2. Navigate to /history
3. Measure time to "donations" state update

Pass: < 3s on good connection
```

### Test 2: Search Responsiveness

```
Measure: Typing lag in search box
Target: No perceptible lag
Steps:
1. Type quickly in search box
2. Observe character appearance
3. Observe list updates

Pass: Characters appear instantly, list filters < 100ms
```

### Test 3: Filter Application

```
Measure: Time from filter change to UI update
Target: < 200ms
Steps:
1. Open filter sheet
2. Change sort order
3. Measure list reorder time

Pass: Instant reorder, no flicker
```

### Test 4: Large Dataset

```
Measure: Performance with 100+ donations
Simulation: Can't easily test, but code handles it
Check: No memory leaks, smooth scrolling
```

## 🎨 Visual Regression Tests

### Desktop (1920x1080)

- [ ] Statistics cards side-by-side
- [ ] Donation cards full width
- [ ] Proper spacing and alignment
- [ ] Filter sheet not full-screen

### Tablet (768x1024)

- [ ] Statistics cards 2-column
- [ ] Donation cards stack properly
- [ ] Search bar full width
- [ ] Touch targets adequate

### Mobile (375x667)

- [ ] Statistics cards 2-column
- [ ] Text doesn't overflow
- [ ] Bottom nav doesn't cover content
- [ ] Filter sheet full-screen

## 🔍 Console Checks

### No Errors

```javascript
// Open DevTools Console
// Should see:
✓ No red errors
✓ No unhandled promise rejections
✓ No React warnings

// May see:
⚠ "Failed to fetch project name" - OK if project deleted
ℹ Event query logs - OK, informational
```

### Network Calls

```
Expected calls:
1. getLogs (DonationReceived events)
2. getLogs (ProjectFunded events)
3. getBlock (for each unique block)
4. getTransaction (for each project donation)
5. readContract (getProject for each project)

All should return 200 OK
```

## 📱 Cross-Browser Testing

### Chrome/Edge (Chromium)

- [ ] All features work
- [ ] CSV download works
- [ ] No console errors

### Firefox

- [ ] All features work
- [ ] CSV download works
- [ ] Date formatting correct

### Safari (macOS/iOS)

- [ ] All features work
- [ ] CSV download works
- [ ] No webkit-specific issues

## 🚀 Production Readiness

### Before Deploying

- [ ] All tests pass
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Works on mobile
- [ ] CSV export works
- [ ] External links work
- [ ] Error states work
- [ ] Loading states work

### Post-Deploy Checklist

- [ ] Monitor error logs
- [ ] Check analytics for usage
- [ ] Verify blockchain queries aren't excessive
- [ ] Monitor export feature usage
- [ ] Check for user feedback

## 🆘 Troubleshooting

### Issue: "Loading your donation history..." never finishes

**Causes:**

- Wallet not connected
- RPC endpoint down
- Contract address wrong
- Network mismatch

**Debug:**

1. Check console for errors
2. Verify wallet is connected (check header)
3. Check network (should be Alfajores)
4. Verify contract address in .env

### Issue: Donations show but amounts are $0.00

**Cause:** CELO_USD_RATE is 0 or undefined

**Fix:**

- Check `use-donation-history.ts` line 15
- Should be `const CELO_USD_RATE = 0.50;`

### Issue: Project names show as "Project #1"

**Cause:** Project not found in contract or call failed

**Debug:**

1. Check if project exists in contract
2. Verify project ID is correct
3. Check contract address matches

**Fix:**

- Usually harmless, just means project was deleted
- Can add error handling to retry or use cached names

### Issue: CSV download doesn't work

**Cause:** Browser blocking download

**Debug:**

1. Check browser's download settings
2. Check for popup blocker
3. Look for browser notification

**Fix:**

- Allow downloads from localhost
- Try different browser

### Issue: Transaction links don't work

**Cause:** Wrong explorer URL or network

**Fix:**

- Verify URL format: `https://alfajores.celoscan.io/tx/${hash}`
- Check network matches (Alfajores testnet)

## 📈 Success Metrics

After implementing, track:

1. **Usage Rate**

   - % of users who visit /history
   - Target: >50% of donors

2. **Export Usage**

   - # of CSV exports per week
   - Target: >10% of history views

3. **Error Rate**

   - Failed history fetches
   - Target: <1%

4. **Load Time**

   - Average time to display data
   - Target: <3 seconds

5. **User Satisfaction**
   - Feedback/support tickets
   - Target: <5 complaints/month

---

**Happy Testing! 🎉**

If you find any issues, check the implementation docs or open an issue in the repo.
