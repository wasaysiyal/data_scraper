# Google Maps Data Extractor - Modern Dashboard & MongoDB Integration

## Overview

This enhanced version of the Google Maps Data Extractor features a modern, intuitive user interface with significantly improved user experience and visual appeal. The dashboard now includes real-time statistics, advanced data management capabilities, and seamless MongoDB integration for persistent data storage.

## 🎨 New Features

### Modern Dashboard UI
- **Responsive Design**: Fully responsive layout that works on all devices
- **Real-time Statistics**: Live counters for total records, valid emails, phone numbers, and websites
- **Enhanced Data Table**: Improved Tabulator.js integration with sorting, filtering, and pagination
- **Visual Feedback**: Loading spinners, status alerts, and smooth animations
- **Modern Icons**: Font Awesome icons throughout the interface
- **Dark Mode Support**: Automatic dark mode based on system preferences

### MongoDB Integration
- **One-click Database Storage**: Save extracted data directly to MongoDB
- **Flexible Configuration**: Customizable connection strings and collection names
- **Batch Processing**: Efficient handling of large datasets
- **Error Handling**: Graceful fallback to local JSON export
- **Settings Persistence**: MongoDB configuration saved locally

### Enhanced Data Management
- **CSV Export**: Download data in CSV format with improved formatting
- **Excel Export**: Download data in Excel format with custom sheet names
- **Data Refresh**: Real-time data refresh without page reload
- **Local Storage**: Fallback local JSON export when MongoDB unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Chrome Browser (for extension)

### Installation

#### 1. Backend Server Setup
```bash
# Install dependencies
npm install

# Start the MongoDB backend server
npm start
# or for development with auto-reload
npm run dev
```

#### 2. Chrome Extension Setup
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension folder
4. The extension should now be loaded and ready to use

### MongoDB Configuration

#### Local MongoDB
```bash
# Default connection string for local MongoDB
mongodb://localhost:27017/google_maps_data
```

#### MongoDB Atlas (Cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string from the Atlas dashboard
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

#### Using the Dashboard
1. Extract data using the Chrome extension
2. Open the dashboard from the extension popup
3. Click "Save to Database" button
4. Enter your MongoDB connection string and collection name
5. Click "Save to Database" to store your data

## 📊 Dashboard Features

### Statistics Cards
- **Total Records**: Real-time count of all extracted records
- **Valid Emails**: Count of records with valid email addresses
- **Phone Numbers**: Count of records with phone numbers
- **Websites**: Count of records with website URLs

### Data Table Features
- **Sorting**: Click column headers to sort data
- **Filtering**: Use header filters to search specific columns
- **Pagination**: Navigate through large datasets efficiently
- **Selection**: Select individual rows for specific actions
- **Responsive**: Adapts to different screen sizes

### Export Options
- **CSV Export**: Download data as comma-separated values
- **Excel Export**: Download data as Excel spreadsheet
- **JSON Export**: Fallback option for local storage

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/google_maps_data
NODE_ENV=production
```

### MongoDB Settings
The dashboard automatically saves your MongoDB configuration:
- Connection string
- Collection name
- Last used settings

## 🛠️ API Endpoints

### POST /api/save-to-mongodb
Save extracted data to MongoDB database.

**Request Body:**
```json
{
  "connectionString": "mongodb://localhost:27017/mydatabase",
  "collectionName": "google_maps_data",
  "data": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 150 records to MongoDB",
  "insertedCount": 150
}
```

### GET /api/health
Health check endpoint for the backend server.

## 🎯 Usage Examples

### Basic Usage
1. **Extract Data**: Use the Chrome extension to extract Google Maps data
2. **Open Dashboard**: Click the dashboard button in the extension
3. **View Statistics**: Check the real-time stats cards
4. **Save to Database**: Use the "Save to Database" button with MongoDB
5. **Export Data**: Download CSV or Excel files as needed

### Advanced Usage
1. **Custom Collections**: Use different collection names for different data types
2. **Multiple Databases**: Switch between different MongoDB instances
3. **Batch Processing**: Handle thousands of records efficiently
4. **Data Validation**: Automatic validation of email addresses and URLs

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- **Check MongoDB service**: Ensure MongoDB is running locally
- **Verify connection string**: Double-check your connection string format
- **Network issues**: Check firewall and network connectivity
- **Authentication**: Verify username and password for cloud MongoDB

#### Extension Not Loading
- **Developer mode**: Ensure developer mode is enabled in Chrome
- **Manifest file**: Check for errors in manifest.json
- **Permissions**: Verify all required permissions are granted

#### Data Not Appearing
- **Storage permissions**: Check Chrome storage permissions
- **Data extraction**: Ensure data was successfully extracted
- **Refresh data**: Use the refresh button to reload data

### Error Messages

| Error | Solution |
|-------|----------|
| "Connection refused" | Start MongoDB service |
| "Invalid connection string" | Check MongoDB URI format |
| "Database not found" | Create database first |
| "Permission denied" | Check user permissions |

## 📈 Performance Tips

### Large Datasets
- **Batch processing**: Data is processed in batches of 100 records
- **Memory management**: Efficient memory usage for large datasets
- **Connection pooling**: MongoDB connections are properly managed

### Optimization
- **Indexes**: Create indexes on frequently queried fields
- **Connection limits**: Monitor MongoDB connection limits
- **Batch size**: Adjust batch size based on available memory

## 🔐 Security

### Best Practices
- **Connection strings**: Never commit connection strings to version control
- **Environment variables**: Use environment variables for sensitive data
- **Network security**: Use SSL/TLS for cloud MongoDB connections
- **Access control**: Implement proper MongoDB user permissions

## 📝 Development

### Project Structure
```
google-maps-extractor/
├── dashboard.html          # Modern dashboard UI
├── js/
│   └── dashboard.js        # Enhanced dashboard functionality
├── css/
│   └── dashboard.css       # Modern styling
├── server.js               # MongoDB backend server
├── package.json            # Node.js dependencies
└── README-MODERN.md        # This documentation
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release with basic functionality
- **v2.0.0**: Modern UI with MongoDB integration

### Future Enhancements
- Advanced filtering options
- Data visualization charts
- Multiple database support
- Real-time data sync
- Advanced search functionality

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Test with sample data
- Check browser console for errors

## 🎉 Acknowledgments

- [Tabulator.js](http://tabulator.info/) for the data table
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Font Awesome](https://fontawesome.com/) for icons
- [MongoDB](https://www.mongodb.com/) for database storage
- [Express.js](https://expressjs.com/) for the backend server

---

**Note**: This enhanced dashboard requires a MongoDB backend server to be running for full database functionality. Local JSON export is available as a fallback option.