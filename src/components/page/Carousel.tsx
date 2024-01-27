import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Gallery } from "@prisma/client";
import Image from "next/image";

export default function GalleryCarousel({ gallery }: { gallery: Gallery[] }) {
  return (
    <Carousel className="mx-auto w-[16rem] lg:w-[24rem] xl:w-[32rem]">
      <CarouselPrevious type="button" />
      <CarouselContent className="group h-48 lg:h-72 xl:h-96">
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
              </a>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext type="button" />
    </Carousel>
  );
}
