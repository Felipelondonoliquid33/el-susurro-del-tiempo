import SmoothScroll from "@/components/fx/SmoothScroll";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import Manifesto from "@/components/sections/Manifesto";
import Reliquias from "@/components/sections/Reliquias";
import Foco from "@/components/sections/Foco";
import ChapterList from "@/components/sections/ChapterList";
import Passages from "@/components/sections/Passages";
import Footer from "@/components/sections/Footer";

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
