// ✅ Load states
window.onload = function () {
  fetch('https://csumb.space/api/allStatesAPI.php')
    .then(response => response.json())
    .then(states => {
      const stateDropdown = document.getElementById('state');
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.usps;
        option.textContent = state.state;
        stateDropdown.appendChild(option);
      });
    })
    .catch(error => console.error("Error loading states:", error));
};

// ✅ ZIP Code lookup
document.getElementById('zip').addEventListener('blur', function () {
  const zip = this.value.trim();

  fetch(`https://api.api-ninjas.com/v1/zipcode?zip=${zip}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': 'dEnCT9ll6bRONnPUbN2IUw==la0JdIZ4JVAppMos'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const location = data[0];
        const lat = location.latitude;
        const lon = location.longitude;

        document.getElementById('city').value = location.city;
        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lon;

        // Set state dropdown
        const stateDropdown = document.getElementById('state');
        stateDropdown.value = location.state;
        stateDropdown.dispatchEvent(new Event('change'));

        // ✅ Now get county from lat/lon using FCC API
        fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`)
          .then(res => res.json())
          .then(fccData => {
            const countyName = fccData.County.name;

            // Wait a moment to let state dropdown populate counties
            setTimeout(() => {
              const countyDropdown = document.getElementById('county');
              for (let i = 0; i < countyDropdown.options.length; i++) {
                if (countyDropdown.options[i].text === countyName) {
                  countyDropdown.selectedIndex = i;
                  break;
                }
              }
            }, 300); // Delay to wait for county list update

          }).catch(() => alert("County lookup failed"));
      } else {
        alert("No location found for ZIP code.");
      }
    })
    .catch(error => {
      console.error("ZIP API error:", error);
      alert("Error fetching location details.");
    });
});


// ✅ Manual county data by state code
const countiesByState = {
  CA: ["Alameda", "Fresno", "Los Angeles", "Orange", "Riverside", "Sacramento", "San Bernardino", "San Diego", "San Francisco", "Santa Clara", "Ventura"],
  TX: ["Bexar", "Collin", "Dallas", "Harris", "Tarrant", "Travis", "Williamson"],
  NY: ["Albany", "Bronx", "Erie", "Kings", "Monroe", "New York", "Queens", "Richmond", "Suffolk", "Westchester"],
  FL: ["Broward", "Duval", "Hillsborough", "Miami-Dade", "Orange", "Palm Beach", "Pinellas"],
  IL: ["Cook", "DuPage", "Kane", "Lake", "Will"]
};

// ✅ County from State
// ✅ Update counties manually when a state is selected
document.getElementById('state').addEventListener('change', function () {
  const selectedState = this.value;
  const countyDropdown = document.getElementById('county');

  countyDropdown.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.textContent = 'Select a county';
  placeholder.disabled = true;
  placeholder.selected = true;
  countyDropdown.appendChild(placeholder);

  const counties = countiesByState[selectedState];

  if (!counties) {
    const option = document.createElement('option');
    option.textContent = 'No counties found';
    countyDropdown.appendChild(option);
    return;
  }

  counties.forEach(county => {
    const option = document.createElement('option');
    option.value = county;
    option.textContent = county;
    countyDropdown.appendChild(option);
  });
});


    

// ✅ Username availability
document.getElementById('username').addEventListener('blur', function () {
  const username = this.value;
  const msg = document.getElementById('usernameMessage');
  if (username.length < 4) {
    msg.textContent = "Username too short";
    msg.style.color = "red";
  } else {
    msg.textContent = "Username available";
    msg.style.color = "green";
  }
});

// ✅ Suggested password
document.getElementById('password').addEventListener('focus', function () {
  fetch('https://webspace.csumb.edu/~lara4594/ajax/suggestedPwd.php?length=8')
    .then(response => response.text())
    .then(password => {
      document.getElementById('suggestedPwd').textContent = `Suggested: ${password}`;
    });
});

// ✅ Form submission
document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const pwd = document.getElementById('password').value;
  const rePwd = document.getElementById('retypePassword').value;

  if (pwd.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (pwd !== rePwd) {
    alert("Passwords do not match");
    return;
  }

  window.location.href = "welcome.html";
});
