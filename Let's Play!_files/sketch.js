// Sources: codingTrain, https://editor.p5js.org/Pole/sketches/QdQuBgD9K
// Loading Weather Data from Open Weather Map
// https://www.youtube.com/watch?v=ecT42O6I_WI&list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r&index=6&t=0s
//https://editor.p5js.org/Yyasuda/sketches/mirJqVrpu
//2 Parts: one is for drawing. Another one is mapping soundtrack based on today's weather. We can select different countries too


let bCir;
let angle;
let dAngle;
let rc = 300;
let spiros = [];
let spironum = 5;
let spiroIndex = 0;
let sprInfo = [];
let iDiv;
let grph;
let img;
let fileName;

// Slider and button variables
let redSlider, greenSlider, blueSlider, alphaSlider, thicknessSlider, speedSlider;
let rcSlider, rmSlider, rdSlider;
let removeButton, saveButton, submitCityButton, stopSoundButton;
let cityInput;

// Sound variables
let sunnySound, rainSound, thunderstormSound, cloudySound, snowingSound;
let currentSound;

// OpenWeatherMap API key (replace with your own)
const apiKey = 'APPID=e812164ca05ed9e0344b89ebe273c141'; // Replace with your actual OpenWeatherMap API key

function preload() {
  // Load sound files
  sunnySound = loadSound('sunny.mp3');
  rainSound = loadSound('raining.mp3');
  thunderstormSound = loadSound('thunderstorm.mp3');
  cloudySound = loadSound('cloudy.mp3');
  snowingSound = loadSound('snowing.mp3');
  mistSound = loadSound('mist.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bCir = createVector(width / 2, height / 2);
  dAngle = radians(10);
  grph = createGraphics(width, height);

  // Initialize sliders
  redSlider = select('#redSlider');
  greenSlider = select('#greenSlider');
  blueSlider = select('#blueSlider');
  alphaSlider = select('#alphaSlider');
  thicknessSlider = select('#thicknessSlider');
  speedSlider = select('#speedSlider');
  rcSlider = select('#rcSlider');
  rmSlider = select('#rmSlider');
  rdSlider = select('#rdSlider');

  // Initialize buttons
  removeButton = select('#removeButton');
  saveButton = select('#saveButton');
  submitCityButton = select('#submitCityButton');
  cityInput = select('#cityInput');
  fileName = select('#fileName');
  fileName.elt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveImage();
    }
  });

  removeButton.mousePressed(resetCanvas);
  saveButton.mousePressed(saveImage);
  submitCityButton.mousePressed(playWeatherSound);
  cityInput.elt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      playWeatherSound();
    }
  });

  // Initialize SpiroWheels
  resetSpiroWheels();

  iDiv = createDiv();
  // We removed background(0) here to make the canvas transparent
}

