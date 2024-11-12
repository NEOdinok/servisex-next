import { AddToCartForm, BaseCarousel, ConfirmationDialog, Gallery, InfoBlock } from "@/components";
import { BaseLayout } from "@/layouts";
import { formatPrice } from "@/lib/utils";
import { findAllPossibleOffersOfAProduct, transformAllProductsData, transformSingleProductData } from "@/lib/utils";
import { GetProductsResponse, PossibleOffer, Product, ProductPreviewData, ShopItem } from "@/types";

export const dynamicParams = false;

const fetchProducts = async (): Promise<ShopItem[]> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("[Product] Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const { transformedProducts } = transformAllProductsData(data.products);
  return transformedProducts;
};

const fetchSingleProduct = async (parentProductId: string, color?: string): Promise<Product> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(
    `${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}&filter[ids][]=${parentProductId}`,
    {
      cache: "force-cache",
    },
  );

  if (!response.ok) {
    throw new Error("[Product] Failed to fetch one product");
  }

  const data: GetProductsResponse = await response.json();
  const product = data.products[0]; // sinse we are expecting single product

  return product;
};

// Generate static paths based on fetched products
export async function generateStaticParams() {
  const products = await fetchProducts();

  return products.map((product) => ({
    parentProductId: product.parentProductId.toString(),
    color: product.color ? product.color : "no-color",
  }));
}

interface ProductPageProps {
  params: {
    parentProductId: string;
    color: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { parentProductId, color } = params;

  const rawProduct = await fetchSingleProduct(parentProductId, color);
  const product = transformSingleProductData(rawProduct, color);
  const productPossibleOffers = findAllPossibleOffersOfAProduct(rawProduct);

  return (
    <BaseLayout>
      <>
        <div className="grid sm:grid-cols-[400px_1fr] gap-8 sm:px-4">
          <div className="flex items-center flex-col h-fit gap-4">
            <Gallery
              imageUrls={product?.imgs}
              productName={product.name}
              className="hidden sm:flex sm:flex-col md:grid md:grid-cols-2 gap-4"
            />
            <BaseCarousel
              imageUrls={product.imgs}
              productName={product.name}
              className="block sm:hidden w-full aspect-[1/1]"
            />
          </div>

          <div className="flex px-2 sm:px-0 flex-col sm:order-first mb-16">
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl font-mono font-bold uppercase">{product?.name}</h1>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono uppercase">{formatPrice(product.price)} ₽</span>
              </div>
            </div>

            <div className="grid gap-4 mt-8 text-xs leading-loose">
              <InfoBlock title="описание" content={<span className="font-mono">{product?.description}</span>} />
            </div>

            <AddToCartForm product={product} color={color} possibleOffers={productPossibleOffers} />
          </div>
        </div>
      </>
    </BaseLayout>
  );
}
