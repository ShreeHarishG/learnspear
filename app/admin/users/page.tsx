import { getCurrentUserRole } from "@/app/actions";
import { AddInternalUserForm } from "@/components/AddInternalUserForm";
import { AdminCustomersTable } from "@/components/AdminCustomersTable";

export default async function AdminUsersPage() {
  let role: string | null = null;

  try {
    role = await getCurrentUserRole();
  } catch (err) {
    role = null;
  }

  const canInviteInternal = role === "admin";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-heading">
        Users / Customers
      </h1>

      <p className="mt-2 text-text-muted">
        Odoo API: get_customers (partners with customer_rank &gt; 0). Admin can
        add internal users.
      </p>

      <AddInternalUserForm visible={canInviteInternal} />

      <div className="mt-6">
        <AdminCustomersTable />
      </div>
    </div>
  );
}

