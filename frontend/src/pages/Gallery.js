import React from 'react';

function Gallery() {
  const images = [
    { url: 'https://via.placeholder.com/300x200?text=Graduation+Day', caption: 'Graduation Day' },
    { url: 'https://via.placeholder.com/300x200?text=Science+Fair', caption: 'Science Fair 2024' },
    { url: 'https://via.placeholder.com/300x200?text=Sports+Day', caption: 'Sports Day Finals' },
    { url: 'https://via.placeholder.com/300x200?text=Music+Fest', caption: 'Music & Drama Fest' },
    { url: 'https://via.placeholder.com/300x200?text=Clean+Up+Drive', caption: 'Community Clean-Up' },
    { url: 'https://via.placeholder.com/300x200?text=Open+Day', caption: 'Open Day Showcase' },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Gallery</h2>
      <div className="row g-3">
        {images.map((img, index) => (
          <div className="col-md-4" key={index}>
            <div className="card">
              <img src={img.url} className="card-img-top" alt={img.caption} />
              <div className="card-body text-center">
                <p className="card-text">{img.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;

