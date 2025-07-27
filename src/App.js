
import React, { useState, useEffect } from 'react';
import './index.css'; // Import the main CSS file
import PhoneInput from 'react-phone-input-2'; // Import the phone input component
import 'react-phone-input-2/lib/style.css'; // Import the default styles for the phone input
import CryptoJS from 'crypto-js'; // Import CryptoJS for encryption

// --- Component Definitions ---

// Header component with dynamic class based on scroll position
const Header = ({ isScrolled }) => {
  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        <a href="/" className="logo">MeetsVirtual</a>
        <nav>
          <ul>
            <li><a href="#designs">Designs</a></li>
            <li><a href="#vr-experience">VR Experience</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Hero section component
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Experience Your Future, Virtually.</h1>
        <p>Step into your dream home or next architectural marvel before it's built. MeetsVirtual brings designs to life with immersive VR technology.</p>
        <a href="#designs" className="btn">Explore Designs</a>
      </div>
    </section>
  );
};

// Design showcase section component
const DesignShowcase = () => {
  const designs = [
    {
      id: 1,
      title: 'Modern Apartment',
      description: 'A sleek, open-plan apartment with stunning city views.',
      image: '/images/apartment.png' // Ensure this image exists in your public/images folder
    },
    {
      id: 2,
      title: 'Machine',
      description: 'Designed with green principles and natural materials.',
      image: '/images/machine.png' // Ensure this image exists in your public/images folder
    },
    {
      id: 3,
      title: 'Hospital Research',
      description: 'Innovative layout for enhanced productivity and collaboration.',
      image: '/images/heart.png' // Ensure this image exists in your public/images folder
    },
    {
      id: 4,
      title: 'Education',
      description: 'Expansive living with a private pool and breathtaking landscapes.',
      image: '/images/solarsystem.png' // Ensure this image exists in your public/images folder
    },
  ];

  return (
    <section id="designs" className="section">
      <div className="container">
        <h2>Our Immersive Designs</h2>
        <div className="design-grid">
          {designs.map(design => (
            <DesignItem key={design.id} design={design} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual design item component
const DesignItem = ({ design }) => {
  return (
    <div className="design-item">
      <img src={process.env.PUBLIC_URL + design.image} alt={design.title} />
      <div className="design-item-content">
        <h3>{design.title}</h3>
        <p>{design.description}</p>
        <a href="#" className="btn btn-small">View in VR (Coming Soon)</a>
      </div>
    </div>
  );
};

// VR Experience section component
const VRSection = () => {
  return (
    <section id="vr-experience" className="vr-section">
      <div className="container">
        <h2>Feel the Reality with VR Glasses</h2>
        <div className="vr-content">
          <div className="vr-image">
            {/* Make sure this image path is correct relative to your public folder */}
            <img src={process.env.PUBLIC_URL + '/Images/IMG_20250126_194619_498.webp'} alt="VR Glasses" />
          </div>
          <div className="vr-text">
            <p>At MeetsVirtual, we don't just show you designs; we let you step inside them. Our cutting-edge virtual reality integration allows you to walk through your future home or building, explore every corner, and truly understand the space before construction even begins.</p>
            <p>Experience realistic lighting, material textures, and spatial awareness that flat screens simply cannot replicate. This is the next generation of design visualization.</p>
            <a href="#contact" className="btn">Get Your VR Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact section component that renders the ContactForm
const ContactSection = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2>Get Started Now!</h2>
        <p>Tell us about your project and we'll help you visualize your dreams.</p>
        <ContactForm />
      </div>
    </section>
  );
};

// Contact form component with state management, PhoneInput, and encryption
const ContactForm = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // This will store the full number including the country code
    description: ''
  });

  // --- IMPORTANT: NEVER HARDCODE SECRET KEYS IN PRODUCTION FRONTEND CODE ---
  // This is for demonstration purposes only.
  // In a real application, consider:
  // 1. Using HTTPS (essential) for transport layer security.
  // 2. Public-key cryptography (RSA) to exchange a symmetric key securely.
  // 3. Environment variables (for server-side keys).
  const SECRET_KEY = 'your-super-secret-key-that-should-be-long-and-random'; // Replace with a strong, dynamic key

  // Handler for standard input fields (name, email, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler specifically for PhoneInput
  const handlePhoneChange = (value) => {
    // 'value' from react-phone-input-2 is the full number (e.g., "919876543210")
    setFormData(prevState => ({
      ...prevState,
      phone: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // 1. Encrypt the form data
    const plaintext = JSON.stringify(formData);
    const ciphertext = CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();

    // Log the encrypted data (for debugging)
    console.log('Plaintext:', plaintext);
    console.log('Encrypted Data (Ciphertext):', ciphertext);

    // --- Replace with your actual API endpoint ---
    // For local testing, if your backend is on port 3001:
    // const API_ENDPOINT = 'http://localhost:3001/api/contact';
    // For production, use HTTPS:
    
    const API_ENDPOINT = 'http://localhost:3001/api/contact';

    try {
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might add an Authorization header if your API requires it
        },
        body: JSON.stringify({ encryptedData: ciphertext }), // Send the encrypted data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('API Response:', result);
      alert('Thank you for your inquiry! We will get back to you soon.');
  
      // Clear the form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your inquiry. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Your Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Your Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number:</label>
        {/* PhoneInput component */}
        <PhoneInput
          country={'in'} // Set default country (e.g., 'in' for India)
          value={formData.phone}
          onChange={handlePhoneChange} // Use the dedicated handler for PhoneInput
          inputProps={{
            name: 'phone',
            required: false, // Set to true if phone number is mandatory
            // You can add a placeholder: placeholder: "e.g., 9876543210"
          }}
          // Custom classes for styling overrides in index.css
          containerClass="phone-input-container"
          inputClass="phone-input"
          buttonClass="phone-input-button"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">What are you looking for?</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Home design visualization, commercial building tour, virtual staging..."
        ></textarea>
      </div>
      <button type="submit" className="btn">Send Inquiry</button>
    </form>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} MeetsVirtual. All rights reserved.</p>
      </div>
    </footer>
  );
};

// --- Main App Component ---
function App() {
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  // useEffect hook to add and remove scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Define a scroll threshold (e.g., 100 pixels from the top)
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="App">
      {/* Pass the isScrolled state as a prop to the Header component */}
      <Header isScrolled={isScrolled} />
      <Hero />
      <DesignShowcase />
      <VRSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;