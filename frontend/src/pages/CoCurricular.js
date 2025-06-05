import React from 'react';

function CoCurricular() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Co-Curricular Activities</h2>
      <p className="text-center mb-5">
        At Elite Academy, learning goes beyond the classroom. Our co-curriculars mold leaders, artists, athletes, and innovators.
      </p>
      <div className="row">
        {[
          {
            title: "Sports",
            text: "From football and basketball to swimming and athletics, our students represent the school at county and national levels.",
            img: "https://via.placeholder.com/300x200?text=Sports",
          },
          {
            title: "Music & Drama",
            text: "Award-winning performances that blend culture and modern expression. Our students shine in national drama and music festivals.",
            img: "https://via.placeholder.com/300x200?text=Music+%26+Drama",
          },
          {
            title: "Clubs & Societies",
            text: "Our Debate Club has won regional competitions. Science Club innovates tech. Environmental Club runs real-world sustainability projects.",
            img: "https://via.placeholder.com/300x200?text=Clubs",
          },
          {
            title: "Leadership Programs",
            text: "From student council to peer mentorship, students take charge and learn to lead with empathy and impact.",
            img: "https://via.placeholder.com/300x200?text=Leadership",
          },
          {
            title: "Tech & Innovation",
            text: "Coding bootcamps, robotics tournaments, and startup expos — where the next tech revolutionaries are made.",
            img: "https://via.placeholder.com/300x200?text=Tech",
          },
          {
            title: "Community Service",
            text: "We walk the talk. Our students volunteer in hospitals, cleanups, and local outreach programs that make real change.",
            img: "https://via.placeholder.com/300x200?text=Community",
          },
        ].map((activity, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div className="card h-100">
              <img src={activity.img} className="card-img-top" alt={activity.title} />
              <div className="card-body">
                <h5 className="card-title">{activity.title}</h5>
                <p className="card-text">{activity.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoCurricular;

