import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  CalendarDays, Map as MapIcon, BookOpen, Clock, MapPin, 
  Search, User, ChevronLeft, AlertCircle, ChevronRight, 
  Sparkles, Calendar, Building2, DoorOpen, 
  Map as MapPinIcon, ExternalLink, Loader2, Bell, X, CheckCircle2,
  Maximize2
} from 'lucide-react';

// Firebase Imports for Session Persistence
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// --- CONFIGURATION ---
const LINKS = {
  itineraries: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrkmNrEGx_JOuGw--AI5ywWAVwwzjEtv6K-molR-cB21R0J8poWUdnsvUlSLwI3MBzi5-jrGeOUh5/pub?output=csv",
  workshopCatalog: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnhme1HIsh7TxAro8Md1Xwp3fFdxizrFCNBbSLYYlRlWQGf2ndODy3XYte8XDwjyGOWVaBL_tKk4A2/pub?output=csv",
  updatesFeed: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRf69vgjPStu-Y718QfFL7JiD404Y3s9raQ4cFegH4ocqotbE1XE77IXffBQ6iMffx4uUW77g5du9ma/pub?output=csv" 
};

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyD20J-zbKbo7F3AxzwDXdIhUbvUs0W8V5w",
  authDomain: "wish-2026.firebaseapp.com",
  projectId: "wish-2026",
  storageBucket: "wish-2026.firebasestorage.app",
  messagingSenderId: "949007992492",
  appId: "1:949007992492:web:cbb8e0c771228cffba8109"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'wish-2026-v1';

const CONFERENCE_INFO = {
  dates: "Friday 17th — Sunday 19th April 2026",
  tagline: "Join us for three days of connection and growth as we explore what it means to be a witness. Together, we will strengthen our bonds with each other and prepare to reach the world around us.",
  address: "38 Lexton Road, Box Hill North, VIC 3129",
  locationName: "FGAM",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=38+Lexton+Road+Box+Hill+North+VIC+3129"
};

const MASTER_SCHEDULE = [
  { date: 'Friday', events: [ { id: 'f1', time: '5:30 PM', title: 'Doors Open & Dinner', location: 'Lobby', type: 'main' }, { id: 'f2', time: '7:00 PM', title: 'Keynote Session', location: 'Sanctuary', type: 'main' } ] },
  { date: 'Saturday', events: [ { id: 's1', time: '9:00 AM', title: 'All In Session', location: 'Sanctuary', type: 'main' }, { id: 's2', time: '9:30 AM', title: 'Workshop Session 1', type: 'workshop_slot' }, { id: 's3', time: '10:30 AM', title: 'Workshop Session 2', type: 'workshop_slot' }, { id: 's4', time: '12:00 PM', title: 'Workshop Session 3 / Lunch', type: 'workshop_slot' }, { id: 's5', time: '1:00 PM', title: 'Workshop Session 4 / Lunch', type: 'workshop_slot' }, { id: 's6', time: '2:00 PM', title: 'Workshop Session 5', type: 'workshop_slot' }, { id: 's7', time: '3:00 PM', title: 'Workshop Session 6', type: 'workshop_slot' }, { id: 's8', time: '4:00 PM', title: 'Keynote Session', location: 'Sanctuary', type: 'main' }, { id: 's9', time: '6:00 PM', title: 'Night Market', location: 'FGAM Rooftop', type: 'main' } ] },
  { date: 'Sunday', events: [ { id: 'su1', time: '9:00 AM', title: 'All In Session', location: 'Sanctuary', type: 'main' }, { id: 'su2', time: '9:30 AM', title: 'Workshop Session 7', type: 'workshop_slot' }, { id: 'su3', time: '10:30 AM', title: 'Workshop Session 8', type: 'workshop_slot' }, { id: 'su4', time: '12:00 PM', title: 'Workshop Session 9 / Lunch', type: 'workshop_slot' }, { id: 'su5', time: '1:00 PM', title: 'Workshop Session 10 / Lunch', type: 'workshop_slot' }, { id: 'su6', time: '2:00 PM', title: 'Workshop Session 11', type: 'workshop_slot' }, { id: 'su7', time: '3:00 PM', title: 'CONFERENCE CLOSE', location: 'Sanctuary', type: 'main' } ] }
];

