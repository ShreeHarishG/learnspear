// lib/odoo-api.js
import axios from 'axios';

const ODOO_BASE_URL = 'http://localhost:8069';

const odooAPI = {
  // Get all products
  getProducts: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/products`);
    return response.data;
  },

  // Get all subscriptions
  getSubscriptions: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/subscriptions`);
    return response.data;
  },

  // Get all customers
  getCustomers: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/customers`);
    return response.data;
  },

  // Get all plans
  getPlans: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/plans`);
    return response.data;
  },

  // Get all invoices
  getInvoices: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/invoices`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await axios.get(`${ODOO_BASE_URL}/api/stats`);
    return response.data;
  },
};

export default odooAPI;