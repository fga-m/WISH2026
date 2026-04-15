import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  CalendarDays, Map as MapIcon, BookOpen, Clock, MapPin, 
  Search, User, ChevronLeft, AlertCircle, ChevronRight, 
  Sparkles, Calendar, Building2, DoorOpen, 
  Map as MapPinIcon, ExternalLink, Loader2, Bell, X, CheckCircle2,
  Maximize2, Eye, Ticket, Map as MapPinSquare, Plus, Minus, RefreshCcw,
  Users, LogOut
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// --- CONFIGURATION ---
const NOTIFICATION_VERSION = 'v2'; 

const LINKS = {
  itineraries: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrkmNrEGx_JOuGw--AI5ywWAVwwzjEtv6K-molR-cB21R0J8poWUdnsvUlSLwI3MBzi5-jrGeOUh5/pub?output=csv",
  workshopCatalog: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnhme1HIsh7TxAro8Md1Xwp3fFdxizrFCNBbSLYYlRlWQGf2ndODy3XYte8XDwjyGOWVaBL_tKk4A2/pub?output=csv",
  updatesFeed: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRf69vgjPStu-Y718QfFL7JiD404Y3s9raQ4cFegH4ocqotbE1XE77IXffBQ6iMffx4uUW77g5du9ma/pub?output=csv",
  logo: "https://drive.google.com/uc?export=download&id=1ZGhLmeIFbAwIK6G84_eV-IzYr9MLMpOP",
  brushfireFallback: "https://brushfire.com/fga/wish-conference/cdc858de-c50e-490f-a764-212bc3848421",
  siteMapImage: "https://drive.google.com/uc?export=download&id=106Nx1Nk0hDboCOn9q645yDWrLMSy7GDu" 
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
  tagline: "We are so excited to see how God moves this weekend! To help you prepare, you can check your workshop sign-ups here using your attendee email. Please keep in mind that any changes made after Thursday will not be reflected in this data.",
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
  { 
    zone: "FGA Melbourne", 
    address: "38 Lexton Road, Box Hill North", 
    mapUrl: CONFERENCE_INFO.googleMapsUrl, 
    icon: Building2, 
    rooms: [{name: "Lobby", note: "Level 2"}, {name: "Sanctuary", note: "Level 2"}, {name: "Meeting Room", note: "Level 1"}, {name: "Rooftop", note: "Top Level"}],
    levelMaps: [
      { label: "Level 1 Map", url: "https://drive.google.com/uc?export=download&id=1rSBzW6OMiqVjOIZDUTabBisbfhT3SJTx" },
      { label: "Level 2 Map", url: "https://drive.google.com/uc?export=download&id=1cu45p7x6s7TrJq1KMkubHcYFYx-0dqms" }
    ]
  },
  { zone: "4/41 Lexton Road", address: "4/41 Lexton Road, Box Hill North", mapUrl: "https://maps.app.goo.gl/xbrbPsctC5nw8GRk9", icon: Building2, rooms: [{name: "Main Space", note: "Upstairs"}] },
  { zone: "7/41 Lexton Road", address: "7/41 Lexton Road, Box Hill North", mapUrl: "https://maps.app.goo.gl/wdFztK1KFQr62LsZ6", icon: DoorOpen, rooms: [{name: "Dance Studio 1", note: "Ground"}, {name: "Dance Studio 2", note: "Level 1"}] },
  { zone: "61 Lexton Road", address: "61 Lexton Road, Box Hill North", mapUrl: "https://maps.app.goo.gl/fsJV5yCWrXM2XKzS7", icon: MapPinIcon, rooms: [{name: "Main Area", note: "Ground"}, {name: "Classroom", note: "Level 1"}] }
];

// Helper Functions
function normalizeString(str) {
  if (!str) return '';
  return str.toString().toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
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
  if (!urlStr.includes('drive.google.com')) return urlStr;
  const idMatch = urlStr.match(/\/d\/([a-zA-Z0-9_-]+)/) || urlStr.match(/id=([a-zA-Z0-9_-]+)/);
  return idMatch ? `https://lh3.googleusercontent.com/d/${idMatch[1]}` : urlStr;
}

function formatTimestamp(ts) {
  if (!ts || ts === 'Recent') return 'Recent';
  try {
    const date = new Date(ts);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ', ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return ts;
  } catch (e) { return ts; }
}

