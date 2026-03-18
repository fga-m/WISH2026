import React, { useState, useMemo, useCallback } from 'react';
import { CalendarDays, Map as MapIcon, BookOpen, Clock, MapPin, Search, User, ChevronLeft, AlertCircle, ChevronRight, Sparkles, Calendar, Home, Building2, DoorOpen, Map as MapPinIcon, ExternalLink } from 'lucide-react';

// --- CONFIGURATION ---
const LINKS = {
  // Pulls live from Google Sheets
  itineraries: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdrkmNrEGx_JOuGw--AI5ywWAVwwzjEtv6K-molR-cB21R0J8poWUdnsvUlSLwI3MBzi5-jrGeOUh5/pub?output=csv",
};

// Path for your locally hosted logo in the /public folder
const LOGO_URL = "/logo.png";

const CONFERENCE_INFO = {
  dates: "Friday 17th — Sunday 19th April 2026",
  tagline: "Join us for three days of connection and growth as we explore what it means to be a witness. Together, we will strengthen our bonds with each other and prepare to reach the world around us.",
  address: "38 Lexton Road, Box Hill North, VIC 3129",
  locationName: "FGAM",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=38+Lexton+Road+Box+Hill+North+VIC+3129"
};

const SLOT_HEADER_MAP = {
  's2': ['session 1', 's2', 'sat 9:30', 'saturday 9:30'],
  's3': ['session 2', 's3', 'sat 10:30', 'saturday 10:30'],
  's4': ['session 3', 's4', 'sat 12:00', 'saturday 12:00'],
  's5': ['session 4', 's5', 'sat 1:00', 'saturday 1:00'],
  's6': ['session 5', 's6', 'sat 2:00', 'saturday 2:00'],
  's7': ['session 6', 's7', 'sat 3:00', 'saturday 3:00'],
  'su2': ['session 7', 'su2', 'sun 9:30', 'sunday 9:30'],
  'su3': ['session 8', 'su3', 'sun 10:30', 'sunday 10:30'],
  'su4': ['session 9', 'su4', 'sun 12:00', 'sunday 12:00'],
  'su5': ['session 10', 'su5', 'sun 1:00', 'sunday 1:00'],
  'su6': ['session 11', 'su6', 'sun 2:00', 'sunday 2:00'],
};

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
    rooms: [{ name: "Main Space", note: "Upstairs" }]
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

