import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar as CalendarIcon, Sun, Wind, Thermometer, CloudRain } from 'lucide-react';
import '../weather-animations.css';

const Hourcast = () => {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [weather, setWeather] = useState({
    temp: 72,
    feels_like: 70,
    humidity: 65,
    high: 78,
    low: 64,
    conditions: 'Clear',
    description: 'Clear skies',
    wind: 8,
    visibility: 10,
    sunrise: '6:42 AM',
    sunset: '7:06 PM',
    dayLength: '12h 24m'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Hide welcome screen after 1 second
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  // Fetch live weather data
  useEffect(() => {
    const fetchWeather = async (lat = 28.6139, lon = 77.2090) => { // Default: New Delhi, India
      try {
        const API_KEY = '187c4d9f1bce418d590c2140a01615a0';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

        console.log('Fetching weather from:', url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Weather API Response:', data);

        if (data.cod === 401) {
          console.log('⏳ API Key not activated yet. Please wait 10-15 minutes after signup.');
          console.log('Using default weather data for now...');
          return;
        }

        if (data.main) {
          const sunrise = new Date(data.sys.sunrise * 1000);
          const sunset = new Date(data.sys.sunset * 1000);
          const dayLengthMs = sunset - sunrise;
          const hours = Math.floor(dayLengthMs / (1000 * 60 * 60));
          const minutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));

          const newWeather = {
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            high: Math.round(data.main.temp_max),
            low: Math.round(data.main.temp_min),
            conditions: data.weather[0].main,
            description: data.weather[0].description,
            wind: Math.round(data.wind.speed),
            visibility: Math.round(data.visibility / 1609.34),
            sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            dayLength: `${hours}h ${minutes}m`
          };

          console.log('✅ Weather data updated successfully!', newWeather);
          setWeather(newWeather);
        }
      } catch (error) {
        console.log('❌ Weather fetch error:', error);
      }
    };

    // Try to get user's location, fallback to default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location granted, fetching weather...');
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('📍 Location denied, using default location (New Delhi)');
          fetchWeather();
        }
      );
    } else {
      console.log('📍 Geolocation not supported, using default location');
      fetchWeather();
    }

    // Update weather every 5 minutes
    const weatherInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
          () => fetchWeather()
        );
      } else {
        fetchWeather();
      }
    }, 300000); // 300,000 ms = 5 minutes

    return () => clearInterval(weatherInterval);
  }, []);

  useEffect(() => {
    const hours = time.getHours();
    if (hours >= 0 && hours < 5) setGreeting('Good Night');
    else if (hours >= 5 && hours < 12) setGreeting('Good Morning');
    else if (hours >= 12 && hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [time]);

  const formatNumber = (num) => num < 10 ? `0${num}` : num;

  const getTimeLeftInDay = () => {
    const now = new Date(time);
    const endOfDay = new Date(time);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getDayOfYear = () => {
    const start = new Date(time.getFullYear(), 0, 0);
    const diff = time - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getWeekProgress = () => {
    const startOfYear = new Date(time.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((time - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return { weekNumber, totalWeeks: 52, progress: (weekNumber / 52) * 100 };
  };

  const getSeason = () => {
    const month = time.getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const hours = time.getHours() % 12 || 12;
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const weekData = getWeekProgress();


  // Weather Animation Components
  const RainAnimation = useMemo(() => {
    const raindrops = [];
    for (let i = 0; i < 80; i++) {
      const left = Math.random() * 100;
      const duration = 0.5 + Math.random() * 0.5;
      const delay = Math.random() * 2;
      raindrops.push(
        <div
          key={i}
          className="raindrop"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return <div className="rain-container">{raindrops}</div>;
  }, []);

  const SnowAnimation = useMemo(() => {
    const snowflakes = [];
    for (let i = 0; i < 40; i++) {
      const left = Math.random() * 100;
      const duration = 3 + Math.random() * 2;
      const delay = Math.random() * 5;
      const swayDuration = 2 + Math.random() * 2;
      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s, ${swayDuration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return <div className="snow-container">{snowflakes}</div>;
  }, []);

  const FogAnimation = useMemo(() => {
    return (
      <div className="fog-container">
        <div className="fog-layer"></div>
        <div className="fog-layer"></div>
        <div className="fog-layer"></div>
      </div>
    );
  }, []);

  const CloudsAnimation = useMemo(() => {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      const top = Math.random() * 60;
      const duration = 40 + Math.random() * 20;
      const delay = Math.random() * 20;
      clouds.push(
        <div
          key={i}
          className="cloud"
          style={{
            top: `${top}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return <div className="clouds-container">{clouds}</div>;
  }, []);

  const [showLightning, setShowLightning] = useState(false);

  useEffect(() => {
    if (weather.conditions === 'Thunderstorm') {
      const interval = setInterval(() => {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 200);
      }, 5000 + Math.random() * 5000);
      return () => clearInterval(interval);
    }
  }, [weather.conditions]);

  const WeatherAnimation = () => {
    const condition = weather.conditions;

    switch (condition) {
      case 'Rain':
        return RainAnimation;
      case 'Drizzle':
        return RainAnimation;
      case 'Snow':
        return SnowAnimation;
      case 'Fog':
      case 'Mist':
      case 'Haze':
        return FogAnimation;
      case 'Thunderstorm':
        return (
          <>
            {RainAnimation}
            {showLightning && <div className="lightning-flash" />}
          </>
        );
      case 'Clouds':
        return CloudsAnimation;
      default:
        return null;
    }
  };

  // Generate stars ONCE - Must be before any conditional returns (Rules of Hooks)
  const stars = useMemo(() => {
    const starElements = [];
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
      const size = Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small';
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 4 + Math.random() * 6; // 4-10 seconds (slower twinkling)
      const delay = Math.random() * 8; // 0-8 seconds delay

      starElements.push(
        <div
          key={i}
          className={`star star-${size}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
    return starElements;
  }, []);

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="h-screen w-screen aureon-background flex items-center justify-center font-outfit overflow-hidden">
        <div className="text-center animate-fade-in">
          <p className="text-graphite-light text-sm sm:text-base font-light tracking-wider mb-4">
            Welcome to
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl text-silver font-ultra-thin tracking-[0.3em] uppercase mb-2">
            Hourcast
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-graphite-dark/50 to-transparent mx-auto mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen aureon-background flex items-center justify-center p-3 sm:p-4 md:p-6 font-outfit overflow-hidden">
      {/* Animated Stars - Static positions */}
      <div className="stars">
        {stars}
      </div>

      {/* Dynamic Weather Animation */}
      <WeatherAnimation />

      <div className="w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4">

        {/* Greeting */}
        <div className="mb-2 sm:mb-3 animate-fade-in">
          <p className="text-graphite-light text-xs sm:text-sm md:text-base font-light tracking-wide">
            {greeting}
          </p>
        </div>

        {/* Main Time Display */}
        <div className="mb-1 sm:mb-2 animate-slide-up">
          <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-silver font-ultra-thin tracking-tighter leading-none">
              {hours}
            </span>
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-silver/90 font-ultra-thin tracking-tighter leading-none">
              :
            </span>
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-silver font-ultra-thin tracking-tighter leading-none">
              {minutes}
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-graphite font-extra-light ml-1 sm:ml-2 self-end mb-1 sm:mb-2">
              {seconds}
            </span>
          </div>
        </div>

        {/* AM/PM Pill */}
        <div className="mb-2 sm:mb-3">
          <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-charcoal-light/30 backdrop-blur-sm border border-graphite-dark/20">
            <span className="text-xs sm:text-sm text-silver-muted font-light tracking-widest">
              {ampm}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <p className="text-graphite text-xs sm:text-sm font-light tracking-wide text-center px-4">
            {time.toLocaleDateString('en-US', { weekday: 'long' })}
            <span className="mx-2 text-graphite-dark/50">·</span>
            {time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Compact Info Grid - Fully Responsive */}
        <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-0">

          {/* First Row: Week Progress (2 cols) + Time Left + Season */}

          {/* Week Progress - Spans 2 columns */}
          <div className="col-span-2 aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-graphite-dark/20 shadow-charcoal-soft">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Week Progress</span>
                <span className="text-silver-muted text-xs sm:text-sm font-light">{weekData.progress.toFixed(0)}%</span>
              </div>
              <div className="relative h-1.5 bg-charcoal-dark/50 rounded-full overflow-hidden mb-1.5 sm:mb-2">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-graphite-dark to-silver-muted rounded-full transition-all duration-700"
                  style={{ width: `${weekData.progress}%` }}
                />
              </div>
              <p className="text-graphite text-xs font-light">
                Week {weekData.weekNumber} · Day {getDayOfYear()} · {weekData.totalWeeks - weekData.weekNumber} weeks left
              </p>
            </div>
          </div>

          {/* Time Left */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Time Left</span>
              </div>
              <p className="text-white text-base sm:text-lg font-light">{getTimeLeftInDay()}</p>
              <p className="text-graphite text-xs font-light mt-1">
                {Math.floor(((time.getHours() * 60 + time.getMinutes()) / 1440) * 100)}% of day complete
              </p>
            </div>
          </div>

          {/* Season */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Season</span>
              </div>
              <p className="text-white text-base sm:text-lg font-light">{getSeason()}</p>
              <p className="text-graphite text-xs font-light mt-1">
                Spring in {90 - getDayOfYear()} days
              </p>
            </div>
          </div>

          {/* Second Row: Daylight + Month + Temp + Weather */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-2xl p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Daylight</span>
              </div>
              <p className="text-silver text-lg font-light">{weather.dayLength}</p>
              <p className="text-graphite text-xs font-light mt-1">
                ↑ {weather.sunrise} · ↓ {weather.sunset}
              </p>
            </div>
          </div>

          {/* Month Progress */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-2xl p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Month</span>
              </div>
              <p className="text-silver text-lg font-light">
                {Math.floor((time.getDate() / new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate()) * 100)}%
              </p>
              <p className="text-graphite text-xs font-light mt-1">
                {new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate() - time.getDate()} days left
              </p>
            </div>
          </div>

          {/* Temperature */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-2xl p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Temp</span>
              </div>
              <p className="text-silver text-lg font-light">{Math.round(weather.temp)}°C</p>
              <p className="text-graphite text-xs font-light mt-1">
                H: {weather.high}° · L: {weather.low}° · {weather.humidity}% humidity
              </p>
            </div>
          </div>

          {/* Weather */}
          <div className="aureon-glow-hover">
            <div className="bg-charcoal-light/30 backdrop-blur-xl rounded-2xl p-4 border border-graphite-dark/20 shadow-charcoal-soft h-full">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="w-4 h-4 text-silver-muted" strokeWidth={1.5} />
                <span className="text-graphite-light text-xs font-light uppercase tracking-wide">Weather</span>
              </div>
              <p className="text-silver text-lg font-light">{weather.conditions}</p>
              <p className="text-graphite text-xs font-light mt-1">
                Wind {weather.wind} mph · Visibility {weather.visibility} mi
              </p>
            </div>
          </div>

        </div>

        {/* Hourcast Branding */}
        <div className="mt-6">
          <p className="text-graphite-dark/40 text-xs font-light tracking-[0.3em] uppercase">
            Hourcast
          </p>
        </div>

      </div>
    </div>
  );
};

export default Hourcast;