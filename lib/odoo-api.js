// lib/odoo-api.js
// API base URL is read from .env: NEXT_PUBLIC_ODOO_URL
import axios from "axios";

const ODOO_BASE_URL =
  process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";

// Create axios instance with credentials
const apiClient = axios.create({
  baseURL: ODOO_BASE_URL,
  withCredentials: true, // Important: sends cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

const odooAPI = {
  // ============ AUTHENTICATION ============

  /**
   * Login to Odoo
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} User info and session
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/web/session/authenticate", {
        jsonrpc: "2.0",
        params: {
          db: "odoo",
          login: email,
          password: password,
        },
      });

      if (response.data.result && response.data.result.uid) {
        // Store user info in localStorage
        localStorage.setItem("odoo_user", JSON.stringify(response.data.result));
        return {
          success: true,
          user: response.data.result,
        };
      } else {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Logout from Odoo
   */
  logout: async () => {
    try {
      await apiClient.post("/web/session/destroy");
      localStorage.removeItem("odoo_user");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current session info
   */
  getSession: async () => {
    try {
      const response = await apiClient.post("/web/session/get_session_info");
      return response.data.result;
    } catch (error) {
      console.error("Session error:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const user = localStorage.getItem("odoo_user");
    return user !== null;
  },

  /**
   * Get stored user info
   */
  getUser: () => {
    const user = localStorage.getItem("odoo_user");
    return user ? JSON.parse(user) : null;
  },

  // ============ PROFILE ============

  /** * GET /api/me - Returns currently logged in user profile
   * Used for Profile page
   */
  getProfile: async () => {
    const response = await apiClient.get("/api/me");
    return response.data;
  },

  // ============ PRODUCTS & SHOP ============

  /** * GET /api/products - Returns list of sellable products
   */
  getProducts: async () => {
    const response = await apiClient.get("/api/products");
    return response.data;
  },

  /** * GET /api/products/[id] - Returns details for a single product
   */
  getProductDetail: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  // ============ ORDERS ============

  /** * GET /api/orders - Returns Sale Orders
   * @param {number} partnerId - Optional: Filter by specific customer
   */
  getOrders: async (partnerId = null) => {
    const url = partnerId
      ? `/api/orders?partner_id=${partnerId}`
      : "/api/orders";
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // ============ SUBSCRIPTIONS ============

  /** * GET /api/subscriptions - Returns all subscriptions (Admin)
   */
  getSubscriptions: async () => {
    const response = await apiClient.get("/api/subscriptions");
    return response.data;
  },

  /**
   * Get user's subscriptions only
   * @param {number} partnerId - Filter by specific customer
   */
  getUserSubscriptions: async (partnerId) => {
    const response = await apiClient.get(
      `/api/subscriptions?partner_id=${partnerId}`,
    );
    return response.data;
  },

  /** * GET /api/plans - Returns subscription plans
   */
  getPlans: async () => {
    // Note: Ensure /api/plans exists in your python code if you need this
    // If not added in previous step, this might 404 until implemented
    const response = await apiClient.get("/api/plans");
    return response.data;
  },

  // ============ INVOICES ============

  /** * GET /api/invoices - Returns all invoices (Admin)
   */
  getInvoices: async () => {
    const response = await apiClient.get("/api/invoices");
    return response.data;
  },

  /**
   * Get user's invoices only
   * @param {number} partnerId - Filter by specific customer
   */
  getUserInvoices: async (partnerId) => {
    const response = await apiClient.get(
      `/api/invoices?partner_id=${partnerId}`,
    );
    return response.data;
  },
  getInvoiceById: async (invoiceId) => {
    const response = await apiClient.get(`/api/invoices/${invoiceId}`);
    return response.data;
  },
  // ============ CUSTOMERS & PAYMENTS ============

  /** GET /api/customers - returns { status, data: [{ id, name, email, phone }] } */
  getCustomers: async () => {
    const response = await apiClient.get("/api/customers");
    return response.data;
  },

  /** GET /api/payments */
  getPayments: async () => {
    const response = await apiClient.get("/api/payments");
    return response.data;
  },

  /** GET /api/stats - returns { status, data: { active_subscriptions, total_revenue } } */
  getStats: async () => {
    const response = await apiClient.get("/api/stats");
    return response.data;
  },

  // ============ ADMIN OPERATIONS ============

  /**
   * Create a new subscription (admin only)
   */
  createSubscription: async (data) => {
    const response = await apiClient.post("/api/subscriptions/create", data);
    return response.data;
  },

  /**
   * Activate subscription
   */
  activateSubscription: async (subscriptionId) => {
    const response = await apiClient.post(
      `/api/subscriptions/${subscriptionId}/activate`,
    );
    return response.data;
  },

  /**
   * Create invoice
   */
  createInvoice: async (subscriptionId) => {
    const response = await apiClient.post(
      `/api/subscriptions/${subscriptionId}/invoice`,
    );
    return response.data;
  },

  /**
   * Register payment
   */
  registerPayment: async (invoiceId, amount) => {
    const response = await apiClient.post(
      `/api/invoices/${invoiceId}/payment`,
      { amount },
    );
    return response.data;
  },
};

export default odooAPI;
