export interface NepalLocation {
  province: string;
  districts: {
    name: string;
    cities: string[];
  }[];
}

export const nepalLocations: NepalLocation[] = [
  {
    province: "Koshi",
    districts: [
      { name: "Jhapa", cities: ["Birtamod", "Damak", "Bhadrapur", "Mechinagar"] },
      { name: "Morang", cities: ["Biratnagar", "Belbari", "Sundar Haraicha", "Urlabari"] },
      { name: "Sunsari", cities: ["Dharan", "Itahari", "Inaruwa"] },
      { name: "Ilam", cities: ["Ilam", "Suryodaya"] },
      { name: "Dhankuta", cities: ["Dhankuta", "Pakhribas"] }
    ]
  },
  {
    province: "Madhesh",
    districts: [
      { name: "Parsa", cities: ["Birgunj", "Pokhariya"] },
      { name: "Dhanusha", cities: ["Janakpur", "Dhanushadham", "siraha"] },
      { name: "Saptari", cities: ["Rajbiraj", "Kancharup"] },
      { name: "Bara", cities: ["Kalaiya", "Jitpur Simara"] }
    ]
  },
  {
    province: "Bagmati",
    districts: [
      { name: "Kathmandu", cities: ["Kathmandu", "Kirtipur", "Budhanilkantha", "Tokha"] },
      { name: "Lalitpur", cities: ["Lalitpur", "Mahalaxmi", "Godawari"] },
      { name: "Bhaktapur", cities: ["Bhaktapur", "Madhyapur Thimi", "Suryabinayak", "Changunarayan"] },
      { name: "Chitwan", cities: ["Bharatpur", "Ratnanagar", "Khairahani"] },
      { name: "Makwanpur", cities: ["Hetauda", "Thaha"] },
      { name: "Kavrepalanchok", cities: ["Dhulikhel", "Banepa", "Panauti"] }
    ]
  },
  {
    province: "Gandaki",
    districts: [
      { name: "Kaski", cities: ["Pokhara"] },
      { name: "Tanahu", cities: ["Damauli", "Shuklagandaki"] },
      { name: "Nawalparasi East", cities: ["Kawasoti", "Devchuli"] },
      { name: "Gorkha", cities: ["Gorkha", "Palungtar"] },
      { name: "Syangja", cities: ["Putalibazar", "Waling"] }
    ]
  },
  {
    province: "Lumbini",
    districts: [
      { name: "Rupandehi", cities: ["Butwal", "Siddharthanagar", "Tilottama"] },
      { name: "Dang", cities: ["Ghorahi", "Tulsipur", "Lamahi"] },
      { name: "Banke", cities: ["Nepalgunj", "Kohalpur"] },
      { name: "Palpa", cities: ["Tansen", "Rampur"] },
      { name: "Kapilvastu", cities: ["Kapilvastu", "Banganga"] }
    ]
  },
  {
    province: "Karnali",
    districts: [
      { name: "Surkhet", cities: ["Birendranagar"] },
      { name: "Dailekh", cities: ["Narayan", "Dullu"] },
      { name: "Jumla", cities: ["Chandannath"] }
    ]
  },
  {
    province: "Sudurpashchim",
    districts: [
      { name: "Kailali", cities: ["Dhangadhi", "Tikapur", "Ghodaghodi"] },
      { name: "Kanchanpur", cities: ["Bhimdatta", "Bedkot"] },
      { name: "Doti", cities: ["Dipayal Silgadhi"] }
    ]
  }
];