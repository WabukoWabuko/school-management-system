import React from 'react';

function Gallery() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Gallery</h2>
      <div className="row g-3">
        {[...Array(6)].map((_, index) => (
          <div className="col-md-4" key={index}>
            <img
              src={`https://via.placeholder.com/300x200?text=Event+${index + 1}`}
              className="img-fluid rounded"
              alt={`Event ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
