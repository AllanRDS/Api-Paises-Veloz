const regionSubregionMap = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Caribbean", "Central America", "South America", "North America"],
  Asia: ["Central Asia", "East Asia", "South-Eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"]
};

let allCountries = [];
const countriesContainer = document.getElementById('countries');
const countriesPerPage = 20;
let currentPage = 0;

async function fetchCountries() {
  try {
      const response = await fetch('https://restcountries.com/v3.1/all');

      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

      allCountries = await response.json();
      saveCountriesToLocalStorage();
      populateRegions();
      displayCountries();
      addEventListeners();
      window.addEventListener('scroll', handleScroll);
  } catch (error) {
      console.error('Erro ao buscar países:', error);
  }
}

function saveCountriesToLocalStorage() {
  localStorage.setItem('countries', JSON.stringify(allCountries));
}

function addEventListeners() {
  document.getElementById('region').addEventListener('change', (event) => {
      populateSubregions(event.target.value);
      resetFilters();
  });

  document.getElementById('subregion').addEventListener('change', resetFilters);
  document.getElementById('population').addEventListener('change', resetFilters);
  document.getElementById('sortBy').addEventListener('change', resetFilters);
  document.getElementById('search').addEventListener('input', resetFilters);
}

function populateRegions() {
  const regionSelect = document.getElementById('region');
  regionSelect.innerHTML = '<option value="">Selecione uma Região</option>';
  Object.keys(regionSubregionMap).forEach(region => {
      regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
  });
}

function populateSubregions(region) {
  const subregionSelect = document.getElementById('subregion');
  subregionSelect.innerHTML = '<option value="">Selecione uma Sub-região</option>';
  subregionSelect.disabled = !region;

  if (region) {
      regionSubregionMap[region].forEach(subregion => {
          subregionSelect.innerHTML += `<option value="${subregion}">${subregion}</option>`;
      });
  }
}

function displayCountries() {
  const filteredCountries = filterCountries(allCountries);
  const sortedCountries = sortCountries(filteredCountries);
  const paginatedCountries = sortedCountries.slice(currentPage * countriesPerPage, (currentPage + 1) * countriesPerPage);

  paginatedCountries.forEach(country => {
      const countryDiv = createCountryDiv(country);
      countriesContainer.appendChild(countryDiv);
  });
}

function createCountryDiv(country) {
  const countryDiv = document.createElement('div');
  countryDiv.classList.add('country');
  countryDiv.addEventListener('click', () => {
      localStorage.setItem("selectedCountry", country.name.common);
      window.location.href = "country-details.html";
  });

  countryDiv.innerHTML = `
      <img src="${country.flags.png}" alt="Bandeira de ${country.name.common}">
      <h3>${country.name.common}</h3>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Região:</strong> ${country.region}</p>
      <p><strong>Sub-região:</strong> ${country.subregion}</p>
      <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Área:</strong> ${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</p>
  `;

  return countryDiv;
}

function filterCountries(countries) {
  const selectedRegion = document.getElementById('region').value;
  const selectedSubregion = document.getElementById('subregion').value;
  const selectedPopulation = document.getElementById('population').value;
  const searchTerm = document.getElementById('search').value.toLowerCase();

  return countries.filter(country => {
      return (
          (selectedRegion ? country.region === selectedRegion : true) &&
          (selectedSubregion ? country.subregion === selectedSubregion : true) &&
          checkPopulation(country.population, selectedPopulation) &&
          country.name.common.toLowerCase().includes(searchTerm)
      );
  });
}

function checkPopulation(population, range) {
  switch (range) {
      case 'lessThan1M': return population < 1000000;
      case '1Mto10M': return population >= 1000000 && population < 10000000;
      case '10Mto100M': return population >= 10000000 && population < 100000000;
      case 'moreThan100M': return population >= 100000000;
      default: return true;
  }
}

function sortCountries(countries) {
  const sortBy = document.getElementById('sortBy').value;

  const compareFunctions = {
      nameAsc: (a, b) => a.name.common.localeCompare(b.name.common),
      nameDesc: (a, b) => b.name.common.localeCompare(a.name.common),
      populationAsc: (a, b) => a.population - b.population,
      populationDesc: (a, b) => b.population - a.population,
      areaAsc: (a, b) => (a.area || 0) - (b.area || 0),
      areaDesc: (a, b) => (b.area || 0) - (a.area || 0)
  };

  return countries.sort(compareFunctions[sortBy]);
}

function resetFilters() {
  currentPage = 0;
  countriesContainer.innerHTML = '';
  displayCountries();
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      currentPage++;
      displayCountries();
  }
}

window.onload = fetchCountries;