function NavItem({ icon: Icon, label, isActive, onClick, badge = 0 }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-[#4563AD]' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`p-1.5 rounded-xl transition-all relative ${isActive ? 'bg-[#4563AD]/10' : ''}`}>
        <Icon size={22} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-[#FCF5EB] animate-pulse">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
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

  const getMapsUrlForRoom = (roomName) => {
    if (!roomName) return CONFERENCE_INFO.googleMapsUrl;
    const cleanInput = String(roomName).toLowerCase().trim();
    let venue = VENUE_MAP.find(v => v.rooms.some(r => r.name.toLowerCase().trim() === cleanInput));
    if (!venue) venue = VENUE_MAP.find(v => v.zone.toLowerCase().trim() === cleanInput);
    if (!venue) venue = VENUE_MAP.find(v => cleanInput.includes(v.zone.toLowerCase().trim()));
    return venue ? venue.mapUrl : CONFERENCE_INFO.googleMapsUrl;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF5EB] animate-in slide-in-from-right-8 duration-300 pb-24 text-left text-gray-900">
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="py-4 border-b border-[#E8BA21]/20 flex items-center gap-2 sticky top-0 bg-[#FCF5EB]/90 backdrop-blur-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-[#4563AD] hover:bg-[#4563AD]/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <span className="font-extrabold text-[#4563AD] text-sm uppercase tracking-wider">Workshop Details</span>
        </div>
        <div className="py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2 font-serif">{workshop.title}</h1>
          <p className="text-lg md:text-xl font-bold text-[#ED4E23] mb-8">by {workshop.speaker}</p>
          
          {workshop.sessions && workshop.sessions.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-8 text-left">
              <h3 className="text-[#4563AD] font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2"><Calendar size={14} /> Schedule & Location</h3>
              <div className="space-y-4">
                {workshop.sessions.map((session, sIdx) => (
                  <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 last:pb-0 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FCF5EB] flex items-center justify-center text-[#ED4E23] shrink-0"><Clock size={18} /></div>
                      <div>
                        <p className="text-sm font-extrabold uppercase">{session.day} Session</p>
                        <p className="text-xs font-bold text-gray-400">{session.time}</p>
                      </div>
                    </div>
                    <a href={getMapsUrlForRoom(session.room)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-50 hover:bg-[#4563AD]/5 text-[#4563AD] px-4 py-2.5 rounded-xl border border-gray-100 transition-all group shrink-0">
                      <MapPin size={14} className="text-[#E8BA21] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">{session.room}</span>
                      <ExternalLink size={10} className="opacity-30" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-sm md:prose-base text-gray-600 font-medium leading-relaxed bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm mb-8 text-left">
            <h3 className="text-gray-900 font-bold mb-3 text-lg font-serif">About this session</h3>
            {workshop.description ? <ExpandableText text={workshop.description} maxLength={3000} /> : <p className="italic text-gray-400">Description coming soon...</p>}
          </div>

          {workshop.biography && workshop.biography !== "N/A" && (
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#4563AD]/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8BA21]/10 rounded-bl-full -z-0"></div>
              <h3 className="text-[#4563AD] font-bold mb-4 text-lg font-serif relative z-10 text-left">About the Speaker</h3>
              <div className="flex items-start gap-4 relative z-10 text-left">
                <div className="w-20 h-20 rounded-2xl bg-[#FCF5EB] border-2 border-[#ED4E23] flex items-center justify-center overflow-hidden shadow-sm shrink-0 font-bold text-[#ED4E23] text-2xl uppercase">
                   {workshop.photo ? <img src={getDirectDriveLink(workshop.photo)} alt={workshop.speaker} className="w-full h-full object-cover" loading="lazy" /> : workshop.speaker?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-base leading-tight">{String(workshop.speaker || '')}</h4>
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
  const [conferenceUser, setConferenceUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('my-wish'); 
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  
  // Interactive Image State
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(null);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [lastSeenUpdates, setLastSeenUpdates] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [error, setError] = useState('');
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [workshops, setWorkshops] = useState([]);
  const [updates, setUpdates] = useState([]);

  const getDistance = (touches) => Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);

  useEffect(() => { if (!selectedImage) { setZoom(1); setOffset({ x: 0, y: 0 }); } }, [selectedImage]);

  const openBrushfire = () => {
    if (window.brushfire) {
      window.brushfire("open", {widgetId: "cdc858de-c50e-490f-a764-212bc3848421"});
    } else if (!document.querySelector('script[src*="brushfire.min.js"]')) {
      const script = document.createElement('script');
      script.src = "https://widgetclient.brushfire.com/brushfire.min.js";
      script.async = true;
      script.onload = () => window.brushfire?.("open", {widgetId: "cdc858de-c50e-490f-a764-212bc3848421"});
      document.head.appendChild(script);
    } else {
      window.open(LINKS.brushfireFallback, '_blank');
    }
  };

  const processUser = useCallback(async (u, emailStr, allPeers = []) => {
    const fKey = Object.keys(u).find(k => k.includes('first'));
    const lKey = Object.keys(u).find(k => k.includes('last'));
    const userName = `${String(u[fKey] || '')} ${String(u[lKey] || '')}`.trim() || emailStr.split('@')[0];
    
    setConferenceUser({ 
      name: userName, 
      email: emailStr, 
      workshops: u 
    });
    
    // Store matching users for the switcher menu
    if (allPeers.length > 0) {
      setMatchingUsers(allPeers);
    }
    
    setIsUserMenuOpen(false);
    setActiveTab('my-wish');
    
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'session', 'current'), { 
          email: emailStr, 
          selectedUser: userName,
          updatedAt: new Date().toISOString(), 
          notifVersion: NOTIFICATION_VERSION 
        }, { merge: true });
      }
    } catch (err) { console.error(err); }
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;
    setIsLoadingUser(true);
    setError('');
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${LINKS.itineraries}&t=${timestamp}`, { cache: "no-store" });
      const csv = await res.text();
      const rawData = parseCSV(csv);
      const emailStr = email.trim().toLowerCase();
      const users = rawData.filter(row => Object.values(row).some(val => String(val).toLowerCase().trim() === emailStr));
      
      if (users.length === 1) {
        await processUser(users[0], emailStr, users);
      } else if (users.length > 1) {
        setMatchingUsers(users);
      } else {
        setError(`"${emailStr}" not found in registration list.`);
      }
    } catch (e) { setError("Error connecting to registry."); }
    finally { setIsLoadingUser(false); }
  };

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (err) { setIsSessionRestored(true); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'session', 'current'));
          if (snap.exists()) {
            const data = snap.data();
            if (data.notifVersion === NOTIFICATION_VERSION && data.lastSeenUpdates) {
              setLastSeenUpdates(data.lastSeenUpdates);
            }
            if (data.email) {
               setEmail(data.email);
               const res = await fetch(`${LINKS.itineraries}`, { cache: "no-store" });
               const rawData = parseCSV(await res.text());
               const users = rawData.filter(row => Object.values(row).some(v => String(v).toLowerCase().trim() === data.email));
               
               if (users.length > 0) {
                 // Try to find the specific last-selected user, otherwise default to first
                 let selected = users[0];
                 if (data.selectedUser) {
                    const match = users.find(u => {
                      const fKey = Object.keys(u).find(k => k.includes('first'));
                      const lKey = Object.keys(u).find(k => k.includes('last'));
                      return `${String(u[fKey] || '')} ${String(u[lKey] || '')}`.trim() === data.selectedUser;
                    });
                    if (match) selected = match;
                 }
                 processUser(selected, data.email, users);
               }
            }
          }
        } catch (err) { console.error(err); }
      }
      setIsSessionRestored(true);
    });
    return () => unsubscribe();
  }, [processUser]);

  useEffect(() => {
    const fetchData = async (bustCache = false) => {
      try {
        const suffix = bustCache ? `&t=${new Date().getTime()}` : '';
        const catalogRes = await fetch(`${LINKS.workshopCatalog}${suffix}`);
        const catalogData = parseCSV(await catalogRes.text());
        setWorkshops(catalogData.map(row => ({ ...row, sessions: parseSessionString(String(row.sessions || '')) })).sort((a,b) => String(a.title || '').localeCompare(String(b.title || ''))));

        const updatesRes = await fetch(`${LINKS.updatesFeed}${suffix}`);
        const rawUpdates = parseCSV(await updatesRes.text());
        const mappedUpdates = rawUpdates.map(u => {
          const rawTs = u.timestamp || '';
          return {
            title: u.title || u.updatetitle || u.heading || '',
            body: u.body || u.message || u.updatemessage || '',
            author: u.author || u.postedby || u.name || 'Team',
            image: u.image || u.imageurl || u.photo || u.uploadimage || u.photoupload || '',
            timestamp: rawTs,
            ms: !isNaN(new Date(rawTs).getTime()) ? new Date(rawTs).getTime() : 1
          };
        });
        setUpdates(mappedUpdates.reverse());
      } catch (err) { console.error("Feed load error", err); }
      setIsDataLoaded(true);
    };
    fetchData(false);
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'updates' && auth.currentUser && updates.length > 0) {
      const latestTs = Math.max(...updates.map(u => u.ms));
      if (latestTs > lastSeenUpdates) {
        setLastSeenUpdates(latestTs);
        setDoc(doc(db, 'artifacts', appId, 'users', auth.currentUser.uid, 'session', 'current'), { lastSeenUpdates: latestTs, notifVersion: NOTIFICATION_VERSION }, { merge: true }).catch(() => {});
      }
    }
  }, [activeTab, updates, lastSeenUpdates]);

  const unreadCount = useMemo(() => updates.filter(u => u.ms > lastSeenUpdates).length, [updates, lastSeenUpdates]);

  const handleSlotClick = (ev) => {
    if (ev.type !== 'workshop_slot') return;
    const dayAbbr = selectedDay.substring(0, 3);
    const matches = workshops.filter(w => w.sessions?.some(s => s.day === dayAbbr && s.time === ev.time));
    setSelectedSlot({ title: ev.title, dayAbbr, time: ev.time, matches });
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

  const handleStart = (clientX, clientY, touches) => {
    if (touches && touches.length === 2) setInitialDistance(getDistance(touches));
    else { setIsDragging(true); setDragStart({ x: clientX - offset.x, y: clientY - offset.y }); }
  };

  const handleMove = (clientX, clientY, touches) => {
    if (touches && touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(touches);
      const ratio = currentDistance / initialDistance;
      const newZoom = Math.min(Math.max(1, zoom * ratio), 5);
      setZoom(newZoom);
      setInitialDistance(currentDistance);
    } else if (isDragging) {
      setOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    }
  };

  const handleLogout = async () => {
    setConferenceUser(null);
    setMatchingUsers([]);
    setIsUserMenuOpen(false);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'session', 'current'), { email: null, selectedUser: null }, { merge: true });
      }
    } catch (e) {}
  };

  if (!isSessionRestored) return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col items-center justify-center p-10 text-center text-gray-900">
      <Loader2 className="animate-spin text-[#ED4E23] mb-4" size={48} />
      <h2 className="text-xl font-extrabold font-serif">Loading WISH Experience...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col font-sans text-gray-900 selection:bg-[#E8BA21]/30 text-left overflow-hidden">
      
      {/* Profile Switcher Menu */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FCF5EB]/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-8 duration-300">
          <div className="w-full max-w-2xl mx-auto flex flex-col h-full px-6">
            <div className="py-6 flex items-center justify-between border-b border-[#E8BA21]/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#ED4E23] uppercase tracking-widest">Logged in as {conferenceUser?.email}</span>
                <h2 className="text-2xl font-extrabold font-serif">Profiles</h2>
              </div>
              <button onClick={() => setIsUserMenuOpen(false)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-8 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Switch User</p>
              {matchingUsers.map((u, i) => {
                const fKey = Object.keys(u).find(k => k.includes('first'));
                const lKey = Object.keys(u).find(k => k.includes('last'));
                const name = `${String(u[fKey] || '')} ${String(u[lKey] || '')}`.trim();
                const isActive = conferenceUser?.name === name;
                
                return (
                  <button 
                    key={i} 
                    onClick={() => processUser(u, conferenceUser.email, matchingUsers)} 
                    className={`w-full p-6 rounded-[2rem] flex items-center justify-between transition-all border ${isActive ? 'bg-[#4563AD] border-[#4563AD] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-800 shadow-sm hover:border-[#E8BA21]/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${isActive ? 'bg-white/20' : 'bg-[#FCF5EB] text-[#4563AD]'}`}>{name.charAt(0)}</div>
                      <span className="font-extrabold text-lg">{name}</span>
                    </div>
                    {isActive ? <CheckCircle2 size={24} /> : <ChevronRight size={20} className="text-gray-300" />}
                  </button>
                );
              })}
            </div>
            <div className="py-8 border-t border-[#E8BA21]/20">
              <button onClick={handleLogout} className="w-full p-6 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center gap-3 font-extrabold text-lg hover:bg-red-100 transition-colors">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Zoomable Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200 overflow-hidden touch-none" onWheel={(e) => setZoom(Math.min(Math.max(1, zoom + e.deltaY * -0.005), 5))}>
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-4 pointer-events-auto">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="text-white/80 hover:text-white p-1 transition-colors"><Minus size={20}/></button>
              <span className="text-white font-black text-xs min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(5, zoom + 0.5))} className="text-white/80 hover:text-white p-1 transition-colors"><Plus size={20}/></button>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button onClick={() => { setZoom(1); setOffset({x:0,y:0}); }} className="text-white/80 hover:text-white p-1 transition-colors"><RefreshCcw size={16}/></button>
            </div>
            <button onClick={() => setSelectedImage(null)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-colors pointer-events-auto"><X size={28} /></button>
          </div>
          <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" onMouseDown={(e) => handleStart(e.clientX, e.clientY)} onMouseMove={(e) => handleMove(e.clientX, e.clientY)} onMouseUp={() => { setIsDragging(false); setInitialDistance(null); }} onMouseLeave={() => { setIsDragging(false); setInitialDistance(null); }} onTouchStart={(e) => e.touches.length === 2 ? handleStart(null, null, e.touches) : handleStart(e.touches[0].clientX, e.touches[0].clientY)} onTouchMove={(e) => e.touches.length === 2 ? handleMove(null, null, e.touches) : handleMove(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={() => { setIsDragging(false); setInitialDistance(null); }}>
            <div style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transition: isDragging || initialDistance ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }} className="max-w-full max-h-full">
              <img src={getDirectDriveLink(selectedImage)} className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" alt="View" draggable={false} onDoubleClick={() => zoom > 1 ? (setZoom(1), setOffset({x:0,y:0})) : setZoom(2.5)} />
            </div>
          </div>
          <div className="absolute bottom-10 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest pointer-events-none">{zoom > 1 ? "Drag to move • Double-tap to reset" : "Pinch or scroll to zoom"}</div>
        </div>
      )}

      {selectedSlot && (
        <div className="fixed inset-0 z-[100] bg-[#FCF5EB]/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-8 duration-300">
          <div className="w-full max-w-2xl mx-auto flex flex-col h-full px-6 text-left">
            <div className="py-6 flex items-center justify-between border-b border-[#E8BA21]/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#ED4E23] uppercase tracking-widest">{selectedSlot.dayAbbr} • {selectedSlot.time}</span>
                <h2 className="text-2xl font-extrabold font-serif">{selectedSlot.title}</h2>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-8 space-y-4 pb-12">
              {selectedSlot.matches.length === 0 && <div className="text-center py-20 text-gray-400 italic">No workshops found for this time slot.</div>}
              {selectedSlot.matches.map(w => (
                <div key={`slot-item-${w.id}`} onClick={() => { setSelectedWorkshopId(w.id); setSelectedSlot(null); }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 cursor-pointer transition-all flex items-center justify-between group">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-extrabold text-lg leading-tight group-hover:text-[#4563AD] transition-colors">{w.title}</h3>
                    <p className="text-[#ED4E23] text-[10px] font-black uppercase tracking-widest mt-1">{w.speaker}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase text-gray-400"><MapPin size={10} className="text-[#E8BA21]/50" />{w.sessions?.find(s => s.day === selectedSlot.dayAbbr && s.time === selectedSlot.time)?.room || 'TBA'}</div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-[#ED4E23] transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="w-full bg-[#FCF5EB] border-b border-[#E8BA21]/20 sticky top-0 z-40 h-20 shrink-0">
        <div className="max-w-2xl mx-auto p-5 flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            {LINKS.logo ? <img src={getDirectDriveLink(LINKS.logo)} alt="Logo" className={`h-12 w-auto object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0 absolute'}`} onLoad={() => setLogoLoaded(true)} onError={() => setLogoLoaded(false)} /> : null}
            {!logoLoaded && <div className="w-10 h-10 bg-[#ED4E23] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm">W</div>}
          </div>
          {conferenceUser && (
            <button 
              onClick={() => setIsUserMenuOpen(true)}
              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-gray-100 font-black text-sm text-[#4563AD] uppercase shadow-sm active:scale-95 transition-all relative group"
            >
              {conferenceUser.name.charAt(0)}
              {matchingUsers.length > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-[#4563AD] text-white p-0.5 rounded-md border-2 border-[#FCF5EB]">
                  <Users size={10} />
                </div>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 pb-32 overflow-y-auto">
        {selectedWorkshopId ? (
          <WorkshopDetailView workshop={workshopLookupMap.get(String(selectedWorkshopId).toLowerCase()) || Array.from(workshopLookupMap.values()).find(w => normalizeString(w.title) === normalizeString(selectedWorkshopId))} onBack={() => setSelectedWorkshopId(null)} />
        ) : (
          <>
            {activeTab === 'updates' && (
              <div className="space-y-8 animate-in fade-in text-left text-gray-900">
                <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Updates</h2></div>
                <div className="space-y-4">
                  {updates.length === 0 && <div className="text-center py-20 text-gray-400 italic">No updates yet. Check back during the conference!</div>}
                  {updates.map((post, idx) => (
                    <div key={idx} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex items-start gap-4 p-5 animate-in slide-in-from-bottom-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-extrabold mb-1 leading-tight">{post.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium mb-3">{post.body}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Clock size={12}/> {formatTimestamp(post.timestamp)} • {post.author}</div>
                      </div>
                      {post.image && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer relative group" onClick={() => setSelectedImage(post.image)}>
                          <img src={getDirectDriveLink(post.image)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Post" loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors"><Maximize2 size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" /></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-8 animate-in fade-in text-gray-900">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif text-left">Schedule</h2>
                  <div onClick={() => setSelectedImage("https://drive.google.com/uc?export=download&id=1H6xyTv1jyIGzUF8uaV1Yqq04hFT7uRP4")} className="w-1/2 bg-white rounded-2xl border border-[#4563AD]/20 shadow-sm overflow-hidden cursor-pointer group relative active:scale-[0.98] transition-all shrink-0">
                    <div className="aspect-[16/5] w-full bg-gray-100 overflow-hidden relative">
                      <img src={getDirectDriveLink("https://drive.google.com/uc?export=download&id=1H6xyTv1jyIGzUF8uaV1Yqq04hFT7uRP4")} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="KIDS Schedule" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                          <CalendarDays className="text-[#4563AD]" size={12} />
                          <span className="font-extrabold text-[#4563AD] text-[9px] uppercase tracking-widest">KIDS Schedule</span>
                          <Maximize2 size={10} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
                <div className="space-y-6">
                  {MASTER_SCHEDULE.find(d => d.date === selectedDay)?.events.map(ev => (
                    <div key={ev.id} className="flex gap-4 text-left">
                      <div className="w-16 text-right font-bold text-gray-400 text-sm py-4">{ev.time}</div>
                      <div onClick={() => handleSlotClick(ev)} className={`flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all ${ev.type === 'workshop_slot' ? 'cursor-pointer hover:border-[#E8BA21]/40 hover:shadow-md' : ''}`}>
                        {(ev.type === 'main' && !ev.title.toLowerCase().includes('lunch')) && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4563AD]" />}
                        {(ev.type === 'workshop_slot' || ev.title.toLowerCase().includes('lunch')) && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8BA21]" />}
                        <div className="flex items-center justify-between gap-4"><h4 className="font-bold text-lg">{ev.title}</h4>{ev.type === 'workshop_slot' && <ChevronRight size={16} className="text-[#E8BA21] opacity-50" />}</div>
                        <div className="text-xs text-gray-400 mt-1 uppercase font-bold flex items-center gap-1"><MapPin size={12}/>{ev.type === 'workshop_slot' ? 'Select a Workshop' : (ev.location || 'Multiple Rooms')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'workshops' && (
              <div className="space-y-8 text-left animate-in fade-in text-gray-900">
                <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Workshops</h2>
                {!isDataLoaded ? (
                  <div className="grid gap-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 animate-pulse"><div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-3" /><div className="h-3 bg-gray-100 rounded w-1/3" /></div>)}</div>
                ) : (<>
                <div className="relative group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Search topics..." className="w-full pl-12 p-5 rounded-[2rem] border border-gray-100 bg-white outline-none focus:ring-4 focus:ring-[#4563AD]/5 shadow-sm font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="grid gap-4">
                  {filteredWorkshops.map(w => (
                    <div key={w.id} onClick={() => setSelectedWorkshopId(w.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 cursor-pointer transition-all flex flex-col group">
                      <div className="flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><h3 className="font-extrabold text-xl leading-tight">{w.title}</h3><p className="text-[#ED4E23] text-[10px] font-black uppercase tracking-widest mt-0.5">{w.speaker}</p></div><ChevronRight size={18} className="text-gray-300 group-hover:text-[#ED4E23] transition-colors mt-1" /></div>
                      {w.sessions && w.sessions.length > 0 && <div className="mt-4 flex flex-col gap-2 border-t border-gray-50 pt-4">{w.sessions.map((session, sIdx) => (<div key={sIdx} className="flex items-center gap-3 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100/50 w-fit"><div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-tighter"><Clock size={10} className="text-gray-400" />{session.day} {session.time}</div><div className="w-px h-2 bg-gray-200" /><div className="flex items-center gap-1 text-[9px] font-bold text-[#4563AD] uppercase tracking-tighter"><MapPin size={10} className="opacity-50" />{session.room}</div></div>))}</div>}
                    </div>
                  ))}
                </div>
                </>)}
              </div>
            )}

            {activeTab === 'my-wish' && (
              conferenceUser ? (
                <div className="space-y-8 text-left animate-in fade-in text-gray-900">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">My WISH</h2>
                      <p className="text-xs text-gray-500 font-bold uppercase">Personal Itinerary</p>
                    </div>
                    {matchingUsers.length > 1 && (
                      <button onClick={() => setIsUserMenuOpen(true)} className="text-[10px] font-bold text-[#4563AD] bg-[#4563AD]/5 px-3 py-1.5 rounded-lg border border-[#4563AD]/20 uppercase tracking-widest hover:bg-[#4563AD]/10 transition-colors flex items-center gap-2">
                        <Users size={12} /> Switch Profile
                      </button>
                    )}
                  </div>
                  <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
                  <div className="space-y-6">
                    {MASTER_SCHEDULE.find(d => d.date === selectedDay)?.events.map(ev => {
                      const userSelection = String(conferenceUser.workshops[ev.id.toLowerCase()] || '');
                      const workshop = workshopLookupMap.get(userSelection.toLowerCase().trim()) || Array.from(workshopLookupMap.values()).find(w => normalizeString(w.title) === normalizeString(userSelection));
                      const isLunch = userSelection.toLowerCase().includes('lunch') || workshop?.id === 'lunch-special';
                      const isMain = ev.type === 'main' || isLunch;
                      const dayAbbr = selectedDay.substring(0, 3);
                      const sessionMatch = workshop?.sessions?.find(s => s.day === dayAbbr && s.time === ev.time);
                      const roomName = sessionMatch ? sessionMatch.room : (ev.location || '');
                      return (
                        <div key={`personal-${ev.id}`} className="flex gap-4">
                          <div className="w-16 text-right font-bold text-gray-400 text-sm py-4">{ev.time}</div>
                          <div className={`flex-1 p-5 rounded-3xl border transition-all relative overflow-hidden ${isMain ? 'bg-white border-[#4563AD] shadow-md' : workshop ? 'bg-white border-[#E8BA21] shadow-md cursor-pointer hover:border-[#ED4E23]' : 'bg-white/50 border-gray-100 shadow-sm'}`} onClick={() => (workshop && !isLunch) ? setSelectedWorkshopId(workshop.id) : null}>
                            {(isMain || workshop) && <div className={`absolute top-0 left-0 w-1.5 h-full ${isMain ? 'bg-[#4563AD]' : 'bg-[#E8BA21]'}`} />}
                            <h4 className={`font-bold text-lg ${!workshop && ev.type === 'workshop_slot' ? 'italic text-gray-400' : 'text-gray-900'}`}>{workshop ? workshop.title : (ev.type === 'workshop_slot' ? (userSelection || 'No session selected') : ev.title)}</h4>
                            {workshop && !isLunch && <p className="text-xs text-[#ED4E23] font-bold mt-1 uppercase tracking-widest">with {workshop.speaker}</p>}
                            {roomName && <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400 tracking-wider"><MapPin size={12} className={isMain ? "text-[#4563AD]/40" : "text-[#E8BA21]/40"} />{String(roomName)}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-8 text-left animate-in fade-in text-gray-900">
                  {matchingUsers.length > 0 ? (
                    <div className="pt-4">
                      <button onClick={() => setMatchingUsers([])} className="mb-4 text-sm font-bold text-[#4563AD] flex items-center gap-1 uppercase tracking-widest"><ChevronLeft size={16}/> Back</button>
                      <h2 className="text-3xl font-extrabold text-[#4563AD] mb-2 font-serif">Multiple People Found</h2>
                      <div className="space-y-3 mt-6">
                        {matchingUsers.map((u, i) => (
                          <button key={i} onClick={() => processUser(u, email.trim().toLowerCase(), matchingUsers)} className="w-full p-6 bg-white border border-[#E8BA21]/30 rounded-[2rem] flex items-center justify-between shadow-sm hover:border-[#ED4E23] transition-all"><span className="font-extrabold text-gray-800 text-lg">{(String(u['namefirst'] || '') + ' ' + String(u['namelast'] || ''))}</span><ChevronRight size={20} className="text-[#E8BA21]" /></button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pt-4">
                        <p className="text-lg text-gray-600 font-medium leading-relaxed mb-2">{CONFERENCE_INFO.tagline}</p>
                      </div>

                      <div className="flex justify-center">
                        <img src="/Icon.png" alt="WISH Conference" className="w-1/2 object-contain" />
                      </div>

                      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#4563AD]/5 mb-4 text-left">
                        <h2 className="text-2xl font-extrabold mb-2">Sign In</h2>
                        <p className="text-sm text-gray-400 font-medium mb-8">Enter your registered email to access your personal itinerary.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#E8BA21]/10 focus:border-[#E8BA21] outline-none text-gray-900 font-medium transition-all" required />
                          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl flex items-center gap-2 animate-bounce"><AlertCircle size={16}/> {error}</div>}
                          <button type="submit" disabled={isLoadingUser} className="w-full bg-[#ED4E23] text-white font-extrabold py-5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg hover:bg-[#ED4E23]/90 transition-all active:scale-95">{isLoadingUser ? "Checking..." : "Access Schedule"}</button>
                        </form>
                      </div>

                      <div className="grid grid-cols-1 gap-4 text-left"><div className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 shadow-sm"><Calendar size={20} className="text-[#E8BA21]" /><span className="text-sm font-bold">{CONFERENCE_INFO.dates}</span></div><a href={CONFERENCE_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 group shadow-sm"><MapPin size={20} className="text-[#E8BA21]" /><div className="flex flex-col"><span className="text-sm font-bold group-hover:text-[#4563AD]">{CONFERENCE_INFO.locationName}</span><span className="text-[10px] font-medium text-gray-400">{CONFERENCE_INFO.address}</span></div></a></div>
                    </>
                  )}
                </div>
              )
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in space-y-10 text-left text-gray-900">
                <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Venues</h2></div>

                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setSelectedImage("https://drive.google.com/uc?export=download&id=1eWmIxuEgjfqwVDdz6DGgvJivggBVMwzl")} className="bg-white rounded-2xl border border-[#4563AD]/20 shadow-sm overflow-hidden cursor-pointer group relative active:scale-[0.98] transition-all">
                    <div className="aspect-[16/5] w-full bg-gray-100 overflow-hidden relative">
                      <img src={getDirectDriveLink("https://drive.google.com/uc?export=download&id=1eWmIxuEgjfqwVDdz6DGgvJivggBVMwzl")} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Kids Carpark Map" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                          <MapPinSquare className="text-[#4563AD]" size={12} />
                          <span className="font-extrabold text-[#4563AD] text-[9px] uppercase tracking-widest">Kids Map (Carpark)</span>
                          <Maximize2 size={10} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setSelectedImage("https://drive.google.com/uc?export=download&id=1EmA7f7JUEP5MRfKfCBkQEi1hvD1s-_O0")} className="bg-white rounded-2xl border border-[#4563AD]/20 shadow-sm overflow-hidden cursor-pointer group relative active:scale-[0.98] transition-all">
                    <div className="aspect-[16/5] w-full bg-gray-100 overflow-hidden relative">
                      <img src={getDirectDriveLink("https://drive.google.com/uc?export=download&id=1EmA7f7JUEP5MRfKfCBkQEi1hvD1s-_O0")} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Kids Classroom Map" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                          <MapPinSquare className="text-[#4563AD]" size={12} />
                          <span className="font-extrabold text-[#4563AD] text-[9px] uppercase tracking-widest">Kids Map (Classrooms)</span>
                          <Maximize2 size={10} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setSelectedImage(LINKS.siteMapImage)} className="bg-white rounded-2xl border border-[#4563AD]/20 shadow-sm overflow-hidden cursor-pointer group relative active:scale-[0.98] transition-all">
                    <div className="aspect-[16/5] w-full bg-gray-100 overflow-hidden relative">
                      <img src={getDirectDriveLink(LINKS.siteMapImage)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Overview Map" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                          <MapPinSquare className="text-[#4563AD]" size={12} />
                          <span className="font-extrabold text-[#4563AD] text-[9px] uppercase tracking-widest">Lexton Road Map</span>
                          <Maximize2 size={10} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setSelectedImage("https://drive.google.com/uc?export=download&id=1seCj4hAI7qufxV4LD2wp6B-AH4GU_o5Y")} className="bg-white rounded-2xl border border-[#4563AD]/20 shadow-sm overflow-hidden cursor-pointer group relative active:scale-[0.98] transition-all">
                    <div className="aspect-[16/5] w-full bg-gray-100 overflow-hidden relative">
                      <img src={getDirectDriveLink("https://drive.google.com/uc?export=download&id=1seCj4hAI7qufxV4LD2wp6B-AH4GU_o5Y")} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Lexton Parking Map" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-2 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                          <MapPinSquare className="text-[#4563AD]" size={12} />
                          <span className="font-extrabold text-[#4563AD] text-[9px] uppercase tracking-widest">Lexton Parking Map</span>
                          <Maximize2 size={10} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {VENUE_MAP.map((location, idx) => {
                    const VenueIcon = location.icon;
                    return (
                      <div key={idx} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4" style={{animationDelay: `${idx*100}ms`}}>
                        <div className="p-8 flex items-start gap-5 border-b border-gray-50 bg-gray-50/40">
                          <div className="w-12 h-12 rounded-2xl bg-[#4563AD]/10 flex items-center justify-center text-[#4563AD] shrink-0 shadow-inner"><VenueIcon size={22} /></div>
                          <div className="flex-1">
                            <h3 className="text-xl font-extrabold">{location.zone}</h3>
                            <a href={location.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-[#E8BA21] font-bold mt-1 hover:text-[#4563AD] transition-all">{location.address}<ExternalLink size={12} className="text-gray-300" /></a>
                            
                            {location.levelMaps && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {location.levelMaps.map((lvl, lIdx) => (
                                  <button 
                                    key={lIdx} 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedImage(lvl.url); }}
                                    className="bg-white border border-[#4563AD]/20 hover:border-[#4563AD] text-[#4563AD] text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                  >
                                    <Maximize2 size={12} /> {lvl.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                          {location.rooms.map((room, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 transition-all">
                              <span className="text-sm font-bold text-gray-700">{room.name}</span>
                              <span className="text-[10px] uppercase font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{room.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#FCF5EB]/95 backdrop-blur-xl border-t border-[#E8BA21]/20 z-50 h-20">
        <div className="max-w-2xl mx-auto h-20 flex justify-around items-center px-4">
          <NavItem icon={User} label="MY WISH" isActive={activeTab === 'my-wish'} onClick={() => { setActiveTab('my-wish'); setSelectedWorkshopId(null); setSelectedSlot(null); setIsUserMenuOpen(false); }} />
          <NavItem icon={Bell} label="Updates" badge={unreadCount} isActive={activeTab === 'updates'} onClick={() => { setActiveTab('updates'); setSelectedWorkshopId(null); setSelectedSlot(null); setIsUserMenuOpen(false); }} />
          <NavItem icon={CalendarDays} label="Schedule" isActive={activeTab === 'schedule'} onClick={() => { setActiveTab('schedule'); setSelectedWorkshopId(null); setSelectedSlot(null); setIsUserMenuOpen(false); }} />
          <NavItem icon={BookOpen} label="Workshops" isActive={activeTab === 'workshops'} onClick={() => { setActiveTab('workshops'); setSelectedWorkshopId(null); setSelectedSlot(null); setIsUserMenuOpen(false); }} />
          <NavItem icon={MapIcon} label="Venues" isActive={activeTab === 'map'} onClick={() => { setActiveTab('map'); setSelectedWorkshopId(null); setSelectedSlot(null); setIsUserMenuOpen(false); }} />
        </div>
      </nav>
    </div>
  );
}
