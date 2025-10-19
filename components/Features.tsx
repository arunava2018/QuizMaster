import { features } from "@/constants"

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-20 mb-10 px-6 sm:px-12 lg:px-20 border-t border-border"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-3 mb-14">
        <h1 className="md:text-4xl text-3xl font-bold text-foreground">
          Everything You Need to <span className="text-primary">Excel</span>
        </h1>
        <p className="max-w-xl text-muted-foreground leading-relaxed text-sm sm:text-base">
          Powerful features designed to help you master computer science fundamentals and ace technical interviews.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex flex-col gap-3 border border-border bg-card hover:bg-muted/50 transition-all duration-300 p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
            </div>
          )
        })}
      </div>

      {/* Decorative Background Blob */}
      <div className="absolute -z-10 w-[28rem] h-[28rem] bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </section>
  )
}
