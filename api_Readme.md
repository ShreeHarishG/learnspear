Here are the specific API names and the exact structure of their JSON responses based on your current Odoo setup:

### 1. Product Listing

* **API Name:** `get_products`
* **Endpoint:** `/api/products`
* **Response Structure:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 36,
      "name": "Customizable Desk",
      "list_price": 750.0
    }
  ]
}

```


* **Note:** Returns all items where `sale_ok` is true.



---

### 2. Subscription Details

* **API Name:** `get_subscriptions`
* **Endpoint:** `/api/subscriptions`
* **Response Structure:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "SUB20260207101152",
      "partner_id": [57, "Customer 1"],
      "plan_id": [1, "Monthly plan"],
      "state": "active",
      "amount_total": 1000.0,
      "start_date": "2026-02-07"
    }
  ]
}

```


* **Note:** Relational fields like `partner_id` return a list containing the ID and the Display Name.



---

### 3. Customer Directory

* **API Name:** `get_customers`
* **Endpoint:** `/api/customers`
* **Response Structure:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 44,
      "name": "B2C Customer Intra State",
      "email": "gemini_furniture@fake.geminifurniture.com",
      "phone": "(941)-284-4875"
    }
  ]
}

```


* **Note:** Returns partners with a `customer_rank > 0`.



---

### 4. Subscription Plans

* **API Name:** `get_plans`
* **Endpoint:** `/api/plans`
* **Response Structure:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Monthly plan",
      "billing_period": "monthly",
      "price": 0.0
    }
  ]
}

```



---

### 5. Invoice Records

* **API Name:** `get_invoices`
* **Endpoint:** `/api/invoices`
* **Response Structure:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 14,
      "name": "INV/2026/00006",
      "partner_id": [42, "B2B Customer Inter State"],
      "invoice_date": "2026-02-07",
      "amount_total": 50400.0,
      "payment_state": "not_paid",
      "state": "posted"
    }
  ]
}

```



---

### 6. Dashboard Statistics

* **API Name:** `get_stats`
* **Endpoint:** `/api/stats`
* **Response Structure:**
```json
{
  "status": "success",
  "data": {
    "active_subscriptions": 3,
    "total_revenue": 0
  }
}

```


* **Note:** `total_revenue` is currently 0 because your invoices are in `not_paid` or `draft` status.



**Would you like me to help you create the TypeScript interfaces for these responses so you can use them in your Next.js frontend?**