import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Transformation from "../components/Transformation";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import About from "../components/About";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Transformation />
      <Services />
      <Gallery />
      <About />
      <Contact />
    </>
  );
}
