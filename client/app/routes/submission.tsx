import type { Route } from "./+types/home";
import { Submission } from "~/components/submission";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Home Page", content: "The Landing Page for Code 4 Change" },
  ];
}

export default function Submission1() {
  return <Submission />;
}
