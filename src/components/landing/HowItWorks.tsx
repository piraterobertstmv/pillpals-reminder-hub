
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

export const HowItWorks = () => (
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
);
