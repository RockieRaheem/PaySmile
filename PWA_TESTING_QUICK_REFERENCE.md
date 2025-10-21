# 🚀 PaySmile PWA - Testing Quick Reference

## ⚡ 5-Minute Quick Test

### 1. Start the App

```bash
npm run dev
```

Visit: `http://localhost:9002`

### 2. Test PWA Install (Chrome Desktop)

1. Look for install icon (⊕) in address bar
2. Click "Install PaySmile"
3. App opens in standalone window
4. Check: No browser UI visible ✅

### 3. Test Core Features

- [ ] Dashboard loads with balance
- [ ] Round-Up page calculates donations
- [ ] Projects page shows 3 projects
- [ ] Badges page displays NFTs
- [ ] Bottom nav navigation works

### 4. Test Mobile (Chrome DevTools)

1. Press F12 → Toggle device (Ctrl+Shift+M)
2. Select "iPhone 12 Pro"
3. Check all buttons are easily tappable
4. Verify no horizontal scrolling
5. Test bottom nav doesn't overlap

### 5. Test Offline (Quick Check)

1. DevTools → Network tab
2. Check "Offline"
3. Refresh page
4. App should load from cache ✅

---

## 📱 Mobile Device Testing

### Get Your Local IP

```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Visit on Phone

```
http://YOUR_IP:9002
Example: http://192.168.1.100:9002
```

### Install on Android

1. Chrome → Menu (⋮)
2. "Add to Home Screen"
3. Tap "Add"
4. Launch from home screen

### Install on iOS

1. Safari → Share button
2. "Add to Home Screen"
3. Tap "Add"
4. Launch from home screen

---

## 🎬 Demo Video Quick Shots

### Shot 1: PWA Install (15 sec)

- Show browser with install prompt
- Click "Install"
- App opens in standalone mode
- Point out: "No app store needed!"

### Shot 2: Offline Mode (10 sec)

- Turn off WiFi
- App still works
- Say: "Cached pages load instantly"

### Shot 3: Touch Targets (10 sec)

- Show mobile view
- Tap buttons with thumb
- Say: "44px minimum, WCAG AAA"

### Shot 4: App Shortcuts (10 sec)

- Long-press app icon
- Show Round-Up, Vote, Badges shortcuts
- Say: "Quick access to key features"

---

## 🐛 Troubleshooting

### Install button not showing?

- Must be HTTPS or localhost
- Check manifest.json is accessible
- Clear cache and reload

### Service worker not registering?

```javascript
// Check in browser console
navigator.serviceWorker.getRegistrations().then((r) => console.log(r));
```

### Offline not working?

- Check DevTools → Application → Service Workers
- Verify "sw.js" is active
- Try unregister and reload

### Mobile can't connect?

- Check same WiFi network
- Disable firewall temporarily
- Use `0.0.0.0` instead of localhost:
  ```bash
  npm run dev -- -H 0.0.0.0
  ```

---

## 📊 Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run PWA audit
lighthouse http://localhost:9002 --preset=pwa --view

# Run mobile audit
lighthouse http://localhost:9002 --preset=mobile --view
```

### Target Scores

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: 100 ✅

---

## 🎯 Judge Demo Talking Points

### Opening (10 sec)

> "PaySmile is a Progressive Web App built on Celo. Watch - I can install it right now, no app store needed."

### PWA Features (20 sec)

> "It works offline - perfect for Uganda where data is expensive. Uses service workers to cache pages. Loads instantly even on 3G."

### Mobile-First (15 sec)

> "Every button is 44 pixels minimum - WCAG AAA accessibility. Optimized for one-handed use. True mobile-first design."

### Celo Integration (15 sec)

> "Built on Celo because it's mobile-first. Works perfectly with Valora. All donations are transparent on the blockchain."

### Impact (10 sec)

> "30 million mobile payments daily in Uganda. PaySmile turns spare change into community impact."

---

## ✅ Pre-Submission Checklist

### Code

- [ ] No console errors
- [ ] All TypeScript errors fixed
- [ ] Service worker registers
- [ ] Manifest.json valid

### Features

- [ ] Wallet connects (MetaMask/Valora)
- [ ] Round-up calculation works
- [ ] Projects load from blockchain
- [ ] Badges display NFT count
- [ ] Voting/donation works

### PWA

- [ ] Installable on Chrome
- [ ] Installable on Safari
- [ ] Works offline
- [ ] Icons display correctly
- [ ] Theme color shows

### Mobile

- [ ] Touch targets 44px+
- [ ] No horizontal scroll
- [ ] Bottom nav works
- [ ] Buttons easy to tap
- [ ] Forms usable

### Documentation

- [ ] README updated with PWA section
- [ ] Demo script includes PWA
- [ ] MOBILE_TESTING.md complete
- [ ] GitHub repo public

### Deployment

- [ ] Deploy to Vercel
- [ ] Test live URL on mobile
- [ ] Add URL to README
- [ ] Add demo video link

---

## 🚀 Final Deploy

```bash
# Build production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy preview
vercel
```

### After Deploy

1. Visit Vercel URL on mobile
2. Test PWA install
3. Add live URL to README
4. Submit to EthNile'25!

---

## 🏆 You're Ready!

**Everything works. Just test, record, and submit!**

Good luck at EthNile'25! 🎉
