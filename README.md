# Visa Portal

A modern visa application portal built with Node.js, Express, and Bootstrap.

## Features

- Modern, responsive design
- User-friendly visa application process
- Application status tracking
- Admin dashboard
- Contact form
- Multi-country visa support
- Interactive UI with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd visa-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
visa-portal/
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # Client-side JavaScript
├── images/                # Image assets
├── flags/                 # Country flag images
├── server.js             # Express server
├── package.json          # Project dependencies
└── *.html                # HTML pages
```

## API Endpoints

- POST `/login` - User authentication
- GET `/admin-dashboard` - Admin dashboard access
- POST `/logout` - User logout
- POST `/contact` - Contact form submission
- POST `/apply` - Visa application submission

## Security Features

- CORS protection
- Rate limiting
- Security headers
- XSS protection
- Input validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## TODO

- [ ] Implement proper authentication system
- [ ] Add email functionality for notifications
- [ ] Implement proper session management
- [ ] Add database integration
- [ ] Add file upload functionality for documents
- [ ] Implement proper application processing
- [ ] Add user dashboard
- [ ] Add payment integration 