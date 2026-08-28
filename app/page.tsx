import SmoothScroll from "@/components/fx/SmoothScroll";
import ChapterList from "@/components/sections/ChapterList";
import Foco from "@/components/sections/Foco";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Passages from "@/components/sections/Passages";
import Reliquias from "@/components/sections/Reliquias";

/**
 * Recorrido de la página.
 *
 * Alterna respiro y golpe: pergamino (Hero) → archivo a pantalla completa
 * (Gallery) → color (Manifesto) → vitrina lateral (Reliquias) → voz (Foco) →
 * lectura tranquila (Capítulos, Pasajes) → cierre.
 */
export default function Page() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Manifesto />
        <Reliquias />
        <Foco />
        <ChapterList />
        <Passages />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
