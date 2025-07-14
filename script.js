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

// --- State dropdown population
window.onload = () => {
  fetch('https://csumb.space/api/allStatesAPI.php')
    .then(res => res.json())
    .then(states => {
      const sd = document.getElementById('state');
      states.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.usps;
        opt.textContent = s.state;
        sd.appendChild(opt);
      });
    })
    .catch(err => console.error('Error loading states:', err));
};

// --- On ZIP blur: fetch location + county
document.getElementById('zip').addEventListener('blur', function () {
  const zip = this.value.trim();
  if (!zip) return;

  // Reset messages
  document.getElementById('zipMessage').textContent = '';
  
  // Zippopotamus or API Ninjas? Using Zippopotam.us here:
  fetch(`https://api.zippopotam.us/us/${zip}`)
    .then(r => {
      if (!r.ok) {
        document.getElementById('zipMessage').textContent = 'Zip code not found';
        throw new Error('ZIP not found');
      }
      return r.json();
    })
    .then(data => {
      const p = data.places[0];
      const { 'place name': city, latitude, longitude } = p;

      document.getElementById('city').value = city;
      document.getElementById('lat').value = latitude;
      document.getElementById('lon').value = longitude;

      const sd = document.getElementById('state');
      const stateAbbr = data['places'][0]['state abbreviation'];
      sd.value = stateAbbr;
      sd.dispatchEvent(new Event('change'));

      return fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${latitude}&longitude=${longitude}&format=json`);
    })
    .then(r => r.json())
    .then(fcc => {
      const county = fcc.County.name;
      const cd = document.getElementById('county');

      for (let i=0; i<cd.options.length; i++) {
        if (cd.options[i].text.includes(county)) {
          cd.selectedIndex = i;
          return;
        }
      }
      // If not found, add it
      const opt = document.createElement('option');
      opt.value = county;
      opt.textContent = county;
      opt.selected = true;
      cd.appendChild(opt);

    })
    .catch(err => console.error('ZIP–county chain failed:', err));
});

// --- Populate counties when state changes (fallback)
document.getElementById('state').addEventListener('change', function () {
  const st = this.value;
  const cd = document.getElementById('county');
  cd.innerHTML = '<option selected disabled>Loading counties…</option>';

  fetch(`https://csumb.space/api/getCountiesAPI.php?state=${st}`)
    .then(r => r.json())
    .then(counties => {
      cd.innerHTML = '';
      counties.forEach(c => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = c;
        cd.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error loading counties:', err);
      cd.innerHTML = '<option>Error loading counties</option>';
    });
});


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

document.getElementById('password').addEventListener('focus', function () {
  fetch('https://webspace.csumb.edu/~lara4594/ajax/suggestedPwd.php?length=8')
    .then(response => response.text())
    .then(password => {
      document.getElementById('suggestedPwd').textContent = `Suggested: ${password}`;
    });
});

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
