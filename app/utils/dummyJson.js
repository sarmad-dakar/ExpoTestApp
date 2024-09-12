import { icons } from "../MyAssets";

export const AllSports = [
  {
    name: "Tennis",
    icon: icons.tennis,
  },
  {
    name: "Squash",
    icon: icons.squash,
  },
  {
    name: "Padel",
    icon: icons.padel,
  },
  {
    name: "Cricket",
    icon: icons.cricket,
  },
  {
    name: "Snooker",
    icon: icons.snooker,
  },
];

export const bookingData = {
  courts: ["Court 1", "Court 2", "Court 3", "Court 4", "Court %"],
  timings: [
    {
      time: "06:30 AM",
      availability: ["Available", "Booked", "N/A", "Expired", "Available"],
    },
    {
      time: "07:00 AM",
      availability: ["Available", "N/A", "Booked", "Booked"],
    },
    {
      time: "07:30 AM",
      availability: ["Expired", "Booked", "N/A", "Available"],
    },
    {
      time: "08:00 AM",
      availability: ["Booked", "Available", "N/A", "Expired"],
    },
    {
      time: "08:30 AM",
      availability: ["N/A", "Expired", "Booked", "Available"],
    },
    {
      time: "09:00 AM",
      availability: ["Available", "N/A", "Booked", "Available"],
    },
    {
      time: "09:30 AM",
      availability: ["Booked", "N/A", "Available", "Expired"],
    },
    {
      time: "10:00 AM",
      availability: ["Expired", "Available", "N/A", "Booked"],
    },
    {
      time: "10:30 AM",
      availability: ["N/A", "Available", "Booked", "N/A"],
    },
    {
      time: "11:00 AM",
      availability: ["Available", "Booked", "Expired", "N/A"],
    },
    {
      time: "11:30 AM",
      availability: ["N/A", "Available", "Booked", "Expired"],
    },
    {
      time: "12:00 PM",
      availability: ["Available", "Expired", "N/A", "Booked"],
    },
    {
      time: "12:30 PM",
      availability: ["Booked", "Available", "N/A", "Expired"],
    },
    {
      time: "01:00 PM",
      availability: ["Expired", "Available", "Booked", "N/A"],
    },
    {
      time: "01:30 PM",
      availability: ["Booked", "N/A", "Expired", "Available"],
    },
    {
      time: "02:00 PM",
      availability: ["Available", "Expired", "N/A", "Booked"],
    },
  ],
};

export const dummyPlayers = [
  { id: 1, name: "Player 1", score: 100, isFav: true },
  { id: 2, name: "Player 2", score: 150, isFav: true },
  { id: 3, name: "Player 3", score: 120, isFav: true },
  { id: 4, name: "Player 4", score: 200, isFav: true },
  { id: 5, name: "Player 5", score: 170, isFav: false },
  { id: 6, name: "Player 6", score: 130, isFav: true },
  { id: 7, name: "Player 7", score: 140, isFav: false },
  { id: 8, name: "Player 8", score: 90, isFav: true },
  { id: 9, name: "Player 9", score: 110, isFav: false },
  { id: 10, name: "Player 10", score: 180, isFav: true },
  { id: 11, name: "Player 11", score: 105, isFav: false },
  { id: 12, name: "Player 12", score: 160, isFav: true },
  { id: 13, name: "Player 13", score: 95, isFav: false },
  { id: 14, name: "Player 14", score: 115, isFav: true },
  { id: 15, name: "Player 15", score: 135, isFav: false },
  { id: 16, name: "Player 16", score: 175, isFav: true },
  { id: 17, name: "Player 17", score: 145, isFav: false },
  { id: 18, name: "Player 18", score: 155, isFav: true },
  { id: 19, name: "Player 19", score: 125, isFav: false },
  { id: 20, name: "Player 20", score: 165, isFav: true },
];
