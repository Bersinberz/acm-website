import React, { useState, useEffect } from 'react';
import { motion as m } from "framer-motion";
import Tilt from 'react-vanilla-tilt';
import { useLocation } from 'react-router-dom';
import { fadeIn } from '../../components/transitions';

// --- IMAGES IMPORT START ---
// (Keep your imports exactly as they were)
import images from '../images/acm-sigai-logo-dark.svg'
import img from '../images/Anu Barathi_photo.jpg'
import imges from '../images/sathyabamamaam-removebg-preview.png'
import imgas from '../images/HOD maam.jpg'
import chair from '../images/MUK06822-01.jpeg'
import fcu from '../images/bharath1.jpg'
import tre from '../images/DHEEKSITHA.jpg'
import des from '../images/SIVA1.jpg'
import wea from '../images/adi2.jpg'
import mani from '../images/venkatesh.jpg'
import son from '../images/SONALI1.jpg'
import ava from '../images/janllyn avantikha.jpeg'
import meg from '../images/meghana tanikella.jpg'
import har from '../images/harii.jpg'
import ram from '../images/ram prasath.jpg'
import unk from '../images/20240313_222959.jpg'
import uno from '../images/BATT.jpg'
import unu from '../images/vedha-varshini.jpg'
import fah from '../images/faheems.jpg'
import bhu from '../images/bhuvan.jpg'
import deva from '../images/deva.jpg'
import Sect from '../images/SSECT.jpg'
import Navya from '../images/img1 - navya sree.jpg'
import Likil from '../images/- likhil madhav.jpeg'
import Aafiya from '../images/Aafiya Afsheen.jpg'
import Bargav from '../images/IMG_0299 - Bhargav krishna Gali.jpeg'
import Dhruva from '../images/Dhruva Kumar.jpg';
import Sanjesh from '../images/Sanjesh Portrait - Sanjesh R.G.jpg';
import SaiKrishna from '../images/IMG20240609111221 - sai krishna kaushik kanduri.jpg';
import GeoSovi from '../images/Geo Sovi.jpg';
import Mokshini from '../images/photo - Mokshini Yadav.jpg'
import Subin from '../images/IMG_9461 - SubinTony.jpeg';
import Dharsan from '../images/IMG_5936_Original - Dharsan .L.jpeg';
import Vishal from '../images/passport photo - Tk Vishal.jpg';
import Ukenthiran from '../images/ukethiran.png';
import Lokesh from '../images/PSX_20241212_092333 - Lokesh.jpg';
import Shahul from '../images/1000004341 - Shahul Hameed.jpeg';
import Trimurthulu from '../images/123 (1) - trimurthulu nakka.jpg';
import hadlinsPrice from '../images/IMG-20240719-WA0004(1) - Hadlins Price.jpg';
import harismitha from '../images/PSX_20240728_201137 - Harismitha.jpg';
import hema from '../images/42614044 Hema - Hema Priyanka.jpg';
import jangalaSriVaishnavi from '../images/pp - Sri Vaishnavi Jangala.jpg';
import joyclynImmanuel from '../images/1726494813000_plus - Joyclyn Immanuel.jpg';
import katepalliPavaniPriya from '../images/IMG_1155 - Pavani Katepalli.jpg';
import nirbhay from '../images/SAVE_20240918_090430-min - Nirbhay Shanker.jpg';
import shreyas from '../images/IMG_20240907_150019_639 - SHREYAS S.jpg';
import Varun from '../images/tedx_submitted_photo (1) - Sai Varun Chandrashekar.png'
import arva from '../images/IMG_20231125_141626 - Aravind Reddy.jpg'
import nandhika from '../images/coreunit 2025-2026/20250811204025663 - Nandhika Viswanathan.jpeg'
import anu from '../images/coreunit 2025-2026/IMG-20230730-WA0020 - Anushri Rajkumar.jpg'
import tej from '../images/coreunit 2025-2026/Teja.jpeg'
import faiha from '../images/coreunit 2025-2026/Faiha.jpg'
import harshini from '../images/coreunit 2025-2026/IMG-20250901-WA0013 - Harshini S.jpg'
import yutish from '../images/coreunit 2025-2026/Yuthish.jpg'
import nakka from '../images/mediaunit 2025-2026/123 (1) - trimurthulu nakka.jpg'
import Uke from '../images/mediaunit 2025-2026/331482-1700727349579-43731147 - Ukenthiran.jpg'
import harthik from '../images/mediaunit 2025-2026/43733047 - Harthik reddy Nuvvuru (1).jpg'
import lokesh from '../images/mediaunit 2025-2026/DSC_8281 copy - Lokesh.jpg'
import tony from '../images/mediaunit 2025-2026/IMG_1669 - SubinTony.jpeg'
import otaku from '../images/mediaunit 2025-2026/IMG_3785 - Eternal_otaku Jash.jpeg'
import Shah from '../images/mediaunit 2025-2026/IMG_5676 - Shahul Hameed.jpeg'
import ri from '../images/mediaunit 2025-2026/IMG_5713 - Rishi.jpeg'
import dar from '../images/mediaunit 2025-2026/Untitled-8_Original - Dharsan .L.jpeg'
import janani from '../images/mediaunit 2025-2026/WhatsApp Image 2025-08-15 at 9.36.14 PM - janani.jpeg'
import anush from '../images/mediaunit 2025-2026/WhatsApp Image 2025-08-16 at 10.40.09 - Anushri Rajkumar.jpeg'
import ritesh from '../images/volunteer2025-2026/ritesh.jpeg'
import hansika from '../images/volunteer2025-2026/HANSHIKA SINGH.jpg'
import koshal from '../images/volunteer2025-2026/K KOSHAL.jpg'
import moniha from '../images/TeamLeads 2025-2026/Moniha.jpg'
import Rennita from '../images/TeamLeads 2025-2026/rennita.jpg'
import vicechair from '../images/TeamLeads 2025-2026/vicechair.jpg'
import varun from '../images/TeamLeads 2025-2026/saiVarun.jpg'
import monisha from "../images/volunteer2025-2026/monisha.jpg"
import monika from "../images/volunteer2025-2026/Monika.jpg"
import Lakshaya from "../images/volunteer2025-2026/Lakshaya.jpg"
import Lakshana from "../images/volunteer2025-2026/Lakshana.jpg"
import Lenita from "../images/volunteer2025-2026/Lenita.jpg"
import Harini from "../images/volunteer2025-2026/Harini.jpg"
import Kirthi from "../images/volunteer2025-2026/Kirthi.jpg"
import Vyshnavi from "../images/volunteer2025-2026/Vyshnavi.jpg"
// --- IMAGES IMPORT END ---

