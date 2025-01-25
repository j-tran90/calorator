import ChickenIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Chicken
import BeefIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Beef
import PorkIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Pork
import FishIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Fish
import TurkeyIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Turkey

export const meats = [
  {
    id: 1,
    name: "Chicken",
    kcal: 239,
    protein: 27,
    icon: <ChickenIcon style={{ color: "brown" }} />,
  },
  {
    id: 2,
    name: "Beef",
    kcal: 250,
    protein: 26,
    icon: <BeefIcon style={{ color: "red" }} />,
  },
  {
    id: 3,
    name: "Pork",
    kcal: 242,
    protein: 25.7,
    icon: <PorkIcon style={{ color: "pink" }} />,
  },
  {
    id: 4,
    name: "Fish",
    kcal: 206,
    protein: 22,
    icon: <FishIcon style={{ color: "blue" }} />,
  },
  {
    id: 5,
    name: "Turkey",
    kcal: 135,
    protein: 28,
    icon: <TurkeyIcon style={{ color: "brown" }} />,
  },
];
