import { about } from "../data/shopData";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold">Our Story</h2>
        <p className="mt-4 leading-relaxed text-gray-600">{about.story}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.highlights.map((h) => (
            <div
              key={h}
              className="rounded-lg bg-gray-50 p-4 text-sm font-medium shadow-sm"
            >
              {h}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
