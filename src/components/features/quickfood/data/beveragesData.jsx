import WaterIcon from "@mui/icons-material/LocalDrink"; // Placeholder for Water
import CoffeeIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Coffee
import TeaIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Tea
import JuiceIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Juice
import SodaIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Soda

export const beverages = [
  {
    id: 1,
    name: "Water",
    kcal: 0,
    protein: 0,
    icon: <WaterIcon style={{ color: "blue" }} />,
  },
  {
    id: 2,
    name: "Coffee",
    kcal: 2,
    protein: 0.3,
    icon: <CoffeeIcon style={{ color: "brown" }} />,
  },
  {
    id: 3,
    name: "Tea",
    kcal: 2,
    protein: 0.2,
    icon: <TeaIcon style={{ color: "green" }} />,
  },
  {
    id: 4,
    name: "Juice",
    kcal: 45,
    protein: 0.7,
    icon: <JuiceIcon style={{ color: "orange" }} />,
  },
  {
    id: 5,
    name: "Soda",
    kcal: 150,
    protein: 0,
    icon: <SodaIcon style={{ color: "red" }} />,
  },
];
