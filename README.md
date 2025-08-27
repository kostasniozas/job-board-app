# job-board-app
React Job Board Application

# JobBoard - Full Stack Job Portal Application

A comprehensive job board platform built with React frontend and Node.js backend, featuring separate dashboards for employers and job seekers.

## Project Status

**Current Version:** 2.0 - Backend Integration Complete  
**Progress:** 75% Complete  
**Last Updated:** August 26, 2025

## What's New in Version 2.0

### Major Updates
- **Real Authentication System** - Replaced mock data with MongoDB backend
- **API Integration** - Frontend now communicates with Node.js/Express server
- **Database Persistence** - User data and jobs stored in MongoDB
- **Session Management** - Secure login sessions with bcrypt password hashing
- **Professional Error Handling** - User-friendly error messages and validation

### Technical Improvements
- Complete frontend-backend separation
- RESTful API design
- CORS configuration for development
- Standardized English messaging
- Scalable architecture ready for deployment

## Features

### Authentication System
- User registration (Employer/Job Seeker)
- Secure login with password validation
- Persistent sessions with cookies
- Automatic dashboard routing based on user type
- Profile completion workflows

### Employer Dashboard
- Job posting management
- Candidate applications review
- Interactive interview system with video review
- Analytics dashboard with performance metrics
- Company profile management

### Job Seeker Dashboard
- Advanced job search with filters
- Job application tracking with timeline
- Saved jobs management
- Professional profile editing (5-tab system)
- Application status monitoring

## Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for development and building
- **CSS3** with CSS variables
- **Lucide React** for icons
- **Responsive Design** (mobile-first)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with native driver
- **bcrypt** for password hashing
- **express-session** for session management
- **express-validator** for input validation
- **helmet** + **express-rate-limit** for security

### Database
- **MongoDB** with collections: users, jobs, sessions
- **Indexes** for performance optimization
- **Session storage** in MongoDB
- **Data validation** and constraints

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kostasniozas/job-board-app.git
   cd job-board-app
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info
- `GET /api/auth/check` - Session status

### Jobs Management
- `GET /api/jobs` - List all jobs (public)
- `POST /api/jobs` - Create job (employer only)
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs/my-jobs` - Employer's jobs
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)

### User Profiles
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jobboard
SESSION_SECRET=your-super-secret-key-change-this-in-production
SESSION_MAX_AGE=86400000
```

## Development Workflow

### Current Working Features
- User registration and login
- Dashboard routing (employer vs job seeker)
- Session persistence
- User data storage in MongoDB
- Job creation API (backend ready)

### In Development
- Job posting from frontend
- Job listing integration
- Application system
- Profile management
- File uploads

### Planned Features
- Email notifications
- Advanced search and filtering
- Real-time updates
- Payment integration for premium features
- Mobile app (React Native)

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  userType: String ('employer' | 'jobSeeker'),
  profile: {
    // Job Seeker fields
    firstName: String,
    lastName: String,
    skills: [String],
    experience: [Object],
    // Employer fields  
    companyName: String,
    industry: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  salary: Number,
  company: ObjectId (ref: Users),
  status: String ('active' | 'closed'),
  applications: [ObjectId],
  createdAt: Date
}
```

## Testing

### Manual Testing
1. Register new employer account
2. Login and access employer dashboard
3. Register job seeker account
4. Test dashboard switching
5. Verify data persistence in MongoDB

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","userType":"employer"}'
```

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB Atlas setup
- [ ] Frontend build optimization
- [ ] API security hardening
- [ ] Domain and SSL setup
- [ ] Error monitoring
- [ ] Backup strategy

### Recommended Platforms
- **Frontend:** Netlify, Vercel
- **Backend:** Heroku, Railway, DigitalOcean
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary, AWS S3

## Contributing

### Development Process
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Style
- Use meaningful variable names
- Comment complex logic
- Follow React best practices
- Maintain consistent CSS naming
- Write descriptive commit messages

## Architecture Decisions

### Why This Stack?
- **React**: Component-based UI, excellent developer experience
- **Node.js**: JavaScript everywhere, fast development cycle
- **MongoDB**: Flexible schema, excellent for rapid prototyping
- **Session-based auth**: Simpler than JWT for this use case
- **Express**: Minimal, flexible, well-documented

### Design Patterns
- **Component separation**: Reusable, maintainable frontend
- **API service layer**: Centralized backend communication
- **RESTful design**: Standard, predictable API structure
- **Error boundaries**: Graceful error handling
- **Responsive first**: Mobile-friendly from the start

## License

MIT License - see LICENSE file for details

## Contact

**Developer:** Kostas Niozas  
**Email:** orfeasmarkos@gmail.com  
**GitHub:** https://github.com/kostasniozas

---

**Ready for production deployment and advanced feature development!**