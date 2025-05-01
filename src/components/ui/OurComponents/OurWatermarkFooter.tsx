const OurWatermarkFooter = () => {
  return (
    <footer className="bg-white border-t mt-8 flex w-full items-center justify-center py-6 text-center text-dibs-red">
      <p className="text-sm flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <a href="https://usedibs.com" className="text-dibs-red flex items-center">
          Experience by{' '}
          <span className="inline-flex items-center ps-2">
            <img src="/dibs-logo-red.png" alt="Dibs Logo" className="mr-1 h-6 w-6" />
            <strong className="ps-1 text-lg">Dibs</strong>
          </span>
        </a>
      </p>
    </footer>
  );
};

export default OurWatermarkFooter;
