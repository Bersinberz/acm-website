import React, { type FormEvent, useState } from 'react';
import titlevedio from '../../assets/HomePage/Titlevedio.mp4';
import { motion as m, AnimatePresence } from "framer-motion";
import { fadeIn } from '../../components/transitions';
import ne from '../../assets/HomePage/new.png';
import videoB from '../../assets/HomePage/SISTACMSIGAI.mp4';
import sat from '../../assets/HomePage/Sathyabama Institute of Science and Technology.png';
import grp from '../../assets/HomePage/grp-01.jpeg.jpg';

// Import Icons from react-icons
import { 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaTimes,
  FaPaperPlane 
} from 'react-icons/fa';

// Import service
import { submitContactForm, type ContactFormData } from '../../services/website/Homeservice';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    
    // Get form values
    const formData: ContactFormData = {
      Firstname: (form.elements.namedItem('Firstname') as HTMLInputElement).value,
      Lastname: (form.elements.namedItem('Lastname') as HTMLInputElement).value,
      Email: (form.elements.namedItem('Email') as HTMLInputElement).value,
      Mobile: (form.elements.namedItem('Mobile') as HTMLInputElement).value,
      Message: (form.elements.namedItem('Message') as HTMLTextAreaElement).value,
    };

    try {
      // Use the service
      const result = await submitContactForm(formData);
      
      console.log("Success:", result);
      alert(result.message || "Form submitted successfully!");
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* --- VIDEO CONTROLS HIDING --- */
        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
        video::-webkit-media-controls-picture-in-picture-button { display: none !important; }
        video { -webkit-appearance: none; appearance: none; }

        @keyframes gradientShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* --- PROFESSIONAL FULL FOOTER STYLES --- */
        .main-footer {
            background: linear-gradient(to right, #000428, #004e92);
            color: #ffffff;
            padding: 60px 0 0 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            width: 100%;
            margin-top: 50px;
        }

        .footer-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px 40px 40px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 40px;
            align-items: start;
        }

        .footer-col h3 {
            color: #fff;
            font-size: 1.3rem;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #5CA0F2;
            display: inline-block;
            padding-bottom: 5px;
        }

        .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            font-size: 1rem;
            color: #e0e0e0;
        }

        .contact-item .icon {
            font-size: 1.2rem;
            margin-right: 15px;
            color: #5CA0F2; 
            margin-top: 3px;
        }

        .contact-item p a, .contact-item > a {
            color: #e0e0e0;
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }

        .contact-item p a:hover, .contact-item > a:hover {
            color: #5CA0F2;
        }

        .footer-center {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .footer-brand {
            font-size: 2.2rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 10px;
            letter-spacing: 2px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .cta-text {
            margin-bottom: 20px;
            color: #ccc;
            font-size: 1rem;
        }

        .write-us-btn {
            background: linear-gradient(45deg, #5CA0F2, #3c7ec9);
            color: #fff;
            border: none;
            padding: 12px 35px;
            font-size: 1rem;
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: background 0.3s ease, box-shadow 0.3s ease;
            margin-bottom: 30px;
            font-weight: 700;
        }

        .write-us-btn:hover {
            box-shadow: 0 6px 20px rgba(92, 160, 242, 0.5);
            background: linear-gradient(45deg, #4b92e8, #2a6cb7);
        }

        .social-icons {
            display: flex;
            gap: 15px;
        }

        .social-icon {
            width: 45px;
            height: 45px;
            background: transparent;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 1.4rem;
            color: #e0e0e0;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .social-icon.twitter:hover { color: #1DA1F2; }
        .social-icon.instagram:hover { color: #E1306C; }
        .social-icon.linkedin:hover { color: #0077B5; }

        .footer-map iframe {
            width: 100%;
            height: 250px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .cpoy-cont {
            background: linear-gradient(45deg, #F5F7F6, #5CA0F2);
            background-size: 300% 300%;
            animation: gradientShift 12s ease-in-out infinite;
            padding: 20px 0;
            text-align: center;
            width: 100%;
            margin-top: 0;
        }

        .Copyrights { color: #000; }
        .Copyrights h2 { font-size: 1.1rem; margin-bottom: 10px; font-weight: 800; letter-spacing: 1px; }
        .Copyrights p { 
            font-size: 0.9rem; 
            margin: 5px 0; 
            font-weight: 600; 
            line-height: 1.6;
        }

        /* --- MODAL STYLES --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center;
            z-index: 10000;
        }
        
        .modal-content-styled {
            background: linear-gradient(135deg, #000428, #004e92);
            padding: 50px 40px;
            width: 90%;
            max-width: 800px;
            border-radius: 20px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255,255,255,0.1); 
            color: #fff;

            /* SCROLLABLE PROPERTIES */
            max-height: 85vh; /* Limits height to 85% of viewport */
            overflow-y: auto; /* Enables vertical scrolling */
            overflow-x: hidden; /* Hides horizontal scrolling */
            
            /* Firefox Scrollbar Support */
            scrollbar-width: thin;
            scrollbar-color: #5CA0F2 #000428;
        }

        /* --- CUSTOM UNIQUE SCROLLBAR DESIGN (Webkit/Chrome/Edge) --- */
        .modal-content-styled::-webkit-scrollbar {
            width: 10px;
        }

        .modal-content-styled::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 0 20px 20px 0; /* Match modal rounded corners on the right */
            margin: 20px 0; /* Add some space top/bottom */
        }

        .modal-content-styled::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #5CA0F2, #004e92);
            border-radius: 10px;
            border: 2px solid rgba(0, 4, 40, 0.8); /* Creates a 'floating' look */
        }

        .modal-content-styled::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #7eb6ff, #1c66a6);
        }

        /* Form Grid Layout */
        .formBx {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            width: 100%;
        }

        .inputbx.full-width {
            grid-column: span 2;
        }

        .inputbx {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .inputbx span { 
            display: block; 
            margin-bottom: 5px; 
            font-weight: 600; 
            font-size: 0.95rem; 
            color: #e0e0e0; 
            transform-origin: left;
            transition: color 0.3s;
        }

        .inputbx:focus-within span {
            color: #5CA0F2;
        }

        /* --- INPUT LINE STYLES --- */
        .inputbx input, .inputbx textarea {
            width: 100%; 
            box-sizing: border-box; 
            padding: 10px 5px; 
            border: none;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3); 
            border-radius: 0; 
            font-size: 1rem; 
            color: #fff; 
            background: transparent; 
            outline: none; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .inputbx input::placeholder, .inputbx textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .inputbx input:focus, .inputbx textarea:focus { 
            border-bottom: 2px solid #5CA0F2; 
            background: transparent; 
            box-shadow: 0 5px 10px -2px rgba(92, 160, 242, 0.5); 
        }

        .inputbx textarea {
            min-height: 80px;
            resize: vertical;
            margin-top: 10px;
        }

        /* Sticky Close Button (Optional: to keep it visible while scrolling) */
        .close-modal { 
            position: absolute; 
            top: 20px; 
            right: 20px; 
            background: rgba(255, 255, 255, 0.1); 
            width: 40px; height: 40px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 1.2rem; 
            cursor: pointer; 
            color: #fff;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
        }

        .close-modal:hover {
            background: #ff4d4d;
            border-color: #ff4d4d;
            color: #fff;
        }

        .submit-btn {
            background: #5CA0F2;
            color: #000428; 
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.4s ease;
            display: flex; justify-content: center; align-items: center; gap: 10px;
            margin-top: 10px;
            width: 100%;
        }

        .submit-btn:hover { 
            background: #fff;
        }

        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .modal-decor {
            position: absolute;
            top: -50px; left: -50px;
            width: 150px; height: 150px;
            background: radial-gradient(circle, rgba(92,160,242,0.4) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
            opacity: 0.5;
            z-index: 0;
            pointer-events: none;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .spinner {
            display: inline-block;
            margin-left: 10px;
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @media (max-width: 900px) {
            .footer-container { grid-template-columns: 1fr; gap: 40px; text-align: center; }
            .footer-col h3 { border-bottom: none; }
            .contact-item { justify-content: center; }
        }
        @media (max-width: 600px) {
            .formBx { grid-template-columns: 1fr; }
            .inputbx.full-width { grid-column: span 1; }
            .modal-content-styled { padding: 30px 20px; width: 95%; max-height: 80vh;}
        }
      `}</style>
      
      <div className='scroll-watcher'></div>

      <div className='main'>
        <video 
          src={titlevedio} autoPlay loop muted playsInline 
          disablePictureInPicture={true}
          controls={false}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <div className='About'>
        {/* ... (Content sections - kept same as provided) ... */}
        <div className='Aboutt'>
          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='aboutsec'>
            <h2 className='about-heading'>ABOUT <span>SIST ACM SIGAI</span></h2>
            <p className='about-paragraph'>Founded on the 25th of March 2024, SIST ACM SIGAI is the first SIGAI student chapter in Tamil Nadu...</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='main-about'>
            <video 
                src={videoB} autoPlay loop controls={false} muted playsInline 
                disablePictureInPicture={true} 
                style={{ pointerEvents: 'none' }} 
            />
          </m.div>

          <m.div variants={fadeIn("up", 0.4)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} className='mission'>
            <h1><span>OUR</span> MISSION</h1>
            <p className='mission-paragraph'>At SIST ACM SIGAI Student Chapter, we're on a mission to ignite curiosity, foster collaboration...</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='image-container'>
            <img src={ne} alt='LOGO REVEAL' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='vision'>
            <h1><span>OUR</span> VISION</h1>
            <p className='mission-paragraph'>We envision a vibrant community where students from all backgrounds come together...</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" exit="exit" viewport={{ once: false, amount: 0.7 }} className='image-container'>
            <img src={sat} alt='SIST ACM SIGAI' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='ideology'>
            <h1><span>OUR</span> IDEOLOGY</h1>
            <p className='mission-paragraph'>In our student chapter, we're not just about AI; we're about people...</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.7 }} className='image-container'>
            <img src={grp} alt='OUR CORE UNIT' loading="lazy" />
          </m.div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="main-footer">
        <div className="footer-container">
            <div className="footer-col">
                <h3>Contact Us</h3>
                <div className="contact-item">
                    <span className="icon"><FaMapMarkerAlt /></span>
                    <p>
                        <a href='https://www.sathyabama.ac.in/' target="_blank" rel="noopener noreferrer">
                          Sathyabama Institute of Science and Technology Semmencheri, Chennai, India
                        </a><br />
                    </p>
                </div>
                <div className="contact-item">
                    <span className="icon"><FaEnvelope /></span>
                    <a href='mailto:sist.sigai@gmail.com'>sist.sigai@gmail.com</a>
                </div>
                <div className="contact-item">
                    <span className="icon"><FaPhoneAlt /></span>
                    <a href='tel:+916383594324'>+91 6383594324</a>
                </div>
            </div>

            <div className="footer-col footer-center">
                <div className="footer-brand">SIST ACM SIGAI</div>
                <p className="cta-text">Have questions or want to collaborate?</p>
                
                <button className="write-us-btn" onClick={toggleModal}>
                    Write to Us <FaEnvelope style={{marginLeft:'8px', display:'inline'}}/>
                </button>

                <div className="social-icons">
                    <a href='https://x.com/sist_sigai' target="_blank" aria-label="Twitter" className="social-icon twitter">
                      <FaTwitter />
                    </a>
                    <a href='https://www.instagram.com/sist_sigai?igsh=bzBjc3Jmam85NTdn' target="_blank" aria-label="Instagram" className="social-icon instagram">
                      <FaInstagram />
                    </a>
                    <a href='https://www.linkedin.com/company/sist-acm-sigai-student-chapter/' target="_blank" aria-label="LinkedIn" className="social-icon linkedin">
                      <FaLinkedin />
                    </a>
                </div>
            </div>

            <div className="footer-col footer-map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5412320274245!2d80.22350167642874!3d12.87288088743351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b8c90befe2b%3A0x170ab8b5b21bb530!2sSathyabama%20Institute%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1710506289648!5m2!1sen!2sin"
                    title="Sathyabama Location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                ></iframe>
            </div>
        </div>

        <div className='cpoy-cont'>
           <div className='Copyrights'>
             <h2>© 2025 SIST ACM SIGAI STUDENT CHAPTER</h2>
             <p>
                Website developed by ADITYA SAI TEJA B | 
                Designed by MANISRI VENKATESH | 
                Backend development: BHUVANESH, DEVENDRA REDDY, BERSIN and RAM PRADEEP
             </p>
           </div>
        </div>
      </footer>

      {/* --- ANIMATIC WIDER MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="modal-overlay">
            <m.div 
                className="modal-content-styled"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <div className="modal-decor"></div>
                
                <button className="close-modal" onClick={toggleModal}><FaTimes /></button>
                
                <h3 style={{textAlign: 'center', marginBottom: '30px', color: '#fff', fontSize: '1.8rem', position:'relative', zIndex:1}}>
                    Send a Message
                </h3>
                
                <form className="form" onSubmit={submitForm} style={{position:'relative', zIndex:1}}>
                <div className='formBx'>
                    {/* First Name & Last Name Side by Side */}
                    <div className='inputbx'>
                        <span>First Name</span>
                        <input 
                          type='text' 
                          name='Firstname' 
                          required 
                          disabled={isSubmitting}
                        />
                    </div>
                    <div className='inputbx'>
                        <span>Last Name</span>
                        <input 
                          type='text' 
                          name='Lastname' 
                          required 
                          disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* Email & Mobile Side by Side */}
                    <div className='inputbx'>
                        <span>Email</span>
                        <input 
                          type='email' 
                          name='Email' 
                          required 
                          disabled={isSubmitting}
                        />
                    </div>
                    <div className='inputbx'>
                        <span>Mobile</span>
                        <input 
                          type='tel' 
                          name='Mobile' 
                          pattern="[+]{1}[0-9]{2} [0-9]{10}" 
                          required 
                          disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* Message - Full Width */}
                    <div className='inputbx full-width'>
                        <span>Message</span>
                        <textarea 
                          name='Message' 
                          required 
                          disabled={isSubmitting}
                        ></textarea>
                    </div>
                    
                    {/* Submit - Full Width */}
                    <div className='inputbx full-width'>
                        <button 
                          type='submit' 
                          className="submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              SENDING...
                              <div className="spinner"></div>
                            </>
                          ) : (
                            <>
                              SEND MESSAGE <FaPaperPlane />
                            </>
                          )}
                        </button>
                    </div>
                </div>
                </form>
            </m.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;