'use client'
import { useEffect, useState } from "react";
import { ProductionCulture, ProductionProduct, ProductionProductCategory, ProductionProductDescription, ProductionProductModel, ProductionProductModelDescriptionCulture, ProductionProductSubCategory, ProductionWorkOrder, ProductionWorkOrderRouting } from "@prisma/client";

interface FiltersProps {
    productCategory: ProductionProductCategory[];
    product: ProductionProduct[];
    productSubCategory: ProductionProductSubCategory[];
    productModel: ProductionProductModel[];
    productCulture: ProductionCulture[];
    productMDC: ProductionProductModelDescriptionCulture[];
    productWorkOrder: ProductionWorkOrder[];
    productWorkOrderRounting: ProductionWorkOrderRouting[];
}

const Filters: React.FC<FiltersProps> = ({ 
        productCategory, 
        product, 
        productSubCategory, 
        productModel, 
        productCulture, 
        productMDC,
        productWorkOrder,
        productWorkOrderRounting
}) => {

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All");
    const [selectedModel, setSelectedModel] = useState("All");
    const [selectedCulture, setSelectedCulture] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState<ProductionProduct[]>(product);
    const [filteredSubCategories, setFilteredSubCategories] = useState<ProductionProductSubCategory[]>(productSubCategory);
    const [filteredCategories, setFilteredCategories] = useState<ProductionProductCategory[]>(productCategory);

    useEffect(() => {
        if (selectedCategory !== "All") {
            const filteredSub = productSubCategory.filter(sub => {
                const category = productCategory.find(cat => cat.Name === selectedCategory);
                return category && sub.ProductCategoryID === category.ProductCategoryID;
            });
            setFilteredSubCategories(filteredSub);
        } else {
            setFilteredSubCategories(productSubCategory);
        }

    }, [selectedCategory, productCategory, productSubCategory]);

    useEffect(() => {
        if (selectedSubCategory !== "All") {
            const filteredCat = productCategory.filter((cat) => {
                const subCategory = productSubCategory.find((sub) => sub.Name === selectedSubCategory);
                return subCategory && cat.ProductCategoryID === subCategory?.ProductCategoryID;
            });
            setFilteredCategories(filteredCat);
        } else {
            setFilteredCategories(productCategory);
        }

    }, [selectedSubCategory, productCategory, productSubCategory]);


    useEffect(() => {
        let newFilteredProducts = product;

        if (selectedCategory !== "All") {
            const categoryProducts = product.filter((p) => {
                const subCategory = productSubCategory.find((sc) => sc.ProductSubcategoryID === p.ProductSubcategoryID);
                if (subCategory) {
                    const category = productCategory.find((c) => c.ProductCategoryID === subCategory.ProductCategoryID);
                    return category?.Name === selectedCategory;
                }
                return false;
            });
            newFilteredProducts = categoryProducts;
        }

        if (selectedSubCategory !== "All") {
            newFilteredProducts = newFilteredProducts.filter((p) => {
                const subCategory = productSubCategory.find((sc) => sc.ProductSubcategoryID === p.ProductSubcategoryID);
                return subCategory?.Name === selectedSubCategory;
            });
        }

        if (selectedModel !== "All") {
            newFilteredProducts = newFilteredProducts.filter((p) => {
                const model = productModel.find((m) => m.ProductModelID === p.ProductModelID)
                return model?.Name === selectedModel;
            })
        }

        if (selectedCulture !== "All") {
            newFilteredProducts = newFilteredProducts.filter((p) => {
                const MDC = productMDC.find((mdc) => mdc.ProductModelID === p.ProductModelID)
                if (MDC) {
                    const culture = productCulture.find((c) => c.CultureID === MDC.CultureID);
                    return culture?.Name === selectedCulture;
                }
                return false;
            });
        }

        setFilteredProducts(newFilteredProducts);

    }, [
        selectedCategory, 
        selectedSubCategory,
        selectedModel,
        selectedCulture,
        product, 
        productCategory, 
        productSubCategory,
        productCulture,
        productMDC,
        productModel,
    ]);

    const productsWorkOrder = productWorkOrder.filter((order) => filteredProducts.find((p) => p.ProductID === order.ProductID))

    const sumOrderQty = productsWorkOrder.reduce((total, order) => total + order.OrderQty, 0);

    return (
        <div className="text-black flex">

            <div className="space-y-2 flex flex-col w-96 p-5">
                <select value={selectedCategory} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}>

                    <option value="All">
                        {filteredCategories !== productCategory ? filteredCategories.map((p) => (p.Name)) : "All"}
                    </option>

                    {filteredCategories !== productCategory ? null :
                    filteredCategories.map((category) => (
                        <option key={category.ProductCategoryID} value={category.Name}>
                            {category.Name}
                        </option>
                    ))}

                </select>

                <select value={selectedSubCategory} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubCategory(e.target.value)}>

                    <option value="All">All</option>

                    {filteredSubCategories.map((subCategory) => (
                        <option key={subCategory.ProductSubcategoryID} value={subCategory.Name}>
                            {subCategory.Name}
                        </option>
                    ))}

                </select>

                <select value={selectedModel} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value)}>

                    <option value="All">All</option>

                    {productModel.map((model) => (
                        <option key={model.ProductModelID} value={model.Name}>
                            {model.Name}
                        </option>
                    ))}

                </select>

                <select value={selectedCulture} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCulture(e.target.value)}>

                    <option value="All">All</option>

                    {productCulture.map((culture) => (
                        <option key={culture.CultureID} value={culture.Name}>
                            {culture.Name}
                        </option>
                    ))}

                </select>
            </div>

            <div className="text-white p-5">
                <h1>{sumOrderQty}</h1>
                {filteredProducts.map((product) => (
                    <p key={product.ProductID}>{product.Name}</p>
                ))}
            </div>

        </div>
    );
};

export default Filters;
