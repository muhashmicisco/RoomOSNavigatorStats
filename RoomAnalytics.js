import xapi from 'xapi';

// Replace 'yourButtonWidgetId' with the actual WidgetId of your UI panel button
const buttonWidgetId1 = 'Temp01';
const buttonWidgetId2 = 'Hum01';
const buttonWidgetId3 = 'TVOC01';

// Replace 'Status/SomeStatusPath' with the actual xStatus path you want to show
const statusPath1 = 'Peripherals ConnectedDevice[1002] RoomAnalytics AmbientTemperature'; // Temperature in Celsius
const statusPath2 = 'Peripherals ConnectedDevice[1002] RoomAnalytics RelativeHumidity'; // Humidity percentage
const statusPath3 = 'Peripherals ConnectedDevice[1002] RoomAnalytics AirQuality Index'; // TVOC index

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to show popup with the status value
function showStatusPopup(value) {
  xapi.command('UserInterface Message Prompt Display', {
    Title: 'Current Status',
    Text: `Status value: ${value}`,
    Duration: 5, // seconds
  });
}

// Event handler for button press
function onButtonPressed(event) {
  if (event.WidgetId === buttonWidgetId1 && event.Type === 'clicked') {
    // Get the current temperature value in Celsius
    xapi.status.get(statusPath1)
      .then((statusValue) => {
        const tempCelsius = parseFloat(statusValue);
        if (!isNaN(tempCelsius)) {
          const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
          let tempStatus = '';
          if (tempFahrenheit > 80) {
            tempStatus = " - Too Hot";
          } else if (tempFahrenheit < 70) {
            tempStatus = " - To Cold";
          }
          showStatusPopup(`${tempCelsius.toFixed(1)}°C = ${tempFahrenheit.toFixed(1)}°F${tempStatus}`);
        } else {
          showStatusPopup('Temperature value is not a valid number');
        }
      })
      .catch((error) => {
        console.error('Error getting status:', error);
      });
  }
  else if (event.WidgetId === buttonWidgetId2 && event.Type === 'clicked') {
    // Get the current humidity value
    xapi.status.get(statusPath2)
      .then((statusValue) => {
        const humidity = parseFloat(statusValue);
        if (!isNaN(humidity)) {
          let humidityStatus = '';
          if (humidity > 50) {
            humidityStatus = " - Too Humid";
          } else if (humidity < 30) {
            humidityStatus = " - Too dry";
          } else humidityStatus = " - OK";
          showStatusPopup(`${humidity.toFixed(1)}%${humidityStatus}`);
        } else {
          showStatusPopup('Humidity value is not a valid number');
        }
      })
      .catch((error) => {
        console.error('Error getting status:', error);
      });
  }
  else if (event.WidgetId === buttonWidgetId3 && event.Type === 'clicked') {
    // Get the current TVOC index value
    xapi.status.get(statusPath3)
      .then((statusValue) => {
        const tvoc = parseFloat(statusValue);
        if (!isNaN(tvoc)) {
          let tvocStatus = '';
          if (tvoc < 3) {
            tvocStatus = " - AQ Good";
          } else if (tvoc === 3) {
            tvocStatus = " - AQ OK";
          } else if (tvoc > 3 && tvoc <= 4) {
            tvocStatus = " - AQ OK";
          } else if (tvoc > 4) {
            tvocStatus = " - AQ Bad";
          }
          showStatusPopup(`${tvoc.toFixed(1)}${tvocStatus}`);
        } else {
          showStatusPopup('TVOC value is not a valid number');
        }
      })
      .catch((error) => {
        console.error('Error getting status:', error);
      });
  }
}

// Register event listener for UI panel button actions
xapi.event.on('UserInterface Extensions Widget Action', onButtonPressed);
