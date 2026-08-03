import BeforeAfterSlider from "./BeforeAfterSlider";
import beforeBraids from "../assets/gallery/before-braids.jpg";
import afterMaroonPixie from "../assets/gallery/after-maroon-pixie.jpg";
import beforeNaturalCut from "../assets/gallery/before-natural-cut.jpg";
import afterStyledCurls from "../assets/gallery/after-styled-curls.jpg";

const pairs = [
  { before: beforeBraids, after: afterMaroonPixie },
  { before: beforeNaturalCut, after: afterStyledCurls },
];

export default function Transformation() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold">See the Transformation</h2>
        <p className="mt-2 text-gray-500">
          Drag the sliders to see the difference we make.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {pairs.map((p, i) => (
            <BeforeAfterSlider key={i} before={p.before} after={p.after} />
          ))}
        </div>
      </div>
    </section>
  );
}
