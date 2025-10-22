"use client";
import { ArrowRight, Brain, Trophy, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/quiz");
  }
  return (
    <section className="relative overflow-hidden py-15 mb-20 px-6 sm:px-12 lg:px-20 rounded-xl border border-border bg-gradient-to-br from-muted to-background/40 dark:from-muted/40 dark:to-background/20 transition-colors duration-300 m-10 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 text-left">
          <p className="md:text-left text-center mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
            Master CS Fundamentals
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left">
            Sharpen Your
            <br />
            Computer
            <br />
            Science Skills.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md text-center md:text-left mx-auto md:mx-0">
            Strengthen your foundation in Computer Science with interactive
            quizzes and real-time progress tracking.
          </p>

          <div className="flex gap-4 mt-6 flex-col md:flex-row items-center md:items-start">
            {/* Primary CTA */}
            <button className="btn-primary text-sm flex items-center justify-center gap-2 group px-6 py-2.5 rounded-full font-medium transition-all duration-300" onClick={handleClick}>
              <span>Start Quiz</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>

            {/* Secondary CTA */}
            <button className="btn-outline text-sm px-6 py-2.5 rounded-full font-medium hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
              Explore Topics
            </button>
          </div>
        </div>

        {/* Right Content (Features) */}
        <div className="relative flex flex-col justify-start items-center md:items-start space-y-6 p-6 sm:p-8">
          {[
            {
              icon: <Brain size={22} />,
              title: "Comprehensive Topics",
              desc: "Test your core CS areas like DSA, OS, DBMS, CN, and more — all in one platform.",
            },
            {
              icon: <Clock size={22} />,
              title: "Self-Paced Quizzes",
              desc: "Challenge yourself anytime with flexible, bite-sized quizzes tailored to your schedule.",
            },
            {
              icon: <Trophy size={22} />,
              title: "Progress Insights",
              desc: "Get detailed analytics on your strengths and weak spots — and watch your mastery grow.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 border border-border bg-card hover:bg-muted/50 transition-all duration-300 p-5 rounded-xl shadow-sm hover:shadow-md w-full max-w-full sm:max-w-md"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                {feature.icon}
              </div>
              <div className="flex flex-col text-left">
                <p className="text-base font-semibold text-foreground">
                  {feature.title}
                </p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}

          {/* Decorative gradient blob */}
          <div className="absolute -z-10 w-72 h-72 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}
