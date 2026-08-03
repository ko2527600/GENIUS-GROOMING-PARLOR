import BeforeAfterSlider from "./BeforeAfterSlider";
import beforeImg from "../assets/gallery/before-braids.jpg";
import afterImg from "../assets/gallery/after-maroon-pixie.jpg";

export default function Transformation() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold">See the Transformation</h2>
        <p className="mt-2 text-gray-500">
          Drag the slider to see the difference we make.
        </p>

        <div className="mt-10 flex justify-center">
          <BeforeAfterSlider before={beforeImg} after={afterImg} />
        </div>
      </div>
    </section>
  );
}
