'use strict';

// Tour product IDs:  5, 6, 7, 8  → 1-day tours
//                    9,10,11,12  → 2-day-1-night tours
// Car model IDs:  1=Fortuner 7-seat | 2=Transit 16-seat
//                 3=County 29-seat  | 4=Universe 45-seat
// Table name:  price_list  (NOT price_lists)

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = new Date();

    // ── PRODUCTS (tour, ids 5–12) ──────────────────────────────────────────
    await queryInterface.bulkInsert('products', [

      // ══ 1-DAY TOURS ═══════════════════════════════════════════════════════

      // id=5 ─ Da Nang City Tour (1 day)
      {
        id: 5, category_id: 2,
        product_name: 'Da Nang City Tour – 1 Day',
        description: 'Explore the highlights of Da Nang in one day: Linh Ung Pagoda on Son Tra Peninsula, Love Lock Bridge, APEC Park, Museum of Cham Sculpture, and Marble Mountains.',
        address: 'Da Nang',
        image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Da Nang City Highlights',
            items: [
              { time: '07:30', desc: 'Driver and guide pick up guests at hotel lobby. Depart for Da Nang city sightseeing.' },
              { time: '08:00', desc: 'Visit Linh Ung Pagoda on Son Tra Peninsula — home to the 67-metre Lady Buddha statue with panoramic ocean views.' },
              { time: '09:30', desc: 'Stop at Love Lock Bridge for photos, admire Dragon Bridge and Han River from the bank.' },
              { time: '10:30', desc: 'Visit APEC Park featuring the iconic kite-shaped sculpture and exhibition hall.' },
              { time: '11:30', desc: 'Explore the Museum of Cham Sculpture — one of the world\'s finest collections of Champa artefacts and Sa Huynh relics.' },
              { time: '12:30', desc: 'Lunch at a local restaurant — enjoy Quang Noodles and Pork Roll Rice Paper (Bánh Tráng Cuốn Thịt Heo).' },
              { time: '13:30', desc: 'Depart for Marble Mountains (Ngu Hanh Son). Guide shares the area\'s wartime history.' },
              { time: '14:00', desc: 'Stroll through Non Nuoc Stone Carving Village, browse intricate marble sculptures.' },
              { time: '14:20', desc: 'Climb Thuong Thai, Trung Thai, and Ha Thai peaks. Explore caves and visit the oldest Linh Ung Pagoda in Da Nang.' },
              { time: '16:15', desc: 'Return to hotel. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=6 ─ Da Nang – Hoi An (1 day, afternoon/evening)
      {
        id: 6, category_id: 2,
        product_name: 'Da Nang & Hoi An Evening Tour – 1 Day',
        description: 'An afternoon at Linh Ung Pagoda and Marble Mountains, followed by a magical evening stroll through Hoi An Ancient Town and a lantern-releasing experience on the Hoai River.',
        address: 'Da Nang → Hoi An',
        image_url: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Da Nang & Hoi An Ancient Town',
            items: [
              { time: '13:30', desc: 'Driver and guide pick up guests at agreed meeting point. Head to Son Tra Peninsula.' },
              { time: '14:00', desc: 'Visit Linh Ung Pagoda — the largest temple in Da Nang, home to the tallest Lady Buddha statue in Vietnam.' },
              { time: '15:30', desc: 'Arrive at Marble Mountains (Ngu Hanh Son) — a cluster of five limestone peaks.' },
              { time: '16:00', desc: 'Visit Linh Ung Non Nuoc Pagoda, Tam Thai Temple, and explore Huyen Khong and Tang Chon caves.' },
              { time: '17:00', desc: 'Wander through Non Nuoc Stone Carving Village, over 300 years of artisan tradition.' },
              { time: '17:30', desc: 'Drive to Hoi An Ancient Town — UNESCO World Heritage Site.' },
              { time: '18:00', desc: 'Evening stroll along the ancient streets; visit Japanese Covered Bridge (Chua Cau) — symbol of Hoi An.' },
              { time: '18:30', desc: 'Dinner at a renowned Hoi An restaurant (local specialties).' },
              { time: '19:00', desc: 'Explore Tan Ky Old House, Cantonese Assembly Hall, lantern street, and night market.' },
              { time: '20:00', desc: 'Optional: bai choi folk singing performance; release flower lanterns on the Hoai River (own expense).' },
              { time: '21:00', desc: 'Board vehicle back to Da Nang. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=7 ─ Ba Na Hills (1 day)
      {
        id: 7, category_id: 2,
        product_name: 'Ba Na Hills Full-Day Tour – 1 Day',
        description: 'A full day at Ba Na Hills: Le Jardin D\'Amour flower garden, the iconic Golden Bridge held by giant stone hands, Moon Castle, French Village, and Fantasy Park indoor entertainment.',
        address: 'Ba Na Hills, Da Nang',
        image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Ba Na Hills Adventure',
            items: [
              { time: '07:30', desc: 'Driver and guide pick up guests from Da Nang hotel. Depart for Ba Na Hills.' },
              { time: '08:30', desc: 'Arrive at main gate. Guide handles ticketing. Board cable car — a 20-minute scenic ride over pristine rainforest.' },
              { time: '08:45', desc: 'Enjoy the cable car journey as you feel the temperature drop across altitudinal zones.' },
              { time: '09:15', desc: 'Visit Le Jardin D\'Amour — a stunning terraced flower garden showcasing blooms from around the world.' },
              { time: '09:45', desc: 'Walk the famous Golden Bridge at 1,400 m altitude — supported by two giant moss-covered stone hands.' },
              { time: '10:15', desc: 'Visit Linh Ung Pagoda on the summit of Chua Mountain.' },
              { time: '10:45', desc: 'Take the cog railway to Moon Castle; enjoy a live artistic performance.' },
              { time: '11:15', desc: 'Walk from Moon Castle to Eclipse Square — perfect for cloud-chasing photos.' },
              { time: '11:45', desc: 'Buffet lunch at Ba Na Hills\' 5-star restaurant (nearly 200 Asian and European dishes).' },
              { time: '13:00', desc: 'Explore the romantic French Village — modelled on 19th-century European architecture.' },
              { time: '13:30', desc: 'Enter Fantasy Park — Vietnam\'s largest indoor amusement park.' },
              { time: '15:00', desc: 'Free time to explore the summit and take photos.' },
              { time: '15:30', desc: 'Board cable car down. Vehicle returns guests to Da Nang.' },
              { time: '17:00', desc: 'Drop-off at original pick-up point. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=8 ─ Nui Than Tai Hot Spring Park (1 day)
      {
        id: 8, category_id: 2,
        product_name: 'Than Tai Hot Spring Park – 1 Day',
        description: 'Experience Vietnam\'s largest natural hot-spring water park: wild slides, lazy river, natural mineral pools, an egg-boiling lake, and a dinosaur park — all in one day.',
        address: 'Than Tai Mountain, Da Nang',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Than Tai Hot Spring Adventure',
            items: [
              { time: '07:30', desc: 'Driver and guide pick up guests at hotel. Depart for Than Tai Hot Spring Park.' },
              { time: '08:30', desc: 'Arrive at park entrance. Store luggage; begin exploration.' },
              { time: '08:45', desc: 'Electric buggy transfers the group to the water park area. Enjoy water-jet massage pools and exhilarating water slides.' },
              { time: '10:00', desc: 'Float along the lazy river; explore Long Tien cave; relax in the Ficus massage pool.' },
              { time: '11:00', desc: 'Soak in natural mineral hot-spring pools — renowned for their health benefits.' },
              { time: '12:00', desc: 'Lunch and rest at Rong Do Restaurant inside the park.' },
              { time: '13:00', desc: 'Visit the natural egg-boiling lake — a unique volcanic geo-thermal feature (own expense for eggs).' },
              { time: '13:30', desc: 'Explore the Dinosaur Park — life-size moving animatronic dinosaurs with realistic sounds.' },
              { time: '14:00', desc: 'Visit Son Than Temple, the Di Lac Buddha statue, the Long Quy statue, and Vietnam\'s largest natural stone bathtub.' },
              { time: '15:30', desc: 'Group assembles to exit. Than Tai tour concludes.' },
              { time: '16:30', desc: 'Return vehicle drops guests at original pick-up point. Farewell!' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // ══ 2-DAY 1-NIGHT TOURS ═══════════════════════════════════════════════

      // id=9 ─ 2D1N Da Nang – Hoi An – Ba Na Hills
      {
        id: 9, category_id: 2,
        product_name: 'Da Nang – Hoi An – Ba Na Hills – 2 Days 1 Night',
        description: 'Day 1: Son Tra Peninsula, Marble Mountains, Hoi An Ancient Town by night. Day 2: Full-day Ba Na Hills — Golden Bridge, Moon Castle, and Fantasy Park.',
        address: 'Da Nang → Hoi An → Ba Na Hills',
        image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Son Tra · Marble Mountains · Hoi An',
            items: [
              { time: '11:00', desc: 'Vehicle picks up guests at Da Nang Airport. Transfer to hotel for check-in (lunch at own expense).' },
              { time: '13:30', desc: 'Visit Linh Ung Pagoda on Son Tra Peninsula — sweeping views over Da Nang.' },
              { time: '15:00', desc: 'Marble Mountains: climb 108 stone steps to the summit of Thuy Son peak; visit Linh Ung Pagoda.' },
              { time: '16:00', desc: 'Explore Xa Loi Tower, Vong Hai Dai, Tam Thai Temple, Tang Chon and Huyen Khong caves.' },
              { time: '17:00', desc: 'Walk through Non Nuoc Stone Carving Village — nearly 300 years of craftsmanship.' },
              { time: '17:30', desc: 'Drive to Hoi An Ancient Town.' },
              { time: '18:00', desc: 'Dinner at an Old Town restaurant (Hoi An specialties).' },
              { time: '19:00', desc: 'Evening walk: Japanese Covered Bridge, Phuc Kien Assembly Hall, Tan Ky Old House, lantern street.' },
              { time: '20:00', desc: 'Free time: bai choi folk music, Hoai River lantern release, night market shopping (own expense).' },
              { time: '20:30', desc: 'Group boards vehicle back to Da Nang for overnight rest.' }
            ]
          },
          {
            day: 2, label: 'Day 2 — Ba Na Hills',
            items: [
              { time: '07:00', desc: 'Breakfast at hotel. Vehicle departs for Ba Na Hills with guide.' },
              { time: '08:45', desc: 'Guide collects tickets. Board cable car — world-record single-wire run over lush rainforest.' },
              { time: '09:00', desc: 'Ride cog railway; visit Le Jardin D\'Amour and Linh Ung Ba Na Pagoda.' },
              { time: '10:00', desc: 'Walk the Golden Bridge at 1,400 m — held by giant stone hands for iconic photos.' },
              { time: '10:30', desc: 'Explore Moon Castle and Eclipse Square.' },
              { time: '12:00', desc: 'Buffet lunch at the 4-star hilltop restaurant.' },
              { time: '13:30', desc: 'Stroll through the French Village — charming 19th-century European-style architecture.' },
              { time: '14:00', desc: 'Enjoy Fantasy Park — over 100 rides and games for all ages.' },
              { time: '16:00', desc: 'Board cable car down. Vehicle transfers guests to airport. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=10 ─ 2D1N Da Nang – Hoi An – Than Tai
      {
        id: 10, category_id: 2,
        product_name: 'Da Nang – Hoi An – Than Tai Hot Spring – 2 Days 1 Night',
        description: 'Day 1: Son Tra Peninsula, Marble Mountains, and Hoi An Ancient Town by night. Day 2: Relax in natural mineral hot springs and explore Than Tai Mountain Park.',
        address: 'Da Nang → Hoi An → Than Tai',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Son Tra · Marble Mountains · Hoi An',
            items: [
              { time: '11:00', desc: 'Vehicle picks up guests at Da Nang Airport. Transfer to hotel for check-in.' },
              { time: '13:30', desc: 'Visit Linh Ung Pagoda on Son Tra Peninsula.' },
              { time: '15:00', desc: 'Marble Mountains: climb Thuy Son peak (108 stone steps).' },
              { time: '16:00', desc: 'Visit Xa Loi Tower, Tam Thai Temple, Tang Chon and Huyen Khong caves.' },
              { time: '17:00', desc: 'Non Nuoc Stone Carving Village walk.' },
              { time: '17:30', desc: 'Drive to Hoi An Ancient Town.' },
              { time: '18:00', desc: 'Dinner at a local restaurant featuring Hoi An specialties.' },
              { time: '19:00', desc: 'Evening stroll: Japanese Covered Bridge, Phuc Kien Assembly Hall, lantern street.' },
              { time: '20:00', desc: 'Free time: lantern release, night market at Nguyen Hoang Street (own expense).' },
              { time: '20:30', desc: 'Return to Da Nang for overnight rest.' }
            ]
          },
          {
            day: 2, label: 'Day 2 — Than Tai Hot Spring Park',
            items: [
              { time: '08:00', desc: 'Breakfast at hotel. Vehicle departs for Than Tai Hot Spring Park.' },
              { time: '09:00', desc: 'Arrive at park; store bags. Electric buggy to water park zone.' },
              { time: '10:00', desc: 'Water park fun: slides, splash jets, wave pool.' },
              { time: '11:30', desc: 'Buffet lunch at Rong Do Restaurant.' },
              { time: '13:30', desc: 'Natural mineral hot-spring soak — therapeutic and relaxing.' },
              { time: '14:30', desc: 'Dinosaur Park, Di Lac Buddha shrine, Son Than Temple, natural egg-boiling lake.' },
              { time: '16:00', desc: 'Vehicle returns guests to Da Nang city centre / airport. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=11 ─ 2D1N Da Nang – Hoi An – Cu Lao Cham Island
      {
        id: 11, category_id: 2,
        product_name: 'Da Nang – Hoi An – Cu Lao Cham Island – 2 Days 1 Night',
        description: 'Day 1: Son Tra Peninsula, Marble Mountains, and Hoi An Ancient Town. Day 2: Speedboat to Cu Lao Cham Marine Reserve — coral reef snorkelling and pristine beach swimming.',
        address: 'Da Nang → Hoi An → Cu Lao Cham Island',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Son Tra · Marble Mountains · Hoi An',
            items: [
              { time: '11:00', desc: 'Vehicle picks up guests at Da Nang Airport. Hotel check-in (lunch at own expense).' },
              { time: '13:30', desc: 'Visit Linh Ung Pagoda on Son Tra Peninsula.' },
              { time: '15:00', desc: 'Marble Mountains (Ngu Hanh Son): climb Thuy Son peak — 108 stone steps.' },
              { time: '16:00', desc: 'Explore Xa Loi Tower, Vong Hai Dai lookout, Tam Thai Temple, Tang Chon and Huyen Khong caves.' },
              { time: '17:00', desc: 'Non Nuoc Stone Carving Village.' },
              { time: '17:30', desc: 'Drive to Hoi An Ancient Town.' },
              { time: '18:00', desc: 'Dinner; experience Hoi An\'s signature White Rose dumplings and Cao Lau noodles.' },
              { time: '19:00', desc: 'Evening walk: Japanese Covered Bridge, Phuc Kien Assembly Hall, lantern street stroll.' },
              { time: '20:00', desc: 'Free time: bai choi folk singing, Hoai River lantern release, Nguyen Hoang night market (own expense).' },
              { time: '20:30', desc: 'Return to Da Nang for overnight rest.' }
            ]
          },
          {
            day: 2, label: 'Day 2 — Cu Lao Cham Marine Reserve',
            items: [
              { time: '08:00', desc: 'Breakfast at hotel. Vehicle departs for Cua Dai Pier, Hoi An.' },
              { time: '08:45', desc: 'Guide completes departure formalities. Guests board high-speed speedboat.' },
              { time: '09:00', desc: 'Speedboat docks at Lang Village Pier. Visit the Marine Conservation Zone, ancient Champa Well, and Hai Tang Pagoda.' },
              { time: '10:30', desc: 'Speedboat to Bai Ong Eco Zone — change into swimwear and head to Hon Dai for coral reef snorkelling.' },
              { time: '11:30', desc: 'Lunch at beachside restaurant with fresh Cu Lao Cham seafood specialties.' },
              { time: '14:00', desc: 'Free time: swimming, beach photography, hammock relaxation.' },
              { time: '15:00', desc: 'Speedboat returns to Cua Dai Pier. Vehicle takes guests back to Da Nang / airport. Farewell!' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // id=12 ─ 2D1N Da Nang – Hoi An – Hue Imperial City
      {
        id: 12, category_id: 2,
        product_name: 'Da Nang – Hoi An – Hue Imperial City – 2 Days 1 Night',
        description: 'Day 1: Son Tra Peninsula, Marble Mountains, and Hoi An Ancient Town by night. Day 2: Journey to the ancient imperial capital of Hue — Khai Dinh Mausoleum, Imperial Citadel, and Thien Mu Pagoda.',
        address: 'Da Nang → Hoi An → Hue',
        image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Day 1 — Son Tra · Marble Mountains · Hoi An',
            items: [
              { time: '11:00', desc: 'Vehicle picks up guests at Da Nang Airport. Transfer to hotel for check-in.' },
              { time: '13:30', desc: 'Visit Linh Ung Pagoda on Son Tra Peninsula.' },
              { time: '15:00', desc: 'Marble Mountains: climb Thuy Son peak (108 stone steps).' },
              { time: '16:00', desc: 'Visit Xa Loi Tower, Vong Hai Dai, Tam Thai Temple, Tang Chon and Huyen Khong caves.' },
              { time: '17:00', desc: 'Non Nuoc Stone Carving Village.' },
              { time: '17:30', desc: 'Drive to Hoi An Ancient Town.' },
              { time: '18:00', desc: 'Dinner — savour Hoi An\'s most beloved dishes.' },
              { time: '19:00', desc: 'Evening walk: Japanese Covered Bridge, Phuc Kien Assembly Hall, lantern street.' },
              { time: '20:00', desc: 'Free time: bai choi folk singing, Hoai River lantern release (own expense).' },
              { time: '20:30', desc: 'Return to Da Nang for overnight rest.' }
            ]
          },
          {
            day: 2, label: 'Day 2 — Hue Imperial Capital',
            items: [
              { time: '07:00', desc: 'Breakfast at hotel. Vehicle departs north along the coast toward Hue.' },
              { time: '09:00', desc: 'Admire Lang Co Bay from the mountain pass; visit a pearl jewellery exhibition.' },
              { time: '10:00', desc: 'Khai Dinh Mausoleum — the most elaborate and ornate royal mausoleum of the Nguyen Dynasty.' },
              { time: '11:30', desc: 'Lunch at a Hue restaurant (try Bun Bo Hue and royal Hue cuisine).' },
              { time: '13:30', desc: 'Imperial Citadel (Dai Noi): Ngo Mon Gate, Thai Hoa Palace, Dien Tho Palace, Flag Tower.' },
              { time: '15:00', desc: 'Thien Mu Pagoda — 21-metre Phuoc Duyen tower overlooking the romantic Perfume River.' },
              { time: '16:00', desc: 'Return journey to Da Nang. Drop-off at airport or hotel. Tour ends.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      }

    ], {});

    // ── PRICE LIST – products 5–12 × all car models 1–4 ──────────────────
    // Table: price_list (singular, no trailing 's')
    await queryInterface.bulkInsert('price_list', [

      // Product 5 – Da Nang City 1D
      { product_id: 5, model_id: 1, price:  600000, created_at: t, updated_at: t },
      { product_id: 5, model_id: 2, price:  900000, created_at: t, updated_at: t },
      { product_id: 5, model_id: 3, price: 1400000, created_at: t, updated_at: t },
      { product_id: 5, model_id: 4, price: 2200000, created_at: t, updated_at: t },

      // Product 6 – Da Nang & Hoi An Evening 1D
      { product_id: 6, model_id: 1, price:  700000, created_at: t, updated_at: t },
      { product_id: 6, model_id: 2, price: 1000000, created_at: t, updated_at: t },
      { product_id: 6, model_id: 3, price: 1600000, created_at: t, updated_at: t },
      { product_id: 6, model_id: 4, price: 2500000, created_at: t, updated_at: t },

      // Product 7 – Ba Na Hills 1D
      { product_id: 7, model_id: 1, price:  750000, created_at: t, updated_at: t },
      { product_id: 7, model_id: 2, price: 1100000, created_at: t, updated_at: t },
      { product_id: 7, model_id: 3, price: 1800000, created_at: t, updated_at: t },
      { product_id: 7, model_id: 4, price: 2800000, created_at: t, updated_at: t },

      // Product 8 – Than Tai Hot Spring 1D
      { product_id: 8, model_id: 1, price:  650000, created_at: t, updated_at: t },
      { product_id: 8, model_id: 2, price:  950000, created_at: t, updated_at: t },
      { product_id: 8, model_id: 3, price: 1500000, created_at: t, updated_at: t },
      { product_id: 8, model_id: 4, price: 2300000, created_at: t, updated_at: t },

      // Product 9 – Da Nang – Hoi An – Ba Na Hills 2D1N
      { product_id: 9, model_id: 1, price: 1800000, created_at: t, updated_at: t },
      { product_id: 9, model_id: 2, price: 2800000, created_at: t, updated_at: t },
      { product_id: 9, model_id: 3, price: 4500000, created_at: t, updated_at: t },
      { product_id: 9, model_id: 4, price: 6500000, created_at: t, updated_at: t },

      // Product 10 – Da Nang – Hoi An – Than Tai 2D1N
      { product_id: 10, model_id: 1, price: 1600000, created_at: t, updated_at: t },
      { product_id: 10, model_id: 2, price: 2600000, created_at: t, updated_at: t },
      { product_id: 10, model_id: 3, price: 4200000, created_at: t, updated_at: t },
      { product_id: 10, model_id: 4, price: 6200000, created_at: t, updated_at: t },

      // Product 11 – Da Nang – Hoi An – Cu Lao Cham 2D1N
      { product_id: 11, model_id: 1, price: 1700000, created_at: t, updated_at: t },
      { product_id: 11, model_id: 2, price: 2700000, created_at: t, updated_at: t },
      { product_id: 11, model_id: 3, price: 4300000, created_at: t, updated_at: t },
      { product_id: 11, model_id: 4, price: 6300000, created_at: t, updated_at: t },

      // Product 12 – Da Nang – Hoi An – Hue 2D1N
      { product_id: 12, model_id: 1, price: 2000000, created_at: t, updated_at: t },
      { product_id: 12, model_id: 2, price: 3200000, created_at: t, updated_at: t },
      { product_id: 12, model_id: 3, price: 5000000, created_at: t, updated_at: t },
      { product_id: 12, model_id: 4, price: 7500000, created_at: t, updated_at: t },

    ], {});

    // ── TOUR BOOKINGS ────────────────────────────────────────────────────────
    const T1 = '10000000-0000-0000-0000-000000000006'; // Ba Na Hills 1D – COMPLETED
    const T2 = '10000000-0000-0000-0000-000000000007'; // City Tour 1D   – CONFIRMED
    const T3 = '10000000-0000-0000-0000-000000000008'; // 2D1N Hoi An+BaNa – PENDING

    await queryInterface.bulkInsert('bookings', [
      // T1 – Nguyễn Văn An | Ba Na Hills 1D | 16-seat Transit | car 1 | COMPLETED
      {
        id: T1,
        customer_id: '00000000-0000-0000-0000-000000000002',
        product_id: 7, model_id: 2, car_id: 1,
        driver_id: '00000000-0000-0000-0000-000000000011',
        start_time: new Date('2026-04-10T07:30:00'),
        end_time:   new Date('2026-04-10T17:00:00'),
        total_price: 1100000, status: 'COMPLETED',
        additional_data: JSON.stringify({
          pickup_location: 'Novotel Premier Han River Hotel lobby',
          contact_name: 'Nguyễn Văn An', contact_phone: '0901000002',
          num_passengers: 14
        }),
        created_at: new Date(), updated_at: new Date()
      },
      // T2 – Lê Minh Cường | Da Nang City Tour 1D | 16-seat Transit | car 2 | CONFIRMED
      {
        id: T2,
        customer_id: '00000000-0000-0000-0000-000000000004',
        product_id: 5, model_id: 2, car_id: 2,
        driver_id: '00000000-0000-0000-0000-000000000012',
        start_time: new Date('2026-06-10T07:30:00'),
        end_time:   new Date('2026-06-10T16:30:00'),
        total_price: 900000, status: 'CONFIRMED',
        additional_data: JSON.stringify({
          pickup_location: 'Fusion Suites Da Nang Beach Hotel lobby',
          contact_name: 'Lê Minh Cường', contact_phone: '0901000004',
          num_passengers: 13
        }),
        created_at: new Date(), updated_at: new Date()
      },
      // T3 – Trần Thị Bình | 2D1N Hoi An + Ba Na | 29-seat County | no car yet | PENDING
      {
        id: T3,
        customer_id: '00000000-0000-0000-0000-000000000003',
        product_id: 9, model_id: 3, car_id: null, driver_id: null,
        start_time: new Date('2026-06-15T11:00:00'),
        end_time:   new Date('2026-06-16T16:00:00'),
        total_price: 4500000, status: 'PENDING',
        additional_data: JSON.stringify({
          pickup_location: 'Da Nang International Airport',
          contact_name: 'Trần Thị Bình', contact_phone: '0901000003',
          num_passengers: 25
        }),
        created_at: new Date(), updated_at: new Date()
      },
    ], {});

    // ── TOUR PAYMENTS ────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('payments', [
      // T1 completed – 30% of 1,100,000
      { id: '20000000-0000-0000-0000-000000000005',
        booking_id: T1, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-005', amount: 330000,
        status: 'SUCCESS', created_at: new Date(), updated_at: new Date() },
      // T2 confirmed – 30% of 900,000
      { id: '20000000-0000-0000-0000-000000000006',
        booking_id: T2, payment_method: 'VNPAY',
        transaction_code: 'VNPAY-SEED-006', amount: 270000,
        status: 'SUCCESS', created_at: new Date(), updated_at: new Date() },
    ], {});

    // ── TOUR REVIEWS (only COMPLETED tour booking) ───────────────────────────
    await queryInterface.bulkInsert('reviews', [
      {
        booking_id: T1,
        customer_id: '00000000-0000-0000-0000-000000000002',
        rating: 5,
        comment: 'Ba Na Hills was absolutely breathtaking! The Golden Bridge views were stunning and the driver was on time. A perfect day out — highly recommended!',
        created_at: new Date(), updated_at: new Date()
      },
    ], {});

    // ── TOUR NOTIFICATIONS ───────────────────────────────────────────────────
    await queryInterface.bulkInsert('notifications', [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        content: 'New 2-day tour booking from Trần Thị Bình (Da Nang – Hoi An – Ba Na Hills) is awaiting car assignment.',
        is_read: false, created_at: new Date(), updated_at: new Date()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000002',
        content: 'Your Ba Na Hills tour has been completed. We hope you had an amazing experience — please leave us a review!',
        is_read: true, created_at: new Date(), updated_at: new Date()
      },
    ], {});
  },

  // ── DOWN ──────────────────────────────────────────────────────────────────
  async down(queryInterface, Sequelize) {
    const tourBookingIds = [
      '10000000-0000-0000-0000-000000000006',
      '10000000-0000-0000-0000-000000000007',
      '10000000-0000-0000-0000-000000000008',
    ];
    const tourPaymentIds = [
      '20000000-0000-0000-0000-000000000005',
      '20000000-0000-0000-0000-000000000006',
    ];
    const tourProductIds = [5, 6, 7, 8, 9, 10, 11, 12];

    await queryInterface.bulkDelete('notifications',
      { content: { [Sequelize.Op.like]: '%tour%' } }, {});
    await queryInterface.bulkDelete('reviews',
      { booking_id: tourBookingIds }, {});
    await queryInterface.bulkDelete('payments',
      { id: tourPaymentIds }, {});
    await queryInterface.bulkDelete('bookings',
      { id: tourBookingIds }, {});
    await queryInterface.bulkDelete('price_list',
      { product_id: tourProductIds }, {});
    await queryInterface.bulkDelete('products',
      { id: tourProductIds }, {});
  }
};
