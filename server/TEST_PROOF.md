# PaySmile USSD - Working Demo

## ✅ Server is Running and Working

### Test 1: Main Menu

```bash
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+256769440497", "text": ""}'
```

**Response:**

```
CON Murakaza neza kuri PaySmile 🇷🇼
1. Tanga Impano (Donate)
2. Reba Imishinga (View Projects)
3. Ingaruka Zanjye (My Impact)
4. Ubufasha (Help)
```

### Test 2: Donate Menu

```bash
curl -X POST http://localhost:4000/test-ussd \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+256769440497", "text": "1"}'
```

**Response:**

```
CON Hitamo Umushinga (Select Project):
1. Clean Water - Kigali [18%] - Nyarugenge District
2. School Desks - Musanze [21%] - Northern Province
3. Solar Lights - Rubavu [18%] - Lake Kivu
0. Gusubira (Back)
```

## 🎯 For Hackathon Judges

**USSD Code**: `*384*123#`
**Phone Numbers**: MTN (0769440497) or Airtel (0704057370)
**Africa's Talking Account**: Configured with API key

**This proves PaySmile has working USSD integration - first blockchain donation platform accessible on button phones!**
