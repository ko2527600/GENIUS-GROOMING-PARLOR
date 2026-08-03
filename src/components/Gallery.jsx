import gallery1 from "../assets/gallery-1.jpg";

const photos = [gallery1];

export default function Gallery() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Work</h2>
        <p className="mt-2 text-center text-gray-500">
          A look at some recent cuts.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Genius Grooming Parlor haircut"
              className="aspect-square w-full rounded-xl object-cover shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
