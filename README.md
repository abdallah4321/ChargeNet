# ChargeNet 🔌

ChargeNet is a comprehensive Electric Vehicle (EV) charging station management system that enables drivers to find, book, and pay for charging sessions while allowing station owners to manage their charging infrastructure efficiently.

## Features ⚡

- **User Management**
  - Multi-role system (Driver, Owner, SuperAdmin)
  - Secure authentication and authorization
  - Profile management with user images

- **Station Management**
  - Real-time station status monitoring
  - Unit management and maintenance tracking
  - Comprehensive station details and availability

- **Booking System**
  - Automated scheduling system
  - Real-time booking management
  - Charge session reminders

- **Payment Integration**
  - Secure payment processing through Paymob
  - Payment history tracking
  - Automated payment handling

- **Reporting**
  - Daily and monthly automated reports
  - Custom report generation
  - Performance analytics

## Technology Stack

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt for password hashing
- **Task Scheduling:** Agenda.js
- **Email Service:** Nodemailer
- **HTTP Client:** Axios for API integrations
- **Logging:** Morgan for HTTP request logging, Winston for application logging
- **Containerization:** Docker and Docker Compose
- **API Security:**
  - Helmet for HTTP headers security
  - Express Rate Limit for API rate limiting
  - CORS enabled
  - Request validation with Joi
- **Development Tools:**
  - ESLint for code linting
  - Prettier for code formatting
  - Nodemon for development auto-reload
  - Postman for API testing and documentation

## Prerequisites 📋

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager
- Docker and Docker Compose (optional, for containerized deployment)
- Postman (for testing APIs and accessing the collection)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abdallah4321/ChargeNet.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   PAYMOB_API_KEY=your_paymob_api_key
   ```

4. Start the development server:

   ```bash
   # Using npm
   npm run dev

   # Using Docker
   docker-compose up
   ```

5. Import the Postman Collection:
   - Open Postman
   - Click on "Import"
   - Select the `ChargeNet.postman_collection.json` file from the project root
   - You now have access to all API endpoints for testing

## Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm start`: Start the production server
- `npm run seed`: Seed the database with initial data
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues
- `npm run format`: Format code with Prettier

## API Documentation 📚

The API is organized around REST principles. It accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.

### Base URL

```
http://localhost:3000/api/v1
```

For detailed API documentation, please refer to our API documentation (coming soon).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@chargenet.com or join our Slack channel.

---

by Eng/Abdallah ramadan salem
