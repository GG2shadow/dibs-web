const BLPListings = () => {
  const listingsInfo = [
    {
      title: '1-on-1 Expert Consultation',
      price: 'FREE',
      imgSrc: '/dibs-listing-photo.png',
    },
    {
      title: 'Dummy Listing 2',
      price: 'FREE',
      imgSrc: '/dibs-listing-photo.png',
    },
    {
      title: 'Dummy Listing 3',
      price: 'FREE',
      imgSrc: '/dibs-listing-photo.png',
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {listingsInfo.map((listing, index) => (
        <div key={index} className="rounded-xl border p-4">
          <img
            src={listing.imgSrc}
            alt="placeholder"
            className="aspect-video w-full rounded-xl border border-dashed object-cover"
          />
          <div className="p-6">
            <h3 className="mb-1 text-2xl font-semibold">{listing.title}</h3>
            <p className="text-muted-foreground">{listing.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BLPListings;
