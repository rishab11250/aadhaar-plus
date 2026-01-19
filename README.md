# Aadhaar Lifecycle Dashboard

A comprehensive, React-based visualization dashboard designed to help policymakers and analysts track the lifecycle of Aadhaar enrolments. This tool provides insights into "Data Decay," mandatory biometric updates, migration trends, and digital readiness across different states in India.

![Dashboard Preview](./dashboard_preview.png)
*(Note: Add a screenshot of the dashboard here if available)*

## 🚀 Key Features

* **Real-Time Data Integration**: Automatically fetches and aggregates live sample data from Government Open Data APIs (Demographic, Enrolment, and Biometric datasets).
* **Dynamic Visualization**: Interactive charts powered by **Recharts** including:
  * **Enrolment Trends**: Comparative line charts for new enrolments vs. updates.
  * **Biometric Health**: Composed charts visualizing the gap between expected and actual biometric updates (MBU).
  * **Migration Map**: Horizontal bar charts highlighting states with high address update intensity.
  * **Digital Readiness**: Stacked bar charts breaking down update types (Mobile vs. Address vs. Biometric).
* **Interactive Sidebar**: Seamless navigation between Overview, Demographic Insights, Biometric Health, and Migration views.
* **Global Filtering**: Filter data by Year and State (infrastructure ready).
* **Responsive Design**: Fully responsive layout optimized for Desktop, Tablet, and Mobile devices using **Tailwind CSS**.

## 🛠️ Tech Stack

* **Frontend Framework**: [React](https://react.dev/) (v19)
* **Build Tool**: [Vite](https://vitejs.dev/) (v6)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Charts**: [Recharts](https://recharts.org/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Data Handling**: Native Fetch API with custom aggregation logic.

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Dashboard/       # Chart components (KPICards, EnrolmentTrend, etc.)
│   ├── Layout/          # App shell (Sidebar, DashboardLayout)
│   └── UI/              # Reusable UI elements (Card, FilterBar)
├── data/
│   └── api.js           # Data service: Fetches public/data.json & aggregates it
├── lib/
│   └── utils.js         # Helper functions (Tailwind class merger)
├── App.jsx              # Main application logic & routing
└── index.css            # Global styles & Tailwind imports
```

## ⚡ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/rishab11250/UDAI.git
    cd UDAI
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

### Running the Application

1. **Fetch Latest Data (ETL Script)**
    The app uses a static JSON snapshot to avoid CORS issues with the government APIs. To update this snapshot:

    ```bash
    node scripts/fetchData.js
    ```

    *This fetches fresh data from `api.data.gov.in` and saves it to `public/data.json`.*

2. **Start Development Server**

    ```bash
    npm run dev
    ```

    Open your browser at `http://localhost:5173`.

## 🔗 Data Sources

This dashboard consumes data from the Open Government Data (OGD) Platform India:

1. **Demographic Updates**: `api.data.gov.in/resource/19eac040-0b94-49fa-b239-4f2fd8677d53`
2. **Aadhaar Enrolment**: `api.data.gov.in/resource/ecd49b12-3084-4521-8f7e-ca8bf72069ba`
3. **Biometric Updates**: `api.data.gov.in/resource/65454dab-1517-40a3-ac1d-47d4dfe6891c`

## 🤝 Contribution

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.
