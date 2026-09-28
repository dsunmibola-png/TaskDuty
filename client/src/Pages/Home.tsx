import { ArrowRight,  } from "lucide-react";
import { Link } from "react-router-dom";
import homeIllustration from "../assets/home-illustration.svg.png";



function Home() {
  return (
    <main className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 md:gap-16">
      <section>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Manage your Tasks on{" "}
          <span className="mt-2 block text-[#974fd0]">
            TaskDuty
          </span>
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
          Bring a little order to your everyday life. Organize your
          tasks, set due dates, and keep track of your progress—all
          in one simple place.
        </p>

        <Link
          to="/tasks"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#974fd0] px-6 py-3 font-medium text-white transition-colors hover:bg-[#803db7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
        >
          Go to My Tasks
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <div className="flex justify-center md:justify-end">
 <div className="flex justify-center md:justify-end">
  <img
    src={homeIllustration}
    alt="People organizing tasks on a task board"
    className="h-auto w-full max-w-sm"
  />
</div>
</div>
    </main>
  );
}

export default Home;
