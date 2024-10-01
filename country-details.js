async function loadCountryDetails() {
    const countryName = localStorage.getItem("selectedCountry");

    if (!countryName) {
        console.error("Nenhum país selecionado.");
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

        const countryData = await response.json();
        const country = countryData[0];

        document.getElementById("country-name").innerText = country.name.common;
        document.getElementById("country-flag").src = country.flags.svg;
        document.getElementById("capital").innerText = country.capital ? country.capital[0] : "N/A";
        document.getElementById("region").innerText = country.region;
        document.getElementById("subregion").innerText = country.subregion;
        document.getElementById("population").innerText = country.population.toLocaleString();
        document.getElementById("area").innerText = country.area ? country.area.toLocaleString() + " km²" : "N/A";
        document.getElementById("languages").innerText = Object.values(country.languages || {}).join(", ") || "N/A";
        document.getElementById("currency").innerText = Object.values(country.currencies || {}).map(curr => curr.name).join(", ") || "N/A";
        document.getElementById("timezone").innerText = country.timezones.join(", ") || "N/A";
        document.getElementById("tld").innerText = country.tld ? country.tld.join(", ") : "N/A";
        document.getElementById("dial-code").innerText = country.callingCodes ? country.callingCodes.join(", ") : "N/A";
    } catch (error) {
        console.error('Erro ao buscar detalhes do país:', error);
    }
}

document.getElementById("backButton").addEventListener("click", function() {
    window.location.href = "index.html";
});

loadCountryDetails();
