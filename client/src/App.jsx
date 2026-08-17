import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Assets
import logoImg from './assets/emoji 2.jpg';
import step1Img from './assets/download (1).jpeg';
import bloodEmojiImg from './assets/blood emoji.jpeg';
import syringeImg from './assets/syrenge.png';
import thankYouImg from './assets/download.jpeg';

function App() {

  const [view, setView] = useState('home');
  const [step, setStep] = useState(1);


  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loadingDonors, setLoadingDonors] = useState(false);

  const initialFormState = {
    name: '', dob: '', gender: '', weight: '', phone: '', email: '', address: '',
    bloodGroup: '', medical_hiv: '', medical_hepatitis: '', medical_bp: '',
    medical_sugar: '', medical_antibiotics: '', antibiotics_detail: '',
    medical_surgery: '', surgery_detail: '', medical_pregnant: '',
    donating_first_time: '', lastDonation: ''
  };

  const [formData, setFormData] = useState(initialFormState);


  const fetchDonors = async () => {
    setLoadingDonors(true);
    try {
      const res = await axios.get('http://localhost:5000/api/donors');
      setDonors(res.data);
    } catch (err) {
      console.error('Failed to load donors:', err);
    } finally {
      setLoadingDonors(false);
    }
  };

  useEffect(() => {
    if (view === 'findBlood') {
      fetchDonors();
    }
  }, [view]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const handleNextStep = () => {
    if (!formData.name || !formData.dob || !formData.gender || !formData.weight || !formData.phone || !formData.email || !formData.address) {
      alert('Please fill out all required fields in Step 1.');
      return;
    }

    const age = calculateAge(formData.dob);
    if (age < 18 || age > 65) {
      alert(`Eligibility Notice: You must be between 18 and 65 years old. Calculated age: ${age}.`);
      return;
    }

    if (parseInt(formData.weight) < 50) {
      alert('Weight must be at least 50 kg for eligibility.');
      return;
    }

    setStep(2);
  };

  const resetStep = (stepNumber) => {
    if (stepNumber === 1) {
      setFormData((prev) => ({
        ...prev,
        name: '', dob: '', gender: '', weight: '', phone: '', email: '', address: ''
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bloodGroup: '', medical_hiv: '', medical_hepatitis: '', medical_bp: '',
        medical_sugar: '', medical_antibiotics: '', antibiotics_detail: '',
        medical_surgery: '', surgery_detail: '', medical_pregnant: '',
        donating_first_time: '', lastDonation: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEligible =
      formData.medical_hiv === 'no' &&
      formData.medical_hepatitis === 'no' &&
      formData.medical_bp === 'no' &&
      formData.medical_sugar === 'no';

    if (!isEligible) {
      setView('ineligible');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/donors', formData);
      setView('thankYou');
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend server.');
    }
  };

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup ? d.blood_group === selectedGroup : true;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="container">
   
      <header>
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => setView('home')}>
          <img src={logoImg} alt="Red Drops Logo" className="header-logo" />
          <div>
            <div className="logo">
              <span className="drop">R</span>ed <span className="drop">D</span>rops
            </div>
            <h1>Membership & Blood Donation Portal</h1>
          </div>
        </div>
        <div className="slogan">Save Lives</div>
      </header>

      <nav className="nav-bar">
        <button className={`nav-btn ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Home</button>
        <button className={`nav-btn ${view === 'findBlood' ? 'active' : ''}`} onClick={() => setView('findBlood')}>Find Blood</button>
        <button className={`nav-btn ${view === 'whyDonate' ? 'active' : ''}`} onClick={() => setView('whyDonate')}>Why Donate Blood</button>
        <button className={`nav-btn ${view === 'form' ? 'active' : ''}`} onClick={() => { setView('form'); setStep(1); }}>Register as Donor</button>
      </nav>

      
      {view === 'home' && (
        <div className="hero-card">
          <h2 className="hero-title">Welcome to Red Drops Club</h2>
          <p className="hero-subtitle">
            Connecting generous donors with those in critical need. Every single drop counts.
          </p>

          <div className="step-image-container">
            <img src={step1Img} alt="Blood Donation Illustration" className="step-image" />
          </div>

          <div className="featured-quote">
            "Tears of a mother cannot save her child, but your blood can. Be a hero, donate blood."
          </div>

          <div className="cta-button-group">
            <button className="cta-button" onClick={() => { setView('form'); setStep(1); }}>
              Donate Blood Now
            </button>
            <button className="cta-button secondary" onClick={() => setView('findBlood')}>
              Find Available Donors
            </button>
          </div>
        </div>
      )}

     
      {view === 'findBlood' && (
        <div className="hero-card" style={{ textAlign: 'left' }}>
          <h2 className="bold-title">Find Blood Donors</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Search verified registered donors available for blood requests:</p>

          <div className="search-controls">
            <input
              type="text"
              placeholder="Search by donor name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {loadingDonors ? (
            <p>Loading donor registry...</p>
          ) : filteredDonors.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', margin: '30px 0' }}>No donors found matching your search.</p>
          ) : (
            <table className="donor-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.id}>
                    <td><span className="blood-badge">{donor.blood_group}</span></td>
                    <td>{donor.name}</td>
                    <td>{donor.phone}</td>
                    <td>{donor.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

     
      {view === 'whyDonate' && (
        <div className="hero-card">
          <h2 className="bold-title" style={{ textAlign: 'left' }}>Why Donate Blood?</h2>
          <p style={{ textAlign: 'left', color: '#555' }}>
            Donating blood does not just save lives—it offers significant health and psychological benefits for you as well.
          </p>

          <div className="benefits-grid">
            <div className="benefit-item">
              <h4>Saves Up to 3 Lives</h4>
              <p>A single pint of donated blood can be separated into red cells, plasma, and platelets to help multiple patients.</p>
            </div>
            <div className="benefit-item">
              <h4>Free Health Check-Up</h4>
              <p>Prior to donation, your pulse, blood pressure, body temperature, and hemoglobin levels are evaluated.</p>
            </div>
            <div className="benefit-item">
              <h4>Balances Iron Levels</h4>
              <p>Regular blood donations help prevent iron overload in your blood, lowering cardiovascular risks.</p>
            </div>
            <div className="benefit-item">
              <h4>Emotional Well-being</h4>
              <p>Knowing you made a direct, tangible contribution to saving a human life uplifts mental wellness and purpose.</p>
            </div>
          </div>

          <button className="cta-button" onClick={() => { setView('form'); setStep(1); }}>
            Join As A Lifesaver Today
          </button>
        </div>
      )}

     
      {view === 'form' && (
        <main>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <section className="form-step">
                <h2 className="bold-title">Personal Information</h2>

                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Gender:</label>
                  <div className="radio-group">
                    <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required /> Male</label>
                    <label><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Weight (kg):</label>
                  <input type="number" name="weight" min="40" value={formData.weight} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Email Address:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Residential Address:</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
                </div>

                <div className="button-group">
                  <button type="button" className="reset-button" onClick={() => resetStep(1)}>Reset Form</button>
                  <button type="button" onClick={handleNextStep}>Continue to Medical History</button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="form-step">
                <h2 className="bold-title">Medical History & Eligibility</h2>
                <img src={syringeImg} alt="Syringe Sticker" className="sticker syringe-sticker" />

                <div className="form-group">
                  <label>Blood Group:</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <p className="bold-title">Do you currently suffer from any of the following?</p>

                {[
                  { label: '1. HIV', name: 'medical_hiv' },
                  { label: '2. Hepatitis B/C', name: 'medical_hepatitis' },
                  { label: '3. High Or Low Blood Pressure', name: 'medical_bp' },
                  { label: '4. Sugar (Diabetes)', name: 'medical_sugar' },
                  { label: '5. Currently on antibiotics', name: 'medical_antibiotics' },
                  { label: '6. Major Surgery in last 6 months', name: 'medical_surgery' },
                  { label: '7. Pregnant or gave birth recently', name: 'medical_pregnant' }
                ].map((item) => (
                  <div className="condition-group" key={item.name}>
                    <label>{item.label}:</label>
                    <div className="radio-group">
                      <label><input type="radio" name={item.name} value="yes" checked={formData[item.name] === 'yes'} onChange={handleChange} required /> Yes</label>
                      <label><input type="radio" name={item.name} value="no" checked={formData[item.name] === 'no'} onChange={handleChange} /> No</label>
                    </div>
                  </div>
                ))}

                {formData.medical_antibiotics === 'yes' && (
                  <div className="form-group">
                    <label>Which medicine and why?</label>
                    <input type="text" name="antibiotics_detail" value={formData.antibiotics_detail} onChange={handleChange} required />
                  </div>
                )}

                {formData.medical_surgery === 'yes' && (
                  <div className="form-group">
                    <label>Describe the surgery:</label>
                    <input type="text" name="surgery_detail" value={formData.surgery_detail} onChange={handleChange} required />
                  </div>
                )}

                <div className="condition-group">
                  <label>8. Donating for first time?</label>
                  <div className="radio-group">
                    <label><input type="radio" name="donating_first_time" value="yes" checked={formData.donating_first_time === 'yes'} onChange={handleChange} required /> Yes</label>
                    <label><input type="radio" name="donating_first_time" value="no" checked={formData.donating_first_time === 'no'} onChange={handleChange} /> No</label>
                  </div>
                </div>

                {formData.donating_first_time === 'no' && (
                  <div className="form-group">
                    <label>Last Date of Donation:</label>
                    <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange} required />
                  </div>
                )}

                <div className="button-group">
                  <button type="button" className="back-button" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="reset-button" onClick={() => resetStep(2)}>Reset Step</button>
                  <button type="submit" className="big-submit-button">Submit Noble Work</button>
                </div>
              </section>
            )}
          </form>
          <img src={bloodEmojiImg} alt="Friendly Blood Drop" className="sticker blood-drop-sticker" />
        </main>
      )}

      {view === 'thankYou' && (
        <div className="hero-card">
          <img src={thankYouImg} alt="Cross Band-aid" style={{ width: '80px', marginBottom: '15px' }} />
          <h2 className="bold-title">Thank You!</h2>
          <p style={{ color: '#008000', fontSize: '18px', fontWeight: 'bold' }}>
            Thank you for your noble work. Your contribution is invaluable.
          </p>
          <div className="featured-quote">"Blood donation truly is an act of humanity."</div>
          <button className="cta-button" onClick={() => setView('home')}>Back to Home</button>
        </div>
      )}

      {view === 'ineligible' && (
        <div className="hero-card">
          <h2 className="bold-title">Ineligible to Donate</h2>
          <p style={{ color: '#FF0000', fontSize: '18px', fontWeight: 'bold' }}>
            Based on your medical history, you are currently ineligible to donate blood.
          </p>
          <div className="featured-quote">"Health first, donation next. We appreciate your willingness!"</div>
          <button className="cta-button" onClick={() => setView('home')}>Back to Home</button>
        </div>
      )}
    </div>
  );
}

export default App;