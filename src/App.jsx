import React, { useState, useEffect } from 'react';
import { CalendarDays, Map as MapIcon, BookOpen, Clock, MapPin, Search, User, LogOut, ChevronLeft, AlertCircle, ChevronRight, ListChecks, Filter, Sparkles, Calendar, Home, DoorOpen, Coffee, Sun, Building2, Map as MapPinIcon, ExternalLink } from 'lucide-react';

// --- CONFIGURATION ---
const LINKS = {
  // Itineraries pull live from Google Sheets
  itineraries: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrkmNrEGx_JOuGw--AI5ywWAVwwzjEtv6K-molR-cB21R0J8poWUdnsvUlSLwI3MBzi5-jrGeOUh5/pub?output=csv",
};

const LOGO_URL = "https://lh3.googleusercontent.com/d/1ZGhLmeIFbAwIK6G84_eV-IzYr9MLMpOP";

const CONFERENCE_INFO = {
  dates: "Friday 17th — Sunday 19th April 2026",
  tagline: "Join us for three days of connection and growth as we explore what it means to be a witness. Together, we will strengthen our bonds with each other and prepare to reach the world around us.",
  address: "38 Lexton Road, Box Hill North, VIC 3129",
  locationName: "FGAM",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=38+Lexton+Road+Box+Hill+North+VIC+3129"
};

// --- DATA: VENUE MAP ---
const VENUE_MAP = [
  {
    zone: "FGA Melbourne",
    address: "38 Lexton Road, Box Hill North, VIC 3129",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=38+Lexton+Road+Box+Hill+North+VIC+3129",
    icon: <Home size={20} />,
    description: "Main Building - Main Sessions, Meals, Kids Program",
    rooms: [
      { name: "Meeting Room", note: "Level 1" },
      { name: "Lobby", note: "Level 2" },
      { name: "Sanctuary", note: "Level 2" },
      { name: "Classroom 1-5 (Kids Program)", note: "Level 2" },
      { name: "Multipurpose Room (Kids Program)", note: "Level 2" },
      { name: "Rooftop (Night Market)", note: "Rooftop" }
    ]
  },
  {
    zone: "4/41 Lexton Road",
    address: "4/41 Lexton Road, Box Hill North, VIC 3129",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=4+41+Lexton+Road+Box+Hill+North+VIC+3129",
    icon: <Building2 size={20} />,
    description: "Satellite Workshop Space",
    rooms: [
      { name: "Main Space", note: "Upstairs" }
    ]
  },
  {
    zone: "7/41 Lexton Road",
    address: "7/41 Lexton Road, Box Hill North, VIC 3129",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=7+41+Lexton+Road+Box+Hill+North+VIC+3129",
    icon: <DoorOpen size={20} />,
    description: "Satellite Workshop Space",
    rooms: [
      { name: "Dance Studio 1", note: "Ground Level" },
      { name: "Dance Studio 2", note: "Upstairs" }
    ]
  },
  {
    zone: "61 Lexton Road",
    address: "61 Lexton Road, Box Hill North, VIC 3129",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=61+Lexton+Road+Box+Hill+North+VIC+3129",
    icon: <MapPinIcon size={20} />,
    description: "Satellite Workshop Space",
    rooms: [
      { name: "Main Area", note: "Ground Level" },
      { name: "Classroom", note: "Upstairs" }
    ]
  }
];

