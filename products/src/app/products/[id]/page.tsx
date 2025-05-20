import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const getData = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  
  const product = await getData(Number(params.id));
  
  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="product-card p-4 border rounded-lg shadow-md bg-white">
        <div className="flex justify-center">
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={150}
            className="object-contain h-40 w-40"
          />
        </div>

        <h3 className="text-lg font-semibold mt-3 text-black dark:text-black">{product.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <p className="text-blue-600 font-bold mt-2">Price: ${product.price}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm text-yellow-500">Rating: ⭐ {product.rating.rate} ({product.rating.count} reviews)</p>
      </div>
      
      <Link href="/products">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
          Back to Products
        </button>
      </Link>
    </div>
  );
};

export default ProductDetailPage;
