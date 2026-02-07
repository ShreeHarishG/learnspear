// lib/sync-odoo.js
import odooAPI from "./odoo-api";

export const syncWithOdoo = async (user: any) => {
  // 1. Check if we already have a session
  if (odooAPI.isAuthenticated()) return odooAPI.getUser();

  // 2. If not, login to Odoo. 
  // NOTE: For this to work, the user's Odoo password 
  // needs to be known or handled via a master key/proxy.
  const email = user.emailAddresses[0].emailAddress;
  
  // In a 'Lazy' setup, many developers use a standard password 
  // or a custom Odoo controller that bypasses passwords for verified Clerk emails.
  const response = await odooAPI.login(email, "your_standard_password_or_clerk_id");

  return response;
};