const WORKSHOPS_DATA = [
  { 
    id: 'w1', title: 'Managing Screen Time', speaker: 'Kevin and Yen Siow', category: 'Parenting',
    biography: 'As parents of three boys, Kevin and Yen are still on the journey of learning how to navigate screens in a way that honours God, strengthens relationships and shapes character.', 
    description: 'In this workshop, they will share a faith-centred, family values approach to digital habits, drawing on the work of Dr Justin Coulson (Happy Families) and their own lived experience.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w2', title: 'Adulting 101', speaker: 'Mike and Maggie (underwriting)', category: 'Youth/ Young Adult',
    biography: 'Mike is a trained engineer and business owner who sees the world in systems. Maggie is a healthcare professional and homemaker who lives in the details.', 
    description: "Honest conversation about the skills that actually matter in your 20s: finances, career, self care, life admin.",
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Meeting Room (FGA Melbourne)' },
      { day: 'Sat', time: '2:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w3', title: 'Entrepreneurship', speaker: 'Aaron Lau/Michael Ting', category: 'Career',
    biography: "Mike and Aaron have started half a dozen businesses between them.", 
    description: "Entrepreneurship isn't just about starting a business. It's a posture, a way of seeing the world and responding to what doesn't exist yet.",
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w4', title: 'Crossing borders, changing jobs', speaker: 'Alan Wong', category: 'Career',
    biography: 'Alan has worked across Asia-Pacific as an investment banker and fund manager.', 
    description: 'From career ambition to dealing with the painful realities of life and disappointment, Alan shares how God can use changes and crisis to shape us.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w5', title: 'Engaging AI', speaker: 'Alan Wong and Lawrence Chen', category: 'Tech',
    biography: 'Lawrence is a data analyst. Alan is a father and ex-entrepreneur with a passion for new tech.', 
    description: 'AI is rapidly reshaping how we access information, solve problems and create.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w6', title: 'Crowded House', speaker: 'Ash and Grace Chan', category: 'Family',
    biography: 'Grace and Ash have been married for seven years and are the parents of Aria and Madison.', 
    description: 'Living with three generations offers incredible support, but it also brings a unique set of challenges.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w7', title: 'Study Hacks', speaker: 'Ashley Ng', category: 'Youth',
    biography: 'Ashley completed 8 VCE subjects and a Bachelor of Commerce. She has tutored for 5 years.', 
    description: 'Strategies for effective studying and time management.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w8', title: 'Women Dating', speaker: 'Belle Seow / Grace Leong?', category: 'Relationships',
    biography: "Belle is 30 and in a committed relationship. Grace is a 26 year old designer.", 
    description: 'Grounding yourself in God’s truth so you don’t lose yourself in the process.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w9', title: 'Demons in Christians?', speaker: 'Charles Ho', category: 'Theology',
    biography: 'Leaders of the Shalom Ministry in FGAM.', 
    description: 'Recognizing demonic oppression and practical steps toward freedom.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w10', title: 'Sex in the Suburbs', speaker: 'Daniel and Julie Wong', category: 'Marriage',
    biography: "Julie and Daniel Wong have been married for 37 years, with 4 children.", 
    description: 'Discussing the joys of marital sex and how to overcome barriers to intimacy.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w11', title: 'Running', speaker: 'David Gunn, Michelle Tsiros and Dennis Wong', category: 'Health',
    biography: 'Passionate runners believing in physical, mental, and spiritual health benefits.', 
    description: 'Reframes running as a powerful signal to the mind that builds capacity and long-term health.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w12', title: 'Gut & Brain', speaker: 'Dr. Dennis Wong', category: 'Health',
    biography: 'Medical doctor with a strong interest in brain health and dementia prevention.', 
    description: 'A practical, science-grounded exploration of how what we eat shapes how we think and age.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w13', title: 'Menopause Questions', speaker: 'Dr. Sze Wey Lee', category: 'Health',
    biography: 'Obstetrician and gynaecologist based in East Melbourne with 20 years of experience.', 
    description: 'Addressing the symptoms of menopause, management options, and Q&A.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w14', title: 'Life Vision Board', speaker: 'Elaine Choi', category: 'Personal Growth',
    biography: 'Trainer and facilitator with a heart for guiding women through seasons of transition.', 
    description: 'Aligning your life with God’s purpose rather than personal pressure.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w15', title: 'Know Your WHY', speaker: 'Elijah Seow', category: 'Purpose',
    biography: 'Following Christ for 12 years with a heart for transparency and faith shown through action.', 
    description: 'Investigate the core motivations behind your life to avoid distraction and burnout.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w16', title: 'Men Dating', speaker: 'Elijah Seow/Daniel Ong', category: 'Relationships',
    biography: 'Elijah is newly married; Dong is currently engaged. Both bring personal insights.', 
    description: 'Exploring the biblical purpose of dating while addressing leadership and maturity.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w17', title: 'Beyond Possible', speaker: 'Evelyn Seow', category: 'Theology',
    biography: 'Pioneering leader with over four decades of experience walking in the supernatural.', 
    description: 'Biblical steps to manifest the Kingdom and experience God’s dimensional power.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w18', title: 'Homeschool Life', speaker: 'Ewnice Teh (and Tim)', category: 'Parenting',
    biography: 'Raising three children while managing online businesses; homeschooling for two years.', 
    description: 'Testimony of reclaiming time and ensuring parents remain the primary influence on faith.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w19', title: 'Meet Meat', speaker: 'Jean-Paul Seow', category: 'Cooking',
    biography: 'Culinary enthusiast with hard-won knowledge in home meat preparation.', 
    description: 'Learn about cuts, seasoning tricks, and how to get restaurant-quality steak at home.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Rooftop (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Rooftop (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w20', title: 'Motorhome Life', speaker: 'Jit Lim', category: 'Lifestyle',
    biography: 'Long-time member of FGAM with a heart for capturing visions of the road.', 
    description: 'Sharing fond memories from three winters on the road traveling around Australia.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w21', title: 'Unexpected Life', speaker: 'Josh So and Mel Cheung', category: 'Testimony',
    biography: 'Josh serves in coffee ministry; Mel leads a young families home group.', 
    description: 'Vulnerable look at an 11-year journey through seasons of waiting and suffering.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w22', title: 'Worship Unveiled', speaker: 'Kim Teh', category: 'Arts',
    biography: 'Passionate choreographer specializing in discovering the hidden dancer for God.', 
    description: 'Spirit-led space where movement becomes prayer and creative expression.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w23', title: 'Teen Mental Health', speaker: 'Marie Yap (OAM)', category: 'Parenting',
    biography: 'Professor of Psychology at Monash University specializing in adolescent mental health.', 
    description: 'Practical and spiritual strategies parents can use to support young people’s wellbeing.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w24', title: 'Parenting Expectations', speaker: 'May Yen Ong', category: 'Parenting',
    biography: 'Served in ministry for over 20 years; postgraduate qualification in Christian Counselling.', 
    description: 'Navigating changing expectations as children seek independence while maintaining strong bonds.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w25', title: 'God’s Will', speaker: 'Michael Ting / Stephanie Lok', category: 'Young Adult/High School',
    biography: 'Mike runs 1830; Steph is a nurse actively living the search for God’s plan.', 
    description: 'Honest search for guideposts in discerning God’s will based on lived experience.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w26', title: 'Simple Cooking', speaker: 'Min Leong Ong', category: 'Cooking',
    biography: 'Experienced FGAM kitchen volunteer and home cooking specialist.', 
    description: 'Effortless cooking demonstration perfect for individuals or busy families.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Lobby (FGA Melbourne)' },
      { day: 'Sun', time: '9:30 AM', room: 'Lobby (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w27', title: 'Domestic Violence', speaker: 'Mona Julien', category: 'Care',
    biography: 'Trauma recovery specialist with a Diploma in Christian Counselling.', 
    description: 'Real community talk about hidden domestic violence and what supportive responses look like.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w28', title: 'Sanctification and Success', speaker: 'Nev Waterman', category: 'Leadership',
    biography: 'Business leader and husband with many years of church leadership experience.', 
    description: 'Biblical wisdom on growing in faith while navigating a complex professional world.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w29', title: 'Grief & Loss', speaker: 'Ps. Andrew Harper', category: 'Care',
    biography: 'Hospital chaplain for 11 years; pastoral leader since 1987.', 
    description: 'Journeying through loss and encountering God in painful seasons.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w30', title: 'Advanced Bible Study', speaker: 'Ps. Andrew Harper', category: 'Theology',
    biography: 'Pastoral leader and teacher to pastoral care students since 1987.', 
    description: 'Deep dive into scriptural study and interpretative frameworks.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w31', title: 'Following God\'s Calling', speaker: 'Ps. Roland Seow', category: 'Testimony',
    biography: 'Founding Pastor of FGA Melbourne with a heart for missions and families.', 
    description: 'The FGA journey: discerning God’s voice amid uncertainties and estabelecer core values.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w32', title: 'Healing Parental Hurt', speaker: 'Sarah Man and Lai Hing', category: 'Family',
    biography: 'Mother and daughter serving in counselling and social inclusion roles.', 
    description: 'Testimony on modeling Christlike humility to repair hurts across generations.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w33', title: 'Spirit-Led Parenting', speaker: 'Sonja Loke', category: 'Young Families',
    biography: 'Kids Pastor at FGA; teacher’s aide and mother of four.', 
    description: 'Discover how inviting the Holy Spirit into daily parenting transforms your responses.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w34', title: 'Financial Freedom', speaker: 'Wally Chiang', category: 'Finance',
    biography: 'Entrepreneur who retired at 41; founder of FAT FIRE Australia.', 
    description: 'Biblical principles for financial stewardship beyond just wealth creation.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w35', title: 'Missions Topic', speaker: 'Chai Ng', category: 'Missions',
    biography: 'Passionate for local and global missions.', 
    description: 'Exploring the heart of God for the mission field today.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w36', title: 'Family Activity', speaker: 'Harold Nguyen', category: 'Family',
    biography: 'Active member with a heart for family engagement.', 
    description: 'Stage activity designed for families to connect and have fun together.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w37', title: 'Grow in Worship', speaker: 'Iain Low', category: 'Worship',
    biography: 'Lifelong worshiper with a heart for the presence of God.', 
    description: 'Tapping into the heart of worship to fuel spiritual growth.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w38', title: 'Living with Disability', speaker: 'Ivan Low', category: 'Lifestyle',
    biography: 'Lived testimony of walking with God through physical challenges.', 
    description: 'How God walks with you through life’s toughest hurdles.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w39', title: 'Counselling Options', speaker: 'Matt Jones', category: 'Care',
    biography: 'Head of Crossway LifeCare and ordained Baptist minister.', 
    description: 'Practical guidance on when and how to refer loved ones to professional care.',
    sessions: [
      { day: 'Sun', time: '9:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w40', title: 'Apologetics', speaker: 'Peggy Ong', category: 'Theology',
    biography: 'Church elder and Bible scholar at FGAM.', 
    description: 'Defending your faith with confidence in a modern secular world.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w41', title: 'Steps for Staying Faithful', speaker: 'Peggy Ong', category: 'Faith',
    biography: 'Experienced FGAM church elder with a heart for spiritual maturity.', 
    description: 'Habits for maintaining a faithful Christian walk across all life stages.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w42', title: 'No Burnouts', speaker: 'Albert Lee', category: 'Leadership',
    biography: 'Corporate executive with hard-won wisdom from corporate and ministry burnout.', 
    description: 'Moving beyond "doing less" to a survival strategy for passionate longevity.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w43', title: 'Decision Fatigue', speaker: 'Ps. Chris Ong', category: 'Leadership',
    biography: 'Senior Pastor with decades of practical leadership experience.', 
    description: 'Frameworks to handle constant choices with less stress and more clarity.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w44', title: 'Things We Don\'t Talk About in the Journey', speaker: 'Ps. Chris Ong', category: 'Testimony',
    biography: 'Reflections from 30 years in pastoral ministry.', 
    description: 'Honest stories of the hidden costs and trials often left out of growth narratives.',
    sessions: [
      { day: 'Sun', time: '2:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w45', title: 'Honesty', speaker: 'Ps. Isaac Ling', category: 'ALL',
    biography: 'Leader with a heart for transparent living.', 
    description: 'Exploring why an honest life is pleasing to God and the consequences of hiddenness.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w46', title: 'Spiritual Ministry', speaker: 'Ps. Isaac Ling', category: 'Ministry',
    biography: 'Experienced spirit-led prayer leader.', 
    description: 'Dedicated time for individual prayer and spiritual ministry.',
    sessions: [
      { day: 'Sun', time: '9:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w47', title: 'Older Fitness', speaker: 'Tim Tan', category: 'Health',
    biography: 'Chiropractor passionate about empowering older generations to stay mobile.', 
    description: 'Beginner-friendly stretches to honour God with your body as His temple.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w48', title: 'Youth are Leaders Today', speaker: 'JP/Jordan', category: 'Parents of Teens',
    biography: 'Youth leaders dedicated to intergenerational discipleship.', 
    description: 'Testimony-based session showing how youth are active contributors to God’s mission.',
    sessions: [
      { day: 'Sun', time: '12:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w49', title: 'My Faith, My Journey (Youth)', speaker: 'TBC', category: 'Youth',
    biography: 'TBC', 
    description: 'A safe space for youth to explore their own testimonies of everyday faithfulness.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w50', title: 'Live It Out! (Youth)', speaker: 'TBC', category: 'Youth',
    biography: 'TBC', 
    description: 'Panel featuring young leaders on how service and character reflect Christ daily.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w51', title: 'Youth Presentation Activity', speaker: 'TBC', category: 'Youth',
    biography: 'TBC', 
    description: 'Interactive presentation workshop for youth groups.',
    sessions: [
      { day: 'Sun', time: '1:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w52', title: 'Designing A Youth Service (Youth)', speaker: 'TBC', category: 'Youth',
    biography: 'TBC', 
    description: 'Celebrating youth voices and testimonies through curation and communication skills.',
    sessions: [
      { day: 'Sun', time: '2:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
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

// --- OPTIMIZED HELPERS ---

function normalizeString(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    .replace(/['"“”‘’]/g, '') 
    .replace(/[—–-]/g, '-')   
    .trim();
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

const DaySelector = React.memo(({ selectedDay, onDayChange }) => {
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
});

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
          
          {workshop.sessions && workshop.sessions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {workshop.sessions.map((s, i) => (
                <div key={i} className="bg-white/50 border border-[#E8BA21]/30 rounded-2xl p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                    <Clock size={12} className="text-[#E8BA21]" />
                    {s.day} @ {s.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4563AD]">
                    <MapPin size={12} />
                    {s.room}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-sm md:prose-base text-gray-600 font-medium leading-relaxed bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm my-8">
            <h3 className="text-gray-900 font-bold mb-3 text-lg font-serif">About this session</h3>
            {workshop.description ? <ExpandableText text={workshop.description} maxLength={3000} /> : <p className="italic text-gray-400">Description coming soon...</p>}
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#4563AD]/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8BA21]/10 rounded-bl-full -z-0"></div>
            <h3 className="text-[#4563AD] font-bold mb-4 text-lg font-serif relative z-10">About the Speaker</h3>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#FCF5EB] border-2 border-[#ED4E23] overflow-hidden shrink-0 flex items-center justify-center font-bold text-[#ED4E23] text-2xl shadow-sm">{(workshop.speaker || 'T').charAt(0)}</div>
              <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-base leading-tight">{workshop.speaker || 'To be announced'}</h4>
                {workshop.biography ? <ExpandableText text={workshop.biography} maxLength={500} className="text-sm text-gray-600 mt-1.5 leading-relaxed font-medium" /> : <p className="text-sm text-gray-400 mt-1.5 italic">Biography coming soon...</p>}
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

  // Lookup Optimization: One-time calculation
  const workshopLookupMap = useMemo(() => {
    const map = new Map();
    WORKSHOPS_DATA.forEach(w => {
      map.set(w.id.toLowerCase(), w);
      map.set(normalizeString(w.title), w);
    });
    return map;
  }, []);

  const handleLogin = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    const emailStr = email.trim().toLowerCase();
    
    try {
      // Sync without cache-busting as per request (simpler fetch)
      const response = await fetch(LINKS.itineraries);
      const csvText = await response.text();
      const data = parseCSV(csvText);
      const users = data.filter(row => {
        const rowEmail = (row['Email'] || row['email'] || '').toString().trim().toLowerCase();
        return rowEmail === emailStr;
      });

      if (users.length === 1) processUser(users[0]);
      else if (users.length > 1) setMatchingUsers(users);
      else setError("Registration not found. Please check your spelling.");
    } catch (err) { 
      setError("Sync error. Please check your connection."); 
    } finally { 
      setIsLoading(false); 
    }
  }, [email]);

  const processUser = (row) => {
    const fName = row['Name (First)'] || row['name(first)'] || '';
    const lName = row['Name (Last)'] || row['name(last)'] || '';
    const emailAddr = row['Email'] || row['email'] || '';
    const fullName = `${fName} ${lName}`.trim() || emailAddr.split('@')[0];
    
    const userWorkshops = {};
    const identityKeys = ['email', 'name(first)', 'name(last)', 'name'];
    
    Object.keys(row).forEach(originalKey => {
      const key = originalKey.trim().toLowerCase();
      const val = (row[originalKey] || '').toString().trim();
      
      if (!identityKeys.includes(key) && val) {
        const technicalId = Object.keys(SLOT_HEADER_MAP).find(id => 
          SLOT_HEADER_MAP[id].some(alias => alias === key)
        );
        userWorkshops[technicalId || key] = val;
      }
    });

    setCurrentUser({ name: fullName, workshops: userWorkshops });
    setMatchingUsers([]);
    setSelectedDay('Saturday');
  };

  // Memoized Search Results
  const filteredWorkshops = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return WORKSHOPS_DATA;
    return WORKSHOPS_DATA.filter(w => 
      w.title.toLowerCase().includes(term) || 
      w.speaker.toLowerCase().includes(term) ||
      (w.category && w.category.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col font-sans text-gray-900 selection:bg-[#E8BA21]/30 text-left">
      <header className="w-full bg-[#FCF5EB] border-b border-[#E8BA21]/20 sticky top-0 z-40 shadow-sm shrink-0 h-20">
        <div className="max-w-2xl mx-auto p-5 flex justify-between items-center h-full">
          <img src={LOGO_URL} className="h-10 md:h-12 w-auto object-contain" alt="WISH Logo" style={{ aspectRatio: '3/1' }} />
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{currentUser.name}</span>
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-100 font-bold text-sm text-[#4563AD] uppercase shadow-sm">{currentUser.name.charAt(0)}</div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative text-balance">
        {selectedWorkshopId ? (
          <WorkshopDetailView workshop={workshopLookupMap.get(selectedWorkshopId.toLowerCase())} onBack={() => setSelectedWorkshopId(null)} />
        ) : (
          <div className="max-w-2xl w-full mx-auto p-6 pb-32">
            {activeTab === 'my-wish' && (
              currentUser ? (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex justify-between items-end">
                    <div><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">My WISH</h2><p className="text-xs text-gray-500 font-bold uppercase mt-1">Personal Itinerary</p></div>
                    <button onClick={() => setCurrentUser(null)} className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-widest hover:bg-red-50 hover:text-red-400 transition-colors">Logout</button>
                  </div>
                  <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
                  {MASTER_SCHEDULE.filter(day => day.date === selectedDay).map((day) => (
                    <div key={`personal-day-${day.date}`} className="space-y-6">
                      {day.events.map((event) => {
                        const userWorkshopValue = currentUser.workshops[event.id.toLowerCase()] || '';
                        const workshop = workshopLookupMap.get(userWorkshopValue.toLowerCase().trim()) || workshopLookupMap.get(normalizeString(userWorkshopValue));
                        
                        const sessionMatch = workshop?.sessions?.find(s => 
                           s.time === event.time && (
                             (day.date === 'Saturday' && s.day === 'Sat') ||
                             (day.date === 'Sunday' && s.day === 'Sun')
                           )
                        );
                        
                        const isWorkshopSlot = event.type === 'workshop_slot';
                        const isPersonalized = isWorkshopSlot && workshop;
                        const isPending = isWorkshopSlot && !workshop;
                        
                        return (
                          <div key={`personal-ev-${event.id}`} className="flex gap-4 items-start">
                            <div className="w-16 shrink-0 pt-4 text-right font-bold text-gray-400 text-sm">{event.time}</div>
                            <div className={`flex-1 p-5 rounded-3xl border transition-all ${isPersonalized ? 'bg-white border-[#E8BA21] shadow-md cursor-pointer hover:border-[#ED4E23]' : 'bg-white border-gray-100 shadow-sm'} relative overflow-hidden`} onClick={() => isPersonalized ? setSelectedWorkshopId(workshop.id) : null}>
                              {(isPersonalized || event.type === 'main') && <div className={`absolute top-0 left-0 w-1.5 h-full ${event.type === 'main' ? 'bg-[#4563AD]' : 'bg-[#E8BA21]'}`} />}
                              <h4 className={`font-bold text-gray-900 leading-snug text-lg ${isPending ? 'italic text-gray-400' : ''}`}>{workshop ? workshop.title : (isPending ? 'Choice Pending' : event.title)}</h4>
                              {workshop && <p className="text-sm text-[#ED4E23] mt-1 font-bold">with {workshop.speaker}</p>}
                              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 font-semibold uppercase tracking-wider"><MapPin size={13} /> {sessionMatch ? sessionMatch.room : (event.location || (workshop ? 'Check Sessions' : 'TBA'))}</div>
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
                            <span className="font-bold text-gray-800">{(u['Name (First)'] + ' ' + u['Name (Last)']).trim()}</span><ChevronRight size={20} className="text-[#E8BA21]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-12">
                      <div className="text-left py-4">
                        <div className="inline-flex items-center gap-2 bg-[#4563AD]/10 text-[#4563AD] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"><Sparkles size={14} /> WISH CONFERENCE '26</div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] font-serif mb-6">Welcome to <span className="text-[#ED4E23]">WISH</span></h1>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-lg mb-8">{CONFERENCE_INFO.tagline}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50"><Calendar size={20} className="text-[#E8BA21]" /><span className="text-sm font-bold">{CONFERENCE_INFO.dates}</span></div>
                          <a href={CONFERENCE_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 hover:bg-white hover:shadow-md transition-all group"><MapPin size={20} className="text-[#E8BA21]" /><div className="flex flex-col"><span className="text-sm font-bold group-hover:text-[#4563AD]">{CONFERENCE_INFO.locationName}</span><span className="text-[10px] font-medium text-gray-400 truncate w-32 sm:w-auto">{CONFERENCE_INFO.address}</span></div></a>
                        </div>
                      </div>
                      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-[#4563AD]/5 text-left">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sign In</h2><p className="text-sm text-gray-400 font-medium mb-8">Enter your registered email to access your personal itinerary.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#E8BA21]/10 focus:border-[#E8BA21] outline-none text-gray-900 font-medium transition-all" required />
                          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl flex items-center gap-2 animate-bounce"><AlertCircle size={16}/> {error}</div>}
                          <button type="submit" disabled={isLoading} className="w-full bg-[#ED4E23] text-white font-extrabold py-5 rounded-2xl shadow-lg shadow-[#ED4E23]/30 hover:bg-[#ED4E23]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">{isLoading ? "Checking Registry..." : <>Access My Schedule <ChevronRight size={20}/></>}</button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            {activeTab === 'schedule' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="text-left"><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Conference</h2><p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest text-left">Master Schedule</p></div>
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
                <div className="text-left"><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Workshops</h2><p className="text-sm text-gray-500 font-medium mt-1 text-left">Browse sessions and see their scheduled times.</p></div>
                <div className="relative group"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4563AD] transition-colors" size={20} /><input type="text" placeholder="Search topics or speakers..." className="w-full pl-14 p-5 rounded-[2rem] border border-gray-100 bg-white outline-none focus:ring-4 focus:ring-[#4563AD]/5 focus:border-[#4563AD]/20 font-medium transition-all shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="grid grid-cols-1 gap-4 text-left">
                  {filteredWorkshops.map((w) => (
                    <div key={`w-list-${w.id}`} onClick={() => setSelectedWorkshopId(w.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 hover:shadow-md cursor-pointer active:scale-[0.99] transition-all group flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-extrabold text-xl text-gray-900 leading-tight group-hover:text-[#4563AD] transition-colors">{w.title}</h3>
                          <p className="text-[#ED4E23] text-sm font-bold uppercase tracking-wider">{w.speaker}</p>
                        </div>
                        {w.category && <p className="text-[#4563AD] text-[9px] font-extrabold uppercase tracking-widest bg-[#4563AD]/5 inline-block px-2 py-0.5 rounded-full border border-[#4563AD]/10 whitespace-nowrap ml-2">{w.category}</p>}
                      </div>
                      {w.sessions && w.sessions.length > 0 ? (
                        <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 gap-2">
                          {w.sessions.map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 tracking-tighter"><Clock size={11} className="text-[#E8BA21]" /><span>{s.day} {s.time}</span></div>
                              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-400 tracking-tighter truncate"><MapPin size={11} className="text-[#4563AD]" /><span className="truncate">{s.room}</span></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Times to be confirmed</p>
                      )}
                    </div>
                  ))}
                  {filteredWorkshops.length === 0 && <div className="text-center py-20 text-gray-400 font-medium italic">No workshops found.</div>}
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="text-left"><h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Locations</h2><p className="text-sm text-gray-500 font-medium mt-1 text-left">Campus addresses and room layouts.</p></div>
                <div className="space-y-8 text-left">
                  {VENUE_MAP.map((location, idx) => (
                    <div key={`loc-${idx}`} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-8 flex items-start gap-5 border-b border-gray-50 bg-gray-50/40"><div className="w-12 h-12 rounded-2xl bg-[#4563AD]/10 flex items-center justify-center text-[#4563AD] shrink-0 shadow-inner">{location.icon}</div><div><h3 className="text-xl font-extrabold text-gray-900">{location.zone}</h3><a href={location.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-[#E8BA21] font-bold mt-1 hover:text-[#4563AD] transition-all group/addr">{location.address}<ExternalLink size={12} className="text-gray-300 group-hover/addr:text-[#4563AD]" /></a><p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">{location.description}</p></div></div>
                      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-3">{location.rooms.map((room, rIdx) => (<div key={`room-${rIdx}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#E8BA21]/20 hover:shadow-sm transition-all group/room"><span className="text-sm font-bold text-gray-700">{room.name}</span><span className="text-[10px] uppercase font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg tracking-wider border border-gray-100 group-hover/room:bg-[#E8BA21]/10 group-hover/room:text-[#ED4E23] group-hover/room:border-[#E8BA21]/20 transition-all">{room.note}</span></div>))}</div>
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
