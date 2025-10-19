import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen overflow-visible">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
