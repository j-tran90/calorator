import CarrotIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Carrot
import BroccoliIcon from "@mui/icons-material/EmojiNature"; // Placeholder for Broccoli
import SpinachIcon from "@mui/icons-material/LocalFlorist"; // Placeholder for Spinach
import TomatoIcon from "@mui/icons-material/LocalDining"; // Placeholder for Tomato
import PotatoIcon from "@mui/icons-material/Grain"; // Placeholder for Potato

export const vegetables = [
  {
    id: 1,
    name: "Carrot",
    kcal: 41,
    icon: <CarrotIcon style={{ color: "orange" }} />,
  },
  {
    id: 2,
    name: "Broccoli",
    kcal: 34,
    icon: <BroccoliIcon style={{ color: "green" }} />,
  },
  {
    id: 3,
    name: "Spinach",
    kcal: 23,
    icon: <SpinachIcon style={{ color: "green" }} />,
  },
  {
    id: 4,
    name: "Tomato",
    kcal: 18,
    icon: <TomatoIcon style={{ color: "red" }} />,
  },
  {
    id: 5,
    name: "Potato",
    kcal: 77,
    icon: <PotatoIcon style={{ color: "#D2B48C" }} />,
  },
];
