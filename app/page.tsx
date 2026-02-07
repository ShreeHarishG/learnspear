import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light p-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-text-heading tracking-tight">
          Welcome to <span className="text-primary">LearnSpear</span>
        </h1>
        <p className="mb-12 text-xl text-text-muted">
          Select your role to continue to the dashboard.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Admin Card */}
          <Link
            href="/admin"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 border border-transparent"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                🛡️
              </div>
              <h2 className="mb-3 text-2xl font-bold text-text-heading">Admin Portal</h2>
              <p className="text-center text-text-muted">
                Manage subscriptions, invoices, and system settings.
              </p>
              <div className="mt-8 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform group-hover:scale-105">
                Go to Admin Dashboard
              </div>
            </div>
          </Link>

          {/* User Card */}
          <Link
            href="/user"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/50 border border-transparent"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-accent/5 transition-all group-hover:bg-accent/10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-4xl text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                👤
              </div>
              <h2 className="mb-3 text-2xl font-bold text-text-heading">User Portal</h2>
              <p className="text-center text-text-muted">
                Access your courses, profile, and learning progress.
              </p>
              <div className="mt-8 rounded-lg bg-white border-2 border-primary text-primary px-6 py-2.5 text-sm font-semibold shadow-sm transition-all group-hover:bg-primary group-hover:text-white">
                Go to User Dashboard
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
