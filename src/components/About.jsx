import React from 'react';

const About = () => {
  const values = [
     {
      icon: "fas fa-heart",
      title: "Core Values",
      description: "JEM BRILLIANT MIND MONTESSORI SCHOOL INC. Our guiding principles are at the heart of our daily work with children and the foundation of our mission and vision. As members of the Montessori School of JEM BRILLIANT MIND MONTESSORI SCHOOL INC. faculty and staff, we hold these core values"
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Mission",
      description: "The Montessori School of JEM BRILLIANT MIND MONTESSORI SCHOOL INC. (JBMMSI) educates children to prepare them for a life of purpose, integrity, and academic accomplishment. We develop independent learners, critical thinkers, and tomorrow's leaders. JBMMSI does not discriminate on the basis of race, color, national origin, sex, disability, religion or age."
    },
    {
      icon: "fas fa-lightbulb",
      title: "Vision",
      description: "The Montessori School of JEM BRILLIANT MIND MONTESSORI SCHOOL INC. (JBMMSI) will be well-known in the community as an accredited school for Toddlers through Adolescents. JBMMSI will operate as the leading examplar of Montessori education. We will provide an environment that nurtures children to reach their full potential, creating a high-quality, enriching environment for staff and a welcoming, open partnership with parents and families."
    }
  ];

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-content">
          <div className="about-img">
            <img src={`${process.env.PUBLIC_URL}/image/jbmmsi-logo.png`} alt="About JBMMSI" />
          </div>
          
          <div className="about-text">
            <h2 className="section-title">About <span>Us</span></h2>
        
            <div className="values-list">
              {values.map((value, index) => (
                <div key={index} className="value-item">
                  <div className="value-icon">
                    <i className={value.icon}></i>
                  </div>
                  <div className="value-text">
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
