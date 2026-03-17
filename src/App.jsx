import React, { useState, useEffect } from 'react';
import { CalendarDays, Map as MapIcon, BookOpen, Clock, MapPin, Search, User, LogOut, ChevronLeft, AlertCircle, ChevronRight, ListChecks, Filter, Sparkles, Calendar, Home, DoorOpen, Coffee, Sun, Building2, Map as MapPinIcon, ExternalLink } from 'lucide-react';

// --- CONFIGURATION ---
const LINKS = {
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
    id: 'w1', 
    title: 'Managing Screen Time', 
    speaker: 'Kevin and Yen Siow', 
    category: 'Parenting', 
    biography: 'As parents of three boys, Kevin and Yen are still on the journey of learning how to navigate screens in a way that honours God, strengthens relationships and shapes character. They’ve learned that screens aren’t just about time limits, but about relationships, values and understanding the kind of people we are raising.', 
    description: 'In this workshop, they will share a faith-centred, family values approach to digital habits, drawing on the work of Dr Justin Coulson (Happy Families) and their own lived experience. They will speak honestly about what has worked, what has not worked, and some of the mistakes they have made along the way, in the hope that other families can learn from them. Together, they will explore how calm conversations, shared expectations and simple structures can help families use screens for connection, communication and collaboration, while staying anchored in their values. Parents will leave with practical ideas they can try immediately, and encouragement that it’s possible to guide screen use in a way that strengthens family life.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w2', 
    title: 'Adulting 101', 
    speaker: 'Mike and Maggie (underwriting)', 
    category: 'Youth/ Young Adult', 
    biography: 'Mike is a trained engineer and business owner who sees the world in systems. Maggie is a healthcare professional and homemaker who lives in the details. They married each other which, if you think about it, is either a masterclass in complementary strengths or a daily exercise in patience. Probably both. Between them, they bring a rare combination of big-picture thinking and ground-level practicality to the stuff that actually matters in everyday life.', 
    description: "At some point, everyone looks around and realizes they have no idea what they're doing. And that's more normal than anyone admits. This session is an honest, practical conversation about the skills that actually matter in your 20s: finances, career, self care, life admin. Less overwhelm, more clarity.",
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Meeting Room (FGA Melbourne)' },
      { day: 'Sat', time: '2:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w3', 
    title: 'Entrepreneurship', 
    speaker: 'Aaron Lau/Michael Ting', 
    category: 'Career',
    biography: "Mike and Aaron have started half a dozen businesses between them some that worked, some that didn't, and all that taught them something. They've built ventures across automotive, healthcare, construction, and consulting, learning along the way that entrepreneurship is less about having all the answers and more about being willing to figure it out as you go.", 
    description: "Entrepreneurship isn't just about starting a business. It's a posture, a way of seeing the world and responding to what doesn't exist yet. Whether you're building a company, launching a ministry, pioneering a community initiative, or creating something entirely new, the same apostolic DNA runs through it all.",
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w4', 
    title: 'Crossing borders, changing jobs', 
    speaker: 'Alan Wong', 
    category: 'Career',
    biography: 'Alan has worked across Asia-Pacific as an investment banker and fund manager including roles at Macquarie, Acorn Capital, and Sungrow. Having lived in Malaysia, Japan, Hong Kong, Singapore, and Australia, his journey includes career transitions, missed promotions, miscarriage, parenting challenges, and seasons of spiritual wrestling. Through it all, he has come to see the faithful sovereignty of God in life’s deserts and border crossings. He speaks from personal experience about faith formed through uncertainty.', 
    description: 'From Malaysia to Australia, from career ambition to dealing with the painful realities of life and disappointment, I hope that my sharing will encourage you to see how God can use changes and crisis to shape us - in my case this was geographic moves, career setbacks, family trials, and desert seasons - testing times indeed!\n\nThrough Scripture and lived experience, I hope to show how we can trust God’s sovereignty — especially when the outcome is unclear — and to see uncertainty not as abandonment, but as key method of maturing.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w5', 
    title: 'Engaging AI', 
    speaker: 'Alan Wong and Lawrence Chen', 
    category: 'Tech',
    biography: 'Lawrence is a data analyst with a love for mathematics, music, and languages. He works in school funding reform while serving in 1830 ministry. He thinks deeply about how Christians can engage with AI faithfully and wisely. He uses AI in practical and human ways for home group, at work, for content creation, and as a son at home.\n\nAlan is a father, ex-entrepreneur, ex-fund manager and investment banker. He’s passionate about renewable energy and is currently on a study break.', 
    description: 'AI is rapidly reshaping how we access information, solve problems and create — accelerating many of the everyday tasks we already do. In this workshop, Lawrence and Alan will explore what AI is (and isn’t), and show how it can be used wisely and practically in daily life.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w6', 
    title: 'Crowded House', 
    speaker: 'Ash and Grace Chan', 
    category: 'Family',
    biography: 'Hi, we’re Grace and Ash! We have been married for seven years and are the parents of Aria, our spirited three-year-old, and Madison, our joyful one-year-old. When Maddy arrived, we made the strategic decision to trade our autonomy for a "village," moving into Grace’s parents\' home. We bring a candid and transparent lens to the daily chaos of a five-adult household.', 
    description: 'We often hear the proverb, but we rarely discuss the logistics of the "Village" when it’s all under one roof. Living with three generations offers incredible support, but it also brings a unique set of challenges—from conflicting routines to the "unspoken rules" of shared spaces. In this session, we’re opening up about our journey of living with parents and kids together.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w7', 
    title: 'Study Hacks', 
    speaker: 'Ashley Ng', 
    category: 'Youth',
    biography: 'Hi, I’m Ashley! I graduated from Balwyn High School in 2022, where I completed 8 VCE subjects over 3 years. Since then, I’ve also graduated with a Bachelor of Commerce degree at UniMelb (Actuarial Studies and Finance) and am currently pursuing a Diploma in Music. I’ve also been tutoring high school students from year 7-12 for the past 5 years.', 
    description: 'Do you feel like you study for hours on end but get nowhere? Or you’re struggling to balance school with everything else in life? In this workshop, I’ll be sharing the study strategies and practical tips that helped me during both VCE and university, and what I’ve learned from tutoring high school students.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w8', 
    title: 'Women Dating', 
    speaker: 'Belle Seow / Grace Leong?', 
    category: 'Relationships',
    biography: "Belle is 30 years of age this year, has interest in fitness for injury prevention, baking for hunger prevention, and has been in a committed relationship with her husband Elijah for nearly 5 years including 2 years of marriage. Grace is a 26 year old designer who loves sharing in her love of good food, talking about art and a good tv show.", 
    description: 'In today’s age, dating is more complicated than it ever has been. But have you ever thought to slow down and rediscover who you are in Christ before first navigating relationships? Whether you’re single, dating, or figuring things out, this workshop is about grounding yourself in God’s truth so you don’t lose yourself in the process.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w9', 
    title: 'Demons in Christians?', 
    speaker: 'Charles Ho', 
    category: 'Theology',
    biography: 'We currently leading the Shalom Ministry, which is the Inner Healing and Deliverance (IHD) Ministry in FGAM. We have been involved in IHD in and outside of FGAM for many years and have led mission trips focusing on IHD to Thailand and Laos.', 
    description: 'Demons cannot have Christians but Christians can have demons! Demons are for real but we need to recognise them. This workshop will cover how Christians may experience demonic oppression. We’ll look at the open doors that allow such oppression and the ways it can affect us mentally, physically, and spiritually.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w10', 
    title: 'Sex in the Suburbs', 
    speaker: 'Daniel and Julie Wong', 
    category: 'Marriage',
    biography: "Julie and Daniel Wong have been married for 37 years, with 4 adult children and 4 grandchildren. Daniel has his own AI business and Julie is a paediatric Occupational Therapist, with 34 years of counselling experience.", 
    description: 'Sexual intimacy in marriage was designed by God to bring joy and fulfillment. In this workshop, we are going to talk about the joys of marital sex, as well as discussing some of the barriers that married couples face in intimacy and how to overcome them.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w11', 
    title: 'Running', 
    speaker: 'David Gunn, Michelle Tsiros and Dennis Wong', 
    category: 'Health',
    biography: 'David “Gunny” Gunn, Michelle Tsiros, and Dr Dennis Wong are all passionate about the benefits of running for physical, mental, and spiritual health.', 
    description: 'What Are You Running Towards? Through honest beginner experiences along with a clear and practical look at the science of movement, we’ll explore how running reshapes the brain, steadies emotions, and builds calm under pressure.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w12', 
    title: 'Gut & Brain', 
    speaker: 'Dr. Dennis Wong', 
    category: 'Health',
    biography: 'Dr Huang (Dennis) S. Wong, MBA FRACP BMBS, is a medical doctor and aged-care leader with a strong interest in brain health, dementia prevention, and the role of diet and daily lifestyle in protecting memory.', 
    description: 'Our Gut–Brain Axis Workshop is a practical, science-grounded, and culturally sensitive exploration of how what we eat shapes how we think, feel, and age.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w13', 
    title: 'Menopause Questions', 
    speaker: 'Dr. Sze Wey Lee', 
    category: 'Health',
    biography: 'I’m Sze Lee and I’m an obstetrician and gynaecologist based at Epworth Freemasons in East Melbourne. I have had the privilege of journeying with women through the many stages of their reproductive life for almost 20 years.', 
    description: 'Menopause is often misunderstood and there are myths galore about what the symptoms of menopause are, what can be done about them and the pros and cons of managements.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w14', 
    title: 'Life Vision Board', 
    speaker: 'Elaine Choi', 
    category: 'Personal Growth',
    biography: 'Elaine Choi is a trainer and facilitator with a heart for guiding women through seasons of transition. As the founder of Eltitude Collective, she combines structured learning tools with prayerful reflection.', 
    description: 'In this workshop, participants will explore what it means to align their lives with God’s purpose, rather than personal pressure or comparison.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w15', 
    title: 'Know Your WHY', 
    speaker: 'Elijah Seow', 
    category: 'Purpose',
    biography: 'Elijah is 29 years of age and has been following Christ for the past 12 years of his life with a passion for faith shown through action in his choice of work and ministry.', 
    description: 'Why do you do what you do? When misdirected - social commitments, work, family obligations, and even ministry can all lead to exhaustion, frustration, and even burnout.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w16', 
    title: 'Men Dating', 
    speaker: 'Elijah Seow/Daniel Ong', 
    category: 'Relationships',
    biography: 'Elijah (29) is newly married, celebrating two years in July; Dong (30) is currently engaged and draws from his experiences in current/prior relationships.', 
    description: 'We’re hosting a joint talk for young adults for men with a focus on navigating ‘dating’ today, how to do it well by sharing our perspectives, led by Elijah and Daniel (Dong).',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w17', 
    title: 'Beyond Possible', 
    speaker: 'Evelyn Seow', 
    category: 'Theology',
    biography: 'With over four decades of ministry experience, Evelyn Seow is a pioneering leader dedicated to empowering Christians to walk in the supernatural in God’s Kingdom.', 
    description: 'The earth is groaning for the manifestation of the Sons of God. Jesus promised that "greater works shall we do," and this workshop will provide the biblical steps to manifest the Kingdom.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w18', 
    title: 'Homeschool Life', 
    speaker: 'Ewnice Teh (and Tim)', 
    category: 'Parenting',
    biography: 'Ewnice has been married to her husband Tim for 15 years. FGA has been her church home for over 20 years. For the past two years, Ewnice has embraced homeschooling.', 
    description: 'In this workshop, I’ll be sharing my testimony of why we chose to homeschool and how it has allowed our family to reclaim our time and our children’s childhood.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w19', 
    title: 'Meet Meat', 
    speaker: 'Jean-Paul Seow', 
    category: 'Cooking',
    biography: 'Culinary enthusiast based at FGAM.', 
    description: 'If you love steak, this one’s for you! Learn about different cuts, seasoning tricks, cooking techniques, and how to get restaurant-quality results at home.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Rooftop (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Rooftop (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w20', 
    title: 'Motorhome Life', 
    speaker: 'Jit Lim', 
    category: 'Lifestyle',
    biography: 'Long-time member of FGAM with a heart for adventure.', 
    description: 'Betty and I went around Australia in three winters on the road. We are very keen to share our experiences and fond memories so that some of us can capture the vision.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w21', 
    title: 'Unexpected Life', 
    speaker: 'Josh So and Mel Cheung', 
    category: 'Testimony',
    biography: 'Josh and Mel have been together for 11 years and married for 5. They have called FGAM home for the past three years. Josh serves in the coffee ministry.', 
    description: 'Drawing from Romans 5:3–4 and Romans 8:26–28, this workshop explores how God works through seasons of waiting, suffering, and uncertainty to produce perseverance.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w22', 
    title: 'Worship Unveiled', 
    speaker: 'Kim Teh', 
    category: 'Arts',
    biography: 'Kim is a passionate dance choreographer and teacher. She especially loves facilitating individuals to discover their hidden dancer for God.', 
    description: 'Discover a space where movement becomes prayer and creative expression unfolds to encounter with God.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w23', 
    title: 'Teen Mental Health', 
    speaker: 'Marie Yap (OAM)', 
    category: 'Parenting',
    biography: 'Marie is a Professor of Psychology at Monash University. Her research specialises in child and adolescent mental health.', 
    description: 'Mental health has become a more widely-known term. As parents or other adults who care for teenagers, there are things we can do to support our young people’s mental health.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w24', 
    title: 'Parenting Expectations', 
    speaker: 'May Yen Ong', 
    category: 'Parenting',
    biography: 'May Yen Ong is deeply passionate about seeing families flourish. Married for 28 years and a mother of three young adults.', 
    description: 'When our children grow into teens and young adults, they naturally seek independence. In this workshop, May will share personal insights on navigating changing expectations.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w25', 
    title: 'God’s Will', 
    speaker: 'Michael Ting / Stephanie Lok', 
    category: 'Young Adult/High School',
    biography: 'Mike currently runs the young adults ministry, 1830. Steph is a nurse and a young adult who is actively living the question herself.', 
    description: '"What does God actually want for my life?" Drawing from lived experience, they\'ll offer some guideposts for young adults wrestling with the same question.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '9:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w26', 
    title: 'Simple Cooking', 
    speaker: 'Min Leong Ong', 
    category: 'Cooking',
    biography: 'Min Leong is an experienced home cook and frequent volunteer in the FGAM kitchen.', 
    description: 'Back by popular demand, Min Leong hosts a live food demonstration focused on effortless cooking, perfect for individuals or families.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Lobby (FGA Melbourne)' },
      { day: 'Sun', time: '9:30 AM', room: 'Lobby (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w27', 
    title: 'Domestic Violence', 
    speaker: 'Mona Julien', 
    category: 'Care',
    biography: 'Mona has a Diploma in Christian Counselling and a Graduate Certificate in Social Inclusion. She has worked alongside families for over two decades.', 
    description: 'This workshop is a real, down‑to‑earth community talk about what domestic violence can look like when it’s hidden from view.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '2:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w28', 
    title: 'Sanctification and Success', 
    speaker: 'Nev Waterman', 
    category: 'Leadership',
    biography: 'Nev is a Christian husband, father, and business leader who has spent many years walking alongside men in both church and everyday life.', 
    description: 'Grow in faith, character, and confidence as you learn to follow Christ in a complex world.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w29', 
    title: 'Grief & Loss', 
    speaker: 'Ps. Andrew Harper', 
    category: 'Care',
    biography: 'Ps. Andrew has served in various church pastoral and leadership roles since 1987. Between 2014-2025 Andrew served as a hospital chaplain.', 
    description: 'Drawing on his 11 years serving as a hospital chaplain, Ps. Andrew Harper will discuss the journey of grief.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w30', 
    title: 'Advanced Bible Study', 
    speaker: 'Ps. Andrew Harper', 
    category: 'Theology',
    biography: 'Ps. Andrew has served in pastoral and leadership roles since 1987 and was a hospital chaplain for over a decade.', 
    description: 'A deep dive into advanced biblical study and hermeneutics.',
    sessions: [
      { day: 'Sat', time: '12:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w31', 
    title: 'Following God\'s Calling', 
    speaker: 'Ps. Roland Seow', 
    category: 'Testimony',
    biography: 'Ps Roland is the Founding Pastor of FGA Melbourne with a passion for missions and families. He facilitates restoration for Pastors through IPIN.', 
    description: 'This workshop chronicles FGAM\'s formation story to help participants discern God\'s voice amid life\'s uncertainties.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w32', 
    title: 'Healing Parental Hurt', 
    speaker: 'Sarah Man and Lai Hing', 
    category: 'Family',
    biography: 'Lai Hing is a social worker and Sarah is a counsellor. They serve at FGA and work in social inclusion.', 
    description: 'Hear a mother and daughter’s personal testimony about how parents can model Christlike humility in addressing and repairing relational hurts.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w33', 
    title: 'Spirit-Led Parenting', 
    speaker: 'Sonja Loke', 
    category: 'Young Families',
    biography: 'Sonja is the Kids Pastor at FGA Kids and a mother of four. She has deep reliance on the Holy Spirit\'s guidance in everyday family life.', 
    description: 'Discover how inviting the Holy Spirit into your parenting journey—from sleepless nights to challenging conversations—can transform how you respond to your children.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w34', 
    title: 'Financial Freedom', 
    speaker: 'Wally Chiang', 
    category: 'Finance',
    biography: 'Wally retired at 41 after reaching financial independence. He is the founder of FAT FIRE Australia.', 
    description: 'Gain a clearer understanding of what true financial freedom means through a practical framework grounded in timeless biblical principles.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w35', 
    title: 'Missions Topic', 
    speaker: 'Chai Ng', 
    category: 'Missions',
    biography: 'TBC', 
    description: 'We are called to missions. Exploring the heart of God for the local and global field.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Classroom (61 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Classroom (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w36', 
    title: 'Family Activity', 
    speaker: 'Harold Nguyen', 
    category: 'Family',
    biography: 'TBC', 
    description: 'A fun stage activity designed for all families to enjoy together.',
    sessions: [
      { day: 'Sat', time: '1:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w37', 
    title: 'Grow in Worship', 
    speaker: 'Iain Low', 
    category: 'Worship',
    biography: 'TBC', 
    description: 'Learn how a life of worship contributes to spiritual growth from a life-long worshiper. Tap into the heart of worship.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Dance Studio 2 (7/41 Lexton Road)' },
      { day: 'Sun', time: '10:30 AM', room: 'Dance Studio 2 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w38', 
    title: 'Living with Disability', 
    speaker: 'Ivan Low', 
    category: 'Lifestyle',
    biography: 'TBC', 
    description: 'A lived testimony about disability. How God walks with you and how to deal with the challenges one faces.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Sanctuary (FGA Melbourne)' },
      { day: 'Sun', time: '12:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w39', 
    title: 'Counselling Options', 
    speaker: 'Matt Jones', 
    category: 'Care',
    biography: 'Matt Jones is Head of Crossway LifeCare. He is an ordained Baptist minister with 20 years of pastoral care experience.', 
    description: 'When is it appropriate to refer to professional care? We will be exploring these challenges to give you greater confidence to care.',
    sessions: [
      { day: 'Sun', time: '9:30 AM', room: 'Meeting Room (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w40', 
    title: 'Apologetics', 
    speaker: 'Peggy Ong', 
    category: 'Theology',
    biography: 'TBC', 
    description: 'Learn how to defend your faith from Bible scholar and FGAM church elder Aunty Peggy.',
    sessions: [
      { day: 'Sat', time: '3:00 PM', room: 'Main Space (4/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w41', 
    title: 'Steps for Staying Faithful', 
    speaker: 'Peggy Ong', 
    category: 'Faith',
    biography: 'TBC', 
    description: 'How to remain faithful as a Christian. Suitable for all ages of spiritual maturity.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w42', 
    title: 'No Burnouts', 
    speaker: 'Albert Lee', 
    category: 'Leadership',
    biography: 'Seasoned commercial executive with over 30 years of multinationals experience.', 
    description: 'Move beyond the cliché of "doing less" to the art of leading better. Come learn how to be a leader who burns with passion but is not consumed.',
    sessions: [
      { day: 'Sat', time: '2:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w43', 
    title: 'Decision Fatigue', 
    speaker: 'Ps. Chris Ong', 
    category: 'Leadership',
    biography: 'Senior Pastor with decades of leadership experience.', 
    description: 'Unpack why decision fatigue is common and how to approach making choices more wisely with simple tools and frameworks.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w44', 
    title: 'Things We Don\'t Talk About in the Journey', 
    speaker: 'Ps. Chris Ong', 
    category: 'Testimony',
    biography: 'Ps Chris Ong reflects honestly on the hidden costs and trials that shape a 30-year journey.', 
    description: 'This unrecorded workshop creates space to tell the fuller story of FGA’s journey. It is an invitation to see faith and leadership as they really are.',
    sessions: [
      { day: 'Sun', time: '2:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w45', 
    title: 'Honesty', 
    speaker: 'Ps. Isaac Ling', 
    category: 'ALL',
    biography: 'TBC', 
    description: 'How to live an honest, transparent God-honoring life and why doing so is pleasing to God.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Main Area (61 Lexton Road)' },
      { day: 'Sun', time: '12:00 PM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w46', 
    title: 'Spiritual Ministry', 
    speaker: 'Ps. Isaac Ling', 
    category: 'Ministry',
    biography: 'TBC', 
    description: 'Come for a time of spiritual ministry with Ps. Isaac Ling.',
    sessions: [
      { day: 'Sun', time: '9:30 AM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w47', 
    title: 'Older Fitness', 
    speaker: 'Tim Tan', 
    category: 'Health',
    biography: 'Timothy is a chiropractor passionate about empowering older generations to feel as strong as they did in their 20’s.', 
    description: 'Unpack what it truly means to honour God with our bodies as temples of the Holy Spirit. Beginner-friendly class included.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Dance Studio 1 (7/41 Lexton Road)' },
      { day: 'Sun', time: '1:00 PM', room: 'Dance Studio 1 (7/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w48', 
    title: 'Youth are Leaders Today', 
    speaker: 'JP/Jordan', 
    category: 'Parents of Teens',
    biography: 'TBC', 
    description: 'A youth-led, testimony-based session demonstrating how young people are already serving and representing Christ today.',
    sessions: [
      { day: 'Sun', time: '12:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w49', 
    title: 'My Faith, My Journey (Youth)', 
    speaker: 'TBC', 
    category: 'Youth',
    biography: 'TBC', 
    description: 'Explores how God works through everyday faithfulness and ongoing journeys. Recognise that everyone has a testimony worth offering.',
    sessions: [
      { day: 'Sat', time: '9:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w50', 
    title: 'Live It Out! (Youth)', 
    speaker: 'TBC', 
    category: 'Youth',
    biography: 'TBC', 
    description: 'Explore what it means to live out faith through service, hospitality, and character. Panel features Kevin Wong, Bella Deltondo, and Hajin You.',
    sessions: [
      { day: 'Sat', time: '10:30 AM', room: 'Main Space (4/41 Lexton Road)' }
    ]
  },
  { 
    id: 'w51', 
    title: 'Youth Presentation Activity', 
    speaker: 'TBC', 
    category: 'Youth',
    biography: 'TBC', 
    description: 'Workshop presentation activity for youth.',
    sessions: [
      { day: 'Sun', time: '1:00 PM', room: 'Sanctuary (FGA Melbourne)' }
    ]
  },
  { 
    id: 'w52', 
    title: 'Designing A Youth Service (Youth)', 
    speaker: 'TBC', 
    category: 'Youth',
    biography: 'TBC', 
    description: 'A curated program of youth-led stories celebrating the voices of young people and the vibrancy of next-gen faith.',
    sessions: [
      { day: 'Sun', time: '2:00 PM', room: 'Main Area (61 Lexton Road)' }
    ]
  },
  { 
    id: 'w53', 
    title: 'Designing A Youth Service', 
    speaker: 'TBC', 
    category: 'Youth',
    biography: 'TBC', 
    description: 'Vibrant next-gen faith showcased through youth testimonies.',
    sessions: []
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

// --- HELPERS ---

function normalizeString(str) {
  if (!str) return '';
  return str.toString()
    .toLowerCase()
    .replace(/['"“”‘’]/g, '') 
    .replace(/[—–-]/g, '-')   
    .trim();
}

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
      const users = data.filter(row => getSafeField(row, 'Email').toLowerCase() === emailStr);
      if (users.length === 1) processUser(users[0]);
      else if (users.length > 1) setMatchingUsers(users);
      else setError("Registration not found. Please check your spelling.");
    } catch (err) { setError("Unable to sync. Please check your internet connection."); }
    finally { setIsLoading(false); }
  };

  const processUser = (row) => {
    const fName = getSafeField(row, 'Name (First)');
    const lName = getSafeField(row, 'Name (Last)');
    const fullName = `${fName} ${lName}`.trim() || getSafeField(row, 'Email').split('@')[0];
    
    const userWorkshops = {};
    const identityKeys = ['email', 'name(first)', 'name(last)', 'name'];
    
    Object.keys(row).forEach(originalKey => {
      const key = originalKey.trim().toLowerCase();
      const val = (row[originalKey] || '').toString().trim();
      
      if (!identityKeys.includes(key) && val) {
        const technicalId = Object.keys(SLOT_HEADER_MAP).find(id => 
          SLOT_HEADER_MAP[id].some(alias => alias === key)
        );
        if (technicalId) userWorkshops[technicalId] = val;
        else userWorkshops[key] = val; 
      }
    });

    setCurrentUser({ name: fullName, workshops: userWorkshops });
    setMatchingUsers([]);
    setSelectedDay('Saturday');
  };

  const filteredWorkshops = WORKSHOPS_DATA.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col font-sans text-gray-900 selection:bg-[#E8BA21]/30 text-left">
      <header className="w-full bg-[#FCF5EB] border-b border-[#E8BA21]/20 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="max-w-2xl mx-auto p-5 flex justify-between items-center">
          <img src={LOGO_URL} className="h-10 md:h-12 object-contain" alt="WISH Logo" />
          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-bold text-gray-500 uppercase">{currentUser.name}</span>
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-sm text-[#4563AD] uppercase shadow-sm">{currentUser.name.charAt(0)}</div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative text-balance">
        {selectedWorkshopId ? (
          <WorkshopDetailView workshop={WORKSHOPS_DATA.find(w => w.id.toLowerCase() === selectedWorkshopId.toLowerCase())} onBack={() => setSelectedWorkshopId(null)} />
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
                        const workshop = WORKSHOPS_DATA.find(w => 
                          w.id.toLowerCase() === userWorkshopValue.toLowerCase().trim() ||
                          normalizeString(w.title) === normalizeString(userWorkshopValue)
                        );
                        
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
                            <div 
                              className={`flex-1 p-5 rounded-3xl border transition-all ${isPersonalized ? 'bg-white border-[#E8BA21] shadow-md cursor-pointer hover:border-[#ED4E23]' : 'bg-white border-gray-100 shadow-sm'} relative overflow-hidden`} onClick={() => isPersonalized ? setSelectedWorkshopId(workshop.id) : null}
                            >
                              {(isPersonalized || event.type === 'main') && <div className={`absolute top-0 left-0 w-1.5 h-full ${event.type === 'main' ? 'bg-[#4563AD]' : 'bg-[#E8BA21]'}`} />}
                              <h4 className={`font-bold text-gray-900 leading-snug text-lg ${isPending ? 'italic text-gray-400' : ''}`}>{workshop ? workshop.title : (isPending ? 'Choice Pending' : event.title)}</h4>
                              {workshop && <p className="text-sm text-[#ED4E23] mt-1 font-bold">with {workshop.speaker}</p>}
                              
                              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                <MapPin size={13} /> 
                                {sessionMatch ? sessionMatch.room : (event.location || (workshop ? 'Multiple Rooms' : 'TBA'))}
                              </div>
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
                            <span className="font-bold text-gray-800">{(getSafeField(u, 'Name (First)') + ' ' + getSafeField(u, 'Name (Last)')).trim() || getSafeField(u, 'Email')}</span><ChevronRight size={20} className="text-[#E8BA21]" />
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
                          <a href={CONFERENCE_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 bg-white/50 p-4 rounded-2xl border border-white/50 hover:bg-white hover:shadow-md transition-all group"><MapPin size={20} className="text-[#E8BA21]" /><div className="flex flex-col"><span className="text-sm font-bold group-hover:text-[#4563AD]">{CONFERENCE_INFO.locationName}</span><span className="text-[10px] font-medium text-gray-400">{CONFERENCE_INFO.address}</span></div></a>
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
                <div className="text-left">
                  <h2 className="text-4xl font-extrabold text-[#ED4E23] font-serif">Workshops</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1 text-left">Browse sessions and see their scheduled times.</p>
                </div>
                <div className="relative group"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4563AD] transition-colors" size={20} /><input type="text" placeholder="Search topics or speakers..." className="w-full pl-14 p-5 rounded-[2rem] border border-gray-100 bg-white outline-none focus:ring-4 focus:ring-[#4563AD]/5 focus:border-[#4563AD]/20 font-medium transition-all shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="grid grid-cols-1 gap-4 text-left">
                  {filteredWorkshops.map((w) => (
                    <div key={`w-list-${w.id}`} onClick={() => setSelectedWorkshopId(w.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-[#E8BA21]/30 hover:shadow-md cursor-pointer active:scale-[0.99] transition-all group flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-extrabold text-xl text-gray-900 leading-tight group-hover:text-[#4563AD] transition-colors">{w.title}</h3>
                          <p className="text-[#ED4E23] text-sm font-bold uppercase tracking-wider">{w.speaker}</p>
                        </div>
                        {w.category && <p className="text-[#4563AD] text-[9px] font-extrabold uppercase tracking-widest bg-[#4563AD]/5 inline-block px-2.5 py-0.5 rounded-full border border-[#4563AD]/10 whitespace-nowrap ml-2">{w.category}</p>}
                      </div>

                      {w.sessions && w.sessions.length > 0 ? (
                        <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 gap-2">
                          {w.sessions.map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 tracking-tighter">
                                <Clock size={11} className="text-[#E8BA21]" />
                                <span>{s.day} {s.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-400 tracking-tighter truncate">
                                <MapPin size={11} className="text-[#4563AD]" />
                                <span className="truncate">{s.room}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Times to be confirmed</p>
                      )}
                    </div>
                  ))}
                  {filteredWorkshops.length === 0 && <div className="text-center py-20 text-gray-400 font-medium italic">No workshops found matching that search.</div>}
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
