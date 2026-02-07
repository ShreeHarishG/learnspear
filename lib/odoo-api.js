// lib/odoo-api.js
import axios from "axios";

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// We point to the Next.js API Proxy Route we created (/api/odoo)
// This avoids CORS errors by routing requests: Browser -> Next.js Server -> Odoo
const PROXY_URL = "/api/odoo";

const apiClient = axios.create({
  baseURL: PROXY_URL,
  withCredentials: true, // Important: forwards cookies through the proxy
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR (Crucial Fix)
// The proxy at /api/odoo automatically adds "/api/" to the target URL.
// So we must remove the leading "/api/" from our frontend calls to avoid double "/api/api/".
// Example: Client calls "/api/invoices" -> Interceptor changes to "invoices" -> Proxy calls "ODOO_URL/api/invoices"
apiClient.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("/api/")) {
    config.url = config.url.replace("/api/", "");
  }
  return config;
});

// ==============================================================================
// API METHODS
// ==============================================================================
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
      // Note: Standard Odoo login is at /web/session. 
      // The proxy handles this path correctly.
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
   * Sync Clerk User with Odoo (Auth Bridge)
   */
  syncClerkUser: async (email) => {
    try {
      const secret = process.env.NEXT_PUBLIC_ODOO_BRIDGE_SECRET || "your_shared_secret";
      
      const response = await apiClient.post("/api/auth/clerk_sync", {
        jsonrpc: "2.0",
        params: {
          email: email,
          secret_key: secret, 
        },
      });

      // Handle direct JSON response from our custom controller
      // The proxy might return data directly or wrapped in 'result' depending on Odoo version
      const data = response.data.result || response.data;

      if (data && !data.error && data.status === 'success') {
        const userData = {
            uid: data.uid,
            name: data.name,
            partner_id: data.partner_id,
            session_id: data.session_id
        };
        localStorage.setItem("odoo_user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, error: data.error || "Sync failed" };
    } catch (error) {
      return { success: false, error: error.message };
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

  // ============ PROFILE & USERS ============

  /** GET /api/me - Returns currently logged in user profile */
  getProfile: async () => {
    const response = await apiClient.get("/api/me");
    return response.data;
  },

  /** GET /api/users - List all users (Admin only) */
  getUsers: async () => {
    const response = await apiClient.get("/api/users");
    return response.data;
  },

  // ============ PRODUCTS & SHOP ============

  /** GET /api/products - Returns list of sellable products */
  getProducts: async () => {
    const response = await apiClient.get("/api/products");
    return response.data;
  },

  /** GET /api/products/[id] - Returns details for a single product */
  getProductDetail: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  /** POST /api/products - Create a new product (Admin) */
  createProduct: async (productData) => {
    const response = await apiClient.post("/api/products", productData);
    return response.data;
  },

  /** DELETE /api/products/[id] - Delete product (Admin) */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  },

  // ============ ORDERS & CART ============

  /** GET /api/orders - Returns Sale Orders
   * @param {number} partnerId - Optional: Filter by specific customer
   */
  getOrders: async (partnerId = null) => {
    const url = partnerId
      ? `/api/orders?state=sale&partner_id=${partnerId}`
      : "/api/orders?state=sale";
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return response.data;
  },

  /** GET /api/orders?state=quotation - List Draft Quotations */
  getQuotations: async () => {
    const response = await apiClient.get("/api/orders?state=quotation");
    return response.data;
  },

  /** POST /api/orders - Create Order from Cart */
  createOrder: async (orderData) => {
    // orderData: { partner_id: number, lines: [{ product_id: number, qty: number }] }
    const response = await apiClient.post("/api/orders", orderData);
    return response.data;
  },

  // ============ SUBSCRIPTIONS ============

  /** GET /api/subscriptions - Returns all subscriptions (Admin) */
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

  /** GET /api/plans - Returns subscription plans */
  getPlans: async () => {
    const response = await apiClient.get("/api/plans");
    return response.data;
  },

  // ============ INVOICES & FINANCE ============

  /** GET /api/invoices - Returns all invoices (Admin) */
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

  /** GET /api/payments */
  getPayments: async (partnerId = null) => {
    const url = partnerId 
        ? `/api/payments?partner_id=${partnerId}` 
        : "/api/payments";
    const response = await apiClient.get(url);
    return response.data;
  },

  // ============ CUSTOMERS & CONFIG ============

  /** GET /api/customers */
  getCustomers: async () => {
    const response = await apiClient.get("/api/customers");
    return response.data;
  },

  /** GET /api/taxes */
  getTaxes: async () => {
    const response = await apiClient.get("/api/taxes");
    return response.data;
  },

  /** GET /api/discounts */
  getDiscounts: async () => {
    const response = await apiClient.get("/api/discounts");
    return response.data;
  },

  /** GET /api/settings */
  getSettings: async () => {
    const response = await apiClient.get("/api/settings");
    return response.data;
  },

  // ============ DASHBOARD STATS ============

  /** GET /api/stats */
  getStats: async () => {
    const response = await apiClient.get("/api/stats");
    return response.data;
  },

  // ============ ADMIN OPERATIONS (Legacy/Specific) ============

  /** Create subscription (Admin) */
  createSubscription: async (data) => {
    const response = await apiClient.post("/api/subscriptions/create", data);
    return response.data;
  },

  /** Activate subscription */
  activateSubscription: async (subscriptionId) => {
    const response = await apiClient.post(
      `/api/subscriptions/${subscriptionId}/activate`,
    );
    return response.data;
  },

  /** Create invoice from subscription */
  createInvoice: async (subscriptionId) => {
    const response = await apiClient.post(
      `/api/subscriptions/${subscriptionId}/invoice`,
    );
    return response.data;
  },

  /** Register payment */
  registerPayment: async (invoiceId, amount) => {
    const response = await apiClient.post(
      `/api/invoices/${invoiceId}/payment`,
      { amount },
    );
    return response.data;
  },
};

export default odooAPI;