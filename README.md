# 🛡️ LearnSpear

**LearnSpear** is a premium, enterprise-grade business management platform designed to bridge the gap between powerful ERP systems and modern user experiences. Built with **Next.js 15**, **Clerk**, and **Odoo ERP**, it provides a seamless, high-performance interface for both administrators and customers.

---

## 🚀 Key Features

### 📊 Admin Intelligence Dashboard
- **Real-time KPI Tracking**: Monitor Total Revenue, MRR (Monthly Recurring Revenue), ARPU, and Active Subscriptions at a glance.
- **Sales Analytics**: Integrated view of invoices, quotations, and recent sales activities.
- **System Health Monitoring**: Live status indicators for Odoo connection and database synchronization.
- **Quick Operations**: Rapid creation of invoices, products, and user accounts directly from the dashboard.

### 👤 User Experience Portal
- **Order Management**: Track personal orders, view invoice histories, and manage active subscriptions.
- **Unified Profile**: Seamless synchronization of profile data between Clerk (Auth) and Odoo (ERP).
- **Interactive Landing Page**: Modern, high-conversion landing page with feature highlights, testimonials, and FAQ.

### 🔌 Enterprise Integration (Odoo Bridge)
- **High-Performance API**: A custom Python-based Odoo controller (`odoo_api_blob_temp.py`) handles secure data exchange.
- **Auto-Sync Auth**: Automatic user creation and synchronization when a user signs up via Clerk.
- **Role-Based Access**: Granular protection for `/admin` and `/user` routes.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Authentication**: [Clerk](https://clerk.com/) (Next.js SDK)
- **ERP Backend**: [Odoo ERP](https://www.odoo.com/) (Python)
- **Data Management**: Axios, React Hooks, Next.js API Routes
- **Notifications**: [Sonner](https://sonner.steventey.com/), [React Hot Toast](https://react-hot-toast.com/)

---

## ⚙️ Project Structure

```bash
learnspear/
├── app/                  # Next.js App Router (Admin, User, API routes)
├── components/           # Reusable UI components (Shared, Landing, Dashboards)
├── lib/                  # Core logic, Odoo API client, and custom hooks
├── public/               # Static assets and images
├── middleware.ts         # Route protection and Auth logic
├── odoo_api_blob_temp.py # Custom Odoo side API controller (Python)
└── package.json          # Dependencies and scripts
```

---

## 🚥 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- A running Odoo Instance (v15+)
- Clerk Account & API Keys

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd learnspear
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_ODOO_URL=http://your-odoo-instance:8069
   ODOO_SECRET_KEY=your_shared_secret
   ```

4. **Deploy Odoo Controller**:
   Copy `odoo_api_blob_temp.py` to your custom Odoo module's `controllers` directory.

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4001](http://localhost:4001) to see the result.

---

## 🤖 Future AI Roadmap
> [!TIP]
> This project is designed for seamless AI integration. Potential expansion areas include:
> - **Predictive Analytics**: AI-driven revenue forecasting based on historical Odoo data.
> - **Smart Support**: RAG-based AI chatbot for customer order tracking and product FAQs.
> - **Automated Reporting**: Generative AI for summarizing monthly sales and subscription trends.

---

## 📄 License
This project is private and intended for internal use.
