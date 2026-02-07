export default function SettingsPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Settings</h1>
            <p className="mt-2 text-text-muted">Application configuration (Mocked).</p>

            <div className="mt-8 max-w-2xl bg-white p-8 rounded-2xl border border-border-color shadow-sm space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-text-heading mb-4">General Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Company Name</label>
                            <input type="text" className="w-full p-2 border border-border-color rounded-lg" defaultValue="LearnSpear Inc." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-heading mb-1">Support Email</label>
                            <input type="email" className="w-full p-2 border border-border-color rounded-lg" defaultValue="support@learnspear.com" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border-color pt-6">
                    <h2 className="text-lg font-semibold text-text-heading mb-4">Notification Settings</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                            <span className="text-text-heading">Email on new subscription</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                            <span className="text-text-heading">Email on payment failure</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                            <span className="text-text-heading">Weekly summary report</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
