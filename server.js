const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Serve static files with caching headers
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Rate limiting (simple implementation)
const rateLimit = {};
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (rateLimit[ip]) {
    const timeSinceLastRequest = now - rateLimit[ip].timestamp;
    if (timeSinceLastRequest < 1000) { // 1 second
      rateLimit[ip].count++;
      if (rateLimit[ip].count > 10) {
        return res.status(429).json({ error: 'Too many requests' });
      }
    } else {
      rateLimit[ip].count = 1;
    }
  } else {
    rateLimit[ip] = { count: 1 };
  }
  rateLimit[ip].timestamp = now;
  next();
});

// Travel Services API Endpoints
const travelServices = {
  flights: [
    { id: 1, from: 'Dhaka', to: 'Dubai', price: 699, airline: 'Emirates' },
    { id: 2, from: 'Dhaka', to: 'Singapore', price: 799, airline: 'Singapore Airlines' },
    { id: 3, from: 'Dhaka', to: 'Malaysia', price: 599, airline: 'Malaysia Airlines' }
  ],
  hotels: [
    { id: 1, name: 'Luxury Palace Dubai', location: 'Dubai', price: 200, rating: 5 },
    { id: 2, name: 'Marina Bay Sands', location: 'Singapore', price: 300, rating: 5 },
    { id: 3, name: 'Kuala Lumpur Suites', location: 'Malaysia', price: 150, rating: 4 }
  ],
  transfers: [
    { id: 1, type: 'Luxury Sedan', location: 'Dubai', price: 50 },
    { id: 2, type: 'Premium SUV', location: 'Singapore', price: 60 },
    { id: 3, type: 'Business Van', location: 'Malaysia', price: 45 }
  ]
};

// Search Flights
app.post('/api/flights/search', (req, res) => {
  const { from, to, date } = req.body;
  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const availableFlights = travelServices.flights.filter(
    flight => flight.from.toLowerCase() === from.toLowerCase() &&
             flight.to.toLowerCase() === to.toLowerCase()
  );
  res.json({ flights: availableFlights });
});

// Search Hotels
app.post('/api/hotels/search', (req, res) => {
  const { location, checkIn, checkOut, guests } = req.body;
  if (!location || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const availableHotels = travelServices.hotels.filter(
    hotel => hotel.location.toLowerCase() === location.toLowerCase()
  );
  res.json({ hotels: availableHotels });
});

// Book Airport Transfer
app.post('/api/transfers/book', (req, res) => {
  const { location, type, date } = req.body;
  if (!location || !type || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const availableTransfers = travelServices.transfers.filter(
    transfer => transfer.location.toLowerCase() === location.toLowerCase()
  );
  res.json({ transfers: availableTransfers });
});

// Get Travel Package
app.post('/api/packages/search', (req, res) => {
  const { destination, duration, budget } = req.body;
  if (!destination || !duration || !budget) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const flight = travelServices.flights.find(
    f => f.to.toLowerCase() === destination.toLowerCase()
  );
  const hotel = travelServices.hotels.find(
    h => h.location.toLowerCase() === destination.toLowerCase()
  );
  const transfer = travelServices.transfers.find(
    t => t.location.toLowerCase() === destination.toLowerCase()
  );
  
  if (flight && hotel && transfer) {
    const totalPrice = flight.price + (hotel.price * duration) + transfer.price;
    if (totalPrice <= budget) {
      res.json({
        package: {
          flight,
          hotel,
          transfer,
          duration,
          totalPrice
        }
      });
    } else {
      res.json({ message: 'No packages found within your budget' });
    }
  } else {
    res.json({ message: 'No packages available for this destination' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Login endpoint with basic validation
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // TODO: Implement proper authentication
  res.json({ success: true });
});

// Protected admin dashboard route
app.get('/admin-dashboard', (req, res) => {
  // TODO: Add proper authentication middleware
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // TODO: Implement proper session management
  res.json({ success: true });
});

// Contact form endpoint with validation
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  // TODO: Implement email sending
  res.json({ success: true, message: 'Thank you for contacting us! We will get back to you soon.' });
});

// Application submission endpoint with validation
app.post('/apply', (req, res) => {
  const { name, passport, visaType } = req.body;
  if (!name || !passport || !visaType) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // TODO: Implement application processing
  res.json({ 
    success: true, 
    message: 'Your application has been received!',
    applicationId: Math.random().toString(36).substring(2, 15)
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 