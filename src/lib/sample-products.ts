import type { ProductInput } from "./types";

// Starter catalogue so a fresh store isn't empty. Load it from the admin
// Bikes page, then edit or delete freely.
export const SAMPLE_PRODUCTS: ProductInput[] = [
  {
    slug: "urban-glide-500",
    name: "أوربان جلايد 500",
    nameEn: "Urban Glide 500",
    brand: "Shahna",
    category: "city",
    price: 1490,
    compareAtPrice: 1690,
    description:
      "دراجتنا الأكثر مبيعًا للتنقّل اليومي. محرك هادئ بقوة 500 واط في العجلة الخلفية، وجلسة مستقيمة مريحة، وأضواء مدمجة تجعل أوربان جلايد أسهل طريقة لعبور المدينة دون أن تصل متعرّقًا. البطارية المدمجة في الإطار قابلة للفك لتشحنها على مكتبك.",
    descriptionEn:
      "Our best-selling commuter. A quiet 500 W rear hub motor, an upright riding position and integrated lights make the Urban Glide the easiest way to get across town without arriving sweaty. The frame-integrated battery pops out so you can charge it at your desk.",
    imageUrl: null,
    accentColor: "#c8f031",
    specs: { motorWatts: 500, batteryWh: 540, rangeKm: 90, topSpeedKmh: 25, weightKg: 23 },
    stock: 12,
    featured: true,
    active: true,
  },
  {
    slug: "ridge-runner-750",
    name: "ريدج رنر 750",
    nameEn: "Ridge Runner 750",
    brand: "Shahna",
    category: "mountain",
    price: 2890,
    compareAtPrice: null,
    description:
      "دراجة جبلية صُمّمت للصعود. محرك 750 واط وشوكة تعليق بمدى 120 ملم يجعلان المسارات الصخرية الحادة سهلة، وإطارات عريضة بقياس 2.6 إنش تثبّتك على الأرض الرخوة. ومكابح قرصية هيدروليكية تمنحك توقفًا واثقًا في طريق النزول.",
    descriptionEn:
      "A hardtail built for climbing. The 750 W motor and 120 mm suspension fork flatten steep, rocky trails, while 2.6\" knobby tyres keep you planted on loose ground. Hydraulic disc brakes give you confident stopping on the way back down.",
    imageUrl: null,
    accentColor: "#ff7a1a",
    specs: { motorWatts: 750, batteryWh: 720, rangeKm: 80, topSpeedKmh: 32, weightKg: 27 },
    stock: 5,
    featured: true,
    active: true,
  },
  {
    slug: "pocket-fold-350",
    name: "بوكيت فولد 350",
    nameEn: "Pocket Fold 350",
    brand: "Shahna",
    category: "folding",
    price: 990,
    compareAtPrice: null,
    description:
      "تُطوى في أقل من 15 ثانية لتتسع في صندوق السيارة أو في زاوية شقة صغيرة. عجلات 20 إنش تجعلها رشيقة وسط الزحام، ومحرك 350 واط يتعامل مع الطلعات بسهولة.",
    descriptionEn:
      "Folds in under 15 seconds to fit in a car boot, a train luggage rack or the corner of a small apartment. 20\" wheels make it nimble in traffic, and the 350 W motor handles hills with ease.",
    imageUrl: null,
    accentColor: "#3ad6c5",
    specs: { motorWatts: 350, batteryWh: 360, rangeKm: 55, topSpeedKmh: 25, weightKg: 18 },
    stock: 20,
    featured: true,
    active: true,
  },
  {
    slug: "family-hauler-cargo",
    name: "فاميلي هولر",
    nameEn: "Family Hauler",
    brand: "Shahna",
    category: "cargo",
    price: 3290,
    compareAtPrice: 3590,
    description:
      "دراجة حمولة طويلة تتحمل حتى 200 كغ. احمل طفلين، أو مشتريات أسبوع كامل، أو صناديق التوصيل. جاهزة لبطارية ثانية، ومعها حامل وسطي يبقيها ثابتة أثناء التحميل.",
    descriptionEn:
      "A longtail cargo bike rated for 200 kg total load. Carry two kids, a week of groceries or a delivery run's worth of boxes. Dual-battery ready, with a centre stand that stays steady while you load up.",
    imageUrl: null,
    accentColor: "#ffc93c",
    specs: { motorWatts: 750, batteryWh: 960, rangeKm: 110, topSpeedKmh: 25, weightKg: 36 },
    stock: 3,
    featured: true,
    active: true,
  },
  {
    slug: "swift-road-250",
    name: "سويفت رود 250",
    nameEn: "Swift Road 250",
    brand: "Shahna",
    category: "road",
    price: 2390,
    compareAtPrice: null,
    description:
      "تبدو وتسير كدراجة طريق عادية، مع مساعدة خفية بقوة 250 واط لمواجهة الرياح والطلعات الطويلة. وزنها 15 كغ فقط، فهي خفيفة بما يكفي لتركبها والمحرك مطفأ.",
    descriptionEn:
      "Looks and rides like a regular road bike, with a discreet 250 W assist for headwinds and long climbs. At 15 kg it's light enough to ride with the motor off.",
    imageUrl: null,
    accentColor: "#7b8cff",
    specs: { motorWatts: 250, batteryWh: 360, rangeKm: 100, topSpeedKmh: 25, weightKg: 15 },
    stock: 7,
    featured: false,
    active: true,
  },
  {
    slug: "metro-step-through",
    name: "مترو ستيب ثرو",
    nameEn: "Metro Step-Through",
    brand: "Shahna",
    category: "city",
    price: 1290,
    compareAtPrice: null,
    description:
      "إطار منخفض يسهّل الصعود والنزول بأي لباس. تأتي مع سلة أمامية وحامل خلفي وواقيات طين كاملة، فهي جاهزة للمشاوير من اليوم الأول.",
    descriptionEn:
      "A low step-through frame makes getting on and off easy in any outfit. A front basket, rear rack and full fenders come fitted, so it's ready for errands from day one.",
    imageUrl: null,
    accentColor: "#ff5d8f",
    specs: { motorWatts: 350, batteryWh: 468, rangeKm: 75, topSpeedKmh: 25, weightKg: 24 },
    stock: 0,
    featured: false,
    active: true,
  },
];
