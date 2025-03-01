import type { Route } from "./+types/home";
import { About } from "../pages/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About" },
    { name: "About Us Page", content: "About Page" },
  ];
}

export default function AboutPage() {
  return <About />;
}
