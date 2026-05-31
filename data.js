// Perks Finder — data layer (browser + Node.js compatible)

const PROGRAMS = {
  rewardgateway:    { id: 'rewardgateway',     name: 'Work RewardGateway' },
  nrma:             { id: 'nrma',              name: 'NRMA' },
  bupa:             { id: 'bupa',              name: 'Bupa' },
  qantas_shopping:  { id: 'qantas_shopping',   name: 'Qantas Shopping Portal' },
  qantas_money:     { id: 'qantas_money',      name: 'Qantas FF Card (Qantas Money)' },
  westpac_altitude: { id: 'westpac_altitude',  name: 'Westpac Altitude Qantas Black' },
  commbank_yello:   { id: 'commbank_yello',    name: 'CommBank CC (Yello)' },
  everyday_rewards: { id: 'everyday_rewards',  name: 'Everyday Rewards' },
  velocity_ff:      { id: 'velocity_ff',        name: 'Velocity FF' },
  velocity_shopping:{ id: 'velocity_shopping',  name: 'Velocity Shopping Portal' },
};

const REQUIRED_MERCHANT_FIELDS = ['id', 'name', 'program', 'category', 'discount', 'description', 'deepLink', 'addedAt'];

const SEED_MERCHANTS = {
  rewardgateway: [
    {
      id: 'woolworths-rewardgateway',
      name: 'Woolworths',
      program: 'rewardgateway',
      category: 'Grocery',
      discount: '5% off Woolworths eGift Cards',
      description: 'Woolworths is Australia\'s largest supermarket chain with thousands of stores nationally. Through Work RewardGateway, employees can purchase Woolworths eGift Cards at a 5% discount, usable for groceries, petrol at Woolworths-affiliated stations, and online orders at woolworths.com.au.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'jb-hi-fi-rewardgateway',
      name: 'JB Hi-Fi',
      program: 'rewardgateway',
      category: 'Electronics',
      discount: '5% off JB Hi-Fi eGift Cards',
      description: 'JB Hi-Fi is Australia\'s largest consumer electronics and home entertainment retailer with over 200 stores. Through Work RewardGateway, employees can purchase JB Hi-Fi eGift Cards at a 5% discount, redeemable on TVs, laptops, phones, gaming consoles, and appliances.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'myer-rewardgateway',
      name: 'Myer',
      program: 'rewardgateway',
      category: 'Department Store',
      discount: 'Up to 10% off Myer eGift Cards',
      description: 'Myer is Australia\'s largest department store chain offering fashion, homewares, cosmetics, toys, and electrical goods. Through Work RewardGateway, employees can access Myer eGift Cards at up to 10% off, redeemable in-store and online across all Myer product categories.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'hoyts-rewardgateway',
      name: 'Hoyts',
      program: 'rewardgateway',
      category: 'Entertainment',
      discount: 'Discounted movie tickets from $12',
      description: 'Hoyts is one of Australia\'s largest cinema chains operating multiplex cinemas in major cities. Through Work RewardGateway, employees can purchase discounted Hoyts tickets from $12, well below the standard adult price of $25–$28, valid for standard, premium, and Xtremescreen sessions.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'coles-rewardgateway',
      name: 'Coles',
      program: 'rewardgateway',
      category: 'Grocery',
      discount: '5% off Coles eGift Cards',
      description: 'Coles is one of Australia\'s two largest supermarket chains. Through Work RewardGateway, employees can purchase Coles eGift Cards at a 5% discount, usable at Coles supermarkets, Coles Online, Coles Express service stations, and Liquorland stores.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  nrma: [
    {
      id: 'budget-nrma',
      name: 'Budget Car Rental',
      program: 'nrma',
      category: 'Travel',
      discount: 'Up to 25% off car rental rates',
      description: 'Budget Car Rental is a major international car rental company with locations across Australian airports and cities. NRMA members receive up to 25% off Budget standard rental rates across economy, mid-size, SUV, and van categories for both leisure and business rentals.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'bridgestone-nrma',
      name: 'Bridgestone',
      program: 'nrma',
      category: 'Automotive',
      discount: '10% off tyres and auto services',
      description: 'Bridgestone is one of the world\'s largest tyre manufacturers with a large network of Select auto service centres across Australia. NRMA members receive 10% off Bridgestone and Firestone tyres plus auto servicing including wheel alignments, balancing, brake inspections, and battery replacements.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'thrifty-nrma',
      name: 'Thrifty Car Rental',
      program: 'nrma',
      category: 'Travel',
      discount: '15% off car rentals',
      description: 'Thrifty Car Rental operates at airports and city locations throughout Australia, offering vehicles from economy sedans to people-movers. NRMA members receive a 15% discount on Thrifty published rates, making it a cost-effective choice for interstate travel and road trips.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'nrma-destinations-nrma',
      name: 'NRMA Destinations & Experiences',
      program: 'nrma',
      category: 'Travel',
      discount: 'Member rates on holiday parks and resorts',
      description: 'NRMA Destinations & Experiences is NRMA\'s own portfolio of holiday parks, resorts, and campsites across NSW, Victoria, and Queensland. Members receive exclusive pricing on powered and unpowered sites, cabins, and resort rooms, often up to 20% below public rates depending on season.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'readymed-nrma',
      name: 'ReadyMED Urgent Care',
      program: 'nrma',
      category: 'Health',
      discount: 'Reduced consultation fees for NRMA members',
      description: 'ReadyMED is an urgent care clinic network offering reduced-fee medical consultations for non-emergency conditions. NRMA members receive reduced out-of-pocket costs, making it a convenient and affordable option for after-hours care without visiting a hospital emergency department.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  bupa: [
    {
      id: 'specsavers-bupa',
      name: 'Specsavers',
      program: 'bupa',
      category: 'Optical',
      discount: 'No-gap eye tests and discounts on frames',
      description: 'Specsavers is Australia\'s leading optical retailer with over 400 stores nationally. Bupa extras members receive no-gap comprehensive eye tests and significant discounts on prescription glasses, frames, and contact lenses. Bupa is a Specsavers preferred provider, meaning higher claim limits and lower out-of-pocket costs.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'fitness-first-bupa',
      name: 'Fitness First',
      program: 'bupa',
      category: 'Health & Fitness',
      discount: 'Discounted gym membership rates for Bupa members',
      description: 'Fitness First is one of Australia\'s largest gym chains with facilities in major cities. Bupa health insurance members are eligible for discounted Fitness First membership rates under the Bupa Advantage program, covering casual visits and ongoing memberships at participating locations.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'terry-white-bupa',
      name: 'Terry White Chemmart',
      program: 'bupa',
      category: 'Pharmacy',
      discount: 'Discounts on selected health and wellness products',
      description: 'Terry White Chemmart is a major Australian pharmacy chain. Bupa members can access exclusive discounts on a range of health and wellness products at Terry White Chemmart locations, including vitamins, supplements, skincare, and personal care items, as part of Bupa\'s preferred provider pharmacy network.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'bupa-dental-bupa',
      name: 'Bupa Dental',
      program: 'bupa',
      category: 'Dental',
      discount: 'No-gap check-ups, clean and X-rays for extras members',
      description: 'Bupa Dental is Bupa\'s own network of dental clinics across Australia. Extras members receive fully covered annual check-ups, cleans, and X-rays at Bupa Dental centres. More complex procedures such as fillings and crowns are also covered at significantly reduced out-of-pocket rates versus non-network dentists.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'fernwood-bupa',
      name: 'Fernwood Fitness',
      program: 'bupa',
      category: 'Health & Fitness',
      discount: 'Discounted membership for female Bupa members',
      description: 'Fernwood Fitness is a women-only gym chain with clubs across Australia. Female Bupa health insurance members can access discounted membership rates at Fernwood through the Bupa Advantage program. Fernwood offers group fitness classes, personal training, and 24-hour access at many locations.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  qantas_shopping: [
    {
      id: 'booking-com-qantas-shopping',
      name: 'Booking.com',
      program: 'qantas_shopping',
      category: 'Travel',
      discount: 'Earn up to 3 Qantas Points per $1 spent',
      description: 'Booking.com is one of the world\'s largest online travel platforms offering hotels, apartments, and villas globally. Clicking through to Booking.com via the Qantas Shopping portal earns Qantas Frequent Flyer members up to 3 Qantas Points for every $1 spent on accommodation.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'apple-store-qantas-shopping',
      name: 'Apple Store',
      program: 'qantas_shopping',
      category: 'Electronics',
      discount: 'Earn 1 Qantas Point per $1 spent',
      description: 'The Apple Store is the official retail channel for all Apple products including iPhone, iPad, Mac, Apple Watch, and AirPods. Qantas Frequent Flyer members earn 1 Qantas Point per $1 spent at Apple when shopping via the Qantas Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'adidas-qantas-shopping',
      name: 'Adidas',
      program: 'qantas_shopping',
      category: 'Sport & Fashion',
      discount: 'Earn 3 Qantas Points per $1 spent',
      description: 'Adidas is a global sportswear brand selling footwear, apparel, and accessories for sport and lifestyle. Qantas Frequent Flyer members earn 3 Qantas Points per $1 spent at adidas.com.au when accessing it through the Qantas Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'ebay-qantas-shopping',
      name: 'eBay',
      program: 'qantas_shopping',
      category: 'General Retail',
      discount: 'Earn 1 Qantas Point per $1 spent',
      description: 'eBay Australia is one of the country\'s largest online marketplaces with millions of new and used items across electronics, clothing, homewares, and collectables. Qantas Frequent Flyer members earn 1 Qantas Point per $1 on eligible eBay purchases via the Qantas Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'catch-qantas-shopping',
      name: 'Catch.com.au',
      program: 'qantas_shopping',
      category: 'General Retail',
      discount: 'Earn 2 Qantas Points per $1 spent',
      description: 'Catch.com.au is a major Australian online retailer offering daily deals and a wide marketplace covering electronics, appliances, clothing, toys, and groceries. Qantas Frequent Flyer members earn 2 Qantas Points per $1 spent at Catch when shopping via the Qantas Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  qantas_money: [
    {
      id: 'woolworths-qantas-money',
      name: 'Woolworths',
      program: 'qantas_money',
      category: 'Grocery',
      discount: 'Earn 1 Qantas Point per $1 spent',
      description: 'Woolworths is a Qantas Frequent Flyer program partner and a key everyday earn opportunity for Qantas Money cardholders. Paying with your Qantas Money card at Woolworths supermarkets or Woolworths Online earns Qantas Points on grocery spend, with bonus points during promotional periods.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'bp-qantas-money',
      name: 'BP',
      program: 'qantas_money',
      category: 'Fuel',
      discount: 'Earn up to 3 Qantas Points per litre of fuel',
      description: 'BP is one of Australia\'s largest fuel retailers with service stations nationwide. Qantas Money cardholders with a linked Frequent Flyer account earn Qantas Points on fuel purchases at BP, with promotional rates of up to 3 points per litre during partner campaigns.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'uber-qantas-money',
      name: 'Uber / Uber Eats',
      program: 'qantas_money',
      category: 'Transport & Food Delivery',
      discount: 'Earn 1 Qantas Point per $1 spent',
      description: 'Uber and Uber Eats are ride-sharing and food delivery platforms available throughout Australia. By linking your Qantas Frequent Flyer account to Uber, you earn 1 Qantas Point per $1 spent on rides and food deliveries, turning everyday transport and takeaway into points.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'qantas-hotels-qantas-money',
      name: 'Qantas Hotels',
      program: 'qantas_money',
      category: 'Travel',
      discount: 'Earn up to 3 Qantas Points per $1 spent',
      description: 'Qantas Hotels is the Qantas Frequent Flyer program\'s own hotel booking platform, powered by Expedia. Members earn up to 3 Qantas Points per $1 on hotel bookings at thousands of properties worldwide. Paying with a Qantas Money card can stack additional earn rates.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'airbnb-qantas-money',
      name: 'Airbnb',
      program: 'qantas_money',
      category: 'Accommodation',
      discount: 'Earn Qantas Points on stays',
      description: 'Airbnb is the world\'s largest platform for short-term accommodation rentals including holiday homes, apartments, and unique stays. Qantas Frequent Flyer members can earn Qantas Points on eligible Airbnb bookings when using a Qantas-earning payment card or booking through Qantas Travel Money.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  westpac_altitude: [
    {
      id: 'qantas-flights-westpac-altitude',
      name: 'Qantas Flights',
      program: 'westpac_altitude',
      category: 'Travel',
      discount: 'Earn Qantas Points on all card spend; bonus points on Qantas flights',
      description: 'The Westpac Altitude Qantas Black card earns Qantas Points on everyday spend, with bonus points when purchasing Qantas flights directly through qantas.com or Qantas contact centres. It is one of the highest-earning Qantas-linked credit cards in Australia with uncapped points accumulation.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'accor-westpac-altitude',
      name: 'Accor Hotels',
      program: 'westpac_altitude',
      category: 'Travel',
      discount: 'Bonus Qantas Points and Accor member rates',
      description: 'Accor is one of the world\'s largest hotel groups, operating Sofitel, Novotel, Mercure, ibis, and MGallery across Australia and globally. Westpac Altitude Qantas Black cardholders earn Qantas Points on Accor stays when booking through eligible channels, and may access Accor Live Limitless member benefits.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'hertz-westpac-altitude',
      name: 'Hertz',
      program: 'westpac_altitude',
      category: 'Car Rental',
      discount: 'Hertz Gold Plus Rewards status and earn Qantas Points',
      description: 'Hertz is a major international car rental company with locations at Australian airports and cities. Westpac Altitude Qantas Black cardholders receive complimentary Hertz Gold Plus Rewards status for expedited service, and earn Qantas Points on Hertz rentals booked with the card.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'qantas-wine-westpac-altitude',
      name: 'Qantas Wine',
      program: 'westpac_altitude',
      category: 'Food & Beverage',
      discount: 'Discounted Qantas Wine Premium membership and earn points on wine purchases',
      description: 'Qantas Wine is the Qantas Frequent Flyer program\'s wine subscription and retail service, offering curated mixed cases and cellar door experiences. Westpac Altitude Qantas Black cardholders may access discounted Qantas Wine Premium membership and earn Qantas Points on wine purchases.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'priority-pass-westpac-altitude',
      name: 'Priority Pass Lounges',
      program: 'westpac_altitude',
      category: 'Travel',
      discount: 'Complimentary airport lounge access worldwide',
      description: 'Priority Pass is the world\'s largest independent airport lounge program, covering over 1,300 lounges in 600+ airports globally. Westpac Altitude Qantas Black cardholders receive complimentary Priority Pass membership with a set number of free lounge visits per year, regardless of airline or ticket class.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  commbank_yello: [
    {
      id: 'menulog-commbank-yello',
      name: 'Menulog',
      program: 'commbank_yello',
      category: 'Food Delivery',
      discount: '5% cashback on orders, up to $10 per month',
      description: 'Menulog is one of Australia\'s largest food delivery platforms, offering delivery from thousands of restaurants nationally. CommBank Yello members receive 5% cashback on Menulog orders each month (capped at $10), credited to the eligible CommBank account within a few business days.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'spotify-commbank-yello',
      name: 'Spotify',
      program: 'commbank_yello',
      category: 'Entertainment',
      discount: 'Discounted Spotify Premium subscription',
      description: 'Spotify is the world\'s most popular music streaming service with over 100 million songs and podcasts. CommBank Yello eligible customers may access a discounted Spotify Premium subscription as one of the rotating Yello benefits, reducing the monthly cost of ad-free, offline-capable streaming.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '7-eleven-commbank-yello',
      name: '7-Eleven',
      program: 'commbank_yello',
      category: 'Fuel & Convenience',
      discount: 'Fuel lock-in discount via 7-Eleven app',
      description: '7-Eleven is a convenience store and fuel retailer chain across Australia. CommBank Yello members can lock in a discounted per-litre fuel price through the 7-Eleven app up to 24 hours before filling up, regardless of price changes at the bowser, when paying with an eligible CommBank card.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'virgin-australia-commbank-yello',
      name: 'Virgin Australia',
      program: 'commbank_yello',
      category: 'Travel',
      discount: 'Cashback or bonus Velocity Points on flight bookings',
      description: 'Virgin Australia is one of Australia\'s two major domestic airlines. CommBank Yello members may access cashback or bonus Velocity Points on Virgin Australia flight bookings when paying with an eligible CommBank credit card, making air travel a higher-value spend category.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'hoyts-commbank-yello',
      name: 'Hoyts',
      program: 'commbank_yello',
      category: 'Entertainment',
      discount: 'Discounted movie tickets for CommBank Yello members',
      description: 'Hoyts is one of Australia\'s largest cinema chains. CommBank Yello members can access discounted Hoyts movie tickets when purchasing through the CommBank app Yello benefits section or using an eligible CommBank card at Hoyts cinemas across Australia.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  everyday_rewards: [
    {
      id: 'woolworths-everyday-rewards',
      name: 'Woolworths Supermarkets',
      program: 'everyday_rewards',
      category: 'Grocery',
      discount: 'Earn 1 point per $1 spent; bonus offers weekly',
      description: 'Woolworths Supermarkets is the founding partner of the Everyday Rewards program. Members earn 1 Everyday Rewards point per $1 spent in store and online. Weekly bonus point offers on selected products can significantly boost earn rates. 2,000 points equals $10 off your next shop.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'big-w-everyday-rewards',
      name: 'BIG W',
      program: 'everyday_rewards',
      category: 'General Retail',
      discount: 'Earn 1 point per $1 spent',
      description: 'BIG W is a discount department store owned by Woolworths Group, selling clothing, toys, electronics, and homewares. Everyday Rewards members earn 1 point per $1 spent at BIG W, which combines with supermarket earn for faster accumulation towards the $10 redemption threshold.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'bws-everyday-rewards',
      name: 'BWS',
      program: 'everyday_rewards',
      category: 'Liquor',
      discount: 'Earn points on beer, wine, and spirits',
      description: 'BWS (Beer Wine Spirits) is Woolworths Group\'s liquor retail chain with stores adjacent to many Woolworths supermarkets. Everyday Rewards members earn points on BWS purchases as part of the Woolworths Group earn ecosystem, with occasional bonus point promotions on selected products.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'dan-murphys-everyday-rewards',
      name: "Dan Murphy's",
      program: 'everyday_rewards',
      category: 'Liquor',
      discount: "Earn points by linking MyDan's and Everyday Rewards",
      description: "Dan Murphy's is Australia's largest liquor retailer and part of the Woolworths Group. By linking your Dan Murphy's MyDan's account with Everyday Rewards, you earn Everyday Rewards points on wine, beer, spirits, and non-alcoholic beverages purchased in store or online.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'everyday-market-everyday-rewards',
      name: 'Everyday Market',
      program: 'everyday_rewards',
      category: 'Online Retail',
      discount: 'Earn points on Everyday Market purchases',
      description: "Everyday Market is Woolworths' online marketplace featuring third-party sellers across homewares, beauty, outdoor, electronics, and more. Everyday Rewards members earn points on eligible orders placed through woolworths.com.au, expanding the point-earning opportunity well beyond groceries.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  velocity_ff: [
    {
      id: 'virgin-australia-velocity-ff',
      name: 'Virgin Australia',
      program: 'velocity_ff',
      category: 'Flights',
      discount: 'Earn 5–10 Velocity Points per $1 spent on flights',
      description: 'Virgin Australia is one of Australia\'s two major domestic airlines and the founding partner of the Velocity Frequent Flyer program. Members earn 5 to 10 Velocity Points per $1 on Virgin Australia flights depending on fare class, with Business Class earning the highest rate. Points redeem for reward flights, upgrades, and partner rewards.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'singapore-airlines-velocity-ff',
      name: 'Singapore Airlines',
      program: 'velocity_ff',
      category: 'Flights',
      discount: 'Earn Velocity Points on Singapore Airlines flights',
      description: 'Singapore Airlines is a global premium carrier and a Velocity Frequent Flyer partner airline. Members can earn Velocity Points on eligible Singapore Airlines flights, particularly on routes connecting Australia to Southeast Asia, Europe, and beyond.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'avis-velocity-ff',
      name: 'Avis',
      program: 'velocity_ff',
      category: 'Car Rental',
      discount: 'Earn Velocity Points on car rentals',
      description: 'Avis is a global car rental company with locations at Australian airports and major city centres. Velocity Frequent Flyer members earn Velocity Points on eligible Avis car rental bookings when entering their Velocity member number at booking. Points are credited after the rental is completed.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'etihad-velocity-ff',
      name: 'Etihad Airways',
      program: 'velocity_ff',
      category: 'Flights',
      discount: 'Earn Velocity Points on Etihad flights',
      description: 'Etihad Airways is the national airline of the UAE and a Velocity Frequent Flyer partner. Members earn Velocity Points on eligible Etihad flights, with routes from Australia to Abu Dhabi, Europe, and the UK being popular for earning. Points credited are based on fare class and distance flown.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'accor-velocity-ff',
      name: 'Accor Hotels',
      program: 'velocity_ff',
      category: 'Accommodation',
      discount: 'Earn Velocity Points on hotel stays',
      description: 'Accor is one of the world\'s largest hotel groups with Sofitel, Pullman, Novotel, Mercure, and ibis properties widely across Australia. Velocity Frequent Flyer members earn Velocity Points on eligible Accor stays when booking with their Velocity number linked, with bonus points during promotional periods.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  velocity_shopping: [
    {
      id: 'ebay-velocity-shopping',
      name: 'eBay',
      program: 'velocity_shopping',
      category: 'General Retail',
      discount: 'Earn up to 3 Velocity Points per $1 spent',
      description: "eBay Australia is one of the country's largest online marketplaces with millions of listings across electronics, fashion, homewares, and collectables. Velocity Frequent Flyer members earn up to 3 Velocity Points per $1 spent on eligible eBay purchases when clicking through from the Velocity Shopping portal.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'the-iconic-velocity-shopping',
      name: 'THE ICONIC',
      program: 'velocity_shopping',
      category: 'Fashion',
      discount: 'Earn up to 4 Velocity Points per $1 spent',
      description: "THE ICONIC is Australia's largest online fashion and lifestyle retailer carrying thousands of brands in clothing, footwear, sportswear, and beauty. Velocity Frequent Flyer members earn up to 4 Velocity Points per $1 spent at THE ICONIC when shopping via the Velocity Shopping portal.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'myer-velocity-shopping',
      name: 'Myer',
      program: 'velocity_shopping',
      category: 'Department Store',
      discount: 'Earn up to 3 Velocity Points per $1 spent',
      description: "Myer is Australia's largest department store chain offering fashion, beauty, homewares, and electrical goods. Velocity Frequent Flyer members earn up to 3 Velocity Points per $1 spent at myer.com.au when accessing Myer via the Velocity Shopping portal.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'expedia-velocity-shopping',
      name: 'Expedia',
      program: 'velocity_shopping',
      category: 'Travel',
      discount: 'Earn up to 3 Velocity Points per $1 spent on hotels and packages',
      description: 'Expedia is a global online travel agency offering flights, hotels, car rentals, and holiday packages. Velocity Frequent Flyer members earn up to 3 Velocity Points per $1 spent on eligible hotel and package bookings at Expedia when clicking through from the Velocity Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'catch-velocity-shopping',
      name: 'Catch.com.au',
      program: 'velocity_shopping',
      category: 'General Retail',
      discount: 'Earn up to 2 Velocity Points per $1 spent',
      description: 'Catch.com.au is a major Australian online retailer offering deals and a marketplace covering electronics, appliances, clothing, beauty, toys, and groceries. Velocity Frequent Flyer members earn up to 2 Velocity Points per $1 spent at Catch when shopping through the Velocity Shopping portal.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
};

function createEmptyData() {
  const programs = {};
  for (const [id, prog] of Object.entries(PROGRAMS)) {
    programs[id] = { id, name: prog.name, merchants: [] };
  }
  return { version: 1, programs };
}

function validateMerchant(m) {
  if (!m || typeof m !== 'object') return false;
  for (const field of REQUIRED_MERCHANT_FIELDS) {
    if (!(field in m) || typeof m[field] !== 'string') return false;
  }
  return true;
}

function validateData(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version !== 1) return false;
  if (!data.programs || typeof data.programs !== 'object') return false;
  for (const prog of Object.values(data.programs)) {
    if (!prog.id || !prog.name || !Array.isArray(prog.merchants)) return false;
    for (const m of prog.merchants) {
      if (!validateMerchant(m)) return false;
    }
  }
  return true;
}

function loadData() {
  try {
    const raw = localStorage.getItem('perks_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateData(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function saveData(data) {
  localStorage.setItem('perks_data', JSON.stringify(data));
}

// Merges incoming into existing. Incoming merchants overwrite existing by id.
// Programs present in existing but absent in incoming are left unchanged.
function mergeData(existing, incoming) {
  const result = JSON.parse(JSON.stringify(existing));
  for (const [progId, incomingProg] of Object.entries(incoming.programs)) {
    if (!result.programs[progId]) {
      result.programs[progId] = { id: progId, name: incomingProg.name, merchants: [] };
    }
    const byId = new Map(result.programs[progId].merchants.map(m => [m.id, m]));
    for (const m of incomingProg.merchants) {
      byId.set(m.id, m);
    }
    result.programs[progId].merchants = Array.from(byId.values());
  }
  return result;
}

function getExportJson() {
  const data = loadData() || createEmptyData();
  return JSON.stringify(data, null, 2);
}

function downloadExport() {
  if (typeof document === 'undefined') return;
  const json = getExportJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perks-backup-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJson(jsonString) {
  let incoming;
  try {
    incoming = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }
  if (!validateData(incoming)) {
    throw new Error('Invalid data structure: must have version:1 and programs object with valid merchants');
  }
  const existing = loadData() || createEmptyData();
  const merged = mergeData(existing, incoming);
  saveData(merged);
  return merged;
}

function preseedIfEmpty() {
  if (loadData()) return false;
  const data = createEmptyData();
  for (const [programId, merchants] of Object.entries(SEED_MERCHANTS)) {
    if (data.programs[programId]) {
      data.programs[programId].merchants = merchants;
    }
  }
  saveData(data);
  return true;
}

function getAllMerchants() {
  const data = loadData();
  if (!data) return [];
  const results = [];
  for (const prog of Object.values(data.programs)) {
    for (const m of prog.merchants) {
      results.push(Object.assign({}, m, { programName: prog.name }));
    }
  }
  return results;
}

function getCategoryList() {
  const cats = new Set(getAllMerchants().map(m => m.category).filter(Boolean));
  return [...cats].sort();
}

function getMerchantsByCategory(category) {
  return getAllMerchants().filter(m => m.category === category);
}

function buildImportPayload(programId, programName, rawText) {
  const timestamp = new Date().toISOString();

  const schemaBlock =
    'Each object must have EXACTLY these fields (all must be strings):\n' +
    '  "id"          — kebab-case slug from the merchant name only. Never include the program name. e.g. "jb-hi-fi", "woolworths", "event-cinemas"\n' +
    '  "name"        — normalised common trading name. e.g. "JB Hi-Fi" not "JB HI-FI GIFT CARDS", "Woolworths" not "WOOLWORTHS SUPERMARKET EGIFT CARD"\n' +
    '  "program"     — must be "' + programId + '"\n' +
    '  "category"    — see rules above\n' +
    '  "discount"    — see rules above\n' +
    '  "description" — see rules above\n' +
    '  "deepLink"    — see rules above\n' +
    '  "addedAt"     — use exactly: "' + timestamp + '"\n\n' +
    'Return ONLY a valid JSON array. No markdown, no code fences, no explanation. Raw JSON only.\n\nTEXT:\n' + rawText;

  let header;

  switch (programId) {
    case 'nrma':
      header =
        'Extract merchant data from the NRMA Member Benefits portal text below.\n\n' +
        'Format: each entry has a merchant name, a description blurb, and two prices — original (strikethrough) and discounted.\n\n' +
        'Field rules:\n' +
        '  "discount"    — calculate % off from the two prices: round((original − discounted) / original × 100), e.g. "15% off (A$45.05 vs A$53.00)"\n' +
        '  "description" — use the blurb text verbatim\n' +
        '  "deepLink"    — empty string (not present in this format)\n' +
        '  "category"    — infer from merchant type, e.g. "Experiences & Attractions", "Wildlife & Zoos", "Dining", "Travel", "Health & Beauty", "Entertainment"\n\n';
      break;

    case 'rewardgateway':
      header =
        'Extract merchant data from the Work RewardGateway portal text below.\n\n' +
        'Format: each entry has a merchant name, a truncated blurb, a discount rate ("Earn X%" or "Save X%"), and a Check offers URL.\n\n' +
        'Field rules:\n' +
        '  "discount"    — e.g. "Earn 9% cashback" or "Save 5%"\n' +
        '  "description" — use the blurb verbatim (truncated is fine)\n' +
        '  "deepLink"    — extract the Check offers URL exactly as it appears\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    case 'bupa':
      header =
        'Extract merchant data from the Bupa Member Benefits portal text below.\n\n' +
        'The paste may contain three formats — handle all of them:\n\n' +
        '1. eGift cards — merchant name, discount %, URL\n' +
        '   "discount": e.g. "4% off eGift card"\n' +
        '   "description": empty string\n' +
        '   "deepLink": extract URL exactly\n' +
        '   "category": "eGift Cards"\n\n' +
        '2. Restaurant dining — price tier ($ signs), merchant name, suburb, discount %, URL\n' +
        '   "discount": e.g. "8% off dining"\n' +
        '   "description": include suburb, e.g. "Located in Sans Souci"\n' +
        '   "deepLink": extract URL exactly\n' +
        '   "category": "Dining"\n\n' +
        '3. Travel offers — prose offer description with embedded URL\n' +
        '   "name": extract merchant name from the description text\n' +
        '   "discount": extract the offer value, e.g. "Save up to $500 on Economy fares", "15% off travel insurance"\n' +
        '   "description": the offer text verbatim\n' +
        '   "deepLink": extract URL exactly\n' +
        '   "category": "Travel"\n\n';
      break;

    case 'qantas_shopping':
      header =
        'Extract merchant data from the Qantas Shopping Portal text below.\n\n' +
        'Format: each entry has a merchant name, points per $1 spent, and an optional promo badge (BONUS POINTS, FREE SHIPPING, etc).\n\n' +
        'Field rules:\n' +
        '  "discount"    — e.g. "4 Qantas pts per $1 spent"\n' +
        '  "description" — include promo badge if present, e.g. "Bonus points offer available"; otherwise empty string\n' +
        '  "deepLink"    — empty string (not present in this format)\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    case 'westpac_altitude':
      header =
        'Extract merchant data from the Westpac Altitude Cashback portal text below.\n\n' +
        'Format: each entry has a merchant name, base cashback %, optional Westpac bonus cashback %, and optional end date.\n\n' +
        'Field rules:\n' +
        '  "discount"    — combine base + bonus if present, e.g. "Up to 7% cashback (incl. 1% Westpac bonus)"; if base only: "3% cashback"\n' +
        '  "description" — include bonus and expiry if present, e.g. "Includes 2% Westpac bonus cashback, ends 30 June 2025"; otherwise empty string\n' +
        '  "deepLink"    — empty string (not present in this format)\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    case 'everyday_rewards':
      header =
        'Extract merchant data from the Everyday Rewards portal text below.\n\n' +
        'Format: linked/unlinked status, merchant name, points rate or specific offer, and deep links.\n\n' +
        'SKIP these points-transfer partners entirely (do not extract them): Westpac, St.George, Bank of Melbourne, BankSA, Amex, ANZ, any Accor property, Qantas Frequent Flyer.\n\n' +
        'Field rules:\n' +
        '  "discount"    — e.g. "1 Everyday Rewards pt per $1 spent", "Save 4c/L on fuel"\n' +
        '  "description" — the offer description verbatim\n' +
        '  "deepLink"    — extract the "Shop now" or "Join and link" URL\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    case 'velocity_ff':
      header =
        'Extract merchant data from the Velocity Frequent Flyer offers page text below.\n\n' +
        'Format: each entry has a merchant name, a fixed point grant (e.g. "10,000 Points"), and a URL.\n\n' +
        'Field rules:\n' +
        '  "discount"    — e.g. "10,000 Velocity pts (one-off)"\n' +
        '  "description" — empty string\n' +
        '  "deepLink"    — extract URL exactly\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    case 'velocity_shopping':
      header =
        'Extract merchant data from the Velocity Shopping portal text below.\n\n' +
        'Format: each entry has a merchant name, points per $1 spent (e.g. "AU$1 = 6 Points"), optional "was X points" bonus context, and a URL.\n\n' +
        'Field rules:\n' +
        '  "discount"    — e.g. "6 Velocity pts per $1 spent"\n' +
        '  "description" — include bonus context if present, e.g. "Currently boosted from 2 pts per $1"; otherwise empty string\n' +
        '  "deepLink"    — extract URL exactly\n' +
        '  "category"    — infer from merchant type\n\n';
      break;

    default:
      header =
        'Extract merchant and perk data from the ' + programName + ' portal text below.\n\n' +
        'Field rules:\n' +
        '  "discount"    — concise benefit description, prefixed with enough context to be self-explanatory\n' +
        '  "description" — verbatim text from the source; empty string if no description is present\n' +
        '  "deepLink"    — URL to the offer page if found, otherwise empty string\n' +
        '  "category"    — infer from merchant type\n\n';
  }

  return {
    model: 'claude-sonnet-4-6',
    max_tokens: 64000,
    messages: [{ role: 'user', content: header + schemaBlock }],
  };
}

function parseExtractedMerchants(content, programId) {
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Could not parse AI response as JSON: ' + e.message);
  }
  if (!Array.isArray(parsed)) {
    throw new Error('AI response is not a JSON array');
  }
  const now = new Date().toISOString();
  const merchants = [];
  let skipped = 0;
  for (const m of parsed) {
    const candidate = Object.assign({}, m, { program: programId, addedAt: now });
    if (validateMerchant(candidate)) {
      merchants.push(candidate);
    } else {
      skipped++;
    }
  }
  return { merchants, skipped };
}

function loadApiKey() {
  return localStorage.getItem('perks_api_key') || '';
}

function saveApiKey(key) {
  localStorage.setItem('perks_api_key', key.trim());
}

function clearApiKey() {
  localStorage.removeItem('perks_api_key');
}

function isInstallBannerDismissed() {
  return localStorage.getItem('perks_install_dismissed') === '1';
}

function dismissInstallBanner() {
  localStorage.setItem('perks_install_dismissed', '1');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROGRAMS,
    REQUIRED_MERCHANT_FIELDS,
    SEED_MERCHANTS,
    createEmptyData,
    validateMerchant,
    validateData,
    loadData,
    saveData,
    mergeData,
    getExportJson,
    downloadExport,
    importFromJson,
    preseedIfEmpty,
    loadApiKey,
    saveApiKey,
    clearApiKey,
    isInstallBannerDismissed,
    dismissInstallBanner,
    getAllMerchants,
    getCategoryList,
    getMerchantsByCategory,
    buildImportPayload,
    parseExtractedMerchants,
  };
}
