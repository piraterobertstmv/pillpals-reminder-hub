
import { Sidebar } from "@/components/dashboard/Sidebar";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p>Settings page will be implemented in the next step.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
