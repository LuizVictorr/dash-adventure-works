import Filters from "@/components/production/filters";
import prisma from "@/lib/prisma";

export default async function Home() {

  const product = await prisma.productionProduct.findMany({})
  const productWorkOrder = await prisma.productionWorkOrder.findMany({})
  const productWorkRouting = await prisma.productionWorkOrderRouting.findMany({})
  const productCategory = await prisma.productionProductCategory.findMany({})
  const productSubCategory = await prisma.productionProductSubCategory.findMany({})
  const productModel = await prisma.productionProductModel.findMany({})
  const productModelDescriptionCulture = await prisma.productionProductModelDescriptionCulture.findMany({})
  const productDescription = await prisma.productionProductDescription.findMany({})
  const productCulture = await prisma.productionCulture.findMany({})

  return (
    <main className="">
      <Filters 
        productCategory={productCategory} 
        product={product}
        productSubCategory={productSubCategory}
        productCulture={productCulture}
        productMDC={productModelDescriptionCulture}
        productModel={productModel}
        productWorkOrder={productWorkOrder}
        productWorkOrderRounting={productWorkRouting}
        />
    </main>
  );
}
