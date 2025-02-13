
import { LayoutDashboard, PlusCircle, List, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", path: "/dashboard" },
    { icon: <PlusCircle className="w-5 h-5" />, label: "Add Medication", path: "/dashboard/add" },
    { icon: <List className="w-5 h-5" />, label: "View Medications", path: "/dashboard/medications" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/dashboard/settings" }
  ];

  return (
    <div className="h-full w-64 bg-white border-r p-4">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-current={location.pathname === item.path ? "page" : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
