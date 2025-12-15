import React from 'react';
import ProductPage from './ProductPage';

function Beauty() {
  return (
    <>
      <div
        className="bg-cover bg-center w-screen h-[200px] flex items-center justify-center bg-[url('/src/assets/ah-cover.jpeg')]"
      >
        <h1
          className="text-[55px] text-center font-bold"
          style={{ color: '#B02B30', fontFamily: '"Gotham", sans-serif' }}
          role="heading"
        >
          Beauty Rentals
        </h1>
      </div>
      <div>
        <ProductPage/>
      </div>
    </>
  );
}

export default Beauty;