interface SocialLink {
  icon: string;
  link: string;
}

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  img: string;
  social?: SocialLink[];
  additional?: string;
  // removed styling props as we will handle this via CSS for consistency
}

interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('volunteers');
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const batchParam = searchParams.get('batch');
    if (batchParam === '2024-2025') {
      setSelectedYear('2024-2025');
    } else {
      setSelectedYear('2025-2026');
    }
  }, [location]);

  const handleDropdownChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(event.target.value);
  };

  // --- DATA SECTIONS ---
  // Note: I have removed the 'className' and 'style' props to force alignment via CSS
  
  const oldVolunteersData: TeamMember[] = [
    { id: 1, name: "Joyclyn Immanuel J", designation: "Volunteer Unit", img: joyclynImmanuel },
    { id: 2, name: "H.HADLINS PRICE", designation: "Volunteer Unit", img: hadlinsPrice },
    { id: 3, name: "Harismitha", designation: "Volunteer Unit", img: harismitha },
    { id: 4, name: "Hema S", designation: "Volunteer Unit", img: hema },
    { id: 5, name: "Jangala Sri Vaishnavi", designation: "Volunteer Unit", img: jangalaSriVaishnavi },
    { id: 6, name: "Katepalli PavaniPriya", designation: "Volunteer Unit", img: katepalliPavaniPriya },
    { id: 7, name: "Nirbhay", designation: "Volunteer Unit", img: nirbhay },
    { id: 8, name: "Shreyas S", designation: "Volunteer Unit", img: shreyas },
  ];

  const oldMediaUnitData: TeamMember[] = [
    { id: 1, name: "Subin VM", designation: "Media Unit", img: Subin },
    { id: 2, name: "Dharsan L", designation: "Media Unit", img: Dharsan },
    { id: 3, name: "T K Vishal", designation: "Media Unit", img: Vishal },
    { id: 4, name: "Ukenthiran A", designation: "Media Unit", img: Ukenthiran },
    { id: 5, name: "Lokesh R", designation: "Media Unit", img: Lokesh },
    { id: 6, name: "Shahul Hameed A", designation: "Media Unit", img: Shahul },
    { id: 7, name: "Nakka Purna Durga Trimurthulu", designation: "Media Unit", img: Trimurthulu }
  ];

  const oldResearchUnitData: TeamMember[] = [
    { id: 1, name: "Konduru Navya Sree", designation: "Research Unit", img: Navya },
    { id: 2, name: "MANDA LIKHIL MADHAV", designation: "Research Unit", img: Likil },
    { id: 3, name: "Aafiya Afsheen N", designation: "Research Unit", img: Aafiya },
    { id: 5, name: "Bargav Krishna Gali", designation: "Research Unit", img: Bargav },
    { id: 6, name: "Dumpa Dhruva Kumar", designation: "Research Unit", img: Dhruva },
    { id: 7, name: "Sanjesh RG", designation: "Research Unit", img: Sanjesh },
    { id: 8, name: "Kanduri Sai Krishna Kaushik", designation: "Research Unit", img: SaiKrishna },
    { id: 9, name: "Geo Sovi", designation: "Research Unit", img: GeoSovi },
    { id: 10, name: "Annangi Mokshini Yadav", designation: "Research Unit", img: Mokshini }
  ];

  const oldLeadershipData: TeamMember[] = [
    { id: 1, name: "GOWTHAM S", designation: "CHAIRPERSON", img: chair, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/_iam_._gowtham_/" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/gowtham--s/" }] },
    { id: 2, name: "KODIDASU BHARATH", designation: "VICE CHAIRPERSON", img: fcu, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/b.h.a.r.a.t.h_1410/" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/bharathkodidasu/" }] },
    { id: 3, name: "DEEKSHITHA", designation: "TREASURER", img: tre, social: [{ icon: "fab fa-twitter", link: "https://twitter.com/izz_deek_?t=5fATezGBzyIf8bjP_-V3aA&s=08" }, { icon: "fab fa-instagram", link: "#" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/deekshitha-uppu-571b122b8/" }] },
    { id: 4, name: "SRI SOUNDHARYA", designation: "SECRETARY", img: Sect, social: [{ icon: "fab fa-instagram", link: "#" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/deekshitha-uppu-571b122b8/" }] }
  ];

  const oldCoreTeamData: TeamMember[] = [
    { id: 1, name: "SIVA KRISHNA ADIMULAM", designation: "CORE TEAM MEMBER", img: des, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/literally.vibe/" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/siva-krishna-adimulam-08100422b/" }] },
    { id: 2, name: "ADITYA SAI TEJA B", designation: "CORE TEAM MEMBER", img: wea, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/_aditya_teja?igsh=MWpocDdpdG8yMmpvOA==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/aditya-sai-teja-b-013a98251" }] },
    { id: 3, name: "D MANISRI VENKATESH", designation: "CORE TEAM MEMBER", img: mani, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/manisrivenkatesh?igsh=MXZ2NHQ5dHRua3F4Yg==" }, { icon: "fab fa-linkedin", link: "http://linkedin.com/in/manisri-venkatesh-93021b299/" }] },
    { id: 4, name: "V DEVENDRA REDDY", designation: "CORE TEAM MEMBER", img: deva, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/dev_is_not_a_name?igsh=bXN6bTU4cGJyYnRi" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/devendra-reddy-344650251/" }] },
    { id: 5, name: "D.V BHUVANESH", designation: "CORE TEAM MEMBER", img: bhu, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/bhuvan._.rebel/" }, { icon: "fab fa-linkedin", link: "https://linkedin.com/in/bhuvan-bhu1" }] },
    { id: 6, name: "SUSHREE SONALI PATRA", designation: "CORE TEAM MEMBER", img: son, social: [{ icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sushree-sonali-patra-734206289" }] },
    { id: 7, name: "JANLLYN AVANTIKHA", designation: "CORE TEAM MEMBER", img: ava, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/janllynavantikha_?igsh=MXRjdDc4bGIzdzUyNw%3D%3D&utm_source=qr" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/janllyn-avantikha-90268726a" }] },
    { id: 8, name: "TANIKELLA LAKSHMI PHANI MEGHANA", designation: "CORE TEAM MEMBER", img: meg, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/tanikellameghana?igsh=MXcxcDIxOHp1cGZ5cw==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/meghana-tanikella-5103482b0" }] },
    { id: 9, name: "BATTINA VAISHNAVI", designation: "CORE TEAM MEMBER", img: uno, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/vaishnavi_battina_?igsh=NWV1eDdhaWcyZzgz" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/battina-vaishnavi-5743652b9" }] },
    { id: 10, name: "B HARITHREENATH", designation: "CORE TEAM MEMBER", img: har, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/itz_hari_13_?igsh=dTludnhiZms1bmht" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/bellamkonda-harithreenath-906665287" }] },
    { id: 11, name: "SAI VARUN CHANDRASHEKAR", designation: "CORE TEAM MEMBER", img: Varun, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/sai_varun04?igsh=cWtieW5hMjJjcmg5" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sai-varun-chandrashekar-93b8bb273" }] },
    { id: 12, name: "FAHEEM MOHAMED RAFI", designation: "CORE TEAM MEMBER", img: fah, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/faheem._.18?igsh=cGwwcjVrYTl5anp1" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/faheem-mohamed-rafi-3ba4a1250" }] },
    { id: 13, name: "VEDHAVARSHINI V", designation: "CORE TEAM MEMBER", img: unu, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/vivi04_v?igsh=M2dwYW4wcWM4OXZr" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/vedha-varshini-vijay-ananth-a83918242" }] },
    { id: 14, name: "RAM PRASATH.R", designation: "CORE TEAM MEMBER", img: ram, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/__._nyctophile_._?igsh=eGdlencycDI2M3Nu" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/ram-prasath-3309b4282" }] },
    { id: 15, name: "R. NIHARIKA", designation: "CORE TEAM MEMBER", img: unk, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/_niha_sri_217_?igsh=MXU0bnRicnE4bzhhaQ==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/niharika-ramayanam-5353642b9" }] },
    { id: 16, name: "GALI ARAVIND KUMAR REDDY", designation: "CORE TEAM MEMBER", img: arva, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/mr.aravind_._?igsh=MWsyeG9rMXR3MThzNw==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/aravind-reddy-bb536b244" }] }
  ];

  const oldFacultyData: TeamMember[] = [
    { id: 1, name: "DR.VIGNESHWARI S", designation: "HOD CSE", additional: "SIGAI MEMBER ID: 1089768", img: imgas }
  ];

  const oldFacultyCoordinatorsData: TeamMember[] = [
    { id: 1, name: "DR.SATHYABAMA R", designation: "ASSOCIATE PROFESSOR", img: imges },
    { id: 2, name: "DR. ANUBHARATHI", designation: "ASSOCIATE PROFESSOR", img: img }
  ];

  const newVolunteersData: TeamMember[] = [
    { id: 1, name: "ANKEPALLY RITHEESH REDDY", designation: "Volunteer Unit", img: ritesh },
    { id: 2, name: "HANSHIKA SINGH", designation: "Volunteer Unit", img: hansika },
    { id: 3, name: "K KOSHAL", designation: "Volunteer Unit", img: koshal },
    { id: 4, name: "S.Monisha", designation: "Volunteer Unit", img: monisha },
    { id: 5, name: "Monika.g", designation: "Volunteer Unit", img: monika },
    { id: 6, name: "Lakshaya s", designation: "Volunteer Unit", img: Lakshaya },
    { id: 7, name: "Lakshana.S ", designation: "Volunteer Unit", img: Lakshana },
    { id: 8, name: "D. Lenita mary", designation: "Volunteer Unit", img: Lenita },
    { id: 9, name: "Harini.c ", designation: "Volunteer Unit", img: Harini },
    { id: 10, name: "Kirthi", designation: "Volunteer Unit", img: Kirthi },
    { id: 11, name: "Vyshnavi", designation: "Volunteer Unit", img: Vyshnavi }
  ];

  const newMediaUnitData: TeamMember[] = [
    { id: 1, name: "NUVVURU HARTHIK REDDY ", designation: "Media Unit", img: harthik },
    { id: 2, name: "B.G.Viswa Janani", designation: "Media Unit", img: janani },
    { id: 3, name: "Mohammed Sayed", designation: "Media Unit", img: anush },
    { id: 4, name: "Lokesh R ", designation: "Media Unit", img: lokesh },
    { id: 5, name: "Guru Rishikesh T", designation: "Media Unit", img: ri },
    { id: 6, name: "Nakka Purna Durga Trimurthulu ", designation: "Media Unit", img: nakka },
    { id: 7, name: "Ukenthiran A ", designation: "Media Unit", img: Uke },
    { id: 8, name: "Dharsan L", designation: "Media Unit", img: dar },
    { id: 9, name: "SUBIN V M", designation: "Media Unit", img: tony },
    { id: 10, name: "Jashwanth.s", designation: "Media Unit", img: otaku },
    { id: 11, name: "Shahul hameed ", designation: "Media Unit", img: Shah }
  ];

  const newResearchUnitData: TeamMember[] = [
    { id: 1, name: "Konduru Navya Sree", designation: "Research Unit", img: Navya },
    { id: 2, name: "MANDA LIKHIL MADHAV", designation: "Research Unit", img: Likil },
    { id: 3, name: "Aafiya Afsheen N", designation: "Research Unit", img: Aafiya },
    { id: 5, name: "Bargav Krishna Gali", designation: "Research Unit", img: Bargav },
    { id: 6, name: "Dumpa Dhruva Kumar", designation: "Research Unit", img: Dhruva },
    { id: 7, name: "Sanjesh RG", designation: "Research Unit", img: Sanjesh },
    { id: 8, name: "Kanduri Sai Krishna Kaushik", designation: "Research Unit", img: SaiKrishna },
    { id: 9, name: "Geo Sovi", designation: "Research Unit", img: GeoSovi },
    { id: 10, name: "Annangi Mokshini Yadav", designation: "Research Unit", img: Mokshini }
  ];

  const newLeadershipData: TeamMember[] = [
    { id: 1, name: "Sai Varun", designation: "CHAIRPERSON", img: varun, social: [{ icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sai-varun-chandrashekar-93b8bb273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " }] },
    { id: 2, name: "Sanjesh R G", designation: "VICE CHAIRPERSON", img: vicechair, social: [{ icon: "fab fa-instagram", link: "https://www.linkedin.com/in/sanjesh-ramesh" }, { icon: "fab fa-linkedin", link: "https://www.instagram.com/sanjesh_unofficial?igsh=aGduamRyOXdqaTRy " }] },
    { id: 3, name: "Rennita Sebastin", designation: "TREASURER", img: Rennita, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/renn_sebx?igsh=MTkzbzYwZGk3MTQ1OA==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/rennita-sebastin-159746323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }] },
    { id: 4, name: "Moniha s", designation: "SECRETARY", img: moniha, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/monihasuresh?igsh=MWVscWhlZGpoaWFicw%3D%3D&utm_source=qr" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/moniha-s-053933327/" }] }
  ];

  const newCoreTeamData: TeamMember[] = [
    { id: 2, name: "NANDHIKA V", designation: "CORE TEAM MEMBER", img: nandhika, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/nandhikaviswanathan?igsh=MXA4OWN0OTdyMnhheA==" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/nandhika-viswanathan/" }] },
    { id: 4, name: "Anushri Rajkumar", designation: "CORE TEAM MEMBER", img: anu, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/anushri.rajkumar/" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/anushri-rajkumar-66836b287" }] },
    { id: 6, name: "HARSHINI S", designation: "CORE TEAM MEMBER", img: harshini, social: [{ icon: "fab fa-instagram", link: "http://instagram.com/lil_miss_crazy/" }, { icon: "fab fa-linkedin", link: "www.linkedin.com/in/harshini-s-067aab2a5" }] },
    { id: 8, name: "YUTHISH KRISHNAN R", designation: "CORE TEAM MEMBER", img: yutish, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/yxthish.x/" }, { icon: "fab fa-linkedin", link: "www.linkedin.com/in/yuthish-krishnan-b68645213 " }] },
    { id: 9, name: "TEJA G", designation: "CORE TEAM MEMBER", img: tej, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/_.tej._royy?igsh=YjJpMWJvandrYmE1" }, { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/gorakati-teja?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }] },
    { id: 10, name: "Faiha ishaq", designation: "CORE TEAM MEMBER", img: faiha, social: [{ icon: "fab fa-instagram", link: "https://www.instagram.com/qwertyfaiha/" }, { icon: "fab fa-linkedin", link: "www.linkedin.com/in/faiha-ishaq-947586324" }] }
  ];

  const newFacultyData: TeamMember[] = [
    { id: 1, name: "DR.VIGNESHWARI S", designation: "HOD CSE", additional: "SIGAI MEMBER ID: 1089768", img: imgas }
  ];

  const newFacultyCoordinatorsData: TeamMember[] = [
    { id: 1, name: "DR.SATHYABAMA R", designation: "ASSOCIATE PROFESSOR", img: imges },
    { id: 2, name: "DR. ANUBHARATHI", designation: "ASSOCIATE PROFESSOR", img: img }
  ];

  const getCardsData = (): TeamMember[] => {
    if (selectedYear === '2024-2025') {
      switch (selectedUnit) {
        case 'media': return oldMediaUnitData;
        case 'research': return oldResearchUnitData;
        default: return oldVolunteersData;
      }
    } else {
      switch (selectedUnit) {
        case 'media': return newMediaUnitData;
        case 'research': return newResearchUnitData;
        default: return newVolunteersData;
      }
    }
  };

  const getLeadershipData = () => selectedYear === '2024-2025' ? oldLeadershipData : newLeadershipData;
  const getCoreTeamData = () => selectedYear === '2024-2025' ? oldCoreTeamData : newCoreTeamData;
  const getFacultyData = () => selectedYear === '2024-2025' ? oldFacultyData : newFacultyData;
  const getFacultyCoordinatorsData = () => selectedYear === '2024-2025' ? oldFacultyCoordinatorsData : newFacultyCoordinatorsData;

  // --- REUSABLE CARD COMPONENT ---
  const MemberCard = ({ member, isLarge = false }: { member: TeamMember, isLarge?: boolean }) => {
    return (
      <Tilt
        id="tilt-card"
        options={{ scale: 1.05, speed: 1000, max: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <m.div
          variants={fadeIn("up", 0.2)}
          initial="hidden1"
          whileInView={"show1"}
          viewport={{ once: false, amount: 0.3 }}
          className={`member-card ${isLarge ? 'large' : ''}`}
        >
          <div className="card-img-wrapper">
            <img src={member.img} alt={member.name} />
          </div>
          <div className="card-content">
            <div className="text-box">
              <h3>{member.name}</h3>
              <span>{member.designation}</span>
              {member.additional && <span className="additional">{member.additional}</span>}
            </div>
            {member.social && (
              <div className="social-links">
                {member.social.map((social, index) => (
                  <a key={index} href={social.link} target="_blank" rel="noopener noreferrer">
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </m.div>
      </Tilt>
    );
  };

  return (
    <>
      <style>{`
        /* --- GENERAL --- */
        * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none; }
        html { scroll-behavior: smooth; }
        body { background-color: #000; font-family: "Noto Sans JP", sans-serif; overflow-x: hidden; }

        /* --- HERO SECTION --- */
        .about1 {
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          text-align: center; min-height: 100vh; width: 100%; padding-top: 50px;
        }
        .about1 h1 {
          color: #fff; font-size: clamp(30px, 5vw, 60px); font-family: "Poppins", sans-serif;
          font-weight: 300; margin-bottom: 30px;
        }
        .content1 {
          display: flex; flex-direction: column; align-items: center; max-width: 1200px;
          padding: 0 20px; color: #fff;
        }
        .content1 .img img { width: 150px; height: auto; margin-bottom: 20px; }
        .wrapper1 h3 {
          font-size: 16px; font-weight: 300; letter-spacing: 0.5px; line-height: 1.6;
          margin-bottom: 20px; text-align: justify;
        }
        .button1 a {
          color: #fff; background-color: #00c3ff; padding: 10px 30px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; display: inline-block;
          margin-top: 20px; font-weight: bold;
        }
        .button1 a:hover { background-color: #fff; color: #000; }

        /* --- MAIN CONTENT AREA --- */
        .bd {
          background: linear-gradient(180deg, rgb(5, 13, 29), rgb(11, 27, 58), #171242, #000);
          padding: 50px 0; min-height: 100vh;
        }
        .section-title {
          text-align: center; margin: 60px 0 40px;
        }
        .section-title h4 {
          display: inline-block; padding: 15px 30px; color: #fff; font-size: clamp(20px, 3vw, 32px);
          border: 1px solid lightskyblue; border-radius: 15px; text-transform: uppercase;
          backdrop-filter: blur(10px); background: rgba(0,0,0,0.3); letter-spacing: 2px;
        }
        .section-title span { font-size: 0.8em; font-weight: bold; display: block; margin-top: 5px; opacity: 0.8; }

        /* --- DROPDOWN --- */
        .dropdown-container { display: flex; justify-content: center; margin-bottom: 30px; align-items: center; gap: 10px; }
        .dropdown-container select {
          padding: 10px 20px; border: 2px solid lightblue; border-radius: 5px;
          background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; outline: none;
        }
        .dropdown-container select option { background: #000; color: #fff; }

        /* --- GRID SYSTEM --- */
        .grid-container {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;
          max-width: 1400px; margin: 0 auto; padding: 0 20px;
        }

        /* --- CARD STYLING --- */
        .member-card {
          width: 280px; height: 380px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px; overflow: hidden;
          position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s;
        }
        
        .member-card.large { width: 320px; height: 420px; }

        /* Image Wrapper ensures all images are same size/ratio */
        .card-img-wrapper {
          width: 100%; height: 100%;
          overflow: hidden;
        }
        .card-img-wrapper img {
          width: 100%; height: 100%;
          object-fit: cover; /* KEY FIX: Forces image to fill area without distortion */
          object-position: top center; /* Focuses on faces */
          transition: transform 0.5s;
        }
        .member-card:hover .card-img-wrapper img {
          transform: scale(1.1);
        }

        /* Card Overlay Content */
        .card-content {
          position: absolute; bottom: -100px; left: 0; width: 100%;
          padding: 20px; background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          display: flex; flex-direction: column; align-items: center;
          transition: bottom 0.4s ease-in-out; border-top: 1px solid rgba(255,255,255,0.2);
        }
        .member-card:hover .card-content { bottom: 0; }

        .text-box h3 {
          color: #fff; text-transform: uppercase; font-size: 16px; margin-bottom: 5px;
          text-align: center; letter-spacing: 1px;
        }
        .text-box span {
          color: #00c3ff; font-size: 12px; display: block; text-align: center; text-transform: uppercase;
        }
        .text-box .additional { color: #ccc; font-size: 10px; margin-top: 2px; }

        .social-links { margin-top: 15px; display: flex; gap: 15px; }
        .social-links a {
          width: 35px; height: 35px; background: #fff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #000; font-size: 18px; transition: 0.3s;
        }
        .social-links a:hover { background: #00c3ff; color: #fff; transform: translateY(-3px); }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
          .member-card, .member-card.large { width: 260px; height: 350px; }
          .grid-container { gap: 20px; }
        }
      `}</style>

      <div className='about1' id='about'>
        <m.h1 variants={fadeIn("up", 0.2)} initial="hidden1" whileInView={"show1"} viewport={{ once: false, amount: 0.7 }}>
          EXPLORE ACM SIGAI!!
        </m.h1>

        <div className='content1'>
          <div className='img'>
            <img src={images} alt='ACM SIGAI Logo' />
          </div>

          <div className='wrapper1'>
            <h3>
              The scope of SIGAI, ACM's Special Interest Group on Artificial Intelligence, consists of the study of intelligence and its realization in computer systems. SIGAI's mission is to promote and support AI-related conferences. Members receive reduced registration rates to all affiliated conferences. Members also receive proceedings from the major SIGAI-sponsored conferences.
            </h3>
            <h3>
              ACM SIGAI is the Association for Computing Machinery's Special Interest Group on Artificial Intelligence (AI), an interdisciplinary group of academic and industrial researchers, practitioners, software developers, end users, and students who work together to promote and support the growth and application of AI principles and techniques throughout computing.
            </h3>
            <div className='button1'>
              <a href={'https://sigai.acm.org/main/'} target="_blank" rel="noopener noreferrer">Explore more</a>
            </div>
          </div>
        </div>
      </div>

      <div className='bd'>
        
        {/* --- LEADERSHIP --- */}
        <div className='section-title'>
          <h4>MEET SIST SIGAI ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getLeadershipData().map((member) => (
            <MemberCard key={member.id} member={member} isLarge={true} />
          ))}
        </div>

        {/* --- CORE TEAM --- */}
        <div className='section-title'>
          <h4>OUR ROOTS ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getCoreTeamData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- FACULTY CONVENER --- */}
        <div className='section-title'>
          <h4>FACULTY CONVENER ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getFacultyData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- FACULTY COORDINATORS --- */}
        <div className='section-title'>
          <h4>FACULTY COORDINATORS ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getFacultyCoordinatorsData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- UNITS SELECTION --- */}
        <div className='section-title'>
          <h4>OUR UNITS ({selectedYear})</h4>
        </div>

        <div className="dropdown-container">
          <label htmlFor="unit-select" style={{ fontWeight: 'bold', color: 'white' }}>Select Unit: </label>
          <select id="unit-select" onChange={handleDropdownChange1} value={selectedUnit}>
            <option value="volunteers">Volunteers Unit</option>
            <option value="media">Media Unit</option>
            <option value="research">Research Unit</option>
          </select>
        </div>

        <div className='grid-container'>
          {getCardsData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

      </div>
    </>
  );
};

export default About;