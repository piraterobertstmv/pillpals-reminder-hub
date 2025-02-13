
import { Bell, Calendar, CheckCircle, Layout, Phone, Pill } from "lucide-react";

const Index = () => {
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

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create a free account and add your medications."
    },
    {
      number: "2",
      title: "Set Reminders",
      description: "Choose when and how often you'd like to be reminded."
    },
    {
      number: "3",
      title: "Stay on Track",
      description: "Receive notifications with pill details and confirmation options."
    }
  ];

  const testimonials = [
    {
      quote: "PillTime keeps me on track with my heart medication – it's a lifesaver!",
      author: "Sarah Johnson",
      role: "User since 2023"
    },
    {
      quote: "I love the reminder with the pill image. It makes taking my meds easier!",
      author: "Michael Chen",
      role: "User since 2023"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">PillTime</span>
          </div>
          <div className="flex gap-4">
            <a href="/auth" className="text-gray-600 hover:text-gray-900">Sign In</a>
            <a href="/auth" className="btn-coral">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
          <h1 className="text-5xl font-bold leading-tight">
            The One Thing You Can't Forget – Your Medication
          </h1>
          <p className="text-xl text-gray-600">
            PillTime makes sure you never miss a dose. With personalized reminders,
            you'll always have your medications on time.
          </p>
          <div className="pt-4">
            <a href="/auth" className="btn-coral">Get Started</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 text-lavender">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-lg mb-4">{testimonial.quote}</p>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Get Started Today!</h2>
          <p className="text-xl text-gray-600 mb-8">
            No downloads or installations needed. Start using PillTime from your browser right now!
          </p>
          <a href="/auth" className="btn-coral">Get Started</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Pill className="w-6 h-6 text-lavender" />
              <span className="text-xl font-bold">PillTime</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
