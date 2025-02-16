
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MedicationList } from "@/components/dashboard/MedicationList";
import { EmailTest } from "@/components/dashboard/EmailTest";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            
            <EmailTest />
            
            <MedicationList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
