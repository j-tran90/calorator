import AppleIcon from "@mui/icons-material/Apple";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Banana
import OrangeIcon from "@mui/icons-material/EmojiNature";
import StrawberryIcon from "@mui/icons-material/LocalFlorist"; // Placeholder for Strawberry
import WineBarIcon from "@mui/icons-material/WineBar"; // Placeholder for Grape

export const fruits = [
  {
    id: 168,
    name: "Apple",
    kcal: 52,
    icon: <AppleIcon style={{ color: "red" }} />,
  },
  {
    id: 171,
    name: "Banana",
    kcal: 89,
    icon: <EmojiFoodBeverageIcon style={{ color: "#FFD700" }} />,
  }, // Yellow
  {
    id: 174,
    name: "Orange",
    kcal: 47,
    icon: <OrangeIcon style={{ color: "orange" }} />,
  },
  {
    id: 202,
    name: "Strawberry",
    kcal: 32,
    icon: <StrawberryIcon style={{ color: "#FF69B4" }} />,
  }, // Pinkish-red
  {
    id: 217,
    name: "Grape",
    kcal: 69,
    icon: <WineBarIcon style={{ color: "purple" }} />,
  },
];
