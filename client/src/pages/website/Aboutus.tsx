import { useState, useEffect } from 'react';
import { motion as m } from "framer-motion";
import Tilt from 'react-vanilla-tilt';
import { getMembers, type Member } from "../../services/website/aboutservice";
import { useLocation } from 'react-router-dom';
import { fadeIn } from '../../components/transitions';
import acmLogo from '../../assets/acm-sigai-logo-dark.svg';

const About = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('volunteers');
  const location = useLocation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const batchParam = searchParams.get('batch');
    setSelectedYear(batchParam === '2024-2025' ? '2024-2025' : '2025-2026');
  }, [location]);

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(event.target.value);
  };

  const getFilteredMembers = (batch: string) => {
    return members.filter(member => member.batch === batch);
  };

  const getLeadershipMembers = () => {
    const filtered = getFilteredMembers(selectedYear);
    return filtered.filter(member => {
      const designation = member.designation.toUpperCase();
      return [
        'CHAIRPERSON',
        'VICE CHAIRPERSON', 
        'TREASURER',
        'SECRETARY'
      ].includes(designation);
    });
  };

  const getCoreTeamMembers = () => {
    const filtered = getFilteredMembers(selectedYear);
    return filtered.filter(member => 
      member.designation.toUpperCase().includes('CORE')
    );
  };

  const getUnitMembers = () => {
    const filtered = getFilteredMembers(selectedYear);
    const unitLower = selectedUnit.toLowerCase();
    
    return filtered.filter(member => {
      const designation = member.designation.toLowerCase();
      return (
        designation.includes(unitLower) ||
        designation.includes('volunteer') ||
        designation.includes('media') ||
        designation.includes('research')
      );
    });
  };

  const getFacultyMembers = () => {
    const filtered = getFilteredMembers(selectedYear);
    return filtered.filter(member => 
      member.designation.toUpperCase().includes('HOD') ||
      member.designation.toUpperCase().includes('FACULTY') ||
      member.designation.toUpperCase().includes('PROFESSOR')
    );
  };

  const renderMemberCard = (member: Member) => (
    <Tilt
      key={member._id}
      id="tilt-card"
      options={{ scale: 2 }}
      style={{ width: 420 }}
    >
      <m.div
        variants={fadeIn("up", 0.2)}
        initial="hidden1"
        whileInView={"show1"}
        viewport={{ once: false, amount: 0.7 }}
        className='cards'
      >
        <div className="member-image">
          <img 
            src={member.imageUrl} 
            alt={member.name}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/150?text=Member';
            }}
          />
        </div>
        <div className='contents'>
          <div className='contentbx'>
            <h3>{member.name}<br /><span>{member.designation}</span></h3>
          </div>
          {member.social && (
            <div className='social'>
              {member.social.linkedin && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              )}
              {member.social.instagram && (
                <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {member.social.facebook && (
                <a href={member.social.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
              )}
            </div>
          )}
        </div>
      </m.div>
    </Tilt>
  );

  const renderFacultyCard = (member: Member) => (
    <m.div
      key={member._id}
      variants={fadeIn("up", 0.2)}
      initial="hidden1"
      whileInView={"show1"}
      viewport={{ once: false, amount: 0.7 }}
      className='cards1'
    >
      <div className="member-image">
        <img 
          src={member.imageUrl} 
          alt={member.name}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=Faculty';
          }}
        />
      </div>
      <div className='contents'>
        <div className='contentbx'>
          <h3>{member.name}<br /><span>{member.designation}</span></h3>
        </div>
      </div>
    </m.div>
  );

  const renderUnitMemberCard = (member: Member) => (
    <m.div
      key={member._id}
      variants={fadeIn("up", 0.2)}
      initial="hidden1"
      whileInView="show1"
      viewport={{ once: false, amount: 0.7 }}
      className='cards1'
    >
      <div className="member-image">
        <img 
          src={member.imageUrl} 
          alt={member.name}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=Member';
          }}
        />
      </div>
      <div className='contents'>
        <div className='contentbx'>
          <h3>
            {member.name}
            <br />
            <span>{member.designation}</span>
          </h3>
        </div>
      </div>
    </m.div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  const leadershipMembers = getLeadershipMembers();
  const coreTeamMembers = getCoreTeamMembers();
  const unitMembers = getUnitMembers();
  const facultyMembers = getFacultyMembers();

  return (
    <>
      <div className='about1' id='about'>
        <m.h1 
          variants={fadeIn("up", 0.2)}
          initial="hidden1"
          whileInView={"show1"}
          viewport={{ once: false, amount: 0.7 }}
        >
          EXPLORE ACM SIGAI!!
        </m.h1>

        <div className='content1'>
          <div className='img'>
            <img src={acmLogo} alt='ACM SIGAI Logo' />
          </div>

          <div className='wrapper1'>
            <h3>
              The scope of SIGAI, ACM's Special Interest Group on Artificial Intelligence,
              consists of the study of intelligence and its realization in computer systems. 
              SIGAI's mission is to promote and support AI-related conferences. 
              Members receive reduced registration rates to all affiliated conferences. 
              Members also receive proceedings from the major SIGAI-sponsored conferences. 
              SIGAI publishes a quarterly newsletter, AI Matters, with ideas and announcements 
              of interest to the AI community.
            </h3>
            <h3>
              ACM SIGAI is the Association for Computing Machinery's Special Interest Group 
              on Artificial Intelligence (AI), an interdisciplinary group of academic and 
              industrial researchers, practitioners, software developers, end users, and 
              students who work together to promote and support the growth and application 
              of AI principles and techniques throughout computing. SIGAI is one of the 
              oldest special interest groups in the ACM. SIGAI, previously called SIGART, 
              started in 1966, publishing the SIGART Newsletter that later became the 
              SIGART Bulletin and Intelligence Magazine.
              <br />
              On January 10, 1947, at the Symposium on Large-Scale Digital Calculating 
              Machinery at the Harvard computation Laboratory, Professor Samuel H. Caldwell 
              of Massachusetts Institute of Technology spoke of the need for an association 
              of those interested in computing machinery, and of the need for communication 
              between them. After making some inquiries during May and June, we believe there 
              is ample interest to start an informal association of many of those interested 
              in the new machinery for computing and reasoning. Since there has to be a beginning, 
              we are acting as a temporary committee to start such an association.
            </h3>
            <div className='button1'>
              <a href={'https://sigai.acm.org/main/'} target="_blank" rel="noopener noreferrer">
                Explore more
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='bd'>
        <div className='wrapper'>
          <m.div 
            variants={fadeIn("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }} 
            className='title-core'
          >
            <h4><span>MEET SIST SIGAI ({selectedYear})</span></h4>
          </m.div>

          {leadershipMembers.length === 0 ? (
            <div className="empty-state">
              <p>No leadership members found for {selectedYear}</p>
            </div>
          ) : (
            <div className='card-container1'>
              {leadershipMembers.map(renderMemberCard)}
            </div>
          )}

          <m.div 
            variants={fadeIn("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }} 
            className='title-core'
          >
            <h4><span>OUR Roots ({selectedYear})</span></h4>
          </m.div>

          {coreTeamMembers.length === 0 ? (
            <div className="empty-state">
              <p>No core team members found for {selectedYear}</p>
            </div>
          ) : (
            <div className='card-container1'>
              {coreTeamMembers.map(renderMemberCard)}
            </div>
          )}

          <m.div
            variants={fadeIn("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }}
            className='title'
          >
            <h4>FACULTY ({selectedYear})</h4>
          </m.div>

          {facultyMembers.length === 0 ? (
            <div className="empty-state">
              <p>No faculty members found for {selectedYear}</p>
            </div>
          ) : (
            <div className='card-container1'>
              {facultyMembers.map(renderFacultyCard)}
            </div>
          )}
        </div>

        <div className='wrapper'>
          <m.div
            variants={fadeIn("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }}
            className='title-co'
          >
            <h4>OUR UNITS ({selectedYear})</h4>
          </m.div>

          <div className="dropdown-container" style={{ textAlign: 'center', margin: '20px 0' }}>
            <label htmlFor="unit-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
              Select Unit: 
            </label>
            <select
              id="unit-select"
              onChange={handleUnitChange}
              value={selectedUnit}
              style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="volunteers">Volunteers Unit</option>
              <option value="media">Media Unit</option>
              <option value="research">Research Unit</option>
            </select>
          </div>

          {unitMembers.length === 0 ? (
            <div className="empty-state">
              <p>No {selectedUnit} unit members found for {selectedYear}</p>
            </div>
          ) : (
            <div className='wrapper'>
              <div className='card-container1'>
                {unitMembers.map(renderUnitMemberCard)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default About;