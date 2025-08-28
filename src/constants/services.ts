import type ServiceType from "../types/service";
import {
  FaTools,
  FaLaptop,
  FaCar,
  FaUserTie,
  FaUser,
  FaPaw,
} from "react-icons/fa";

const services: ServiceType[] = [
  { title: "Maintenance", icon: FaTools, color: "#282828" },
  { title: "Digital", icon: FaLaptop, color: "#3b3b3b" },
  { title: "Car Care", icon: FaCar, color: "#454545" },
  { title: "Professional", icon: FaUserTie, color: "#565656" },
  { title: "Personal", icon: FaUser, color: "#676767" },
  { title: "Pets Care", icon: FaPaw, color: "#787878" },
];

export default services;
