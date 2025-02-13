
import { Bell, Calendar, Layout, Pill } from "lucide-react";

const features = [
  {
    icon: <Bell className="w-6 h-6 text-primary" />,
    title: "Simple Reminders",
    description: "Get daily SMS and email reminders with pill names and images."
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Stay on Track",
    description: "Customizable reminders based on your schedule."
  },
  {
    icon: <Pill className="w-6 h-6 text-primary" />,
    title: "Medication Details",
    description: "Includes the name of each pill and its image for easy identification."
  },
  {
    icon: <Layout className="w-6 h-6 text-primary" />,
    title: "Multi-Medication Support",
    description: "Keep track of several medications effortlessly."
  }
];

export const Features = () => (
  <section className="bg-gray-50 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
