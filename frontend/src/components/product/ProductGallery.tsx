import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const mainImage = images[0] || "/placeholder.jpg";

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={mainImage}
                    alt={name}
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>
            {/* Grid for thumbnails if multiple images exist */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                            <Image
                                src={img}
                                alt={`${name} ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
