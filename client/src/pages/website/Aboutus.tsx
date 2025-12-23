import React, { useState, useEffect } from 'react';
import { motion as m } from "framer-motion";
import Tilt from 'react-vanilla-tilt'
import { useLocation } from 'react-router-dom';
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
import Hariharan from '../images/HariharanV_CSE-DS - Hari Haran.JPG'
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
import { fadeIns } from '../components/Transitionss'
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

const About = () => {
  const [selectedUnit, setSelectedUnit] = useState('volunteers');
  const location = useLocation();

  // Default to current batch (2025-2026)
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Parse URL parameters to determine which batch to show
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const batchParam = searchParams.get('batch');

    if (batchParam === '2024-2025') {
      setSelectedYear('2024-2025');
    } else {
      setSelectedYear('2025-2026');
    }
  }, [location]);

  const handleDropdownChange1 = (event) => {
    setSelectedUnit(event.target.value);
  };

  // Data for old members (2024-2025)
  const oldVolunteersData = [
    {
      id: 1,
      name: "Joyclyn Immanuel J",
      designation: "Volunteer Unit",
      img: joyclynImmanuel,
      className: "joyclyn",
    },
    {
      id: 2,
      name: "H.HADLINS PRICE",
      designation: "Volunteer Unit",
      img: hadlinsPrice,
      className: "hadlins-price",
    },
    {
      id: 3,
      name: "Harismitha",
      designation: "Volunteer Unit",
      img: harismitha,
      className: "harismitha",
    },
    {
      id: 4,
      name: "Hema S",
      designation: "Volunteer Unit",
      img: hema,
      className: "hema-s",
    },
    {
      id: 5,
      name: "Jangala Sri Vaishnavi",
      designation: "Volunteer Unit",
      img: jangalaSriVaishnavi,
      className: "jangala-sri-vaishnavi",
    },
    {
      id: 6,
      name: "Katepalli PavaniPriya",
      designation: "Volunteer Unit",
      img: katepalliPavaniPriya,
      className: "katepalli-pavani-priya",
    },
    {
      id: 7,
      name: "Nirbhay",
      designation: "Volunteer Unit",
      img: nirbhay,
      className: "nirbhay",
    },
    {
      id: 8,
      name: "Shreyas S",
      designation: "Volunteer Unit",
      img: shreyas,
      className: "shreyas-s",
    },
  ];

  const oldMediaUnitData = [
    {
      id: 1,
      name: "Subin VM",
      designation: "Media Unit",
      img: Subin,
      className: "subin-class",
    },
    {
      id: 2,
      name: "Dharsan L",
      designation: "Media Unit",
      img: Dharsan,
      className: "dharsan-class",
    },
    {
      id: 3,
      name: "T K Vishal",
      designation: "Media Unit",
      img: Vishal,
      className: "vishal-class",
    },
    {
      id: 4,
      name: "Ukenthiran A",
      designation: "Media Unit",
      img: Ukenthiran,
      className: "ukenthiran-class",
    },
    {
      id: 5,
      name: "Lokesh R",
      designation: "Media Unit",
      img: Lokesh,
      className: "lokesh-class",
    },
    {
      id: 6,
      name: "Shahul Hameed A",
      designation: "Media Unit",
      img: Shahul,
      className: "shahul-class",
    },
    {
      id: 7,
      name: "Nakka Purna Durga Trimurthulu",
      designation: "Media Unit",
      img: Trimurthulu,
      className: "trimurthulu-class",
    }
  ];

  const oldResearchUnitData = [
    {
      id: 1,
      name: "Konduru Navya Sree",
      designation: "Research Unit",
      img: Navya,
      className: "Navya",
    },
    {
      id: 2,
      name: "MANDA LIKHIL MADHAV",
      designation: "Research Unit",
      img: Likil,
      className: "likil-class",
    },
    {
      id: 3,
      name: "Aafiya Afsheen N",
      designation: "Research Unit",
      img: Aafiya,
      className: "aafiya-class",
    },
    {
      id: 4,
      name: "Hariharan V",
      designation: "Research Unit",
      img: Hariharan,
      className: "hariharan-class",
    },
    {
      id: 5,
      name: "Bargav Krishna Gali",
      designation: "Research Unit",
      img: Bargav,
      className: "bargav-class",
    },
    {
      id: 6,
      name: "Dumpa Dhruva Kumar",
      designation: "Research Unit",
      img: Dhruva,
      className: "dhruva-class",
    },
    {
      id: 7,
      name: "Sanjesh RG",
      designation: "Research Unit",
      img: Sanjesh,
      className: "sanjesh-class",
    },
    {
      id: 8,
      name: "Kanduri Sai Krishna Kaushik",
      designation: "Research Unit",
      img: SaiKrishna,
      className: "saikrishna-class",
    },
    {
      id: 9,
      name: "Geo Sovi",
      designation: "Research Unit",
      img: GeoSovi,
      className: "geosovi-class",
    },
    {
      id: 10,
      name: "Annangi Mokshini Yadav",
      designation: "Research Unit",
      img: Mokshini,
      className: "mokshini-class",
    }
  ];

  // Leadership team data for 2024-2025
  const oldLeadershipData = [
    {
      id: 1,
      name: "GOWTHAM S",
      designation: "CHAIRPERSON",
      img: chair,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/_iam_._gowtham_/" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/gowtham--s/" }
      ]
    },
    {
      id: 2,
      name: "KODIDASU BHARATH",
      designation: "VICE CHAIRPERSON",
      img: fcu,
      className: "imbx13",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/b.h.a.r.a.t.h_1410/" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/bharathkodidasu/" }
      ]
    },
    {
      id: 3,
      name: "DEEKSHITHA",
      designation: "TREASURER",
      img: tre,
      className: "imbx2",
      social: [
        { icon: "fab fa-twitter", link: "https://twitter.com/izz_deek_?t=5fATezGBzyIf8bjP_-V3aA&s=08" },
        { icon: "fab fa-instagram", link: "#" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/deekshitha-uppu-571b122b8/" }
      ]
    },
    {
      id: 4,
      name: "SRI SOUNDHARYA",
      designation: "SECRETARY",
      img: Sect,
      className: "imbx2",
      social: [
        { icon: "fab fa-instagram", link: "#" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/deekshitha-uppu-571b122b8/" }
      ]
    }
  ];

  // Core team data for 2024-2025
  const oldCoreTeamData = [
    {
      id: 1,
      name: "SIVA KRISHNA ADIMULAM",
      designation: "CORE TEAM MEMBER",
      img: des,
      className: "imbx3",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/literally.vibe/" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/siva-krishna-adimulam-08100422b/" }
      ]
    },
    {
      id: 2,
      name: "ADITYA SAI TEJA B",
      designation: "CORE TEAM MEMBER",
      img: wea,
      className: "imbx1",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/_aditya_teja?igsh=MWpocDdpdG8yMmpvOA==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/aditya-sai-teja-b-013a98251" }
      ]
    },
    {
      id: 3,
      name: "D MANISRI VENKATESH",
      designation: "CORE TEAM MEMBER",
      img: mani,
      className: "imbx9",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/manisrivenkatesh?igsh=MXZ2NHQ5dHRua3F4Yg==" },
        { icon: "fab fa-linkedin", link: "http://linkedin.com/in/manisri-venkatesh-93021b299/" }
      ]
    },
    {
      id: 4,
      name: "V DEVENDRA REDDY",
      designation: "CORE TEAM MEMBER",
      img: deva,
      className: "imbx16",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/dev_is_not_a_name?igsh=bXN6bTU4cGJyYnRi" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/devendra-reddy-344650251/" }
      ]
    },
    {
      id: 5,
      name: "D.V BHUVANESH",
      designation: "CORE TEAM MEMBER",
      img: bhu,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/bhuvan._.rebel/" },
        { icon: "fab fa-linkedin", link: "https://linkedin.com/in/bhuvan-bhu1" }
      ]
    },
    {
      id: 6,
      name: "SUSHREE SONALI PATRA",
      designation: "CORE TEAM MEMBER",
      img: son,
      className: "imbx5",
      social: [
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sushree-sonali-patra-734206289" }
      ]
    },
    {
      id: 7,
      name: "JANLLYN AVANTIKHA",
      designation: "CORE TEAM MEMBER",
      img: ava,
      className: "imbx6",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/janllynavantikha_?igsh=MXRjdDc4bGIzdzUyNw%3D%3D&utm_source=qr" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/janllyn-avantikha-90268726a" }
      ]
    },
    {
      id: 8,
      name: "TANIKELLA LAKSHMI PHANI MEGHANA",
      designation: "CORE TEAM MEMBER",
      img: meg,
      className: "imbx21",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/tanikellameghana?igsh=MXcxcDIxOHp1cGZ5cw==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/meghana-tanikella-5103482b0" }
      ]
    },
    {
      id: 9,
      name: "BATTINA VAISHNAVI",
      designation: "CORE TEAM MEMBER",
      img: uno,
      className: "imbx8",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/vaishnavi_battina_?igsh=NWV1eDdhaWcyZzgz" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/battina-vaishnavi-5743652b9" }
      ]
    },
    {
      id: 10,
      name: "B HARITHREENATH",
      designation: "CORE TEAM MEMBER",
      img: har,
      className: "imbx7",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/itz_hari_13_?igsh=dTludnhiZms1bmht" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/bellamkonda-harithreenath-906665287" }
      ]
    },
    {
      id: 11,
      name: "SAI VARUN CHANDRASHEKAR",
      designation: "CORE TEAM MEMBER",
      img: Varun,
      className: "imbx30",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/sai_varun04?igsh=cWtieW5hMjJjcmg5" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sai-varun-chandrashekar-93b8bb273" }
      ]
    },
    {
      id: 12,
      name: "FAHEEM MOHAMED RAFI",
      designation: "CORE TEAM MEMBER",
      img: fah,
      className: "imbx12",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/faheem._.18?igsh=cGwwcjVrYTl5anp1" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/faheem-mohamed-rafi-3ba4a1250" }
      ]
    },
    {
      id: 13,
      name: "VEDHAVARSHINI V",
      designation: "CORE TEAM MEMBER",
      img: unu,
      className: "imbx11",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/vivi04_v?igsh=M2dwYW4wcWM4OXZr" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/vedha-varshini-vijay-ananth-a83918242" }
      ]
    },
    {
      id: 14,
      name: "RAM PRASATH.R",
      designation: "CORE TEAM MEMBER",
      img: ram,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/__._nyctophile_._?igsh=eGdlencycDI2M3Nu" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/ram-prasath-3309b4282" }
      ]
    },
    {
      id: 15,
      name: "R. NIHARIKA",
      designation: "CORE TEAM MEMBER",
      img: unk,
      className: "imbx2",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/_niha_sri_217_?igsh=MXU0bnRicnE4bzhhaQ==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/niharika-ramayanam-5353642b9" }
      ]
    },
    {
      id: 16,
      name: "GALI ARAVIND KUMAR REDDY",
      designation: "CORE TEAM MEMBER",
      img: arva,
      className: "imbx31",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/mr.aravind_._?igsh=MWsyeG9rMXR3MThzNw==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/aravind-reddy-bb536b244" }
      ]
    }
  ];

  // Faculty data for 2024-2025
  const oldFacultyData = [
    {
      id: 1,
      name: "DR.VIGNESHWARI S",
      designation: "HOD CSE",
      additional: "SIGAI MEMBER ID: 1089768",
      img: imgas,
      className: "imbx14"
    }
  ];

  const oldFacultyCoordinatorsData = [
    {
      id: 1,
      name: "DR.SATHYABAMA R",
      designation: "ASSOCIATE PROFESSOR",
      img: imges,
      className: "imbx1"
    },
    {
      id: 2,
      name: "DR. ANUBHARATHI",
      designation: "ASSOCIATE PROFESSOR",
      img: img,
      className: "imbx2",
    }
  ];

  // Data for new members (2025-2026)
  const newVolunteersData = [
    {
      id: 1,
      name: "ANKEPALLY RITHEESH REDDY",
      designation: "Volunteer Unit",
      img: ritesh,
      className: "hadlins-price",
      style: {
        marginTop: "4px",
        transform: "scale(1.2)",
      }
    },
    {
      id: 2,
      name: "HANSHIKA SINGH",
      designation: "Volunteer Unit",
      img: hansika,
      className: "hadlins-price",
      style: { marginLeft: "-12px" }
    },
    {
      id: 3,
      name: "K KOSHAL",
      designation: "Volunteer Unit",
      img: koshal,
      className: "subin-class",
      style: {
        marginLeft: "-10px",
        marginTop: "10px",
        transform: "scale(1.1)"
      }
    },
    {
      id: 4,
      name: "S.Monisha",
      designation: "Volunteer Unit",
      img: monisha,
      className: "subin-class",
    },
    {
      id: 5,
      name: "Monika.g",
      designation: "Volunteer Unit",
      img: monika,
      className: "subin-class",
      style: {
        marginLeft: "-30px"
      }
    },
    {
      id: 6,
      name: "Lakshaya s",
      designation: "Volunteer Unit",
      img: Lakshaya,
      className: "subin-class",
      style: {
        marginLeft: "-30px",
        marginTop: "-5px"
      }
    },
    {
      id: 7,
      name: "Lakshana.S ",
      designation: "Volunteer Unit",
      img: Lakshana,
      className: "subin-class",
      style: {
        marginLeft: "-30px",
        marginTop: "-5px"
      }
    },
    {
      id: 8,
      name: "D. Lenita mary",
      designation: "Volunteer Unit",
      img: Lenita,
      className: "subin-class",
      style: {
        marginLeft: "-30px",
        marginTop: "-5px"
      }
    },
    {
      id: 9,
      name: "Harini.c ",
      designation: "Volunteer Unit",
      img: Harini,
      className: "subin-class",
      style: {
        marginLeft: "-30px",
        marginTop: "-5px"
      }
    },
    {
      id: 10,
      name: "Kirthi",
      designation: "Volunteer Unit",
      img: Kirthi,
      className: "subin-class",
      style: {
        marginLeft: "-50px",
        marginTop: "-50px",
        transform: "scale(2)",
        transformOrigin: "center"
      }
    },
    {
      id: 11,
      name: "Vyshnavi",
      designation: "Volunteer Unit",
      img: Vyshnavi,
      className: "subin-class",
      style: {
        marginLeft: "-30px",
        marginTop: "-5px"
      }
    }
  ];
  const newMediaUnitData = [
    {
      id: 1,
      name: "NUVVURU HARTHIK REDDY ",
      designation: "Media Unit",
      img: harthik,
      className: "subin-class",
      style: { marginLeft: "-23px", marginTop: "-15px" }
    },
    {
      id: 2,
      name: "B.G.Viswa Janani",
      designation: "Media Unit",
      img: janani,
      className: "dharsan-class",
      style: { marginLeft: "-40px" }
    },
    {
      id: 3,
      name: "Mohammed Sayed",
      designation: "Media Unit",
      img: anush,
      className: "vishal-class",
      style: { marginLeft: "-25px" }
    },
    {
      id: 4,
      name: "Lokesh R ",
      designation: "Media Unit",
      img: lokesh,
      className: "ukenthiran-class",
      style: { marginLeft: "-25px" }
    },
    {
      id: 5,
      name: "Guru Rishikesh T",
      designation: "Media Unit",
      img: ri,
      className: "lokesh-class",
      style: { marginLeft: "-40px" }
    },
    {
      id: 6,
      name: "Nakka Purna Durga Trimurthulu ",
      designation: "Media Unit",
      img: nakka,
      className: "shahul-class",
      style: { marginLeft: "-25px" }
    },
    {
      id: 7,
      name: "Ukenthiran A ",
      designation: "Media Unit",
      img: Uke,
      className: "trimurthulu-class",
      style: { marginLeft: "-15px" }
    },
    {
      id: 8,
      name: "Dharsan L",
      designation: "Media Unit",
      img: dar,
      className: "trimurthulu-class",
      style: { marginLeft: "-27px" }
    },
    {
      id: 9,
      name: "SUBIN V M",
      designation: "Media Unit",
      img: tony,
      className: "trimurthulu-class",
      style: { marginLeft: "-25px" }
    },
    {
      id: 10,
      name: "Jashwanth.s",
      designation: "Media Unit",
      img: otaku,
      className: "trimurthulu-class",
      style: { marginLeft: "-25px", marginTop: "40px", transform: "scale(1.3)" }
    },
    {
      id: 11,
      name: "Shahul hameed ",
      designation: "Media Unit",
      img: Shah,
      className: "trimurthulu-class",
      style: { marginLeft: "-55px" }
    }
  ];

  const newResearchUnitData = [
    {
      id: 1,
      name: "Konduru Navya Sree",
      designation: "Research Unit",
      img: Navya,
      className: "Navya",
    },
    {
      id: 2,
      name: "MANDA LIKHIL MADHAV",
      designation: "Research Unit",
      img: Likil,
      className: "likil-class",
    },
    {
      id: 3,
      name: "Aafiya Afsheen N",
      designation: "Research Unit",
      img: Aafiya,
      className: "aafiya-class",
    },
    {
      id: 4,
      name: "Hariharan V",
      designation: "Research Unit",
      img: Hariharan,
      className: "hariharan-class",
    },
    {
      id: 5,
      name: "Bargav Krishna Gali",
      designation: "Research Unit",
      img: Bargav,
      className: "bargav-class",
    },
    {
      id: 6,
      name: "Dumpa Dhruva Kumar",
      designation: "Research Unit",
      img: Dhruva,
      className: "dhruva-class",
    },
    {
      id: 7,
      name: "Sanjesh RG",
      designation: "Research Unit",
      img: Sanjesh,
      className: "sanjesh-class",
    },
    {
      id: 8,
      name: "Kanduri Sai Krishna Kaushik",
      designation: "Research Unit",
      img: SaiKrishna,
      className: "saikrishna-class",
    },
    {
      id: 9,
      name: "Geo Sovi",
      designation: "Research Unit",
      img: GeoSovi,
      className: "geosovi-class",
    },
    {
      id: 10,
      name: "Annangi Mokshini Yadav",
      designation: "Research Unit",
      img: Mokshini,
      className: "mokshini-class",
    }
  ];

  // New leadership team for 2025-2026
  const newLeadershipData = [
    {
      id: 1,
      name: "Sai Varun",
      designation: "CHAIRPERSON",
      img: varun,
      className: "imbx",
      social: [
        // { icon: "fab fa-instagram", link: "https://www.instagram.com/_iam_._gowtham_/" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/sai-varun-chandrashekar-93b8bb273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " }
      ],
      style: { marginLeft: "-20px" }
    },
    {
      id: 2,
      name: "Sanjesh R G",
      designation: "VICE CHAIRPERSON",
      img: vicechair,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.linkedin.com/in/sanjesh-ramesh" },
        { icon: "fab fa-linkedin", link: "https://www.instagram.com/sanjesh_unofficial?igsh=aGduamRyOXdqaTRy " }
      ],
      style: { marginLeft: "-20px" }
    },
    {
      id: 3,
      name: "Rennita Sebastin",
      designation: "TREASURER",
      img: Rennita,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/renn_sebx?igsh=MTkzbzYwZGk3MTQ1OA==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/rennita-sebastin-159746323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
      ],
      style: { marginLeft: "-50px", marginTop: "40px", transform: "scale(1.5)" },
    },
    {
      id: 4,
      name: "Moniha s",
      designation: "SECRETARY",
      img: moniha,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/monihasuresh?igsh=MWVscWhlZGpoaWFicw%3D%3D&utm_source=qr" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/moniha-s-053933327/" }
      ],
    }
  ];

  // New core team for 2025-2026
  const newCoreTeamData = [
    {
      id: 2,
      name: "NANDHIKA V",
      designation: "CORE TEAM MEMBER",
      img: nandhika,
      className: "imbx5",
      style: { marginLeft: "-10px" },
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/nandhikaviswanathan?igsh=MXA4OWN0OTdyMnhheA==" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/nandhika-viswanathan/" }
      ]
    },
    {
      id: 4,
      name: "Anushri Rajkumar",
      designation: "CORE TEAM MEMBER",
      img: anu,
      className: "imbx",
      style: { marginLeft: "-10px" },
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/anushri.rajkumar/" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/anushri-rajkumar-66836b287" }
      ]
    },
    {
      id: 6,
      name: "HARSHINI S",
      designation: "CORE TEAM MEMBER",
      img: harshini,
      className: "imbx",
      style: { marginLeft: "-20px" },
      social: [
        { icon: "fab fa-instagram", link: "http://instagram.com/lil_miss_crazy/" },
        { icon: "fab fa-linkedin", link: "www.linkedin.com/in/harshini-s-067aab2a5" }
      ]
    },
    {
      id: 8,
      name: "YUTHISH KRISHNAN R",
      designation: "CORE TEAM MEMBER",
      img: yutish,
      className: "imbx",
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/yxthish.x/" },
        { icon: "fab fa-linkedin", link: "www.linkedin.com/in/yuthish-krishnan-b68645213 " }
      ],
      style: { marginLeft: "-25px" }
    },
    {
      id: 9,
      name: "TEJA G",
      designation: "CORE TEAM MEMBER",
      img: tej,
      className: "imbx",
      style: { marginLeft: "-20px" },
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/_.tej._royy?igsh=YjJpMWJvandrYmE1" },
        { icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/gorakati-teja?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
      ]
    },
    {
      id: 10,
      name: "Faiha ishaq",
      designation: "CORE TEAM MEMBER",
      img: faiha,
      className: "imbx1",
      style: { marginLeft: "-45px" },
      social: [
        { icon: "fab fa-instagram", link: "https://www.instagram.com/qwertyfaiha/" },
        { icon: "fab fa-linkedin", link: "www.linkedin.com/in/faiha-ishaq-947586324" }
      ]
    }
  ];

  // New faculty for 2025-2026
  const newFacultyData = [
    {
      id: 1,
      name: "DR.VIGNESHWARI S",
      designation: "HOD CSE",
      additional: "SIGAI MEMBER ID: 1089768",
      img: imgas,
      className: "imbx14"
    }
  ];

  const newFacultyCoordinatorsData = [
    {
      id: 1,
      name: "DR.SATHYABAMA R",
      designation: "ASSOCIATE PROFESSOR",
      img: imges,
      className: "imbx1"
    },
    {
      id: 2,
      name: "DR. ANUBHARATHI",
      designation: "ASSOCIATE PROFESSOR",
      img: img,
      className: "imbx2"
    }
  ];

  // Get the data based on the selected unit and year
  const getCardsData = () => {
    if (selectedYear === '2024-2025') {
      switch (selectedUnit) {
        case 'media':
          return oldMediaUnitData;
        case 'research':
          return oldResearchUnitData;
        default:
          return oldVolunteersData;
      }
    } else {
      switch (selectedUnit) {
        case 'media':
          return newMediaUnitData;
        case 'research':
          return newResearchUnitData;
        default:
          return newVolunteersData;
      }
    }
  };

  // Get leadership data based on year
  const getLeadershipData = () => {
    return selectedYear === '2024-2025' ? oldLeadershipData : newLeadershipData;
  };

  // Get core team data based on year
  const getCoreTeamData = () => {
    return selectedYear === '2024-2025' ? oldCoreTeamData : newCoreTeamData;
  };

  // Get faculty data based on year
  const getFacultyData = () => {
    return selectedYear === '2024-2025' ? oldFacultyData : newFacultyData;
  };

  // Get faculty coordinators data based on year
  const getFacultyCoordinatorsData = () => {
    return selectedYear === '2024-2025' ? oldFacultyCoordinatorsData : newFacultyCoordinatorsData;
  };

  return (
    <>
      <div className='about1' id='about'>
        <m.h1 variants={fadeIns("up", 0.2)}
          initial="hidden1"
          whileInView={"show1"}
          viewport={{ once: false, amount: 0.7 }}>EXPLORE ACM SIGAI!!</m.h1>

        <div className='content1'>
          <div className='img'>
            <img src={images} alt='img' />
          </div>

          <div className='wrapper1'>
            <h3>The scope of SIGAI, ACM's Special Interest Group on Artificial Intelligence,
              consists of the study of intelligence and its realization in computer systems. SIGAI's mission is to promote and support AI-related conferences.<break></break> Members receive reduced registration rates to all affiliated conferences. Members also receive proceedings from the major SIGAI-sponsored conferences.SIGAI publishes a quarterly newsletter, AI Matters,
              with ideas and announcements of interest to the AI community.</h3>
            <h3>ACM SIGAI is the Association for Computing Machinery's Special Interest Group on Artificial Intelligence (AI),<break></break>
              an interdisciplinary group of academic and industrial researchers, practitioners,<break></break> software developers, end users, and students who work together to promote and support the growth and application of AI principles and techniques throughout computing. SIGAI is one of the oldest special interest groups in the ACM. SIGAI, previously called SIGART, <break></break>started in 1966, publishing the SIGART Newsletter that
              later became the SIGART Bulletin and Intelligence Magazine.
              <br /> On January 10, 1947, at the Symposium on Large-Scale Digital Calculating Machinery at the Harvard computation Laboratory, Professor Samuel H. Caldwell of Massachusetts Institute of Technology spoke of the need for an association of those interested in computing machinery, and of the need for communication between them.
              After making some inquiries during May and June, we believe there is ample interest to start an informal association of many of those interested in the new machinery for computing and reasoning. Since there has to be a beginning, we are acting as a temporary committee to start such an association.</h3>
            <div className='button1'>
              <a href={'https://sigai.acm.org/main/'}>Explore more</a>
            </div>
          </div>
        </div>
      </div>

      <div className='bd'>
        <div className='wrapper'>
          <m.div variants={fadeIns("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }} className='title-core'>
            <h4><span>MEET SIST SIGAI ({selectedYear})</span> </h4>
          </m.div>

          <div className='card-container1'>
            {getLeadershipData().map((member) => (
              <Tilt
                key={member.id}
                id="tilt-card"
                options={{ scale: 2 }}
                style={{ width: 420 }}
              >
                <m.div
                  variants={fadeIns("up", 0.2)}
                  initial="hidden1"
                  whileInView={"show1"}
                  viewport={{ once: false, amount: 0.7 }}
                  className='cards'
                >
                  <div className={member.className}>
                    <img src={member.img} alt='img' style={member.style}></img>
                  </div>
                  <div className='contents'>
                    <div className='contentbx'>
                      <h3>{member.name}<br /><span>{member.designation}</span></h3>
                    </div>
                    <div className='social'>
                      {member.social.map((social, index) => (
                        <a key={index} href={social.link} target="_blank" rel="noopener noreferrer">
                          <i className={social.icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </m.div>
              </Tilt>
            ))}
          </div>

          <m.div variants={fadeIns("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }} className='title-core'>
            <h4><span>OUR Roots ({selectedYear})</span> </h4>
          </m.div>

          <div className='card-container1'>
            {getCoreTeamData().map((member) => (
              <Tilt
                key={member.id}
                id="tilt-card"
                options={{ scale: 2 }}
                style={{ width: 420 }}
              >
                <m.div
                  variants={fadeIns("up", 0.2)}
                  initial="hidden1"
                  whileInView={"show1"}
                  viewport={{ once: false, amount: 0.7 }}
                  className='cards'
                >
                  <div className={member.className}>
                    <img src={member.img} alt='img' style={member.style} />
                  </div>

                  <div className='contents'>
                    <div className='contentbx'>
                      <h3>{member.name}<br /><span>{member.designation}</span></h3>
                    </div>
                    <div className='social'>
                      {member.social.map((social, index) => (
                        <a key={index} href={social.link} target="_blank" rel="noopener noreferrer">
                          <i className={social.icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </m.div>
              </Tilt>
            ))}
          </div>

          <m.div
            variants={fadeIns("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }}
            className='title'
          >
            <h4>FACULTY CONVENER ({selectedYear})</h4>
          </m.div>

          <div className='card-container1'>
            {getFacultyData().map((faculty) => (
              <m.div
                key={faculty.id}
                variants={fadeIns("up", 0.2)}
                initial="hidden1"
                whileInView={"show1"}
                viewport={{ once: false, amount: 0.7 }}
                className='cards1'
              >
                <div className={faculty.className}>
                  <img src={faculty.img} alt='img' />
                </div>
                <div className='contents'>
                  <div className='contentbx'>
                    <h3>{faculty.name}<br /><span>{faculty.designation}</span><br /><span>{faculty.additional}</span></h3>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        <div className='wrapper'>
          <m.div
            variants={fadeIns("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }}
            className='title-co'
          >
            <h4>FACULTY COORDINATORS ({selectedYear})</h4>
          </m.div>

          <div className='card-container1'>
            {getFacultyCoordinatorsData().map((coordinator) => (
              <m.div
                key={coordinator.id}
                variants={fadeIns("up", 0.2)}
                initial="hidden1"
                whileInView={"show1"}
                viewport={{ once: false, amount: 0.7 }}
                className='cards1'
              >
                <div className={coordinator.className}>
                  <img src={coordinator.img} alt='img' />
                </div>
                <div className='contents'>
                  <div className='contentbx'>
                    <h3>{coordinator.name}<br /><span>{coordinator.designation}</span></h3>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        <div className='wrapper'>
          <m.div
            variants={fadeIns("up", 0.2)}
            initial="hidden1"
            whileInView={"show1"}
            viewport={{ once: false, amount: 0.7 }}
            className='title-co'
          >
            <h4>OUR UNITS ({selectedYear})</h4>
          </m.div>

          <div className="dropdown-container" style={{ textAlign: 'center', margin: '20px 0' }}>
            <label htmlFor="unit-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Unit: </label>
            <select
              id="unit-select"
              onChange={handleDropdownChange1}
              value={selectedUnit}
              style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="volunteers">Volunteers Unit</option>
              <option value="media">Media Unit</option>
              <option value="research">Research Unit</option>
            </select>
          </div>
          <div className='wrapper'>
            <div className='card-container1'>
              {getCardsData().map((member) => (
                <m.div
                  key={member.id}
                  variants={fadeIns("up", 0.2)}
                  initial="hidden1"
                  whileInView="show1"
                  viewport={{ once: false, amount: 0.7 }}
                  className='cards1'
                >
                  <div className={member.className}>
                    <img src={member.img} alt='img' style={member.style} />
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;