import type { Route } from "./+types/home";
import { Welcome } from "../pages/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Home Page", content: "The Landing Page for Code 4 Change" },
  ];
}

export default function Home() {
  return <Welcome />;
}
