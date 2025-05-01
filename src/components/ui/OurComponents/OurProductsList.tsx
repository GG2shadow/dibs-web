import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    amount: string;
    suffix: string;
  };
  image: string;
}

interface OurProductsListProps {
  products: Product[];
}

const OurProductsList = ({ products }: OurProductsListProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-start text-2xl font-bold">Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={'/abc/b/abc'}
              className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="mb-1 text-base font-semibold">{product.name}</h3>
                <p className="mb-2 text-sm text-muted-foreground font-inter">
                  {product.description}
                </p>
                <p className="text-base font-inter">
                  <span className="font-bold">{product.price.amount}</span>{' '}
                  <span className="text-sm">{product.price.suffix}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { OurProductsList }; 