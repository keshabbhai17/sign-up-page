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
  const zipMessage = document.getElementById('zipMessage');

  fetch(`https://api.api-ninjas.com/v1/zipcode?zip=${zip}`, {
    headers: { 'X-Api-Key': 'dEnCT9ll6bRONnPUbN2IUw==la0JdIZ4JVAppMos' }
  })
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) throw new Error("No data for ZIP");

    const location = data[0];
    const lat = location.latitude;
    const lon = location.longitude;
    const city = location.city;
    const state = location.state;

    // Fill city, lat, lon
    document.getElementById('city').value = city;
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;

    // Select state in dropdown
    const stateDropdown = document.getElementById('state');
    stateDropdown.value = state;
    stateDropdown.dispatchEvent(new Event('change'));

    // ✅ Now fetch county using FCC API
    return fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lon}&format=json`);
  })
  .then(response => response.json())
  .then(fccData => {
    const countyName = fccData.County?.name;
    if (!countyName) throw new Error("County not found");

    const countyDropdown = document.getElementById('county');
    for (let option of countyDropdown.options) {
      if (option.value === countyName || option.textContent === countyName) {
        option.selected = true;
        return;
      }
    }

    // If not found in dropdown, add and select it manually
    const option = document.createElement('option');
    option.value = countyName;
    option.textContent = countyName;
    option.selected = true;
    countyDropdown.appendChild(option);
  })
  .catch(error => {
    console.error("ZIP/County lookup failed:", error);
    alert("Failed to fetch location or county details.");
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