// --- DATA: WORKSHOPS ---
const WORKSHOPS_DATA = [
  { id: 'w1', title: 'Managing Screen Time', speaker: 'Kevin and Yen Siow', category: 'Parenting', biography: 'As parents of three boys, Kevin and Yen are still on the journey of learning how to navigate screens in a way that honours God, strengthens relationships and shapes character.', description: 'In this workshop, they will share a faith-centred, family values approach to digital habits, drawing on the work of Dr Justin Coulson (Happy Families) and their own lived experience.' },
  { id: 'w2', title: 'Adulting 101', speaker: 'Mike and Maggie', category: 'Youth/ Young Adult', biography: 'Mike is a trained engineer and business owner. Maggie is a healthcare professional and homemaker.', description: "At some point, everyone looks around and realizes they have no idea what they're doing. This session is an honest conversation about finances, career, self care, and life admin." },
  { id: 'w3', title: 'Entrepreneurship', speaker: 'Aaron Lau/Michael Ting', category: 'Career', biography: "Mike and Aaron have started half a dozen businesses between them. They've built ventures across automotive, healthcare, and consulting.", description: "Entrepreneurship isn't just about starting a business. It's a posture, a way of seeing the world and responding to what doesn't exist yet." },
  { id: 'w4', title: 'Crossing borders, changing jobs', speaker: 'Alan Wong', category: 'Career', biography: 'Alan has worked across Asia-Pacific as an investment banker and fund manager.', description: 'From career ambition to dealing with the painful realities of life and disappointment, Alan shares how God can use changes and crisis to shape us.' },
  { id: 'w5', title: 'Engaging AI', speaker: 'Alan Wong and Lawrence Chen', category: 'Tech', biography: 'Lawrence is a data analyst. Alan is a father and ex-entrepreneur with a passion for new tech.', description: 'AI is rapidly reshaping how we create and solve problems. Explore what AI is (and isn’t) and how it can be used wisely and practically.' },
  { id: 'w6', title: 'Crowded House', speaker: 'Ash and Grace Chan', category: 'Family', biography: 'Married for seven years and parents of two, Ash and Grace live in a village of five adults.', description: 'We rarely discuss the logistics of the "Village" when it’s all under one roof. Living with three generations offers incredible support but unique challenges.' },
  { id: 'w7', title: 'Study Hacks', speaker: 'Ashley Ng', category: 'Youth', biography: 'Ashley completed 8 VCE subjects and a Bachelor of Commerce. She has tutored for 5 years.', description: 'Do you feel like you study for hours but get nowhere? Gain practical ideas and strategies that you can start using immediately.' },
  { id: 'w8', title: 'Women Dating', speaker: 'Belle Seow/Grace Leong?', category: 'Relationships', biography: 'Belle and Grace bring insights from their own dating journeys and committed relationships.', description: 'Whether you’re single or dating, this workshop is about grounding yourself in God’s truth so you don’t lose yourself in the process.' },
  { id: 'w9', title: 'Demons in Christians?', speaker: 'Charles Ho', category: 'Theology', biography: 'Leaders of the Shalom Ministry (Inner Healing and Deliverance) in FGAM.', description: 'This workshop covers how Christians may experience demonic oppression and the practical steps toward freedom.' },
  { id: 'w10', title: 'Sex in the Suburbs', speaker: 'Daniel and Julie Wong', category: 'Marriage', biography: "Married for 37 years with 4 children and 4 grandchildren. Julie is an OT with 34 years of counselling experience.", description: 'Sexual intimacy in marriage was designed by God to bring joy. Discuss the joys as well as the barriers couples face.' },
  { id: 'w11', title: 'Running', speaker: 'David Gunn, Michelle Tsiros and Dennis Wong', category: 'Health', biography: 'Passionate runners who believe in the physical, mental, and spiritual health benefits of the sport.', description: 'What Are You Running Towards? A workshop for anyone who has ever thought about getting into running.' },
  { id: 'w12', title: 'Gut & Brain', speaker: 'Dr. Dennis Wong', category: 'Health', biography: 'Medical doctor and aged-care leader with a strong interest in brain health.', description: 'A practical exploration of how what we eat shapes how we think, feel, and age.' },
  { id: 'w13', title: 'Menopause Questions', speaker: 'Dr. Sze Wey Lee', category: 'Health', biography: 'Obstetrician and gynaecologist based in East Melbourne with 20 years of experience.', description: 'Menopause is often misunderstood. Learn what the symptoms are and the pros and cons of management.' },
  { id: 'w14', title: 'Life Vision Board', speaker: 'Elaine Choi', category: 'Personal Growth', biography: 'Trainer and facilitator with a heart for guiding women through seasons of transition.', description: 'Explore what it means to align your life with God’s purpose rather than personal pressure.' },
  { id: 'w15', title: 'Know Your WHY', speaker: 'Elijah Seow', category: 'Purpose', biography: 'Following Christ for 12 years with a heart for transparency and hard truths.', description: 'Why do you do what you do? Misdirected commitments can lead to exhaustion and burnout.' },
  { id: 'w16', title: 'Men Dating', speaker: 'Elijah Seow/Daniel Ong', category: 'Relationships', biography: 'Newly married and engaged young men sharing their journeys.', description: 'A focus on navigating ‘dating’ today, how to do it well by sharing perspectives and mistakes.' },
  { id: 'w17', title: 'Beyond Possible', speaker: 'Evelyn Seow', category: 'Theology', biography: 'Over four decades of ministry experience empowering Christians to walk in the supernatural.', description: 'Jesus promised that "greater works shall we do." Learn biblical steps to walk in the miraculous.' },
  { id: 'w18', title: 'Homeschool Life', speaker: 'Ewnice Teh (and Tim)', category: 'Parenting', biography: 'Married for 15 years, raising three children while managing online businesses.', description: 'Ewnice shares why they chose to homeschool and how it allowed their family to reclaim time.' },
  { id: 'w19', title: 'Meet Meat', speaker: 'Jean-Paul Seow', category: 'Cooking', biography: 'TBC', description: 'If you love steak, this one’s for you! Learn about different cuts and restaurant-quality tricks.' },
  { id: 'w20', title: 'Motorhome Life', speaker: 'Jit Lim', category: 'Lifestyle', biography: 'TBC', description: 'Jit shares memories and experiences from three winters on the road traveling around Australia.' },
  { id: 'w21', title: 'Unexpected Life', speaker: 'Josh So and Mel Cheung', category: 'Testimony', biography: 'Josh and Mel have been together for 11 years and call FGAM home.', description: 'A vulnerable look at an 11-year journey, exploring how God works through seasons of waiting.' },
  { id: 'w22', title: 'Worship Unveiled', speaker: 'Kim Teh', category: 'Arts', biography: 'Dance choreographer and teacher facilitating discovery of the hidden dancer for God.', description: 'Discover a space where movement becomes prayer and creative expression unfolds.' },
  { id: 'w23', title: 'Teen Mental Health', speaker: 'Marie Yap (OAM)', category: 'Parenting', biography: 'Professor of Psychology at Monash University specializing in adolescent mental health.', description: 'Learn practical and spiritual strategies to support the mental health and wellbeing of teenagers.' },
  { id: 'w24', title: 'Parenting Expectations', speaker: 'May Yen Ong', category: 'Parenting', biography: 'Served in ministry for over 20 years with a passion for families.', description: 'Navigate changing expectations as children grow into teens and young adults.' },
  { id: 'w25', title: 'God’s Will', speaker: 'Michael Ting / Stephanie Lok', category: 'Youth', biography: 'Active leaders living the question of God\'s will in their lives.', description: '"What does God actually want for my life?" Explore guideposts through lived experience.' },
  { id: 'w26', title: 'Simple Cooking', speaker: 'Min Leong Ong', category: 'Cooking', biography: 'TBC', description: 'A live food demonstration focused on effortless cooking, perfect for families.' },
  { id: 'w27', title: 'Domestic Violence', speaker: 'Mona Julien', category: 'Care', biography: 'Two decades of experience working with families and people with disabilities.', description: 'A real, down‑to‑earth community talk about hidden domestic violence and supportive responses.' },
  { id: 'w28', title: 'Sanctification and Success', speaker: 'Nevile Waterman', category: 'Leadership', biography: 'Business leader with many years of experience in church and corporate life.', description: 'Grow in faith, character, and confidence as you learn to follow Christ in a complex world.' },
  { id: 'w29', title: 'Grief & Loss', speaker: 'Ps. Andrew Harper', category: 'Care', biography: 'Ps. Andrew served as a hospital chaplain for 11 years.', description: 'Discuss the journey of grief and how we may encounter God in the midst of painful seasons.' },
  { id: 'w30', title: 'Advanced Bible Study', speaker: 'Ps. Andrew Harper', category: 'Theology', biography: 'Ps. Andrew has served in pastoral and leadership roles since 1987.', description: 'Deep dive into scriptural study and theological themes.' },
  { id: 'w31', title: "Following God's Calling", speaker: 'Ps. Roland Seow', category: 'Testimony', biography: 'Founding Pastor of FGA Melbourne with a passion for missions and families.', description: 'Chronicling FGAM\'s formation story to help participants discern God\'s voice.' },
  { id: 'w32', title: 'Healing Parental Hurt', speaker: 'Sarah Man and Lai Hing', category: 'Family', biography: 'Mother and daughter serving in social inclusion and counselling.', description: 'Personal testimony on modeling Christlike humility to address and repair relational hurts.' },
  { id: 'w33', title: 'Spirit-Led Parenting', speaker: 'Sonja Loke', category: 'Parenting', biography: 'Sonja is the Kids Pastor at FGA Kids and a mother of four.', description: 'Inviting the Holy Spirit into your parenting journey to transform how you respond to children.' },
  { id: 'w34', title: 'Financial Freedom', speaker: 'Wally Chiang', category: 'Finance', biography: 'Wally retired at 41 after reaching financial independence.', description: 'Unpack a framework grounded in biblical principles for financial stewardship.' },
  { id: 'w35', title: 'Missions Topic', speaker: 'Chai Ng', category: 'Missions', biography: 'TBC', description: 'We are called to missions. Explore the local and global heart of God.' },
  { id: 'w36', title: 'Family Activity', speaker: 'Harold Nguyen', category: 'Family', biography: 'TBC', description: 'A fun stage activity designed for all families to enjoy together.' },
  { id: 'w37', title: 'Grow in Worship', speaker: 'Iain Low', category: 'Worship', biography: 'TBC', description: 'Learn how a life of worship contributes to spiritual growth.' },
  { id: 'w38', title: 'Living with Disability', speaker: 'Ivan Low', category: 'Lifestyle', biography: 'TBC', description: 'A lived testimony about disability and how God walks with you.' },
  { id: 'w39', title: 'Counselling Options', speaker: 'Matt Jones', category: 'Care', biography: 'Matt Jones is Head of Crossway LifeCare and an ordained Baptist minister.', description: 'When is it appropriate to refer to professional care? Explore the challenges of giving confidence to care.' },
  { id: 'w40', title: 'Apologetics', speaker: 'Peggy Ong', category: 'Theology', biography: 'TBC', description: 'Learn how to defend your faith from Bible scholar and church elder Aunty Peggy.' },
  { id: 'w41', title: 'Steps for Staying Faithful', speaker: 'Peggy Ong', category: 'Faith', biography: 'TBC', description: 'Practical steps for staying faithful as a Christian, suitable for all maturity stages.' },
  { id: 'w42', title: 'No Burnouts', speaker: 'Albert Lee', category: 'Leadership', biography: 'Seasoned commercial executive with over 30 years of multinationals experience.', description: 'Move beyond the cliché of "doing less" to the art of leading better without consuming yourself.' },
  { id: 'w43', title: 'Decision Fatigue', speaker: 'Ps. Chris Ong', category: 'Leadership', biography: 'TBC', description: 'Unpack why decision fatigue is common and how to approach making choices more wisely.' },
  { id: 'w44', title: "Things We Don't Talk About in the Journey", speaker: 'Ps. Chris Ong', category: 'Testimony', biography: 'TBC', description: 'Ps. Chris Ong reflects honestly on the hidden costs and trials that shape a 30-year journey.' },
  { id: 'w45', title: 'Honesty', speaker: 'Ps. Isaac Ling', category: 'Faith', biography: 'TBC', description: 'How to live an honest, transparent God-honoring life and the repercussions of not doing so.' },
  { id: 'w46', title: 'Spiritual Ministry', speaker: 'Ps. Isaac Ling', category: 'Ministry', biography: 'TBC', description: 'Come for a time of spiritual ministry with Ps. Isaac Ling.' },
  { id: 'w47', title: 'Older Fitness', speaker: 'Tim Tan', category: 'Health', biography: 'Timothy is a chiropractor passionate about empowering older generations.', description: 'Honour God with your body as a temple. Beginner-friendly exercises and stretches.' },
  { id: 'w48', title: 'Youth are Leaders Today', speaker: 'JP/Jordan', category: 'Youth', biography: 'TBC', description: 'A youth-led session sharing how young people are learning to live out their faith now.' },
  { id: 'w49', title: 'My Faith, My Journey (Youth)', speaker: 'TBC', category: 'Youth', biography: 'TBC', description: 'Introduces youth to biblical testimony and everyday faithfulness.' },
  { id: 'w50', title: 'Live It Out! (Youth)', speaker: 'TBC', category: 'Youth', biography: 'TBC', description: 'A panel discussion equiping youth to see how everyday actions reflect Christ.' },
  { id: 'w51', title: 'Family Stage Activity', speaker: 'TBC', category: 'Family', biography: 'TBC', description: 'Family engagement session.' },
  { id: 'w52', title: 'Youth Presentation Activity', speaker: 'TBC', category: 'Youth', biography: 'TBC', description: 'Workshop presentation activity for youth.' },
  { id: 'w53', title: 'Designing A Youth Service (Youth)', speaker: 'TBC', category: 'Youth', biography: 'TBC', description: 'Showcase the testimonies of young people and vibrancy of next-gen faith.' },
];

