class EsriHelper
{
  static async getFields()
  {
    let apiResponse = JSON.parse(await httpGet(baseURL));
    return apiResponse.Fields;
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.response);
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        reject();
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }).then((response) => { return response }).catch(() => { return null; });
}

function getRandomRadius() {
  return parseInt(Math.random()*25000);
}

function displayLastPlaces() {
  document.getElementById("lastPlaces").style.width = "25%";
}

function closePlaces() {
  document.getElementById("lastPlaces").style.width = "0%";
}

function createMarker(myMap) {
  L.marker([22.006361213108, -102.362021302610]).addTo(myMap);
}

function createCircle(myMap, x, y) {
  console.log(y, x);
  var circle = L.circle([y, x], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: getRandomRadius()
  }).addTo(myMap);
  circle.addEventListener('click', function () {
    document.querySelector('.testClass').style = "display: block;";
  });
}

async function getInfo(myMap) {
  //let baseURL = "https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/Covid19/FeatureServer/0/query?";
  let baseURL = 'https://services.arcgis.com/CT0bYvH48f1TEH2t/arcgis/rest/services/Covid19/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
  let apiResponse = JSON.parse(await httpGet(baseURL));
  let differenceX = 0;
  let differenceY = 0;
  for (let i = 0; i < apiResponse.features.length; i++) {
    if (i > 1) {
      differenceX = apiResponse.features[i].geometry.x - apiResponse.features[i - 1].geometry.x;
      differenceY = apiResponse.features[i].geometry.y - apiResponse.features[i - 1].geometry.y
    }
    if (i == 0) {
      createCircle(myMap, apiResponse.features[i].geometry.x.toFixed(12), apiResponse.features[i].geometry.y.toFixed(12));
    } else if (differenceX != 0 && differenceY != 0) {
      createCircle(myMap, apiResponse.features[i].geometry.x.toFixed(12), apiResponse.features[i].geometry.y.toFixed(12));
    }
  }
}
