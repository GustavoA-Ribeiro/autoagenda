export type AppointmentStatus = "Confirmado" | "Pendente" | "Concluído" | "Cancelado";

export type Appointment = {
  id: number;
  customer: string;
  phone: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  employee: string;
  status: AppointmentStatus;
};

export const initialAppointments: Appointment[] = [
  { id: 1, customer: "Mariana Costa", phone: "(32) 99912-3421", vehicle: "Honda Civic · 2019", service: "Lavagem completa", date: "2026-11-03", time: "08:00", duration: 60, price: 85, employee: "Rafael Lima", status: "Confirmado" },
  { id: 2, customer: "Pedro Henrique", phone: "(32) 99831-7720", vehicle: "VW T-Cross · 2022", service: "Higienização interna", date: "2026-11-03", time: "09:30", duration: 120, price: 240, employee: "Lucas Alves", status: "Pendente" },
  { id: 3, customer: "Camila Souza", phone: "(32) 99104-8852", vehicle: "Fiat Argo · 2021", service: "Polimento técnico", date: "2026-11-03", time: "13:30", duration: 180, price: 450, employee: "Rafael Lima", status: "Confirmado" },
  { id: 4, customer: "André Martins", phone: "(32) 98872-1940", vehicle: "Chevrolet Onix · 2020", service: "Lavagem completa", date: "2026-11-03", time: "16:00", duration: 60, price: 85, employee: "Lucas Alves", status: "Confirmado" },
  { id: 5, customer: "Juliana Ferreira", phone: "(32) 99750-1108", vehicle: "Jeep Renegade · 2023", service: "Vitrificação", date: "2026-11-04", time: "10:00", duration: 240, price: 890, employee: "Rafael Lima", status: "Pendente" },
  { id: 6, customer: "Bruno Oliveira", phone: "(32) 99930-4120", vehicle: "Fiat Toro · 2021", service: "Lavagem completa", date: "2026-11-05", time: "14:00", duration: 60, price: 85, employee: "Lucas Alves", status: "Confirmado" }
];

export const initialServices = [
  { id: 1, name: "Lavagem completa", category: "Lavagem", duration: 60, price: 85, active: true },
  { id: 2, name: "Higienização interna", category: "Estética", duration: 120, price: 240, active: true },
  { id: 3, name: "Polimento técnico", category: "Estética", duration: 180, price: 450, active: true },
  { id: 4, name: "Vitrificação", category: "Proteção", duration: 240, price: 890, active: true },
  { id: 5, name: "Lavagem express", category: "Lavagem", duration: 40, price: 55, active: false }
];

export const initialCustomers = [
  { id: 1, name: "Mariana Costa", phone: "(32) 99912-3421", vehicle: "Honda Civic · 2019", visits: 8, lastVisit: "03 nov, 08:00" },
  { id: 2, name: "Pedro Henrique", phone: "(32) 99831-7720", vehicle: "VW T-Cross · 2022", visits: 3, lastVisit: "03 nov, 09:30" },
  { id: 3, name: "Camila Souza", phone: "(32) 99104-8852", vehicle: "Fiat Argo · 2021", visits: 5, lastVisit: "03 nov, 13:30" },
  { id: 4, name: "André Martins", phone: "(32) 98872-1940", vehicle: "Chevrolet Onix · 2020", visits: 2, lastVisit: "03 nov, 16:00" },
  { id: 5, name: "Juliana Ferreira", phone: "(32) 99750-1108", vehicle: "Jeep Renegade · 2023", visits: 1, lastVisit: "04 nov, 10:00" }
];

export const initialTeam = [
  { id: 1, name: "Rafael Lima", role: "Detailer", color: "blue", appointments: 3 },
  { id: 2, name: "Lucas Alves", role: "Lavador", color: "violet", appointments: 3 },
  { id: 3, name: "Você", role: "Administrador", color: "green", appointments: 0 }
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(date);
}
