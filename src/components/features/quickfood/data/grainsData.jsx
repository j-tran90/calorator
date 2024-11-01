import RiceIcon from "@mui/icons-material/Grain"; // Placeholder for Rice
import WheatIcon from "@mui/icons-material/Grain"; // Placeholder for Wheat
import OatsIcon from "@mui/icons-material/LocalDining"; // Placeholder for Oats
import QuinoaIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Quinoa
import BarleyIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Barley

export const grains = [
  {
    id: 1,
    name: "Rice",
    kcal: 130,
    icon: <RiceIcon style={{ color: "#fff" }} />,
  },
  {
    id: 2,
    name: "Wheat",
    kcal: 340,
    icon: <WheatIcon style={{ color: "#f5deb3" }} />,
  },
  {
    id: 3,
    name: "Oats",
    kcal: 68,
    icon: <OatsIcon style={{ color: "#d2b48c" }} />,
  },
  {
    id: 4,
    name: "Quinoa",
    kcal: 120,
    icon: <QuinoaIcon style={{ color: "#ff6347" }} />,
  },
  {
    id: 5,
    name: "Barley",
    kcal: 354,
    icon: <BarleyIcon style={{ color: "#deb887" }} />,
  },
];