const MASTER_SCHEDULE = [
  { 
    date: 'Friday', 
    events: [ 
      { id: 'f1', time: '5:30 PM', title: 'Doors Open & Dinner', location: 'Lobby', type: 'main' }, 
      { id: 'f2', time: '7:00 PM', title: 'Doors Open & Keynote Session', location: 'Sanctuary', type: 'main' } 
    ] 
  },
  { 
    date: 'Saturday', 
    events: [ 
      { id: 's1', time: '9:00 AM', title: 'All In Session', location: 'Sanctuary', type: 'main' }, 
      { id: 's2', time: '9:30 AM', title: 'Workshop Session 1', type: 'workshop_slot' }, 
      { id: 's3', time: '10:30 AM', title: 'Workshop Session 2', type: 'workshop_slot' }, 
      { id: 's4', time: '12:00 PM', title: 'Workshop Session 3/Lunch', type: 'workshop_slot' }, 
      { id: 's5', time: '1:00 PM', title: 'Workshop Session 4/Lunch', type: 'workshop_slot' }, 
      { id: 's6', time: '2:00 PM', title: 'Workshop Session 5', type: 'workshop_slot' }, 
      { id: 's7', time: '3:00 PM', title: 'Workshop Session 6', type: 'workshop_slot' }, 
      { id: 's8', time: '4:00 PM', title: 'Keynote Session', location: 'Sanctuary', type: 'main' },
      { id: 's9', time: '6:00 PM', title: 'Night Market', location: 'FGAM Rooftop', type: 'main' }
    ] 
  },
  { 
    date: 'Sunday', 
    events: [ 
      { id: 'su1', time: '9:00 AM', title: 'All In Session', location: 'Sanctuary', type: 'main' }, 
      { id: 'su2', time: '9:30 AM', title: 'Workshop Session 7', type: 'workshop_slot' }, 
      { id: 'su3', time: '10:30 AM', title: 'Workshop Session 8', type: 'workshop_slot' }, 
      { id: 'su4', time: '12:00 PM', title: 'Workshop Session 9/Lunch', type: 'workshop_slot' }, 
      { id: 'su5', time: '1:00 PM', title: 'Workshop Session 10/Lunch', type: 'workshop_slot' }, 
      { id: 'su6', time: '2:00 PM', title: 'Workshop Session 11', type: 'workshop_slot' }, 
      { id: 'su7', time: '3:00 PM', title: 'CONFERENCE CLOSE KEYNOTE', location: 'Sanctuary', type: 'main' } 
    ] 
  }
];

