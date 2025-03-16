import type { Route } from "./+types/home";
import { HomePage } from "../pages/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Home Page", content: "The Landing Page for Code 4 Change" },
  ];
}

export default function Welcome() {
  return <HomePage />;
}
