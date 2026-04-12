// lib/externalResources.ts

export type UserRole = "farmer" | "transport" | "warehouse";

export type ExternalResource = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  roles: UserRole[];
  category: "workers"; 
};

// ===== RESOURCES =====

export const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    id: "grona-jobb",
    title: "Gröna Jobb",
    description:
      "Sweden’s leading platform for agriculture and forestry jobs.",
    href: "https://www.gronajobb.se/",
    roles: ["farmer"],
    category: "workers",
  },
{
  id: "moving2europe",
  title: "Moving2Europe",
  description:
    "International recruitment company providing seasonal and long-term workers for agriculture, logistics, and other industries across Europe.",
  href: "https://www.moving2europe.eu/work/sweden",
  roles: ["farmer"],
  category: "workers",
},
  {
    id: "arbetsformedlingen",
    title: "Arbetsförmedlingen",
    description:
      "Official Swedish employment service with access to local workforce.",
    href: "https://arbetsformedlingen.se/",
    icon: "🇸🇪",
    roles: ["farmer"],
    category: "workers",
  },
  {
    id: "workwide",
    title: "Workwide",
    description:
      "Find seasonal workers from across Europe, including agriculture labor.",
    href: "https://www.workwide.se/",
    roles: ["farmer"],
    category: "workers",
  },
// ===== TRANSPORT WORKERS =====

{
  id: "workwide-transport",
  title: "Workwide",
  description:
    "Find drivers and logistics workers from across Europe.",
  href: "https://www.workwide.se/",
  roles: ["transport"],
  category: "workers",
},
{
  id: "arbetsformedlingen-transport",
  title: "Arbetsförmedlingen",
  description:
    "Official Swedish platform to find drivers and transport staff.",
  href: "https://arbetsformedlingen.se/",
  icon: "🇸🇪",
  roles: ["transport"],
  category: "workers",
},
{
  id: "chaufforsjobb",
  title: "Chaufförsjobb",
  description:
    "Swedish job board dedicated to drivers and transport jobs.",
  href: "https://xn--chauffrsjobb-9ib.se/",
  roles: ["transport"],
  category: "workers",
},
{
  id: "spalinstaffing",
  title: "Spalin Staffing",
  description:
    "Swedish staffing company specializing in transport, logistics, and warehouse workers, including professional drivers.",
  href: "https://spalinstaffing.se/",
  roles: ["transport"],
  category: "workers",
},

// ===== WAREHOUSE WORKERS =====

{
  id: "workwide-warehouse",
  title: "Workwide",
  description:
    "Find warehouse workers and logistics staff across Europe.",
  href: "https://www.workwide.se/",
  roles: ["warehouse"],
  category: "workers",
},
{
  id: "arbetsformedlingen-warehouse",
  title: "Arbetsförmedlingen",
  description:
    "Official Swedish platform to find warehouse employees.",
  href: "https://arbetsformedlingen.se/",
  icon: "🇸🇪",
  roles: ["warehouse"],
  category: "workers",
},
{
  id: "logistikjobb",
  title: "Manpower",
  description:
    "Swedish job board for logistics and warehouse positions.",
  href: "https://www.manpower.se/",
  roles: ["warehouse"],
  category: "workers",
},
{
  id: "boxflow",
  title: "Boxflow",
  description:
    "Swedish logistics and staffing company providing warehouse and supply chain personnel.",
  href: "https://boxflow.com/bemanning/",
  roles: ["warehouse"],
  category: "workers",
},
];

// ===== HELPERS =====

export function getResourcesByRoleAndCategory(
  role: UserRole,
  category: ExternalResource["category"]
) {
  return EXTERNAL_RESOURCES.filter(
    (r) => r.roles.includes(role) && r.category === category
  );
