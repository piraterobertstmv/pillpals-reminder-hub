
import { useState } from "react";
import { LayoutDashboard, PlusCircle, List, Settings, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", path: "/dashboard" },
    { icon: <PlusCircle className="w-5 h-5" />, label: "Add Medication", path: "/dashboard/add" },
    { icon: <List className="w-5 h-5" />, label: "View Medications", path: "/dashboard/medications" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/dashboard/settings" }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const mobileSidebarStyles = isOpen
    ? "translate-x-0 opacity-100"
    : "-translate-x-full opacity-0";

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>

        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
          aria-hidden="true"
        />

        <nav
          className={`fixed left-0 top-0 bottom-0 w-64 bg-white z-40 transition-all duration-300 ease-in-out transform ${mobileSidebarStyles} h-full shadow-xl`}
          aria-label="Sidebar navigation"
        >
          <div className="pt-16 px-4">
            <div className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleSidebar}
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
        </nav>
      </>
    );
  }

  return (
    <div className="hidden md:block h-full w-64 bg-white border-r p-4">
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
