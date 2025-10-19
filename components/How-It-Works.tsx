import { steps } from "@/constants"

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 mb-10 px-6 sm:px-12 lg:px-20 border-t border-border bg-gradient-to-b from-muted/40 to-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-16">
          A clear, guided path to help you build mastery in Computer Science fundamentals, step by step.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center text-center p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Step number bubble */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg mb-4 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>

              {/* Step Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line for large screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%+1rem)] w-16 h-[2px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute -z-10 w-[25rem] h-[25rem] bg-primary/10 rounded-full blur-3xl top-10 left-0" />
      <div className="absolute -z-10 w-[20rem] h-[20rem] bg-accent/10 rounded-full blur-3xl bottom-0 right-0" />
    </section>
  )
}
