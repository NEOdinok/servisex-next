import { ProductsShowcase } from "@/components";
import { BaseLayout } from "@/layouts/BaseLayout";
import { transformAllProductsData } from "@/lib/utils";
import { GetProductsResponse, ShopItem } from "@/types";

const fetchProducts = async (): Promise<ShopItem[]> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.RETAIL_CRM_API}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("[Shop] Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const { transformedProducts } = transformAllProductsData(data.products);
  return transformedProducts;
};

const ShopPage = async () => {
  const products = await fetchProducts();

  return (
    <BaseLayout>
      <ProductsShowcase products={products} />
    </BaseLayout>
  );
};

export default ShopPage;
