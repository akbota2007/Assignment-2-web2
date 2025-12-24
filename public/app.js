// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const mainContent = document.getElementById('mainContent');

// User Profile Elements
const userImage = document.getElementById('userImage');
const userName = document.getElementById('userName');
const userGender = document.getElementById('userGender');
const userAge = document.getElementById('userAge');
const userDob = document.getElementById('userDob');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userAddress = document.getElementById('userAddress');
const userCity = document.getElementById('userCity');
const userCountry = document.getElementById('userCountry');

// Country Elements
const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const countryCapital = document.getElementById('countryCapital');
const countryLanguages = document.getElementById('countryLanguages');
const countryCurrency = document.getElementById('countryCurrency');
const countryRegion = document.getElementById('countryRegion');
const countryPopulation = document.getElementById('countryPopulation');

// Exchange Rate Elements
const exchangeBase = document.getElementById('exchangeBase');
const rateUSD = document.getElementById('rateUSD');
const rateKZT = document.getElementById('rateKZT');
const exchangeDate = document.getElementById('exchangeDate');

// News Elements
const newsContainer = document.getElementById('newsContainer');

// Event Listener
generateBtn.addEventListener('click', generateRandomUser);

// Main function to generate random user and fetch all data
async function generateRandomUser() {
    showLoading();
    hideError();
    hideContent();

    try {
        // Step 1: Fetch Random User
        const userData = await fetchRandomUser();
        if (!userData) return;

        displayUserData(userData);

        // Step 2: Fetch Country Information
        const countryData = await fetchCountryData(userData.country);
        if (countryData) {
            displayCountryData(countryData);

            // Step 3: Fetch Exchange Rates (using currency from country data)
            if (countryData.currency && countryData.currency !== 'N/A') {
                const exchangeData = await fetchExchangeRate(countryData.currency);
                if (exchangeData) {
                    displayExchangeData(exchangeData);
                }
            }
        }

        // Step 4: Fetch News Headlines
        const newsData = await fetchNews(userData.country);
        displayNews(newsData);

        showContent();
    } catch (error) {
        showError('An unexpected error occurred. Please try again.');
        console.error('Error in generateRandomUser:', error);
    } finally {
        hideLoading();
    }
}

// API Fetch Functions
async function fetchRandomUser() {
    try {
        const response = await fetch('/api/random-user');
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            showError(result.message || 'Failed to fetch user data');
            return null;
        }
    } catch (error) {
        showError('Error connecting to server');
        console.error('Error fetching random user:', error);
        return null;
    }
}

async function fetchCountryData(countryName) {
    try {
        const response = await fetch(`/api/country/${encodeURIComponent(countryName)}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.warn('Country data not available:', result.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching country data:', error);
        return null;
    }
}

async function fetchExchangeRate(currency) {
    try {
        const response = await fetch(`/api/exchange-rate/${currency}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.warn('Exchange rate not available:', result.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}

async function fetchNews(country) {
    try {
        const response = await fetch(`/api/news/${encodeURIComponent(country)}`);
        const result = await response.json();

        if (result.success && result.data) {
            return result.data;
        } else {
            console.warn('News not available:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// Display Functions
function displayUserData(data) {
    userImage.src = data.picture;
    userImage.alt = `${data.firstName} ${data.lastName}`;
    userName.textContent = `${data.firstName} ${data.lastName}`;
    userGender.textContent = capitalizeFirst(data.gender);
    userAge.textContent = `${data.age} years`;
    userDob.textContent = formatDate(data.dateOfBirth);
    userEmail.textContent = data.email;
    userPhone.textContent = data.phone;
    userAddress.textContent = data.address;
    userCity.textContent = data.city;
    userCountry.textContent = data.country;
}

function displayCountryData(data) {
    countryFlag.src = data.flag;
    countryFlag.alt = `${data.name} flag`;
    countryName.textContent = data.name;
    countryCapital.textContent = data.capital;
    countryLanguages.textContent = data.languages;
    countryCurrency.textContent = `${data.currencyName} (${data.currency}) ${data.currencySymbol}`;
    countryRegion.textContent = data.region;
    countryPopulation.textContent = formatNumber(data.population);
}

function displayExchangeData(data) {
    exchangeBase.textContent = `Base Currency: ${data.base}`;
    
    if (data.usdRate !== 'N/A') {
        rateUSD.textContent = `1 ${data.base} = ${parseFloat(data.usdRate).toFixed(2)} USD`;
    } else {
        rateUSD.textContent = 'Rate not available';
    }
    
    if (data.kztRate !== 'N/A') {
        rateKZT.textContent = `1 ${data.base} = ${parseFloat(data.kztRate).toFixed(2)} KZT`;
    } else {
        rateKZT.textContent = 'Rate not available';
    }
    
    exchangeDate.textContent = `Last updated: ${data.date}`;
}

function displayNews(articles) {
    newsContainer.innerHTML = '';

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<div class="no-news">No news articles found for this country.</div>';
        return;
    }

    articles.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';

    const imageContainer = document.createElement('div');
    if (article.image) {
        const img = document.createElement('img');
        img.src = article.image;
        img.alt = article.title;
        img.className = 'news-image';
        img.onerror = function() {
            this.parentElement.innerHTML = '<div class="news-placeholder">No Image</div>';
        };
        imageContainer.appendChild(img);
    } else {
        imageContainer.innerHTML = '<div class="news-placeholder">No Image</div>';
    }

    const content = document.createElement('div');
    content.className = 'news-content';

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = article.title;

    const description = document.createElement('p');
    description.className = 'news-description';
    description.textContent = article.description;

    const meta = document.createElement('div');
    meta.className = 'news-meta';
    meta.innerHTML = `
        <span>Source: ${article.source}</span>
        <span>${formatDate(article.publishedAt)}</span>
    `;

    const link = document.createElement('a');
    link.href = article.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'news-link';
    link.textContent = 'Read full article →';

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(meta);
    content.appendChild(link);

    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
}

// Utility Functions
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showContent() {
    mainContent.classList.remove('hidden');
}

function hideContent() {
    mainContent.classList.add('hidden');
}

function capitalizeFirst(str) {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (!num && num !== 0) return 'N/A';
    return Number(num).toLocaleString('en-US');
}
