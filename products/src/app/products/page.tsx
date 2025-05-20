import Image from "next/image";
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

const getData = async (): Promise<Product[]> => {
  const response = await fetch("https://fakestoreapi.com/products");
  return await response.json();
};

const ProductsPage = async () => {
  const data = await getData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-3xl font-bold mb-8">Products Page</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <div key={product.id} className="product-card p-4 border rounded-lg shadow-md bg-white">
            <div className="flex justify-center">
              <Image
                src={product.image}
                alt={product.title}
                width={150}
                height={150}
                className="object-contain h-40 w-40"
              />
            </div>

            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold mt-3 text-black dark:text-black">{product.title}</h3>
            </Link> 

            <p className="text-gray-600 text-sm mt-2">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">Price: ${product.price}</p>
            <p className="text-sm text-gray-500">Category: {product.category}</p>
            <p className="text-sm text-yellow-500">Rating: ⭐ {product.rating.rate} ({product.rating.count} reviews)</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
