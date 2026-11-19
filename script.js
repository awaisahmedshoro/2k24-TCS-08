const $ = (id) => document.getElementById(id);
let current = { city: "Karachi", country: "Pakistan", temp: 31, feels: 34, humidity: 62, wind: 14, code: 0 };
let unit = "c";
const weatherText = code => code===0?"Clear sky":code<=2?"Partly cloudy":code===3?"Cloudy":code<=48?"Foggy":code<=67?"Rain":code<=77?"Snow":code<=82?"Rain showers":code<=86?"Snow showers":code<=99?"Thunderstorm":"Weather";
const weatherIcon = code => code===0?"☀️":code<=2?"🌤️":code===3?"☁️":code<=48?"🌫️":code<=67?"🌧️":code<=77?"❄️":code<=82?"🌦️":code<=86?"🌨️":"⛈️";
function displayTemp(c){return unit==="c"?Math.round(c):Math.round(c*9/5+32)}
function updateUI(){
  $("locationName").textContent=`${current.city}, ${current.country}`;
  $("heroCity").textContent=current.city;
  $("heroDate").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  $("currentTemp").textContent=displayTemp(current.temp);
  $("condition").textContent=weatherText(current.code);
  $("feelsLike").textContent=`${displayTemp(current.feels)}°${unit.toUpperCase()}`;
  $("humidity").textContent=current.humidity+"%"; $("wind").textContent=current.wind+" km/h";
  $("airFeels").textContent=displayTemp(current.feels)+"°"; $("airHumidity").textContent=current.humidity+"%"; $("airWind").textContent=current.wind+" km/h";
  $("resultCity").textContent=`${current.city}, ${current.country}`;
  $("resultWeather").textContent=`${displayTemp(current.temp)}°${unit.toUpperCase()} · ${weatherText(current.code)}`;
  $("defaultLocation").textContent=`${current.city}, ${current.country}`;
  renderForecast();
}
function renderForecast(){
  const hours=[ "Now","10 AM","11 AM","12 PM","1 PM"];
  $("homeHours").innerHTML=hours.map((h,i)=>`<div class="hour-item"><span>${h}</span><span class="weather-icon">${weatherIcon(current.code)}</span><b>${displayTemp(current.temp+i-1)}°</b></div>`).join("");
  $("hourlyList").innerHTML=Array.from({length:12},(_,i)=>`<div class="forecast-row"><span class="time">${i===0?"Now":`${(new Date().getHours()+i)%24}:00`}</span><span class="icon">${weatherIcon(current.code)}</span><span class="desc">${weatherText(current.code)}</span><b>${displayTemp(current.temp+Math.sin(i/2)*3)}°${unit.toUpperCase()}</b></div>`).join("");
  const days=["Today","Tomorrow","Wednesday","Thursday","Friday","Saturday","Sunday"];
  $("weeklyList").innerHTML=days.map((d,i)=>`<div class="weekly-row"><span class="day">${d}</span><span class="icon">${weatherIcon(current.code)}</span><span class="desc">${weatherText(current.code)}</span><span class="temps">${displayTemp(current.temp+Math.cos(i)*3)}° / ${displayTemp(current.temp-4+Math.sin(i)*2)}°</span></div>`).join("");
}
async function searchCity(city){
  if(!city.trim()){ $("searchMessage").textContent="Please enter a city name."; return; }
  $("searchMessage").textContent="Searching for weather…";
  try{
    const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if(!geo.ok) throw new Error("Could not connect to the location service.");
    const gd=await geo.json(); if(!gd.results?.length) throw new Error("City not found. Check the spelling and try again.");
    const place=gd.results[0];
    const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`);
    if(!res.ok) throw new Error("Weather service is unavailable right now.");
    const data=await res.json(), c=data.current;
    current={city:place.name,country:place.country||"",temp:c.temperature_2m,feels:c.apparent_temperature,humidity:c.relative_humidity_2m,wind:c.wind_speed_10m,code:c.weather_code};
    updateUI(); $("searchMessage").textContent="Weather updated successfully."; $("searchResult").style.display="flex";
  }catch(err){$("searchMessage").textContent=err.message+" Showing sample weather until another city is selected.";}
}
function navigate(screen){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===screen));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.screen===screen));
  const titles={home:"Good morning!",hourly:"Hourly forecast",weekly:"Your week ahead",search:"Explore a new place",settings:"Personalize SkyCast"};
  $("screenTitle").textContent=titles[screen]||"SkyCast";
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.screen)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("searchBtn").addEventListener("click",()=>searchCity($("cityInput").value));
$("cityInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchCity($("cityInput").value)});
document.querySelectorAll("[data-city]").forEach(b=>b.addEventListener("click",()=>{$("cityInput").value=b.dataset.city;searchCity(b.dataset.city)}));
$("refreshBtn").addEventListener("click",()=>searchCity(current.city));
document.querySelectorAll("[data-unit]").forEach(b=>b.addEventListener("click",()=>{unit=b.dataset.unit;document.querySelectorAll("[data-unit]").forEach(x=>x.classList.toggle("active",x===b));updateUI()}));
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>{document.body.classList.toggle("dark",b.dataset.theme==="dark");document.querySelectorAll("[data-theme]").forEach(x=>x.classList.toggle("active",x===b))}));
$("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
updateUI();
searchCity("Karachi");

// Simple front-end demo login (does not authenticate with a server).
document.body.classList.add("logged-out");
const loginForm = $("loginForm");
if (loginForm) loginForm.addEventListener("submit", (event) => { event.preventDefault(); const name=$("userName").value.trim(), email=$("userEmail").value.trim(), password=$("userPassword").value; if(!name || !email || password.length<4){$("loginMessage").textContent="Enter your name, a valid email and a password of at least 4 characters.";return;} const firstName=name.split(/\s+/)[0]; $("profileName").textContent=name; $("profileAvatar").textContent=firstName.charAt(0).toUpperCase(); document.body.classList.remove("logged-out"); navigate("home"); $("screenTitle").textContent=`Welcome, ${firstName}!`; });
$("logoutBtn")?.addEventListener("click",()=>{document.body.classList.add("logged-out");document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$("login").classList.add("active");$("loginForm").reset();$("loginMessage").textContent="You have logged out. Sign in again to continue.";});
