import { BaseLayout } from "@/layouts";
import { ShopItem, GetProductsResponse, Product } from "@/types";

interface ProductPageProps {
  params: {
    parentProductId: string;
    color: string;
  };
}

const transformAllProductsData = (products: Product[]): { transformedProducts: ShopItem[] } => {
  const transformedProducts: ShopItem[] = [];

  products.forEach((product) => {
    const colorMap: { [key: string]: ShopItem } = {};
    let noColorProduct: ShopItem | null = null;

    product.offers.forEach((offer) => {
      const color = offer.properties?.cvet;
      const size = offer.properties?.razmer;

      if (!color) {
        if (!noColorProduct) {
          noColorProduct = {
            name: product.name,
            imgs: [...offer.images],
            parentProductId: product.id,
            price: product.minPrice,
            isOutOfStock: offer.quantity === 0,
            description: product.description,
            color: color || "one-color", // Fallback value
          };
        } else {
          noColorProduct.isOutOfStock = noColorProduct.isOutOfStock && offer.quantity === 0;

          // Manually add unique images to the array
          offer.images.forEach((img) => {
            if (!noColorProduct!.imgs.includes(img)) {
              noColorProduct!.imgs.push(img);
            }
          });
        }
      } else {
        if (!colorMap[color]) {
          colorMap[color] = {
            name: `${product.name} ${color}`,
            imgs: [...offer.images],
            parentProductId: product.id,
            price: offer.price,
            isOutOfStock: true,
            description: product.description,
            color: color,
          };
        }

        if (offer.quantity > 0) {
          colorMap[color].isOutOfStock = false;
        }
      }
    });

    if (noColorProduct) {
      transformedProducts.push(noColorProduct);
    }

    Object.values(colorMap).forEach((colorProduct) => {
      transformedProducts.push(colorProduct);
    });
  });

  return { transformedProducts };
};

// TODO: abstract this function out into util
// fetch products (same as in ShopPage)
const fetchProducts = async (): Promise<ShopItem[]> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const { transformedProducts } = transformAllProductsData(data.products);
  return transformedProducts;
};

// Generate static paths based on fetched products
export async function generateStaticParams() {
  const products = await fetchProducts();

  return products.map((product) => ({
    parentProductId: product.parentProductId.toString(),
    color: product.color ? product.color : "no-color",
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { parentProductId, color } = params;

  return (
    <BaseLayout>
      <div className="flex flex-col items-center justify-center">
        <span>productId: {parentProductId}</span>
        <span>color: {color}</span>
      </div>
    </BaseLayout>
  );
}
