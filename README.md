# 💊 PharmaNearby

PharmaNearby is a cross-platform React Native app built with Expo that helps users quickly search for drug information and locate nearby pharmacies based on real-time location.

---

## 📱 Features

- 🔍 Search for any drug by **brand** or **generic** name
- 📋 View drug details including:
  - Generic name
  - Manufacturer
  - Purpose
  - Warnings
- 💾 Save favorite drugs to **Firebase Firestore**
- 🗺️ Find nearby pharmacies using **Geoapify API**
- 📍 View pharmacies on an interactive **Map** (via `react-native-maps`)
- 🗑️ Delete saved drugs with confirmation
- 📦 View distance from your location to each pharmacy

---

## 🧪 Tech Stack

- React Native + Expo
- Firebase (Firestore)
- Expo Location API
- Geoapify Places API
- React Native Maps
- React Navigation
- Axios

---

## 🔧 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/pharma-nearby.git
   cd pharma-nearby
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Replace `GEOAPIFY_API_KEY` in `MapScreen.js` with your free [Geoapify](https://www.geoapify.com/) API key.
   - Set up your Firebase project and add your Firestore config to `services/firebase.js`.

4. Run the project:
   ```bash
   npx expo start
   ```

---

## 📂 Project Structure

```
├── App.js
├── screens/
│   ├── HomeScreen.js
│   ├── DrugDetailScreen.js
│   ├── SavedScreen.js
│   ├── PharmacyListScreen.js
│   └── MapScreen.js
├── services/
│   └── firebase.js
├── assets/
└── README.md
```

---

## 👥 Team Roles

| Name           | Responsibility                            |
|----------------|--------------------------------------------|
| Darsh Shah     | UI, API integration, Firebase, Map logic   |
| [Teammate #2]  | Drug search, Firestore CRUD, navigation    |

---

## 📌 Future Enhancements

- Push notifications for nearby pharmacy alerts
- Add directions with walking/driving distance
- User authentication
- Dark mode

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Built with ❤️ for real-world healthcare access
