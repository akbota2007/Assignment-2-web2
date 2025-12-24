# Random User Information Dashboard

## 📋 Project Overview
This application integrates multiple APIs to display comprehensive information about random users, including their personal details, country information, currency exchange rates, and relevant news headlines.

## 🚀 Features
1. **Random User Generator** - Displays user profile with personal and location details
2. **Country Information** - Shows detailed country data including flag, capital, language, and currency
3. **Exchange Rates** - Real-time currency conversion to USD and KZT
4. **News Headlines** - Five latest news articles related to the user's country

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <https://github.com/akbota2007/Assignment-2-web2.git>
cd Assignment-2-web2
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
Create a `.env` file in the root directory:
```
NEWS_API_KEY=your_news_api_key_here
PORT=3000
```

**Getting API Keys:**
- News API: Register at https://newsapi.org/ to get your free API key
- Other APIs used in this project don't require API keys

4. **Run the application**
```bash
npm start
```

5. **Access the application**
Open your browser and navigate to:
```
http://localhost:3000
```

## 🛠 Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: RandomUser API, REST Countries API, ExchangeRate API, News API

## 📁 Project Structure
```
project-root/
│
├── server.js              # Main server file with API endpoints
├── public/
│   ├── index.html        # Frontend HTML structure
│   ├── style.css         # Styling and responsive design
│   └── app.js            # Frontend JavaScript logic
├── .env                  # Environment variables (not in repo)
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔑 API Endpoints

### Backend Endpoints
- `GET /api/random-user` - Fetches random user data
- `GET /api/country/:countryName` - Fetches country information
- `GET /api/exchange-rate/:currency` - Fetches exchange rates
- `GET /api/news/:country` - Fetches news headlines

## 💡 Key Design Decisions

### Server-Side API Calls
All API requests are made on the server side to:
- Protect API keys from exposure
- Handle errors centrally
- Provide consistent data format to frontend
- Enable rate limiting and caching if needed

### Error Handling
- Graceful degradation when API data is unavailable
- User-friendly error messages
- Fallback values for missing data

### Responsive Design
- Mobile-first approach
- Flexbox and CSS Grid for layouts
- Media queries for different screen sizes

### Code Organization
- Separation of concerns (server logic, frontend logic, styling)
- Reusable functions
- Clear variable naming and comments

## 🎨 UI/UX Features
- Clean, modern card-based layout
- Loading indicators during API calls
- Smooth transitions and hover effects
- Accessible color scheme with good contrast
- Responsive design for all devices

## 🔒 Security Considerations
- API keys stored in environment variables
- No sensitive data exposed to frontend
- Input validation on server side
- CORS configured appropriately

## 📝 Usage

1. Click the "Generate Random User" button
2. Wait for all data to load (user info, country details, exchange rates, news)
3. Explore the information displayed in organized sections
4. Click "Generate New User" to fetch another random user

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

**API key errors:**
- Verify your NEWS_API_KEY in .env file
- Ensure no extra spaces or quotes around the key

**No news found:**
- Some countries may have limited English news coverage
- The app will display a message if no news is available

## 📚 Learning Outcomes
- Working with multiple RESTful APIs
- Server-side vs client-side API calls
- Asynchronous JavaScript (async/await, Promises)
- Express.js routing and middleware
- Environment variables and security
- Responsive web design
- Error handling and data validation

## 🔮 Future Enhancements
- Add weather information for user's city
- Implement caching to reduce API calls
- Add user favorites/history feature
- Include more detailed news filtering
- Add animation and loading skeletons

## 👨‍💻 Author
Created as part of Web Development Assignment 2

## 📄 License
This project is for educational purposes.