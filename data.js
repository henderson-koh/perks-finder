// Perks Finder — data layer (browser + Node.js compatible)

const PROGRAMS = {
  rewardgateway:    { id: 'rewardgateway',     name: 'Work RewardGateway' },
  nrma:             { id: 'nrma',              name: 'NRMA' },
  bupa:             { id: 'bupa',              name: 'Bupa' },
  qantas_shopping:  { id: 'qantas_shopping',   name: 'Qantas Shopping Portal' },
  qantas_money:     { id: 'qantas_money',      name: 'Qantas FF Card (Qantas Money)' },
  bankwest:         { id: 'bankwest',           name: 'Bankwest CC (More Rewards)' },
  westpac_altitude: { id: 'westpac_altitude',  name: 'Westpac Altitude Qantas Black' },
  commbank_yello:   { id: 'commbank_yello',    name: 'CommBank CC (Yello)' },
  everyday_rewards: { id: 'everyday_rewards',  name: 'Everyday Rewards' },
  shopback:         { id: 'shopback',           name: 'ShopBack' },
  jbhifi_perks:     { id: 'jbhifi_perks',      name: 'JB Hi-Fi Perks' },
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

  bankwest: [
    {
      id: 'myer-bankwest',
      name: 'Myer',
      program: 'bankwest',
      category: 'Department Store',
      discount: 'Earn 3x More Rewards points per $1 spent',
      description: 'Myer is Australia\'s largest department store and a bonus earn partner for Bankwest More Rewards credit cards. Cardholders earn 3 More Rewards points per $1 at Myer stores and myer.com.au, well above the standard earn rate. Points can be redeemed for gift cards, merchandise, or transferred to frequent flyer programs.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'flight-centre-bankwest',
      name: 'Flight Centre',
      program: 'bankwest',
      category: 'Travel',
      discount: 'Earn bonus More Rewards points on travel bookings',
      description: 'Flight Centre is Australia\'s largest travel agency chain with stores nationwide and an online booking platform. Bankwest More Rewards cardholders earn bonus points when booking flights, holiday packages, and cruises through Flight Centre, making it one of the more rewarding ways to spend on travel.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'david-jones-bankwest',
      name: 'David Jones',
      program: 'bankwest',
      category: 'Department Store',
      discount: 'Earn 2x More Rewards points per $1 spent',
      description: 'David Jones is a premium Australian department store known for high-quality fashion, beauty, homewares, and food. Bankwest More Rewards cardholders earn 2 More Rewards points per $1 spent at David Jones stores and davidjones.com, above the standard base earn rate.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'woolworths-bankwest',
      name: 'Woolworths',
      program: 'bankwest',
      category: 'Grocery',
      discount: 'Earn More Rewards points on grocery spending',
      description: 'Woolworths supermarkets are a key everyday spend category for Bankwest More Rewards cardholders. Points are earned at the standard rate on grocery purchases at Woolworths stores and Woolworths Online, helping accumulate More Rewards points through regular weekly shopping.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'ticketek-bankwest',
      name: 'Ticketek',
      program: 'bankwest',
      category: 'Entertainment',
      discount: 'Earn bonus More Rewards points on event tickets',
      description: 'Ticketek is Australia\'s leading ticketing company for major concerts, sports events, theatre, and festivals. Bankwest More Rewards cardholders earn bonus points when purchasing Ticketek event tickets, turning entertainment spending into points redeemable for future rewards.',
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

  shopback: [
    {
      id: 'booking-com-shopback',
      name: 'Booking.com',
      program: 'shopback',
      category: 'Travel',
      discount: 'Up to 8% cashback on hotel bookings',
      description: 'Booking.com is one of the world\'s largest hotel and accommodation booking platforms. ShopBack members earn up to 8% cashback on hotel bookings made via ShopBack\'s Booking.com link, which can stack on top of Booking.com Genius loyalty discounts. Cashback is earned on the booking amount excluding taxes.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'asos-shopback',
      name: 'ASOS',
      program: 'shopback',
      category: 'Fashion',
      discount: 'Up to 5% cashback on clothing and accessories',
      description: 'ASOS is a major international online fashion retailer with a huge range of clothing, shoes, accessories, and beauty products, delivering to Australia. ShopBack members earn up to 5% cashback on ASOS purchases, making it one of the better returns on fashion spending for Australian shoppers.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'kogan-shopback',
      name: 'Kogan',
      program: 'shopback',
      category: 'Electronics',
      discount: 'Up to 3% cashback on electronics and appliances',
      description: 'Kogan is an Australian online retailer specialising in electronics, appliances, furniture, and consumer goods. ShopBack members earn up to 3% cashback on Kogan purchases, making it useful when buying TVs, kitchen appliances, smart home devices, or Kogan own-brand products.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'priceline-shopback',
      name: 'Priceline',
      program: 'shopback',
      category: 'Health & Beauty',
      discount: 'Up to 4% cashback on health and beauty products',
      description: 'Priceline is one of Australia\'s leading health and beauty retailers, selling cosmetics, skincare, fragrances, vitamins, medicines, and personal care products. ShopBack members earn up to 4% cashback on Priceline online purchases, which can be stacked with Priceline Sister Club loyalty points.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'the-iconic-shopback',
      name: 'THE ICONIC',
      program: 'shopback',
      category: 'Fashion',
      discount: 'Up to 5% cashback on fashion purchases',
      description: "THE ICONIC is Australia and New Zealand's largest online fashion and lifestyle destination, stocking over 1,000 brands across clothing, shoes, activewear, and beauty. ShopBack members earn up to 5% cashback on THE ICONIC purchases, making it one of the more rewarding ways to shop for fashion online.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],

  jbhifi_perks: [
    {
      id: 'jbhifi-main-jbhifi-perks',
      name: 'JB Hi-Fi',
      program: 'jbhifi_perks',
      category: 'Electronics',
      discount: 'Exclusive member pricing and early access to sales',
      description: "JB Hi-Fi is Australia's largest consumer electronics and home entertainment retailer. JB Hi-Fi Perks members receive exclusive member-only pricing on selected TVs, laptops, phones, and gaming products, plus early access to major sales events like Black Friday and End of Financial Year sales.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'the-good-guys-jbhifi-perks',
      name: 'The Good Guys',
      program: 'jbhifi_perks',
      category: 'Appliances',
      discount: 'Member discounts on home appliances',
      description: "The Good Guys is one of Australia's largest appliance retailers, selling washing machines, refrigerators, dishwashers, air conditioners, TVs, and small kitchen appliances. As a JB Hi-Fi Group brand, Perks members may access special member pricing on selected The Good Guys products.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'microsoft-jbhifi-perks',
      name: 'Microsoft',
      program: 'jbhifi_perks',
      category: 'Software',
      discount: 'Discounted Microsoft 365 subscriptions',
      description: 'Microsoft is the publisher of Windows, Microsoft 365, Xbox, and Surface devices. JB Hi-Fi Perks members can access discounted Microsoft 365 Personal and Family subscriptions including Word, Excel, PowerPoint, Outlook, Teams, and 1TB OneDrive storage. Subscriptions purchased in-store or via JB Hi-Fi.',
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'jbhifi-now-jbhifi-perks',
      name: 'JB Hi-Fi NOW',
      program: 'jbhifi_perks',
      category: 'Streaming',
      discount: 'Discounted entertainment subscription',
      description: "JB Hi-Fi NOW is JB Hi-Fi's own entertainment subscription service offering streaming movies, TV shows, and music from major studios. Perks members receive a discounted subscription rate, with content available to stream across smart TVs, phones, tablets, and computers.",
      deepLink: '',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'sony-jbhifi-perks',
      name: 'Sony',
      program: 'jbhifi_perks',
      category: 'Electronics',
      discount: 'Exclusive pricing on Sony products at JB Hi-Fi',
      description: 'Sony is a leading global electronics brand known for PlayStation consoles, Bravia TVs, Alpha cameras, WH-1000XM headphones, and Xperia smartphones. JB Hi-Fi Perks members can access exclusive member pricing on selected Sony products, particularly headphones, cameras, and home audio equipment.',
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

function loadApiKey() {
  return localStorage.getItem('perks_api_key') || '';
}

function saveApiKey(key) {
  localStorage.setItem('perks_api_key', key.trim());
}

function clearApiKey() {
  localStorage.removeItem('perks_api_key');
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
  };
}
