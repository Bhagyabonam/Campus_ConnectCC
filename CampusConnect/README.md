# CampusConnect - Event Management System

A comprehensive event management platform designed for educational institutions, featuring role-based access control and streamlined event workflows.

## 🚀 Features

### Role-Based Access Control
- **Student**: View and register for approved events, manage wishlist, track participation history
- **Student Coordinator**: Create, edit, and manage events, track approval status
- **Faculty Coordinator**: Review, approve, or deny event requests with detailed feedback

### Student Dashboard Features
- **Event Discovery**: Browse approved events with advanced filtering
- **Wishlist Management**: Add/remove events to personal wishlist with heart icons
- **Event Registration**: Register for events via Google Form links
- **Event Categories**: Filter by category (Workshop, Cultural, Sports, Academic, Social)
- **Club Filtering**: Filter events by organizing club
- **Status Views**: 
  - Upcoming Events
  - Ongoing Events  
  - Completed Events
  - Wishlisted Events
  - Registered Events
  - Event History

### Student Coordinator Dashboard Features
- **Event Creation**: Create new events with required fields:
  - Event Title
  - Club Name
  - Category
  - Date & Time
  - Venue
  - Google Drive Image Link
  - Google Form Link
  - Description
- **Event Management**: Edit and delete existing events
- **Status Tracking**: Monitor event approval status (Pending, Approved, Denied)
- **Rejection Feedback**: View detailed rejection reasons from faculty
- **Event History**: Track all submitted events with their current status

### Faculty Coordinator Dashboard Features
- **Event Review**: Review all submitted events from student coordinators
- **Approval Workflow**: Approve or deny events with detailed feedback
- **Rejection Management**: Provide specific rejection reasons for denied events
- **Event Cancellation**: Cancel approved events when necessary
- **Advanced Filtering**: Filter events by status, search by title/description/coordinator
- **Bulk Actions**: Perform bulk operations on multiple events

## 🛠️ Technical Implementation

### Data Storage
- **localStorage**: Persistent data storage for events, wishlists, and registrations
- **Event Data Structure**: Comprehensive event objects with all required fields
- **User Sessions**: Secure role-based authentication and session management

### Event Flow Logic
1. **Student Coordinator** creates event → **Faculty Coordinator** reviews
2. **Faculty Coordinator** approves/denies with reason → **Students** see approved events
3. **Students** register via Google Form → **Student Coordinator** manages registrations

### Key Features
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Updates**: Dynamic content updates without page refresh
- **Search & Filter**: Advanced search and filtering capabilities
- **Modal Dialogs**: Intuitive modal interfaces for detailed interactions
- **Notification System**: User-friendly success/error notifications

## 🎯 Demo Accounts

### Student
- **Email**: student@college.edu
- **Password**: Campus123
- **Access**: View and register for approved events

### Student Coordinator  
- **Email**: coordinator@college.edu
- **Password**: Campus123
- **Access**: Create, edit, and submit events for approval

### Faculty Coordinator
- **Email**: faculty@college.edu  
- **Password**: Campus123
- **Access**: Approve or deny event requests

## 📁 File Structure

```
CampusConnect/
├── index.html                 # Landing page with slideshow
├── login.html                 # Authentication page
├── student-dashboard.html     # Student interface
├── student-coordinator-dashboard.html  # Coordinator interface
├── faculty-dashboard.html     # Faculty interface
├── style.css                  # Comprehensive styling
├── script.js                  # Core functionality
└── README.md                  # Documentation
```

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design with smooth animations
- **Color Scheme**: Blue primary (#2563eb) with semantic status colors
- **Typography**: Poppins font family for excellent readability
- **Responsive Grid**: Flexible grid layouts for all screen sizes

### Interactive Elements
- **Hover Effects**: Smooth transitions and visual feedback
- **Status Indicators**: Color-coded event status badges
- **Wishlist Icons**: Heart icons for wishlist management
- **Registration Badges**: Visual indicators for registered events

### Navigation
- **Role-based Menus**: Contextual navigation based on user role
- **Filter Tabs**: Easy switching between different event views
- **Search Functionality**: Real-time search across events
- **Breadcrumb Navigation**: Clear user location awareness

## 🔧 Setup & Usage

1. **Clone/Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Navigate** to the login page
4. **Use** demo credentials to explore different roles
5. **Test** all features across different user roles

## 🚀 Future Enhancements

- **Database Integration**: Replace localStorage with proper database
- **Email Notifications**: Automated email alerts for status changes
- **File Upload**: Direct image upload instead of Google Drive links
- **Advanced Analytics**: Event participation and engagement metrics
- **Mobile App**: Native mobile application development
- **API Integration**: RESTful API for external integrations

## 📝 License

This project is open source and available under the MIT License.

---

**CampusConnect** - Connecting students, coordinators, and faculty through seamless event management. 