function playWeatherSound() {
  //Stop any currently playing sound
  if (currentSound && currentSound.isPlaying()) {
    currentSound.stop();
  }

  // Get city from input
  let city = cityInput.value().trim();
  city = String(city.replace(/\s/g, "%20"))
  if (!city) {
    iDiv.html("Please enter a city name");
    return;
  }

  // Fetch weather data from OpenWeatherMap
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&${apiKey}`;
  console.log(url);
  loadJSON(url, (json) => {
    if (json.cod !== 200) {
      iDiv.html(`Error: ${json.message} for ${city}`);
      return;
    }


    // Extract weather description
    let weather = json.weather[0].description;

    // Map weather to sound: https://openweathermap.org/weather-conditions
    let soundToPlay;
    if (weather.includes("rain")) {
      soundToPlay = rainSound;
    } else if (weather === "clear sky") {
      soundToPlay = sunnySound;
    } else if (weather === "thunderstorm") {
      soundToPlay = thunderstormSound;
    } else if ((weather.includes("clouds") || weather.includes("overcast")) || weather === "mist") {
      soundToPlay = cloudySound;
    } else if (weather === "mist") {
      soundToPlay = mistSound;
    } else if (weather === "snow") {
      soundToPlay = snowingSound;  
    } else {
      iDiv.html(`No sound mapped for weather: ${weather}`);
      return;
    }

    // Play the sound
    if (soundToPlay) {
      soundToPlay.play();
      soundToPlay.setLoop(true);
      currentSound = soundToPlay;
      iDiv.html(`Playing sound for ${city}: ${weather}`);
    }
  }, (error) => {
    iDiv.html(`Error fetching weather for ${city}`);
  });
}

function resetSpiroWheels() {
  spiros = [];
  sprInfo = [];
  spiroIndex = 0;
  for (let i = 0; i < spironum; i++) {
    let rm = floor(random(rc / 5 * 3, rc / 5 * 4));
    let rd = floor(random(rm / 5 * 2, rm / 5 * 4.8));
    spiros.push(new SpiroWheel(
      rcSlider.value(),
      rmSlider.value(),
      rdSlider.value(),
      0,
      floor(random(360 / spironum * i, 360 / spironum * (i + 1))),
      redSlider.value(),
      greenSlider.value(),
      blueSlider.value(),
      alphaSlider.value(),
      thicknessSlider.value()
    ));
    sprInfo.push([spiros[spiros.length - 1].rm, spiros[spiros.length - 1].rd]);
  }
}

function resetCanvas() {
  // We removed background(0) here as well
  grph = createGraphics(width, height); // Recreate graphics buffer
  resetSpiroWheels(); // Reset SpiroWheels
  loop(); // Restart the draw loop
  iDiv.html(nfc(frameRate(), 2));
}

function saveImage() {
  let name = fileName.value().trim();
  if (!name) {
    iDiv.html("Please enter a file name");
    return;
  }
  // Remove invalid characters (basic sanitization)
  name = name.replace(/[<>:"/\\|?*]/g, '');
  if (!name) {
    iDiv.html("Invalid file name");
    return;
  }
  saveCanvas(name, 'png');

}

function draw() {
  // IMPORTANT: Do not use background() here if you want to see the video.
  // The P5.js canvas is transparent by default and the drawing is layered on top.
  
  //iDiv.html(nfc(frameRate(), 2));
  // Update dAngle based on speed slider
  dAngle = radians(parseFloat(speedSlider.value()));
  push();
  translate(width / 2, height / 2);
  stroke(255); // White circle stroke
  strokeWeight(1);
  noFill();
  circle(0, 0, rcSlider.value() * 2);

  let spr = spiros[spiroIndex];
  spr.move(dAngle);
  spr.updateColor(
    redSlider.value(),
    greenSlider.value(),
    blueSlider.value(),
    alphaSlider.value()
  );
  spr.updateThickness(thicknessSlider.value());
  spr.updateParams(
    rcSlider.value(),
    rmSlider.value(),
    rdSlider.value()
  );
  spr.show();
  noStroke();
  colorMode(RGB);
  fill(0);
  let txt = "";
  if (spr.looped) txt = " - finished";
  //text("c" + spiroIndex + ": rm =" + sprInfo[spiroIndex][0] + ", rd =" + sprInfo[spiroIndex][1] + txt, -width / 2 + 10, -height / 2 + spiroIndex * 20 + 20);

  if (spr.looped) {
    spiroIndex++;
    if (spiroIndex >= spiros.length) {
      noLoop();
      drawResult();
    }
  }
  pop();
}

function drawResult() {
  // We remove the background() here as well so the video remains visible
  // The sketch drawing will remain on the canvas
  img = grph.get(0, 0, grph.width, grph.height);
  image(img, -width / 2, -height / 2);
  grph.remove();

  for (let [i, spr] of spiros.entries()) {
    noStroke();
    colorMode(RGB);
    fill(0);
    text("c" + i + ": rm =" + sprInfo[i][0] + ", rd =" + sprInfo[i][1], -width / 2 + 10, -height / 2 + i * 20 + 20);
  }

  iDiv.html("done");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // We removed background(0) here
}