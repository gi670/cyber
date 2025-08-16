# RIT CyberGuard Website

A modern, responsive website for the RIT CyberGuard cybersecurity club at Ramco Institute of Technology, Rajapalayam.

## 🚀 Features

- **Modern Dark Theme**: Cyber-inspired design with RIT Orange and Cyber Blue color scheme
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Dynamic content loading, smooth animations, and form handling
- **Accessibility**: High contrast support, keyboard navigation, and screen reader friendly
- **Performance Optimized**: Fast loading with smooth animations and transitions

## 📁 File Structure

```
rit-cyberguard-website/
├── index.html                 # Main HTML file
├── css/
│   ├── style.css             # Main stylesheet
│   └── additional-styles.css # Enhanced animations and mobile styles
├── js/
│   └── app.js                # JavaScript functionality
├── README.md                 # This file
└── favicon.ico              # (Add your favicon here)
```

## 🛠️ Setup Instructions

1. **Extract the files** to your web server directory
2. **Add your favicon**: Place your `favicon.ico` file in the root directory
3. **Open in browser**: Open `index.html` in any modern web browser
4. **Customize content**: Edit the data arrays in `js/app.js` to update content

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --color-rit-orange: #F76902;  /* Primary color */
    --color-cyber-blue: #00B4D8;  /* Secondary color */
}
```

### Content
Update arrays in `js/app.js`:
- `teamsData` - Team information
- `activitiesData` - Club activities
- `eventsData` - Upcoming events

### Contact Information
Update contact details in the HTML file:
- Email: `cyberguard@ritrjpm.ac.in`
- Phone: `+91 9489634752`
- Address: North Venganallur Village, Rajapalayam, Tamil Nadu - 626117

## 🎯 Key Sections

1. **Hero Section**: Welcome message with club statistics
2. **About**: Mission and foundation details
3. **Teams**: Red Team, Blue Team, Forensics, Research
4. **Activities**: CTF, Workshops, Industry Talks, etc.
5. **Events**: Upcoming club events and meetings
6. **Achievements**: Club accomplishments and statistics
7. **Resources**: Partnerships and facilities
8. **Join**: Membership information and contact details

## ⚡ Features

### Dynamic Content
- Teams, activities, and events load dynamically from JavaScript
- Easy to update without changing HTML

### Interactive Forms
- Join club application form with validation
- Contact form for inquiries
- Event registration functionality

### Responsive Design
- Mobile-first approach
- Collapsible navigation menu
- Optimized layouts for all screen sizes

### Animations
- Scroll-triggered fade-in effects
- Hover animations on cards
- Smooth navigation scrolling
- Loading placeholders

### Accessibility
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion support for sensitive users
- Screen reader friendly markup

## 🚀 Deployment

### For Local Development:
1. Open `index.html` directly in browser
2. Use a local server for best experience:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

### For Production:
1. Upload files to your web hosting service
2. Ensure all file paths are correct
3. Configure your domain to point to `index.html`

## 📞 Support

For technical support or questions:
- Email: cyberguard@ritrjpm.ac.in
- Phone: +91 9489634752

## 📄 License

© 2025 RIT CyberGuard. All rights reserved.
Designed with ❤️ for cybersecurity education.

---

**Security Through Innovation** 🛡️
