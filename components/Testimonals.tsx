import { Star } from "lucide-react";
import { testimonials } from "@/constants";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-20 mb-10 px-6 sm:px-12 lg:px-20 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-3 mb-14">
        <h1 className="md:text-4xl text-3xl font-bold text-foreground text-center leading-tight">
          Trusted by <br /> Learners Worldwide
        </h1>
        <p className="max-w-xl text-muted-foreground leading-relaxed text-sm sm:text-base">
          Join thousands of students and professionals who’ve mastered their fundamentals and
          advanced their tech careers with <span className="text-primary font-semibold">QuizMaster</span>.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col justify-between border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
          >
            {/* Rating Stars */}
            <div className="flex mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400 text-primary-foreground" />
              ))}
            </div>

            {/* Testimonial Content */}
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              “{testimonial.content}”
            </p>

            {/* Author Info */}
            <div>
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role}, <span className="text-primary font-medium">{testimonial.company}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Background Blobs */}
      <div className="absolute -z-10 w-[28rem] h-[28rem] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl top-20 left-10" />
      <div className="absolute -z-10 w-[24rem] h-[24rem] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl bottom-10 right-10" />
    </section>
  );
}
