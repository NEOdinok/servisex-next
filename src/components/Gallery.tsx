import { cn } from "@/lib/utils";

export interface Props {
  className?: string | undefined;
  imageUrls: Array<string>;
  productName?: string | undefined;
}

export type Ref = HTMLButtonElement;

export const Gallery = ({ className, imageUrls, productName }: Props) => {
  const rootStyles = "";
  const classList = cn(rootStyles, className);

  return (
    <section aria-label="Image Gallery" className={classList}>
      {imageUrls.map((url) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url} src={url} className="w-full aspect-[1/1] object-cover" alt={`${productName} + preview`} />
      ))}
    </section>
  );
};
