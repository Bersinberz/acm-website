import React, { type FormEvent, useEffect, useState } from 'react';
import titlevedio from '../../assets/HomePage/Titlevedio.mp4';
import { motion as m, AnimatePresence } from "framer-motion";
import { fadeIn } from '../../components/transitions';
import ne from '../../assets/HomePage/new.png';
import videoB from '../../assets/HomePage/SISTACMSIGAI.mp4';
import sat from '../../assets/HomePage/Sathyabama Institute of Science and Technology.png';
import grp from '../../assets/HomePage/grp-01.jpeg.jpg';
import { GlobalLoader } from "../../components/GlobalLoader";
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
import { submitContactForm, type ContactFormData, type AdminSettings, getAdminSettings } from '../../services/website/Homeservice';
import { FloatingOrb } from '../../components/StatusMessage';
import CopyrightFooter from '../../components/Footer';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAdminSettings();
        setAdminSettings(data);
      } catch (err) {
        console.error("Failed to load admin settings", err);
      }
    };

    fetchSettings();
  }, []);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setIsLoading(true);

    const form = e.target as HTMLFormElement;

    const formData: ContactFormData = {
      Firstname: (form.elements.namedItem('Firstname') as HTMLInputElement).value,
      Lastname: (form.elements.namedItem('Lastname') as HTMLInputElement).value,
      Email: (form.elements.namedItem('Email') as HTMLInputElement).value,
      Mobile: (form.elements.namedItem('Mobile') as HTMLInputElement).value,
      Message: (form.elements.namedItem('Message') as HTMLTextAreaElement).value,
    };

    try {
      const result = await submitContactForm(formData);

      setStatusType("success");
      setStatusMessage(result.message || "Message sent successfully!");
      setStatusVisible(true);

      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);

      setStatusType("error");
      setStatusMessage("Failed to submit form. Please try again.");
      setStatusVisible(true);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const toTitleCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    if (statusVisible) {
      const timer = setTimeout(() => setStatusVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusVisible]);

  return (
    <>
      <GlobalLoader isLoading={isLoading} />

      <FloatingOrb
        isVisible={statusVisible}
        message={statusMessage}
        type={statusType}
        onClose={() => setStatusVisible(false)}
      />

      <style>{`
        /* --- GLOBAL RESETS --- */
        * {
            box-sizing: border-box;
        }

        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
        video::-webkit-media-controls-picture-in-picture-button { display: none !important; }
        video { -webkit-appearance: none; appearance: none; }

        @keyframes gradientShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* --- LAYOUT CONTAINERS --- */
        .main {
            position: relative;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            background: #000; 
        }

        /* Fullscreen Hero Video (Desktop Default) */
        .main video {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Keeps fullscreen on desktop */
            position: absolute;
            top: 0; left: 0;
            z-index: 0;
        }

        .About {
            position: relative;
            z-index: 1;
            background: inherit;
            width: 100%;
            overflow-x: hidden; 
        }

        .Aboutt {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        /* --- SECTIONS & SPACING --- */
        .ideology, .vision, .mission, .main-about, .image-mission, .aboutsec, .image-container {
            margin-top: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
        }

        .main-about {
            margin-top: 100px;
            width: 100%;
        }

        /* Responsive Video Container for Content */
        .main-about video {
            position: relative;
            width: 80%;
            max-width: 900px;
            height: auto;
            aspect-ratio: 16/9;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover;
        }

        /* --- TYPOGRAPHY --- */
        h1, .about-heading {
            color: white;
            font-size: clamp(28px, 5vw, 50px);
            margin-bottom: 20px;
            text-transform: uppercase;
            line-height: 1.2;
            text-align: center;
        }

        h1 span, .about-heading span {
            color: #0099ff;
        }

        p.mission-paragraph, p.about-paragraph {
            color: #e0e0e0;
            font-size: clamp(16px, 2vw, 20px);
            font-weight: 300;
            font-family: "Roboto", sans-serif;
            line-height: 1.6;
            text-align: justify;
            max-width: 900px;
            padding: 0 10px;
        }

        /* --- IMAGES --- */
.image-container img {
    width: 80%;
    max-width: 900px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
        
        .Aboutt img {
             max-width: 100%;
             height: auto;
        }

        /* --- FOOTER --- */
        .main-footer {
            background: linear-gradient(to right, #000428, #004e92);
            color: #ffffff;
            padding: 60px 0 0 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 100%;
            margin-top: 50px;
        }

        .footer-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px 40px 20px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
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
            min-width: 20px;
        }

        .contact-item p a, .contact-item > a {
            color: #e0e0e0;
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
            word-break: break-word;
        }

        .contact-item p a:hover, .contact-item > a:hover {
            color: #5CA0F2;
        }

        .footer-center {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .footer-brand {
            font-size: 2.2rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 10px;
            letter-spacing: 2px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
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
            white-space: nowrap;
        }

        .write-us-btn:hover {
            box-shadow: 0 6px 20px rgba(92, 160, 242, 0.5);
            background: linear-gradient(45deg, #4b92e8, #2a6cb7);
        }

        .social-icons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .social-icon {
            width: 45px;
            height: 45px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 1.4rem;
            color: #e0e0e0;
            transition: all 0.3s ease;
        }

        .social-icon:hover { transform: translateY(-3px); }
        .social-icon.twitter:hover { color: #1DA1F2; background: rgba(29, 161, 242, 0.1); }
        .social-icon.instagram:hover { color: #E1306C; background: rgba(225, 48, 108, 0.1); }
        .social-icon.linkedin:hover { color: #0077B5; background: rgba(0, 119, 181, 0.1); }

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
            padding: 20px;
            text-align: center;
            width: 100%;
        }

        .Copyrights { color: #000; }
        .Copyrights h2 { font-size: 1rem; margin-bottom: 10px; font-weight: 800; }
        .Copyrights p {
            font-size: 0.85rem;
            margin: 5px 0;
            font-weight: 600;
            line-height: 1.6;
        }

        /* --- MODAL --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center;
            z-index: 10000;
            padding: 20px;
        }

        .modal-content-styled {
            background: linear-gradient(135deg, #000428, #004e92);
            padding: 40px;
            width: 100%;
            max-width: 800px;
            border-radius: 20px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            max-height: 90vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
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

        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.1);
            width: 35px; height: 35px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 1rem;
            cursor: pointer;
            color: #fff;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
        }

        .close-modal:hover { background: #ff4d4d; border-color: #ff4d4d; }

        .formBx {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            width: 100%;
        }

        .inputbx.full-width { grid-column: span 2; }

        .inputbx {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .inputbx span {
            margin-bottom: 5px;
            font-weight: 600;
            font-size: 0.9rem;
            color: #e0e0e0;
        }

        .inputbx input, .inputbx textarea {
            width: 100%;
            padding: 10px;
            border: none;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 1rem;
            color: #fff;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
        }

        .inputbx input:focus, .inputbx textarea:focus {
            border-bottom: 2px solid #5CA0F2;
            background: rgba(255,255,255,0.1);
        }

        .submit-btn {
            background: #5CA0F2;
            color: #000428;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 800;
            text-transform: uppercase;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            display: flex; justify-content: center; align-items: center; gap: 10px;
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* --- MEDIA QUERIES --- */

        @media (max-width: 1024px) {
            .footer-container {
                gap: 20px;
            }
        }

        @media (max-width: 900px) {
            .footer-container {
                grid-template-columns: 1fr;
                text-align: center;
            }
            .footer-col h3 {
                border-bottom: none;
                margin-top: 20px;
            }
            .image-container img {
              width: 95%;
            }
            /* Reset Contact Items to work with mobile alignment below */
            .contact-item {
                justify-content: center;
            }
            .main-about video {
                width: 95%;
            }
        }

        @media (max-width: 600px) {
            /* --- FIX FOR TITLE VIDEO OVERLAP & SPACING --- */
            .main {
                /* Add padding to push video below the fixed navbar */
                padding-top: 80px; 
                /* Remove fixed height so container shrinks to fit video exactly */
                height: auto; 
                background: #000;
                display: block; 
            }

            .main video {
                position: relative;
                width: 100%;
                height: auto;
                object-fit: contain; /* Shows full video content including text */
            }
            /* ------------------------------------- */

            /* --- FIX FOR CONTACT US ALIGNMENT --- */
            .footer-container {
               text-align: center;
            }
            
            .contact-item {
               display: flex;
               justify-content: center; /* Keeps the block centered in screen */
               align-items: center; /* Vertically aligns icon with single line text */
               text-align: left; /* Keeps text left aligned relative to icon */
               gap: 15px; /* Adds space between icon and text */
               width: 100%;
            }
            
            /* Special handling for address text to prevent ragged centering */
            .contact-item p, .contact-item a {
               text-align: left;
               flex: 0 1 auto; /* Allows text to wrap naturally */
               max-width: 80%; /* Prevents text from hitting edges */
            }
            
            /* Align icon to top for multi-line address */
            .contact-item:first-of-type { 
               align-items: flex-start;
            }
            
            .contact-item .icon {
               margin-right: 0; /* Reset margin since we use gap */
               margin-top: 3px; /* visual tweak for address */
            }
            /* ------------------------------------- */

            .Aboutt {
                padding: 40px 15px;
            }
            .main-about {
                margin-top: 60px;
            }
            .main-about video {
                width: 100%; 
                border-radius: 8px;
            }
            h1, .about-heading {
                font-size: 28px; 
            }
            .formBx {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .inputbx.full-width {
                grid-column: span 1;
            }
            .modal-content-styled {
                padding: 30px 20px;
                width: 100%;
                height: auto;
                max-height: 85vh;
            }
            .write-us-btn {
                width: 100%;
            }
        }
      `}</style>

      <div className='main'>
        <video
          src={titlevedio}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture={true}
          controls={false}
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <div className='About'>
        <div className='Aboutt'>
          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='aboutsec'>
            <h2 className='about-heading'>ABOUT <span>SIST ACM SIGAI</span></h2>
            <p className='about-paragraph'>
              {adminSettings?.about}
            </p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='main-about'>
            <video
              src={videoB}
              autoPlay
              loop
              controls={false}
              muted
              playsInline
              disablePictureInPicture={true}
              style={{ pointerEvents: 'none' }}
            />
          </m.div>

          <m.div variants={fadeIn("up", 0.4)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='mission'>
            <h1><span>OUR</span> MISSION</h1>
            <p className='mission-paragraph'>
              {adminSettings?.mission}
            </p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={ne} alt='LOGO REVEAL' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='vision'>
            <h1><span>OUR</span> VISION</h1>
            <p className='mission-paragraph'>
              {adminSettings?.vision}
            </p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" exit="exit" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={sat} alt='SIST ACM SIGAI' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='ideology'>
            <h1><span>OUR</span> IDEOLOGY</h1>
            <p className='mission-paragraph'>
              {adminSettings?.ideology}
            </p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={grp} alt='OUR CORE UNIT' loading="lazy" />
          </m.div>
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <span className="icon"><FaMapMarkerAlt /></span>
              <p>
                <a
                  href={adminSettings?.contact.location}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {adminSettings?.contact.location
                    ? toTitleCase(adminSettings.contact.location)
                    : ""}
                </a>
              </p>
            </div>
            <div className="contact-item">
              <span className="icon"><FaEnvelope /></span>
              <a href={`mailto:${adminSettings?.contact.email}`} style={{ wordBreak: 'break-all' }}>
                {adminSettings?.contact.email}
              </a>
            </div>
            <div className="contact-item">
              <span className="icon"><FaPhoneAlt /></span>
              <a href={`tel:${adminSettings?.contact.phone}`}>
                {adminSettings?.contact.phone}
              </a>
            </div>
          </div>

          <div className="footer-col footer-center">
            <div className="footer-brand">
              {adminSettings?.orgName}
            </div>
            <p className="cta-text">Have questions or want to collaborate?</p>

            <button className="write-us-btn" onClick={toggleModal}>
              Write to Us <FaEnvelope style={{ marginLeft: '8px', display: 'inline' }} />
            </button>

            <div className="social-icons">
              <a href={adminSettings?.socials.twitter} target="_blank" aria-label="Twitter" className="social-icon twitter">
                <FaTwitter />
              </a>
              <a href={adminSettings?.socials.instagram} target="_blank" aria-label="Instagram" className="social-icon instagram">
                <FaInstagram />
              </a>
              <a href={adminSettings?.socials.linkedin} target="_blank" aria-label="LinkedIn" className="social-icon linkedin">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-col footer-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5412320274245!2d80.22350177642874!3d12.87288078743351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b8c90befe2b%3A0x170ab8b5b21bb530!2sSathyabama%20Institute%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1710506289648!5m2!1sen!2sin"
              title="Sathyabama Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <CopyrightFooter />
      </footer>

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

              <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff', fontSize: '1.8rem', position: 'relative', zIndex: 1 }}>
                Send a Message
              </h3>

              <form className="form" onSubmit={submitForm} style={{ position: 'relative', zIndex: 1 }}>
                <div className='formBx'>
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
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      title="Enter a valid 10-digit mobile number"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='inputbx full-width'>
                    <span>Message</span>
                    <textarea
                      name='Message'
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className='inputbx full-width'>
                    <button
                      type='submit'
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      SEND MESSAGE <FaPaperPlane />
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