const VENUE_MAP = [
  { zone: "FGA Melbourne", address: "38 Lexton Road, Box Hill North", mapUrl: CONFERENCE_INFO.googleMapsUrl, icon: Building2, rooms: [{name: "Lobby", note: "Level 2"}, {name: "Sanctuary", note: "Level 2"}, {name: "Meeting Room", note: "Level 1"}, {name: "Rooftop", note: "Top Level"}] },
  { zone: "4/41 Lexton Road", address: "4/41 Lexton Road, Box Hill North", mapUrl: "https://www.google.com/maps/search/?api=1&query=4+41+Lexton+Road+Box+Hill+North+VIC+3129", icon: Building2, rooms: [{name: "Main Space", note: "Upstairs"}] },
  { zone: "7/41 Lexton Road", address: "7/41 Lexton Road, Box Hill North", mapUrl: "https://www.google.com/maps/search/?api=1&query=7+41+Lexton+Road+Box+Hill+North+VIC+3129", icon: DoorOpen, rooms: [{name: "Dance Studio 1", note: "Ground"}, {name: "Dance Studio 2", note: "Level 1"}] },
  { zone: "61 Lexton Road", address: "61 Lexton Road, Box Hill North", mapUrl: "https://www.google.com/maps/search/?api=1&query=61+Lexton+Road+Box+Hill+North+VIC+3129", icon: MapPinIcon, rooms: [{name: "Main Area", note: "Ground"}, {name: "Classroom", note: "Level 1"}] }
];

function normalizeString(str) {
  if (!str) return '';
  return str.toString().toLowerCase().trim()
    .replace(/\s+/g, ' ')      
    .replace(/['"“”‘’]/g, '')  
    .replace(/[—–-]/g, ' ')   
    .replace(/[^\w\s]/g, '')  
    .trim();
}

function parseCSV(text) {
  const result = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (inQuotes) {
      if (char === '"' && nextChar === '"') { cell += '"'; i++; }
      else if (char === '"') inQuotes = false;
      else cell += char;
    } else {
      if (char === '"') inQuotes = true;
      else if (char === ',') { row.push(cell.trim()); cell = ''; }
      else if (char === '\n' || char === '\r') {
        if (cell || row.length > 0) { row.push(cell.trim()); result.push(row); }
        row = []; cell = ''; if (char === '\r' && nextChar === '\n') i++;
      } else cell += char;
    }
  }
  if (cell || row.length > 0) { row.push(cell.trim()); result.push(row); }
  if (result.length < 2) return [];
  const headers = result[0].map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
  return result.slice(1).map(rowData => {
    const obj = {};
    headers.forEach((header, index) => { obj[header] = rowData[index] || ''; });
    return obj;
  }).filter(obj => Object.values(obj).some(v => v !== ''));
}

function parseSessionString(str) {
  if (!str) return [];
  return str.split(';').map(part => {
    const segments = part.split('@').map(s => s.trim());
    if (segments.length < 2) return null;
    const [dateTime, room] = segments;
    return { day: dateTime.substring(0, 3).trim(), time: dateTime.substring(4).trim(), room };
  }).filter(s => s !== null);
}

function getDirectDriveLink(url) {
  if (!url) return '';
  const urlStr = String(url);
  const firstUrl = urlStr.split(',')[0].trim();
  if (!firstUrl.includes('drive.google.com')) return firstUrl;
  const idMatch = firstUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || firstUrl.match(/id=([a-zA-Z0-9_-]+)/);
  return idMatch ? `https://lh3.googleusercontent.com/d/${idMatch[1]}` : firstUrl;
}

function formatTimestamp(ts) {
  if (!ts || ts === 'Recent') return 'Recent';
  try {
    const date = new Date(ts);
    if (!isNaN(date.getTime())) {
      const datePart = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      const timePart = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${datePart}, ${timePart}`;
    }
    const parts = ts.split(' ');
    if (parts.length >= 2) {
      const dateStr = parts[0];
      const timePart = parts[1];
      const timeSubParts = timePart.split(':');
      const dateClean = dateStr.split('/').slice(0, 2).join('/');
      if (timeSubParts.length >= 2) {
        let hours = parseInt(timeSubParts[0], 10);
        const minutes = timeSubParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${dateClean}, ${hours}:${minutes} ${ampm}`;
      }
    }
    return ts;
  } catch (e) {
    return ts;
  }
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[#4563AD]' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#4563AD]/10' : ''}`}><Icon size={22} /></div>
      <span className="text-[10px] font-extrabold uppercase tracking-tight text-center leading-tight">{label}</span>
    </button>
  );
}

