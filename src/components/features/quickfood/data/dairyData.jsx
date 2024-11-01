import MilkIcon from "@mui/icons-material/LocalDrink"; // Placeholder for Milk
import CheeseIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Cheese
import YogurtIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Yogurt
import ButterIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Butter
import IceCreamIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Ice Cream

export const dairy = [
  {
    id: 1,
    name: "Milk",
    kcal: 42,
    icon: <MilkIcon style={{ color: "white" }} />,
  },
  {
    id: 2,
    name: "Cheese",
    kcal: 402,
    icon: <CheeseIcon style={{ color: "#f5deb3" }} />,
  },
  {
    id: 3,
    name: "Yogurt",
    kcal: 59,
    icon: <YogurtIcon style={{ color: "#ffeb3b" }} />,
  },
  {
    id: 4,
    name: "Butter",
    kcal: 717,
    icon: <ButterIcon style={{ color: "#ffeb3b" }} />,
  },
  {
    id: 5,
    name: "Ice Cream",
    kcal: 207,
    icon: <IceCreamIcon style={{ color: "#ff69b4" }} />,
  },
];
