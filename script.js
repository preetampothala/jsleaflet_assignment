const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form-input-type");
const inputDistance = document.querySelector(".form-input-distance");
const workouts = [];
let mapZoomLevel = 13;
let map;
let mapEvent;
function getPosition() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(loadMap, function () {
      alert("Could not get your position");
    });
}

form.addEventListener("submit", newWorkout);

function loadMap(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

  const coords = [latitude, longitude];
  console.log(coords);
  map = L.map("map").setView(coords, mapZoomLevel);
  console.log(map);
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //   Handling clicks on map
  map.on("click", showForm);

  workouts.forEach((work) => {
    renderWorkoutMarker(work);
  });
}
getPosition();
function showForm(mapE) {
  mapEvent = mapE;
  form.classList.remove("hidden");
  inputDistance.focus();
}

function newWorkout(e) {
  e.preventDefault();
  const { lat, lng } = mapEvent.latlng;
  const type = inputType.value;
  console.log(type);
  const distance = +inputDistance.value;
  if (!Number.isFinite(distance) || !Number(distance) > 0)
    return alert("Inputs have to be positive numbers!");
  const text = `${type} for ${distance}km on ${new Date().toLocaleDateString(
    "en-US"
  )}`.toUpperCase();
  let workoutcontent = {
    wtype: type,
    wdistance: distance,
    wcoords: [lat, lng],
    description: text,
  };
  workouts.push(workoutcontent);
  console.log(workouts);
  // Render workout on map as marker
  renderWorkoutMarker(workoutcontent);
  renderworkout(workoutcontent);
  hideForm();
}
function renderWorkoutMarker(workout) {
  L.marker(workout.wcoords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 300,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.wtype}-popup`,
      })
    )
    .setPopupContent(
      `${workout.wtype === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
    )
    .openPopup();
}
function hideForm() {
  // Empty inputs
  inputDistance.value = "";

  form.style.display = "none";
  form.classList.add("hidden");
  setTimeout(() => (form.style.display = "flex"), 1000);
}
function renderworkout(workout) {
  let html = `
      <li class="workout workout-${workout.wtype}">
        <h2 class="workout-title">${workout.description}</h2>
        <div class="workout-details">
          <span class="workout-icon">${
            workout.wtype === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout-value">${workout.wdistance}</span>
          <span class="workout-unit">km</span>
        </div>
    `;
  form.insertAdjacentHTML("afterend", html);
}
