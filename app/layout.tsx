import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/fx/CustomCursor";
import ParchmentOverlay from "@/components/fx/ParchmentOverlay";
import { Preloader } from "@/components/fx/Preloader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb",
});

export const metadata: Metadata = {
  title: "El Susurro del Tiempo — Una vida, un libro",
  description:
    "Cada adulto mayor guarda un mundo de historias que corre el riesgo de perderse con el tiempo. Recuperar la memoria.",
  icons: {
    icon: "/assets/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${ebGaramond.variable}`}>
      <body>
        <ParchmentOverlay />
        <CustomCursor />
        {/* El telón envuelve la página: las secciones consultan `useAppListo()`
            para no gastar su animación de entrada por debajo de él. */}
        <Preloader>{children}</Preloader>
      </body>
    </html>
  );
}
