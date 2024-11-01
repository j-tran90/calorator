// sweetsData.jsx
import CakeIcon from "@mui/icons-material/Cake"; // Icon for cake
import IcecreamIcon from "@mui/icons-material/Icecream"; // Icon for ice cream
import CookieIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for cookie
import DonutSmallIcon from "@mui/icons-material/DonutSmall"; // Icon for donut
import StarIcon from "@mui/icons-material/Star"; // Example icon for candy (as a placeholder)

export const sweets = [
  {
    id: 301,
    name: "Candy",
    kcal: 150,
    icon: <StarIcon style={{ color: "#FF69B4" }} />, // Using StarIcon as a placeholder for Candy
  },
  {
    id: 302,
    name: "Cake",
    kcal: 250,
    icon: <CakeIcon style={{ color: "#FFC0CB" }} />,
  },
  {
    id: 303,
    name: "Ice Cream",
    kcal: 200,
    icon: <IcecreamIcon style={{ color: "#FFB6C1" }} />,
  },
  {
    id: 304,
    name: "Cookie",
    kcal: 120,
    icon: <CookieIcon style={{ color: "#D2691E" }} />,
  },
  {
    id: 305,
    name: "Donut",
    kcal: 300,
    icon: <DonutSmallIcon style={{ color: "#FF4500" }} />,
  },
];