function ExpandableText({ text, maxLength = 250, className = "text-gray-600 text-sm leading-relaxed font-medium" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textStr = String(text || '');
  if (!textStr) return null;
  if (textStr.length <= maxLength) return <p className={`${className} whitespace-pre-wrap`}>{textStr}</p>;
  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{isExpanded ? textStr : `${textStr.substring(0, maxLength).trim()}...`}</span>
      <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="ml-1 text-[#ED4E23] font-bold hover:underline inline-flex items-center">
        {isExpanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
}

const DaySelector = React.memo(({ selectedDay, onDayChange }) => {
  const days = ['Friday', 'Saturday', 'Sunday'];
  return (
    <div className="sticky top-0 bg-[#FCF5EB]/95 backdrop-blur-sm z-10 py-4 border-b border-[#E8BA21]/20 mb-6 text-center">
      <div className="flex bg-white/50 p-1 rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto inline-flex">
        {days.map(day => (
          <button key={day} onClick={() => onDayChange(day)} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${selectedDay === day ? 'bg-[#4563AD] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
            {day}
          </button>
        ))}
      </div>
    </div>
  );
});

function WorkshopDetailView({ workshop, onBack }) {
  if (!workshop) return null;
  return (
    <div className="flex flex-col min-h-screen bg-[#FCF5EB] animate-in slide-in-from-right-8 duration-300 pb-24 text-left">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="py-4 border-b border-[#E8BA21]/20 flex items-center gap-2 sticky top-0 bg-[#FCF5EB]/90 backdrop-blur-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-[#4563AD] hover:bg-[#4563AD]/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <span className="font-extrabold text-[#4563AD] text-sm uppercase tracking-wider">Workshop Details</span>
        </div>
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 font-serif">{String(workshop.title || '')}</h1>
          <p className="text-lg md:text-xl font-bold text-[#ED4E23] mb-8">by {String(workshop.speaker || '')}</p>
          
          <div className="prose prose-sm md:prose-base text-gray-600 font-medium leading-relaxed bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm my-8 text-left">
            <h3 className="text-gray-900 font-bold mb-3 text-lg font-serif">About this session</h3>
            {workshop.description ? <ExpandableText text={workshop.description} maxLength={3000} /> : <p className="italic text-gray-400">Description coming soon...</p>}
          </div>

          {workshop.biography && workshop.biography !== "N/A" && (
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#4563AD]/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8BA21]/10 rounded-bl-full -z-0"></div>
              <h3 className="text-[#4563AD] font-bold mb-4 text-lg font-serif relative z-10 text-left">About the Speaker</h3>
              <div className="flex items-start gap-4 relative z-10 text-left">
                <div className="w-20 h-20 rounded-2xl bg-[#FCF5EB] border-2 border-[#ED4E23] flex items-center justify-center overflow-hidden shadow-sm shrink-0 font-bold text-[#ED4E23] text-2xl uppercase">
                   {workshop.photo ? (
                     <img src={getDirectDriveLink(workshop.photo)} alt={workshop.speaker} className="w-full h-full object-cover" />
                   ) : (
                     String(workshop.speaker || 'T').charAt(0)
                   )}
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-gray-900 text-base leading-tight">{String(workshop.speaker || '')}</h4>
                  <ExpandableText text={workshop.biography} maxLength={250} className="text-sm text-gray-600 mt-1.5 leading-relaxed" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [fbUser, setFbUser] = useState(null); 
  const [conferenceUser, setConferenceUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('updates');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setEmail] = useState('');
  
  // States to manage combined loading
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [error, setError] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [workshops, setWorkshops] = useState([]);
  const [updates, setUpdates] = useState([]);

  // Finalize setup from sheet data
  const completeUserSetup = useCallback(async (u, emailStr) => {
    const fKey = Object.keys(u).find(k => k.includes('first'));
    const lKey = Object.keys(u).find(k => k.includes('last'));
    
    setConferenceUser({ 
      name: `${String(u[fKey] || '')} ${String(u[lKey] || '')}`.trim() || emailStr.split('@')[0], 
      email: emailStr, 
      workshops: u 
    });
    setMatchingUsers([]);
    setActiveTab('my-wish');

    // Save session to device-linked Firestore (Remember Me)
    if (auth.currentUser) {
      try {
        const sessionDoc = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'session', 'current');
        await setDoc(sessionDoc, { 
          email: emailStr, 
          updatedAt: new Date().toISOString() 
        });
      } catch (err) {
        console.error("Session save failed", err);
      }
    }
  }, []);

  // Registry check logic
  const performLoginCheck = useCallback(async (targetEmail) => {
    if (!targetEmail) {
      setIsSessionRestored(true);
      return;
    };
    setIsLoadingUser(true);
    setError('');
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${LINKS.itineraries}&t=${timestamp}`, { cache: "no-store" });
      const csv = await res.text();
      const rawData = parseCSV(csv);
      const emailStr = targetEmail.trim().toLowerCase();
      const users = rawData.filter(row => Object.values(row).some(val => String(val).toLowerCase().trim() === emailStr));
      
      if (users.length === 1) {
        await completeUserSetup(users[0], emailStr);
      } else if (users.length > 1) {
        setMatchingUsers(users);
      } else {
        setError(`"${emailStr}" not found in registration list.`);
        if (auth.currentUser) {
          const sessionDoc = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'session', 'current');
          await deleteDoc(sessionDoc).catch(() => {});
        }
      }
    } catch (e) { 
      setError("Error connecting to registry."); 
    } finally { 
      setIsLoadingUser(false); 
      setIsSessionRestored(true); // Signal session check is over
    }
  }, [completeUserSetup]);

  // Auth & Session Retrieval Effect (Rule 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Sign in anonymously immediately to check session doc
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Initial auth failed", err);
        setIsSessionRestored(true); // Proceed anyway if auth fails
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        try {
          const sessionDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'session', 'current');
          const snap = await getDoc(sessionDoc);
          if (snap.exists() && snap.data().email) {
            performLoginCheck(snap.data().email);
          } else {
            setIsSessionRestored(true);
          }
        } catch (err) {
          console.error("Session restore error", err);
          setIsSessionRestored(true);
        }
      } else {
        // No user at all, stop waiting
        setIsSessionRestored(true);
      }
    });
    return () => unsubscribe();
  }, [performLoginCheck]);

  // Main Feed Data Loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const catalogRes = await fetch(`${LINKS.workshopCatalog}&t=${timestamp}`, { cache: "no-store" });
        const catalogCsv = await catalogRes.text();
        const catalogData = parseCSV(catalogCsv);
        setWorkshops(catalogData.map(row => ({
          ...row, 
          sessions: parseSessionString(String(row.sessions || ''))
        })).sort((a,b) => String(a.title || '').localeCompare(String(b.title || ''))));

        const updatesRes = await fetch(`${LINKS.updatesFeed}&t=${timestamp}`, { cache: "no-store" });
        const updatesCsv = await updatesRes.text();
        const rawUpdates = parseCSV(updatesCsv);
        const mappedUpdates = rawUpdates.map(u => ({
          title: u.title || u.updatetitle || u.heading || '',
          body: u.body || u.message || u.updatemessage || '',
          author: u.author || u.postedby || u.name || 'Team',
          image: u.image || u.imageurl || u.photo || u.uploadimage || u.photoupload || '',
          timestamp: u.timestamp || 'Recent'
        }));
        setUpdates(mappedUpdates.reverse());
      } catch (err) { 
        console.error("Feed load error", err); 
      }
      setIsDataLoaded(true); // Signal initial data is ready
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (auth.currentUser) {
      const sessionDoc = doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'session', 'current');
      await deleteDoc(sessionDoc).catch(() => {});
    }
    setConferenceUser(null);
  };

  const workshopLookupMap = useMemo(() => {
    const map = new Map();
    workshops.forEach(w => {
      if (w.id) map.set(String(w.id).toLowerCase().trim(), w);
      if (w.title) map.set(normalizeString(String(w.title)), w);
    });
    return map;
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const baseList = workshops.filter(w => w.id !== 'lunch-special' && normalizeString(String(w.title)) !== normalizeString('Lunch (Meal Time)'));
    return term ? baseList.filter(w => String(w.title).toLowerCase().includes(term) || String(w.speaker).toLowerCase().includes(term)) : baseList;
  }, [searchTerm, workshops]);

  // App is ready only when data is loaded AND we've finished checking for a session
  const isSyncing = !isDataLoaded || !isSessionRestored;

  if (isSyncing) return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col items-center justify-center p-10 text-center">
      <Loader2 className="animate-spin text-[#ED4E23] mb-4" size={48} />
      <h2 className="text-xl font-extrabold text-gray-900 font-serif">Loading Your WISH Experience...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col font-sans text-gray-900 selection:bg-[#E8BA21]/30 text-left">
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
          <img src={selectedImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Full size update" />
        </div>
      )}

      <header className="w-full bg-[#FCF5EB] border-b border-[#E8BA21]/20 sticky top-0 z-40 h-20 shrink-0">
        <div className="max-w-2xl mx-auto p-5 flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#ED4E23] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm">W</div>
            <span className="font-serif font-black text-2xl tracking-tighter">WISH<span className="text-[#4563AD]">26</span></span>
          </div>
          {conferenceUser && (
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 font-bold text-sm text-[#4563AD] uppercase shadow-sm">
              {conferenceUser.name.charAt(0)}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 pb-32">
        {selectedWorkshopId ? (
          <WorkshopDetailView 
            workshop={workshopLookupMap.get(String(selectedWorkshopId).toLowerCase()) || Array.from(workshopLookupMap.values()).find(w => normalizeString(w.title) === normalizeString(selectedWorkshopId))} 
            onBack={() => setSelectedWorkshopId(null)} 
          />
        ) : (
          <>
            {activeTab === 'updates' && (
              <div className="space-y-8 animate-in fade-in">
                <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Updates</h2></div>
                <div className="space-y-4">
                  {updates.length === 0 && <div className="text-center py-20 text-gray-400 italic">No updates yet. Check back during the conference!</div>}
                  {updates.map((post, idx) => (
                    <div key={idx} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden text-left animate-in slide-in-from-bottom-4 flex items-start gap-4 p-5">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-extrabold mb-1 text-gray-900 leading-tight">{String(post.title || '')}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium mb-3">{String(post.body || '')}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Clock size={12}/> {formatTimestamp(post.timestamp)} • {String(post.author || 'Team')}
                        </div>
                      </div>
                      {post.image && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in relative group" onClick={() => setSelectedImage(getDirectDriveLink(String(post.image)))}>
                          <img src={getDirectDriveLink(String(post.image))} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Thumbnail" onError={(e) => e.target.style.display = 'none'} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors"><Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" /></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-8 animate-in fade-in">
                <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif text-left">Schedule</h2>
                <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
                <div className="space-y-6">
                  {MASTER_SCHEDULE.find(d => d.date === selectedDay)?.events.map(ev => (
                    <div key={ev.id} className="flex gap-4 text-left">
                      <div className="w-16 text-right font-bold text-gray-400 text-sm py-4">{ev.time}</div>
                      <div className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        {(ev.type === 'main' && !ev.title.toLowerCase().includes('lunch')) && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4563AD]" />}
                        {(ev.type === 'workshop_slot' || ev.title.toLowerCase().includes('lunch')) && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8BA21]" />}
                        <h4 className="font-bold text-lg text-gray-900">{String(ev.title || '')}</h4>
                        <div className="text-xs text-gray-400 mt-1 uppercase font-bold flex items-center gap-1"><MapPin size={12}/> {String(ev.location || 'Multiple Rooms')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'workshops' && (
              <div className="space-y-8 text-left animate-in fade-in">
                <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Workshops</h2>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <input type="text" placeholder="Search topics or speakers..." className="w-full pl-12 p-5 rounded-[2rem] border border-gray-100 bg-white outline-none focus:ring-4 focus:ring-[#4563AD]/5 shadow-sm font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="grid gap-4">
                  {filteredWorkshops.map(w => (
                    <div key={w.id} onClick={() => setSelectedWorkshopId(w.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 cursor-pointer transition-all flex flex-col group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-xl text-gray-900 leading-tight">{String(w.title || '')}</h3>
                          <p className="text-[#ED4E23] text-[10px] font-black uppercase tracking-widest mt-0.5">{String(w.speaker || '')}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#ED4E23] transition-colors mt-1" />
                      </div>
                      
                      {w.sessions && w.sessions.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2 border-t border-gray-50 pt-4">
                          {w.sessions.map((session, sIdx) => (
                            <div key={`tile-session-${sIdx}`} className="flex items-center gap-3 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100/50 w-fit">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                <Clock size={10} className="text-gray-400" />
                                {session.day} {session.time}
                              </div>
                              <div className="w-px h-2 bg-gray-200" />
                              <div className="flex items-center gap-1 text-[9px] font-bold text-[#4563AD] uppercase tracking-tighter">
                                <MapPin size={10} className="opacity-50" />
                                {session.room}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'my-wish' && (
              conferenceUser ? (
                <div className="space-y-8 text-left animate-in fade-in">
                  <div className="flex justify-between items-end">
                    <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">My WISH</h2><p className="text-xs text-gray-500 font-bold uppercase">Personal Itinerary</p></div>
                    <button onClick={handleLogout} className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-widest hover:text-red-500 transition-colors">Logout</button>
                  </div>
                  <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
                  <div className="space-y-6">
                    {MASTER_SCHEDULE.find(d => d.date === selectedDay)?.events.map(ev => {
                      const userSelection = String(conferenceUser.workshops[ev.id.toLowerCase()] || '');
                      const workshop = workshopLookupMap.get(userSelection.toLowerCase().trim()) || 
                                       Array.from(workshopLookupMap.values()).find(w => normalizeString(w.title) === normalizeString(userSelection));
                      
                      const isLunch = userSelection.toLowerCase().includes('lunch') || workshop?.id === 'lunch-special';
                      const isMain = ev.type === 'main' || isLunch;
                      const dayAbbr = selectedDay.substring(0, 3);
                      const sessionMatch = workshop?.sessions?.find(s => s.day === dayAbbr && s.time === ev.time);
                      const roomName = sessionMatch ? sessionMatch.room : (ev.location || '');
                      
                      return (
                        <div key={`personal-${ev.id}`} className="flex gap-4">
                          <div className="w-16 text-right font-bold text-gray-400 text-sm py-4">{ev.time}</div>
                          <div 
                            className={`flex-1 p-5 rounded-3xl border transition-all relative overflow-hidden ${isMain ? 'bg-white border-[#4563AD] shadow-md' : workshop ? 'bg-white border-[#E8BA21] shadow-md cursor-pointer hover:border-[#ED4E23]' : 'bg-white/50 border-gray-100 shadow-sm'}`} 
                            onClick={() => (workshop && !isLunch) ? setSelectedWorkshopId(workshop.id) : null}
                          >
                            {(isMain || workshop) && <div className={`absolute top-0 left-0 w-1.5 h-full ${isMain ? 'bg-[#4563AD]' : 'bg-[#E8BA21]'}`} />}
                            <h4 className={`font-bold text-lg ${!workshop && ev.type === 'workshop_slot' ? 'italic text-gray-400' : 'text-gray-900'}`}>{workshop ? String(workshop.title || '') : (ev.type === 'workshop_slot' ? (userSelection || 'No session selected') : String(ev.title || ''))}</h4>
                            {workshop && !isLunch && <p className="text-xs text-[#ED4E23] font-bold mt-1 uppercase tracking-widest">with {String(workshop.speaker || '')}</p>}
                            {roomName && <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400 tracking-wider"><MapPin size={12} className={isMain ? "text-[#4563AD]/40" : "text-[#E8BA21]/40"} />{String(roomName)}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-12 text-left animate-in fade-in">
                  {matchingUsers.length > 0 ? (
                    <div className="pt-4">
                      <button onClick={() => setMatchingUsers([])} className="mb-4 text-sm font-bold text-[#4563AD] flex items-center gap-1 uppercase tracking-widest"><ChevronLeft size={16}/> Back</button>
                      <h2 className="text-3xl font-extrabold text-[#4563AD] mb-2 font-serif">Multiple People Found</h2>
                      <div className="space-y-3 mt-6">
                        {matchingUsers.map((u, i) => (
                          <button key={`user-choice-${i}`} onClick={() => completeUserSetup(u, email.trim().toLowerCase())} className="w-full p-6 bg-white border border-[#E8BA21]/30 rounded-[2rem] flex items-center justify-between hover:border-[#ED4E23] shadow-sm animate-in slide-in-from-right-4" style={{animationDelay: `${i*50}ms`}}><span className="font-extrabold text-gray-800 text-lg">{(String(u['namefirst'] || '') + ' ' + String(u['namelast'] || '')).trim()}</span><ChevronRight size={20} className="text-[#E8BA21]" /></button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="py-8">
                        <div className="inline-flex items-center gap-2 bg-[#4563AD]/10 text-[#4563AD] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"><Sparkles size={14} /> WISH CONFERENCE '26</div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] font-serif mb-6">Welcome to <span className="text-[#ED4E23]">WISH</span></h1>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8">{CONFERENCE_INFO.tagline}</p>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 shadow-sm"><Calendar size={20} className="text-[#E8BA21]" /><span className="text-sm font-bold">{CONFERENCE_INFO.dates}</span></div>
                          <a href={CONFERENCE_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 group shadow-sm"><MapPin size={20} className="text-[#E8BA21]" /><div className="flex flex-col"><span className="text-sm font-bold group-hover:text-[#4563AD]">{CONFERENCE_INFO.locationName}</span><span className="text-[10px] font-medium text-gray-400">{CONFERENCE_INFO.address}</span></div></a>
                        </div>
                      </div>
                      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#4563AD]/5">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-sm text-gray-400 font-medium mb-8">Enter your registered email to access your personal itinerary.</p>
                        <form onSubmit={(e) => { e.preventDefault(); performLoginCheck(email); }} className="space-y-4">
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#E8BA21]/10 focus:border-[#E8BA21] outline-none text-gray-900 font-medium transition-all" required />
                          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl flex items-center gap-2 animate-bounce"><AlertCircle size={16}/> {String(error)}</div>}
                          <button type="submit" disabled={isLoadingUser} className="w-full bg-[#ED4E23] text-white font-extrabold py-5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg hover:bg-[#ED4E23]/90 transition-all active:scale-95">{isLoadingUser ? "Checking..." : "Access Schedule"}</button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              )
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in space-y-10 text-left">
                <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Venues</h2></div>
                <div className="space-y-8">
                  {VENUE_MAP.map((location, idx) => {
                    const Icon = location.icon;
                    return (
                    <div key={`loc-${idx}`} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4" style={{animationDelay: `${idx*100}ms`}}>
                      <div className="p-8 flex items-start gap-5 border-b border-gray-50 bg-gray-50/40">
                        <div className="w-12 h-12 rounded-2xl bg-[#4563AD]/10 flex items-center justify-center text-[#4563AD] shrink-0 shadow-inner"><Icon size={22} /></div>
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900">{String(location.zone || '')}</h3>
                          <a href={location.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-[#E8BA21] font-bold mt-1 hover:text-[#4563AD] transition-all">{String(location.address || '')}<ExternalLink size={12} className="text-gray-300" /></a>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {location.rooms.map((room, rIdx) => (
                          <div key={`room-${rIdx}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 group/room hover:border-[#E8BA21]/20 transition-all">
                            <span className="text-sm font-bold text-gray-700">{String(room.name || '')}</span>
                            <span className="text-[10px] uppercase font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{String(room.note || '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#FCF5EB]/95 backdrop-blur-xl border-t border-[#E8BA21]/20 z-50 h-20">
        <div className="max-w-2xl mx-auto h-20 flex justify-around items-center px-4">
          <NavItem icon={Bell} label="Updates" isActive={activeTab === 'updates'} onClick={() => { setActiveTab('updates'); setSelectedWorkshopId(null); }} />
          <NavItem icon={User} label="MY WISH" isActive={activeTab === 'my-wish'} onClick={() => { setActiveTab('my-wish'); setSelectedWorkshopId(null); }} />
          <NavItem icon={CalendarDays} label="Schedule" isActive={activeTab === 'schedule'} onClick={() => { setActiveTab('schedule'); setSelectedWorkshopId(null); }} />
          <NavItem icon={BookOpen} label="Workshops" isActive={activeTab === 'workshops'} onClick={() => { setActiveTab('workshops'); setSelectedWorkshopId(null); }} />
          <NavItem icon={MapIcon} label="Venues" isActive={activeTab === 'map'} onClick={() => { setActiveTab('map'); setSelectedWorkshopId(null); }} />
        </div>
      </nav>
    </div>
  );
}
