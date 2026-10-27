import Image from "next/image";

const fragranceImages = [
  {
    src: "/images/hero/coastal-aqua.jpeg",
    alt: "Aqua perfume on a sunlit coastal terrace",
    number: "01",
    position: "left-[3%] w-[13%] h-[24svh] lg:h-[29svh]",
  },
  {
    src: "/images/hero/emerald-noir.jpeg",
    alt: "Emerald perfume in a dark floral interior",
    number: "02",
    position: "left-[18%] w-[16%] h-[35svh] lg:h-[39svh]",
  },
  {
    src: "/images/hero/city-sillage.jpeg",
    alt: "Golden perfume beside a city cafe",
    number: "03",
    position: "left-[36%] w-[28%] h-[43svh] lg:h-[49svh]",
  },
  {
    src: "/images/hero/desert-amber.jpeg",
    alt: "Amber perfume in a warm garden courtyard",
    number: "04",
    position: "left-[67%] w-[16%] h-[35svh] lg:h-[39svh]",
  },
  {
    src: "/images/botanical-edit/nectar-terre.jpeg",
    alt: "Nectar perfume surrounded by autumn botanicals",
    number: "05",
    position: "left-[85%] w-[12%] h-[24svh] lg:h-[29svh]",
  },
];

export default function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-white px-4 text-[#171717] sm:px-6 lg:min-h-[720px]"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[31%] -translate-x-1/2 whitespace-nowrap text-[26vw] font-black leading-none tracking-[-0.09em] text-[#222a37]/[0.035]"
      >
        AURA & AETHER
      </p>

      <h1
        id="contact-hero-title"
        className="absolute left-1/2 top-[16%] z-10 w-full text-[#222a37] -translate-x-1/2 text-center text-[clamp(2.6rem,8.2vw,7.5rem)] font-black uppercase leading-[0.88] tracking-[-0.045em]"
      >
        Connect with
        <br />
        our scents
      </h1>

      <div className="absolute inset-x-0 bottom-[4%] h-[48svh]">
        {fragranceImages.map((image, index) => (
          <figure
            key={image.src}
            className={`absolute bottom-0 ${image.position} ${image.number === "01" ? "left-[4%] w-[28%] h-[30svh] sm:left-[3%] sm:w-[13%] sm:h-[24svh] lg:h-[29svh]" : image.number === "02" ? "left-[36%] w-[28%] h-[39svh] sm:left-[18%] sm:w-[16%] sm:h-[35svh] lg:h-[39svh]" : image.number === "04" ? "left-[68%] w-[28%] h-[30svh] sm:left-[67%] sm:w-[16%] sm:h-[35svh] lg:h-[39svh]" : "hidden sm:block"}`}
            style={{ zIndex: index + 1 }}
          >
            <figcaption className="mb-2 text-center text-xs font-semibold tracking-wide sm:text-sm">
              {image.number}
            </figcaption>
            <div className="relative h-[calc(100%-24px)] w-full overflow-hidden bg-[#e9e8e6]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 639px) 28vw, (max-width: 1023px) 16vw, 28vw"
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
