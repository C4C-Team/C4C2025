import type { Route } from "./+types/home";
import { Submission } from "~/components/submission";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Submission" },
    { name: "Submission Page", content: "The Submission Page for Code 4 Change" },
  ];
}

export default function Submission1() {
  return <Submission />;
}
