
import { Pill } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Pill className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold">PillTime</span>
      </div>
      <div className="flex gap-4 items-center">
        <Button asChild className="btn-coral">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  </header>
);
