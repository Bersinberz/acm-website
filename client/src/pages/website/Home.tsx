import React, { type FormEvent, useEffect, useState } from 'react';
import titlevedio from '../../assets/HomePage/Titlevedio.mp4';
import { motion as m, AnimatePresence } from "framer-motion";
import { fadeIn } from '../../components/transitions';
import ne from '../../assets/HomePage/new.avif';
import videoB from '../../assets/HomePage/SISTACMSIGAI.mp4';
import sat from '../../assets/HomePage/Sathyabama Institute of Science and Technology.avif';
import grp from '../../assets/HomePage/grp-01.jpeg.avif';
import { GlobalLoader } from "../../components/GlobalLoader";
import {
  FaMapLocationDot,
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaXmark,
  FaPaperPlane,
  FaCircleExclamation
} from 'react-icons/fa6';
import { submitContactForm, type ContactFormData, type AdminSettings, getAdminSettings } from '../../services/website/Homeservice';
import { FloatingOrb } from '../../components/StatusMessage';
import CopyrightFooter from '../../components/Footer';

// Validation types
interface FormErrors {
  Firstname?: string;
  Lastname?: string;
  Email?: string;
  Mobile?: string;
  Message?: string;
}

interface FormTouched {
  Firstname?: boolean;
  Lastname?: boolean;
  Email?: boolean;
  Mobile?: boolean;
  Message?: boolean;
}

