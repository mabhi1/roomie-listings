import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Gallery } from "@prisma/client";
import Image from "next/image";

export default function GalleryCarousel({ gallery }: { gallery: Gallery[] }) {
  return (
    // w-[16rem] lg:w-[24rem] xl:w-[32rem]
    <Carousel className="mx-auto w-[16rem] md:w-full">
      <CarouselPrevious type="button" />
      <CarouselContent className="group h-48 md:h-96 lg:h-[32rem]">
        {gallery.map(item => (
          <CarouselItem key={item.name} className="relative">
            {item.type.startsWith("video") ? (
              <video src={item.url} controls className="h-full w-full rounded" />
            ) : (
              <a href={item.url} target="_blank">
                <Image
                  alt={item.type}
                  src={item.url}
                  width={1024}
                  height={1024}
                  priority
                  className="h-full w-full rounded bg-secondary-foreground/5 object-contain"
                  placeholder="blur"
                  blurDataURL={item.url}
                />
                <div className="absolute right-1 top-1 z-10 rounded bg-primary-foreground/70 p-1 px-2">
                  Click image to expand
                </div>
              </a>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext type="button" />
    </Carousel>
  );
}
