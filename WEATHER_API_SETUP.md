# Getting a Free Weather API Key

To enable live weather data in AUREON, you need a free API key from OpenWeatherMap.

## Steps to Get Your Free API Key:

1. **Visit OpenWeatherMap**
   - Go to: https://openweathermap.org/api

2. **Sign Up for Free**
   - Click "Sign Up" (top right)
   - Create a free account
   - Verify your email

3. **Get Your API Key**
   - After login, go to: https://home.openweathermap.org/api_keys
   - Your default API key will be shown
   - Copy the API key

4. **Add to AUREON**
   - Open: `src/components/DigitalClock.js`
   - Find line ~41: `const API_KEY = 'demo';`
   - Replace `'demo'` with your API key: `const API_KEY = 'your_actual_api_key_here';`
   - Save the file

5. **Restart the App**
   - The app will automatically reload
   - Allow location access when prompted
   - Weather data will now be live!

## What Becomes Live:

✅ **Temperature** - Current, High, Low
✅ **Humidity** - Current humidity %
✅ **Weather Conditions** - Clear, Cloudy, Rain, etc.
✅ **Wind Speed** - In mph
✅ **Visibility** - In miles
✅ **Sunrise Time** - Actual sunrise for your location
✅ **Sunset Time** - Actual sunset for your location
✅ **Day Length** - Calculated from sunrise/sunset

## Notes:

- Free tier allows 1,000 API calls/day
- Weather updates every hour automatically
- If location is denied, default values are used
- API key activation may take 10-15 minutes after signup