// --- NEW: SKELETON LOADER COMPONENT ---
const TextSkeleton = () => (
  <span className="skeleton-wrapper">
    <span className="skeleton-line" style={{ width: '90%' }}></span>
    <span className="skeleton-line" style={{ width: '95%' }}></span>
    <span className="skeleton-line" style={{ width: '80%' }}></span>
  </span>
);

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    Firstname: '',
    Lastname: '',
    Email: '',
    Mobile: '',
    Message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  // Validation functions
  const validateField = (name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case 'Firstname':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'Min 2 characters';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Letters only';
        return '';
      case 'Lastname':
        if (!value.trim()) return 'Last name is required';
        return '';
      case 'Email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        return '';
      case 'Mobile':
        if (!value.trim()) return 'Mobile is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Invalid mobile';
        return '';
      case 'Message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Min 10 characters';
        return '';
      default: return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ContactFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) validateForm();
  }, [formData, touched]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldName = name as keyof ContactFormData;
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'Mobile') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const resetForm = () => {
    setFormData({ Firstname: '', Lastname: '', Email: '', Mobile: '', Message: '' });
    setErrors({});
    setTouched({});
    setIsFormValid(false);
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
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof FormTouched] = true;
      return acc;
    }, {} as FormTouched);
    setTouched(allTouched);

    if (!validateForm()) {
      setStatusType("error");
      setStatusMessage("Please fix the errors in the form.");
      setStatusVisible(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitContactForm(formData);
      setStatusType("success");
      setStatusMessage(result.message || "Message sent successfully!");
      setStatusVisible(true);
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      if (error?.errors && typeof error.errors === "object") {
        setErrors(error.errors);
        setStatusType("error");
        setStatusMessage(error.message || "Please correct highlighted fields.");
      } else {
        setStatusType("error");
        setStatusMessage(error?.message || "Something went wrong.");
      }
      setStatusVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (statusVisible) {
      const timer = setTimeout(() => setStatusVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusVisible]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  const additionalStyles = `
    /* --- SKELETON STYLES --- */
    .skeleton-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      padding: 5px 0;
    }
    .skeleton-line {
      height: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      animation: skeleton-pulse 1.5s infinite ease-in-out;
    }
    @keyframes skeleton-pulse {
      0% { opacity: 0.3; }
      50% { opacity: 0.6; }
      100% { opacity: 0.3; }
    }

    /* --- FORM VALIDATION STYLES --- */
    .inputbx.has-error input,
    .inputbx.has-error textarea {
      border-bottom-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.05) !important;
    }
    .inputbx.has-error input:focus,
    .inputbx.has-error textarea:focus {
      border-bottom-color: #dc2626 !important;
      box-shadow: 0 10px 20px -10px rgba(239, 68, 68, 0.2) !important;
    }
    .error-message {
      color: #ef4444; font-size: 0.85rem; margin-top: 5px; display: flex; align-items: center; gap: 5px; animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .error-icon { font-size: 0.9rem; }
    .character-count { text-align: right; font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin-top: 4px; }
    .character-count.warning { color: #f59e0b; }
    .character-count.error { color: #ef4444; }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none !important; }
  `;

  return (
    <>
      <GlobalLoader isLoading={isSubmitting} />
      <FloatingOrb isVisible={statusVisible} message={statusMessage} type={statusType} onClose={() => setStatusVisible(false)} />

      <style>{`
        :root {
            --primary-blue: #3b82f6;
            --primary-glow: rgba(59, 130, 246, 0.6);
        }
        * { box-sizing: border-box; }
        video::-webkit-media-controls { display: none !important; }

        .main {
            position: relative;
            height: 100dvh;
            width: 100%;
            min-height: 500px;
            overflow: hidden;
            background: #000; 
        }

        .main video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .About { position: relative; z-index: 1; background: inherit; width: 100%; overflow-x: hidden; }
        .Aboutt { width: 100%; max-width: 1200px; margin: 0 auto; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        
        /* Spacing Fixes */
        .ideology, .vision, .mission, .main-about, .image-container { margin-top: 80px; display: flex; align-items: center; justify-content: center; flex-direction: column; width: 100%; }
        .main-about { margin-top: 100px; width: 100%; }

        .tech-badge {
            display: inline-block; padding: 12px 45px; margin-bottom: 30px; color: #fff;
            font-size: clamp(1.2rem, 3vw, 1.8rem); font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
            background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 50px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            position: relative; transition: all 0.3s ease;
        }
        .tech-badge:hover { border-color: #fff; box-shadow: 0 0 40px rgba(59, 130, 246, 0.4); transform: scale(1.05); }
        .tech-badge::before, .tech-badge::after {
            content: ''; position: absolute; top: 50%; transform: translateY(-50%);
            width: 6px; height: 6px; background: var(--primary-blue); border-radius: 50%;
            box-shadow: 0 0 8px var(--primary-blue);
        }
        .tech-badge::before { left: 20px; }
        .tech-badge::after { right: 20px; }
        .tech-highlight { color: var(--primary-blue); }

        p.mission-paragraph, p.about-paragraph {
            color: #e0e0e0; font-size: clamp(16px, 2vw, 20px); font-weight: 300;
            font-family: "Roboto", sans-serif; line-height: 1.6; text-align: justify;
            max-width: 900px; padding: 0 10px; width: 100%;
        }

        .image-container img {
            width: 80%; max-width: 900px; height: auto; display: block; margin: 0 auto;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
        }
        .main-about video {
            position: relative; width: 80%; max-width: 900px; height: auto;
            aspect-ratio: 16/9; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover; border: 1px solid rgba(255,255,255,0.1);
        }

        /* Footer & Modal (Minified for brevity) */
        .main-footer { background: linear-gradient(to right, #000428, #004e92); color: #fff; padding: 60px 0 0; margin-top: 50px; }
        .footer-container { max-width: 1400px; margin: 0 auto; padding: 0 20px 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .footer-col h3 { color: #fff; font-size: 1.3rem; margin-bottom: 25px; text-transform: uppercase; border-bottom: 2px solid #5CA0F2; display: inline-block; padding-bottom: 5px; }
        .contact-item { display: flex; gap: 14px; margin-bottom: 18px; }
        .contact-item .icon { width: 26px; color: #5CA0F2; font-size: 1.25rem; margin-top: 2px; }
        .contact-text a { color: #e0e0e0; text-decoration: none; font-weight: 500; transition: 0.3s; }
        .contact-text a:hover { color: #5CA0F2; }
        .footer-center { text-align: center; display: flex; flex-direction: column; align-items: center; }
        .footer-brand { font-size: 2.5rem; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
        .write-us-btn { background: transparent; color: #fff; border: 1px solid #5CA0F2; padding: 12px 35px; border-radius: 30px; cursor: pointer; transition: 0.3s; margin-bottom: 30px; font-weight: 700; }
        .write-us-btn:hover { background: #5CA0F2; color: #000; box-shadow: 0 0 25px rgba(92, 160, 242, 0.6); }
        .social-icons { display: flex; gap: 15px; justify-content: center; }
        .social-icon { width: 45px; height: 45px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #e0e0e0; transition: 0.3s; }
        .social-icon:hover { background: #5CA0F2; color: #fff; transform: translateY(-3px); }
        /* Twitter (Blue) */
.social-icon.twitter:hover { 
    background: #1DA1F2; 
    border-color: #1DA1F2;
    box-shadow: 0 0 15px rgba(29, 161, 242, 0.6); 
}

/* Instagram (Gradient) */
.social-icon.instagram:hover { 
    background: #f09433; 
    background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); 
    background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
    background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
    border-color: #bc1888;
    box-shadow: 0 0 15px rgba(188, 24, 136, 0.6); 
}

/* LinkedIn (Corporate Blue) */
.social-icon.linkedin:hover { 
    background: #0077b5; 
    border-color: #0077b5;
    box-shadow: 0 0 15px rgba(0, 119, 181, 0.6); 
}
        .footer-map iframe { width: 100%; height: 250px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); }
        .cpoy-cont { background: linear-gradient(45deg, #F5F7F6, #5CA0F2); padding: 20px; text-align: center; }
        
        /* Modal & Form */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); display: flex; justify-content: center; padding-top: 120px; z-index: 10000; }
        .modal-content-styled { position: relative; background: rgba(10, 15, 30, 0.7); padding: 40px; width: 100%; max-width: 800px; border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.5); color: #fff; max-height: 90vh; overflow-y: auto; }
        .close-modal { position: absolute; top: 20px; right: 20px; background: transparent; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
        .close-modal:hover { border-color: #ff4d4d; color: #ff4d4d; transform: rotate(90deg); }
        .hero-highlight { background: linear-gradient(135deg, #fff 0%, var(--primary-blue) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .formBx { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .inputbx { display: flex; flex-direction: column; width: 100%; }
        .inputbx.full-width { grid-column: span 2; }
        .inputbx label { margin-bottom: 8px; font-weight: 600; color: var(--primary-blue); font-size: 0.9rem; }
        .inputbx input, .inputbx textarea { width: 100%; padding: 15px; background: rgba(255,255,255,0.03); border: none; border-bottom: 2px solid rgba(255,255,255,0.2); color: #fff; border-radius: 4px 4px 0 0; }
        .inputbx input:focus, .inputbx textarea:focus { border-bottom: 2px solid var(--primary-blue); background: rgba(59, 130, 246, 0.1); outline: none; }
        .submit-btn { background: var(--primary-blue); color: #fff; padding: 18px; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; width: 100%; margin-top: 15px; display: flex; justify-content: center; align-items: center; gap: 10px; transition: 0.3s; }
        .submit-btn:hover { background: #2563eb; }

        ${additionalStyles}

        @media (max-width: 900px) {
            .footer-container { grid-template-columns: 1fr; text-align: center; }
            .formBx { grid-template-columns: 1fr; }
            .inputbx.full-width { grid-column: span 1; }
        }
      `}</style>

      <main>
        {/* --- HERO SECTION --- */}
        <div className='main'>
          <h1 className="sr-only">SIST ACM SIGAI Student Chapter</h1>
          <video
            src={titlevedio}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>

        <div className='About'>
          <div className='Aboutt'>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='aboutsec'>
              <div className="tech-badge"><span className="tech-highlight">About </span>SIST ACM SIGAI</div>
              <p className='about-paragraph'>
                {/* OPTIMIZATION 2: Skeleton Loader while text fetches */}
                {adminSettings ? adminSettings.about : <TextSkeleton />}
              </p>
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='main-about'>
              <video
                src={videoB}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              />
            </m.div>

            <m.div variants={fadeIn("up", 0.4)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='mission'>
              <div className="tech-badge"><span className="tech-highlight">Our</span> Mission</div>
              <p className='mission-paragraph'>
                {adminSettings ? adminSettings.mission : <TextSkeleton />}
              </p>
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='image-container'>
              {/* OPTIMIZATION 4: Lazy load images */}
              <img src={ne} alt='LOGO REVEAL' loading="lazy" width="900" height="506" />
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='vision'>
              <div className="tech-badge"><span className="tech-highlight">Our</span> Vision</div>
              <p className='mission-paragraph'>
                {adminSettings ? adminSettings.vision : <TextSkeleton />}
              </p>
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" exit="exit" viewport={{ once: false, amount: 0.1 }} className='image-container'>
              <img src={sat} alt='SIST ACM SIGAI' loading="lazy" width="900" height="506" />
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='ideology'>
              <div className="tech-badge"><span className="tech-highlight">Our</span> Ideology</div>
              <p className='mission-paragraph'>
                {adminSettings ? adminSettings.ideology : <TextSkeleton />}
              </p>
            </m.div>

            <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className='image-container'>
              <img src={grp} alt='OUR CORE UNIT' loading="lazy" width="900" height="506" />
            </m.div>
          </div>
        </div>

        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-col">
              <h3>Contact Us</h3>
              <div className="contact-item">
                <span className="icon" aria-hidden="true"><FaMapLocationDot /></span>
                <div className="contact-text">
                  <a href="https://www.sathyabama.ac.in" target="_blank" rel="noopener noreferrer">
                    {adminSettings?.contact.location || "Loading..."}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon" aria-hidden="true"><FaEnvelope /></span>
                <div className="contact-text">
                  <a href={`mailto:${adminSettings?.contact.email}`}>
                    {adminSettings?.contact.email || "Loading..."}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon" aria-hidden="true"><FaPhone /></span>
                <div className="contact-text">
                  <a href={`tel:${adminSettings?.contact.phone}`}>
                    {adminSettings?.contact.phone || "Loading..."}
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-col footer-center">
              <div className="footer-brand">
                <span className="hero-highlight">
                  {adminSettings?.orgName || "SIST ACM SIGAI"}
                </span>
              </div>
              <p className="cta-text">Have questions or want to collaborate?</p>
              <button className="write-us-btn" onClick={toggleModal}>
                Write to Us <FaEnvelope style={{ marginLeft: '8px', display: 'inline' }} />
              </button>
              <div className="social-icons">
                {/* Safe checks for social links */}
                {adminSettings?.socials.twitter && (
                  <a href={adminSettings.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon twitter"><FaTwitter /></a>
                )}
                {adminSettings?.socials.instagram && (
                  <a href={adminSettings.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon instagram"><FaInstagram /></a>
                )}
                {adminSettings?.socials.linkedin && (
                  <a href={adminSettings.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon linkedin"><FaLinkedin /></a>
                )}
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
      </main>

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          resetForm();
        }}
      >
        {isModalOpen && (
          <m.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <m.div
              className="modal-content-styled"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
            >
              <button className="close-modal" onClick={toggleModal} aria-label="Close contact form">
                <FaXmark aria-hidden="true" />
              </button>

              <h3 className="modal-title">
                Send <span className="hero-highlight">your Query</span>
              </h3>

              <form className="form" onSubmit={submitForm} noValidate>
                <div className="formBx">

                  <div className={`inputbx ${errors.Firstname && touched.Firstname ? 'has-error' : ''}`}>
                    <label htmlFor="contact-firstname">First Name</label>
                    <input
                      type="text"
                      id="contact-firstname"
                      name="Firstname"
                      value={formData.Firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      autoComplete="off"
                      maxLength={50}
                    />
                    {errors.Firstname && touched.Firstname && (
                      <div className="error-message">
                        <FaCircleExclamation className="error-icon" /> {errors.Firstname}
                      </div>
                    )}
                  </div>

                  <div className={`inputbx ${errors.Lastname && touched.Lastname ? 'has-error' : ''}`}>
                    <label htmlFor="contact-lastname">Last Name</label>
                    <input
                      type="text"
                      id="contact-lastname"
                      name="Lastname"
                      value={formData.Lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="off"
                      disabled={isSubmitting}
                      maxLength={50}
                    />
                    {errors.Lastname && touched.Lastname && (
                      <div className="error-message">
                        <FaCircleExclamation className="error-icon" /> {errors.Lastname}
                      </div>
                    )}
                  </div>

                  <div className={`inputbx ${errors.Email && touched.Email ? 'has-error' : ''}`}>
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="off"
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    {errors.Email && touched.Email && (
                      <div className="error-message">
                        <FaCircleExclamation className="error-icon" /> {errors.Email}
                      </div>
                    )}
                  </div>

                  <div className={`inputbx ${errors.Mobile && touched.Mobile ? 'has-error' : ''}`}>
                    <label htmlFor="contact-mobile">Mobile Number</label>
                    <input
                      type="tel"
                      id="contact-mobile"
                      name="Mobile"
                      value={formData.Mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      pattern="[0-9]{10}"
                      autoComplete="off"
                      inputMode="numeric"
                      required
                      disabled={isSubmitting}
                      maxLength={10}
                    />
                    {errors.Mobile && touched.Mobile && (
                      <div className="error-message">
                        <FaCircleExclamation className="error-icon" /> {errors.Mobile}
                      </div>
                    )}
                  </div>

                  <div className={`inputbx full-width ${errors.Message && touched.Message ? 'has-error' : ''}`}>
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      name="Message"
                      rows={4}
                      value={formData.Message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      required
                      disabled={isSubmitting}
                      maxLength={1000}
                    />
                    <div
                      className={`character-count ${formData.Message.length > 900
                        ? 'error'
                        : formData.Message.length > 800
                          ? 'warning'
                          : ''
                        }`}
                    >
                      {formData.Message.length}/1000
                    </div>
                    {errors.Message && touched.Message && (
                      <div className="error-message">
                        <FaCircleExclamation className="error-icon" /> {errors.Message}
                      </div>
                    )}
                  </div>

                  <div className="inputbx full-width">
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={
                        isSubmitting ||
                        (!isFormValid && Object.keys(touched).length > 0)
                      }
                    >
                      {isSubmitting ? "TRANSMITTING..." : "Send Query"}
                      <FaPaperPlane />
                    </button>
                  </div>

                </div>
              </form>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;