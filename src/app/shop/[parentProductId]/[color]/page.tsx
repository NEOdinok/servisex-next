import { BaseLayout } from "@/layouts";
import { ShopItem, GetProductsResponse, Product, ProductPreviewData } from "@/types";

interface ProductPageProps {
  params: {
    parentProductId: string;
    color: string;
  };
}

export const dynamicParams = false;

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

const transformProductData = (product: Product, color?: string): ProductPreviewData => {
  // const product = response.products[0]; // Since we're expecting a single product

  const filteredOffers = color ? product.offers.filter((offer) => offer.properties?.cvet === color) : product.offers;

  const sizes =
    product.options
      ?.find((option) => option.code === "razmer")
      ?.values.map((value) => {
        const quantity = filteredOffers
          .filter((offer) => offer.properties?.razmer === value.value)
          .reduce((sum, offer) => sum + (offer.quantity || 0), 0);
        return { value: value.value, quantity };
      }) || [];

  // Find the first available size
  const defaultSize = sizes.find((size) => size.quantity > 0)?.value || "";

  // Ensure images are added only once per color
  const colorImagesMap: { [key: string]: string[] } = {};
  filteredOffers.forEach((offer) => {
    const offerColor = offer.properties?.cvet;
    if (offerColor && !colorImagesMap[offerColor]) {
      colorImagesMap[offerColor] = offer.images;
    }
  });

  let imgs;

  if (color) {
    imgs = colorImagesMap[color] || [];
  } else {
    imgs = Object.values(colorImagesMap).flat();
    if (imgs.length === 0 && product.offers.length > 0) {
      // If no images from colorImagesMap, take images from the first available offer
      imgs = product.offers[0].images;
    }
  }

  return {
    name: product.name,
    imgs,
    parentProductId: product.id,
    price: product.minPrice,
    description: product.description,
    color,
    sizes,
    defaultSize, // Add defaultSize to the transformed data
  };
};

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

const fetchSingleProduct = async (parentProductId: string, color?: string): Promise<ProductPreviewData> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(
    `${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}&filter[ids][]=${parentProductId}`,
    {
      cache: "force-cache",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const product = data.products[0]; // sinse we are expecting single product

  const productPreviewData = transformProductData(product, color);
  return productPreviewData;
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

  const product = await fetchSingleProduct(parentProductId, color);

  return (
    <BaseLayout>
      <div className="flex flex-col items-center justify-center">
        <span>productId: {product.parentProductId}</span>
        <span>color: {product.color}</span>
        <span>description: {product.description}</span>
      </div>
    </BaseLayout>
  );
}