// --- HELPERS ---

function getSafeField(row, fieldName) {
  if (!row) return '';
  const cleanTarget = fieldName.trim().toLowerCase();
  const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === cleanTarget);
  const value = actualKey ? row[actualKey] : '';
  return (value || '').toString().trim();
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1)
    .filter(l => l.trim().length > 0)
    .map((line) => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((h, i) => { if (h) row[h] = values[i] || ''; });
      return row;
    })
    .filter(row => Object.values(row).some(v => v.trim() !== '')); 
}

// --- COMPONENTS ---

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[#4563AD]' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#4563AD]/10' : ''}`}>{icon}</div>
      <span className="text-[10px] font-extrabold uppercase tracking-tight text-center leading-tight">{label}</span>
    </button>
  );
}

function ExpandableText({ text, maxLength = 120, className = "text-gray-600 text-sm leading-relaxed font-medium" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text || text.length === 0) return null;
  if (text.length <= maxLength) return <p className={`${className} whitespace-pre-wrap`}>{text}</p>;
  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{isExpanded ? text : `${text.substring(0, maxLength).trim()}...`}</span>
      <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="ml-2 text-[#ED4E23] font-bold hover:underline inline-flex items-center">
        {isExpanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
}

function DaySelector({ selectedDay, onDayChange }) {
  const days = ['Friday', 'Saturday', 'Sunday'];
  return (
    <div className="sticky top-0 bg-[#FCF5EB]/95 backdrop-blur-sm z-10 py-4 border-b border-[#E8BA21]/20 mb-6">
      <div className="flex bg-white/50 p-1 rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
        {days.map(day => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${selectedDay === day ? 'bg-[#4563AD] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkshopDetailView({ workshop, onBack }) {
  if (!workshop) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF5EB] animate-in slide-in-from-right-8 duration-300 pb-24 text-left">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="py-4 border-b border-[#E8BA21]/20 flex items-center gap-2 sticky top-0 bg-[#FCF5EB]/90 backdrop-blur-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-[#4563AD] hover:bg-[#4563AD]/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <span className="font-extrabold text-[#4563AD] text-sm uppercase tracking-wider">Session Details</span>
        </div>
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 font-serif">{workshop.title || 'Untitled Session'}</h1>
          <p className="text-lg md:text-xl font-bold text-[#ED4E23]">by {workshop.speaker || 'TBA'}</p>
          
          <div className="prose prose-sm md:prose-base text-gray-600 font-medium leading-relaxed bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm my-8">
            <h3 className="text-gray-900 font-bold mb-3 text-lg font-serif">About this session</h3>
            {workshop.description ? (
              <ExpandableText text={workshop.description} maxLength={3000} />
            ) : (
              <p className="italic text-gray-400">Description coming soon...</p>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#4563AD]/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8BA21]/10 rounded-bl-full -z-0"></div>
            <h3 className="text-[#4563AD] font-bold mb-4 text-lg font-serif relative z-10">About the Speaker</h3>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#FCF5EB] border-2 border-[#ED4E23] overflow-hidden shrink-0 flex items-center justify-center font-bold text-[#ED4E23] text-2xl shadow-sm">
                {(workshop.speaker || 'T').charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-base leading-tight">{workshop.speaker || 'To be announced'}</h4>
                {workshop.biography ? (
                  <ExpandableText text={workshop.biography} maxLength={500} className="text-sm text-gray-600 mt-1.5 leading-relaxed font-medium" />
                ) : (
                  <p className="text-sm text-gray-400 mt-1.5 italic">Biography coming soon...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [activeTab, setActiveTab] = useState('my-wish');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Friday');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    const emailStr = email.trim().toLowerCase();
    
    try {
      const response = await fetch(LINKS.itineraries);
      const csvText = await response.text();
      const data = parseCSV(csvText);
      
      const users = data.filter(row => {
        const rowEmail = getSafeField(row, 'Email').toLowerCase();
        return rowEmail === emailStr;
      });

      if (users.length === 1) {
        processUser(users[0]);
      } else if (users.length > 1) {
        setMatchingUsers(users);
      } else {
        setError("Registration not found. Please check your spelling.");
      }
    } catch (err) {
      setError("Unable to sync. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const processUser = (row) => {
    const fName = getSafeField(row, 'Name (First)');
    const lName = getSafeField(row, 'Name (Last)');
    const emailAddr = getSafeField(row, 'Email');
    const fullName = `${fName} ${lName}`.trim() || emailAddr.split('@')[0];
    
    const userWorkshops = {};
    const identityKeys = ['email', 'name(first)', 'name(last)', 'name'];
    Object.keys(row).forEach(key => {
      const val = (row[key] || '').toString().trim().toLowerCase();
      if (!identityKeys.includes(key.trim().toLowerCase()) && val) {
        userWorkshops[key.trim().toLowerCase()] = val;
      }
    });

    setCurrentUser({ name: fullName, workshops: userWorkshops });
    setMatchingUsers([]);
    setSelectedDay('Saturday');
  };

  const filteredWorkshops = WORKSHOPS_DATA.filter(w => {
    const title = w.title.toLowerCase();
    const speaker = w.speaker.toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || speaker.includes(search);
  });

  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col font-sans text-gray-900 selection:bg-[#E8BA21]/30 text-left">
      
      <header className="w-full bg-[#FCF5EB] border-b border-[#E8BA21]/20 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="max-w-2xl mx-auto p-5 flex justify-between items-center">
          <img src={LOGO_URL} className="h-10 md:h-12 object-contain" alt="WISH Logo" />
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-bold text-gray-500 uppercase">{currentUser.name}</span>
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-sm text-[#4563AD] uppercase shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative text-balance">
        {selectedWorkshopId ? (
          <WorkshopDetailView 
            workshop={WORKSHOPS_DATA.find(w => w.id.toLowerCase() === selectedWorkshopId.toLowerCase())} 
            onBack={() => setSelectedWorkshopId(null)} 
          />
        ) : (
          <div className="max-w-2xl w-full mx-auto p-6 pb-32">
            
            {activeTab === 'my-wish' && (
              currentUser ? (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">My WISH</h2>
                      <p className="text-xs text-gray-500 font-bold uppercase mt-1">Personal Itinerary</p>
                    </div>
                    <button onClick={() => setCurrentUser(null)} className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-widest hover:bg-red-50 hover:text-red-400 transition-colors">Logout</button>
                  </div>

                  <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

                  {MASTER_SCHEDULE.filter(day => day.date === selectedDay).map((day) => (
                    <div key={`personal-day-${day.date}`} className="space-y-6">
                      {day.events.map((event) => {
                        const userWorkshopCode = currentUser.workshops[event.id.toLowerCase()] || '';
                        const workshop = WORKSHOPS_DATA.find(w => w.id.toLowerCase() === userWorkshopCode.toLowerCase());
                        const isSlot = event.type === 'workshop_slot';
                        const isH = isSlot && workshop;
                        const isEmptySlot = isSlot && !workshop;
                        
                        return (
                          <div key={`personal-ev-${event.id}`} className="flex gap-4 items-start">
                            <div className="w-16 shrink-0 pt-4 text-right font-bold text-gray-400 text-sm">{event.time}</div>
                            <div 
                              className={`flex-1 p-5 rounded-3xl border transition-all ${isH ? 'bg-white border-[#E8BA21] shadow-md cursor-pointer hover:border-[#ED4E23]' : 'bg-white border-gray-100 shadow-sm'} relative overflow-hidden`}
                              onClick={() => isH ? setSelectedWorkshopId(workshop.id) : null}
                            >
                              {(isH || event.type === 'main' || event.title === 'Night Market') && <div className={`absolute top-0 left-0 w-1.5 h-full ${(event.type === 'main' || event.title === 'Night Market') ? 'bg-[#4563AD]' : 'bg-[#E8BA21]'}`} />}
                              <h4 className={`font-bold text-gray-900 leading-snug text-lg ${isEmptySlot ? 'italic text-gray-400' : ''}`}>
                                {workshop ? workshop.title : (isEmptySlot ? 'Choice Pending' : event.title)}
                              </h4>
                              {workshop && <p className="text-sm text-[#ED4E23] mt-1 font-bold">with {workshop.speaker}</p>}
                              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 font-semibold uppercase tracking-wider"><MapPin size={13} /> {event.location || 'TBA'}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-in fade-in duration-700">
                  {matchingUsers.length > 0 ? (
                    <div className="pt-4 text-left">
                      <button onClick={() => setMatchingUsers([])} className="mb-4 text-sm font-bold text-[#4563AD] flex items-center gap-1"><ChevronLeft size={16}/> Back</button>
                      <h2 className="text-3xl font-extrabold text-[#4563AD] mb-2 font-serif">Select Person</h2>
                      <div className="space-y-3 mt-6">
                        {matchingUsers.map((u, i) => (
                          <button key={`user-choice-${i}`} onClick={() => processUser(u)} className="w-full p-5 bg-white border border-[#E8BA21]/30 rounded-[2rem] flex items-center justify-between hover:bg-white/80 active:scale-[0.98] transition-all shadow-sm">
                            <span className="font-bold text-gray-800">{(getSafeField(u, 'Name (First)') + ' ' + getSafeField(u, 'Name (Last)')).trim() || getSafeField(u, 'Email')}</span>
                            <ChevronRight size={20} className="text-[#E8BA21]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-12">
                      <div className="text-left py-4">
                        <div className="inline-flex items-center gap-2 bg-[#4563AD]/10 text-[#4563AD] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                          <Sparkles size={14} /> WISH CONFERENCE '26
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] font-serif mb-6">
                          Welcome to <span className="text-[#ED4E23]">WISH</span>
                        </h1>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-lg mb-8">
                          {CONFERENCE_INFO.tagline}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50">
                            <Calendar size={20} className="text-[#E8BA21]" />
                            <span className="text-sm font-bold">{CONFERENCE_INFO.dates}</span>
                          </div>
                          <a 
                            href={CONFERENCE_INFO.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 hover:bg-white hover:shadow-md transition-all group"
                          >
                            <MapPin size={20} className="text-[#E8BA21]" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold group-hover:text-[#4563AD]">{CONFERENCE_INFO.locationName}</span>
                              <span className="text-[10px] font-medium text-gray-400">{CONFERENCE_INFO.address}</span>
                            </div>
                          </a>
                        </div>
                      </div>

                      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#4563AD]/5 text-left">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-sm text-gray-400 font-medium mb-8">Enter your registered email to access your personal itinerary.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="Email address" 
                            className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#E8BA21]/10 focus:border-[#E8BA21] outline-none text-gray-900 font-medium transition-all" 
                            required 
                          />
                          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl flex items-center gap-2 animate-bounce"><AlertCircle size={16}/> {error}</div>}
                          <button type="submit" disabled={isLoading} className="w-full bg-[#ED4E23] text-white font-extrabold py-5 rounded-2xl shadow-lg shadow-[#ED4E23]/30 hover:bg-[#ED4E23]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                            {isLoading ? "Checking Registry..." : <>Access My Schedule <ChevronRight size={20}/></>}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            {activeTab === 'schedule' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="text-left">
                  <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Conference</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest text-left">Master Schedule</p>
                </div>
                
                <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

                {MASTER_SCHEDULE.filter(day => day.date === selectedDay).map((day) => (
                  <div key={`master-day-${day.date}`} className="space-y-6">
                    {day.events.map((event) => (
                      <div key={`master-ev-${event.id}`} className="flex gap-4 items-start text-left">
                        <div className="w-16 shrink-0 pt-4 text-right font-bold text-gray-400 text-sm">{event.time}</div>
                        <div className="flex-1 p-5 rounded-3xl border bg-white border-gray-100 shadow-sm relative overflow-hidden">
                          {(event.type === 'main' || event.title === 'Night Market') && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4563AD]" />}
                          {event.type === 'workshop_slot' && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8BA21]" />}
                          <h4 className="font-bold text-gray-900 leading-tight text-lg">{event.title}</h4>
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 font-semibold uppercase tracking-wider"><MapPin size={13} /> {event.location || 'Multiple Rooms'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'workshops' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="text-left">
                  <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Workshops</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1 text-left">Browse and search for specific sessions.</p>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4563AD] transition-colors" size={20} />
                  <input type="text" placeholder="Search topics or speakers..." className="w-full pl-14 p-5 rounded-[2rem] border border-gray-100 bg-white outline-none focus:ring-4 focus:ring-[#4563AD]/5 focus:border-[#4563AD]/20 font-medium transition-all shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 gap-4 text-left">
                  {filteredWorkshops.map((w) => (
                    <div key={`w-list-${w.id}`} onClick={() => setSelectedWorkshopId(w.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 hover:shadow-md cursor-pointer active:scale-[0.99] transition-all group flex flex-col gap-1">
                      <h3 className="font-extrabold text-xl text-gray-900 leading-tight group-hover:text-[#4563AD] transition-colors">{w.title}</h3>
                      <p className="text-[#ED4E23] text-sm font-bold uppercase tracking-wider">{w.speaker}</p>
                      {w.category && (
                        <p className="text-[#4563AD] text-[10px] font-extrabold uppercase tracking-widest bg-[#4563AD]/5 inline-block px-2.5 py-1 rounded-full self-start mt-2 border border-[#4563AD]/10">{w.category}</p>
                      )}
                    </div>
                  ))}
                  {filteredWorkshops.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-medium italic">No workshops found matching that search.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="text-left">
                  <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Locations</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1 text-left">Campus addresses and room layouts.</p>
                </div>
                
                <div className="space-y-8 text-left">
                  {VENUE_MAP.map((location, idx) => (
                    <div key={`loc-${idx}`} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 flex items-start gap-5 border-b border-gray-50 bg-gray-50/40">
                        <div className="w-12 h-12 rounded-2xl bg-[#4563AD]/10 flex items-center justify-center text-[#4563AD] shrink-0 shadow-inner">
                          {location.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900">{location.zone}</h3>
                          <a 
                            href={location.mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs text-[#E8BA21] font-bold mt-1 hover:text-[#4563AD] transition-all group/addr"
                          >
                            {location.address}
                            <ExternalLink size={12} className="text-gray-300 group-hover/addr:text-[#4563AD]" />
                          </a>
                          <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">{location.description}</p>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {location.rooms.map((room, rIdx) => (
                          <div key={`room-${rIdx}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#E8BA21]/20 hover:shadow-sm transition-all group/room">
                            <span className="text-sm font-bold text-gray-700">{room.name}</span>
                            <span className="text-[10px] uppercase font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg tracking-wider border border-gray-100 group-hover/room:bg-[#E8BA21]/10 group-hover/room:text-[#ED4E23] group-hover/room:border-[#E8BA21]/20 transition-all">{room.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#FCF5EB]/95 backdrop-blur-xl border-t border-[#E8BA21]/20 z-50">
        <div className="max-w-2xl mx-auto h-20 flex justify-around items-center px-4">
          <NavItem icon={<User size={22}/>} label="My WISH" isActive={activeTab === 'my-wish'} onClick={() => { setActiveTab('my-wish'); setSelectedWorkshopId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
          <NavItem icon={<CalendarDays size={22}/>} label="Schedule" isActive={activeTab === 'schedule'} onClick={() => { setActiveTab('schedule'); setSelectedWorkshopId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
          <NavItem icon={<BookOpen size={22}/>} label="Workshops" isActive={activeTab === 'workshops'} onClick={() => { setActiveTab('workshops'); setSelectedWorkshopId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
          <NavItem icon={<MapIcon size={22}/>} label="Map" isActive={activeTab === 'map'} onClick={() => { setActiveTab('map'); setSelectedWorkshopId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
        </div>
      </nav>
    </div>
  );
}
