# 📍 Zone Marker Map

A lightweight, cloud-synced web application to visually manage and track your work zones using Google Maps and Firebase. Ideal for field operations like distribution, sales visits, or city planning.

---

## 🚀 **Features**

* ✅ Draw and Name Zones on Google Maps
* ✅ Cloud Sync with Firebase Firestore
* ✅ Sidebar with Bookmarks of Saved Zones
* ✅ Delete Individual Zones
* ✅ Add Notes to Each Zone
* ✅ Assign Status: `Pending`, `Visited`, or `Completed`
* ✅ Color-Coded Zones Based on Status
* ✅ Export Zones as CSV for Reporting
* ✅ Simple Analytics Dashboard (Total, Pending, Visited, Completed Zones)
* ✅ Remembers Last Viewed Map Location or Defaults to Algeria

---

## 📚 **How to Use**

1. **Add a Zone:**

   * Click `➕ Add Zone`.
   * Draw the zone directly on the map.
   * Enter a name for the zone.
   * Select its status using the pop-up buttons.
   * (Optional) Add notes for additional details.

2. **View and Manage Zones:**

   * All saved zones appear in the sidebar.
   * Click the `Delete` button next to any zone to remove it.

3. **Export Data:**

   * Click `📄 Export CSV` to download a CSV file of all zones.

4. **Analytics:**

   * Check the top analytics bar to see zone statistics by status.

---

## ⚙️ **Setup & Configuration**

1. **Google Maps API Key:**

   * Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` with your actual API key from Google Cloud Console.

2. **Firebase Configuration:**

   * Firebase is already set up using Firestore.
   * You can adjust Firestore rules for data security as needed.

---

## 📦 **Deployment**

* Hosted easily via GitHub Pages or any static site hosting service.
* Fully responsive and accessible from any device with a browser.

---

**Enjoy smarter planning and streamlined fieldwork management! 🎯**
