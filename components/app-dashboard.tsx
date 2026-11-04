"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, CarFront, Check,
  ChevronDown, ChevronLeft, ChevronRight, Clock3, Filter, LayoutDashboard,
  ListFilter, Menu, MoreHorizontal, Plus, Search, Settings, Users, Wrench,
  X, UserRound, CircleDollarSign, ExternalLink, Copy, Link2, CalendarCheck2,
  ClipboardList, ShieldCheck, Sparkles
} from "lucide-react";
import {
  Appointment, AppointmentStatus, formatCurrency, formatDateLong,
  initialAppointments, initialCustomers, initialServices, initialTeam
} from "@/lib/demo-data";

type Section = "Visão geral" | "Agenda" | "Clientes" | "Serviços" | "Equipe" | "Configurações";
type CalendarView = "Dia" | "Semana" | "Mês";

const navItems: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Agenda", icon: CalendarDays },
  { label: "Clientes", icon: Users },
  { label: "Serviços", icon: Wrench },
  { label: "Equipe", icon: UserRound },
  { label: "Configurações", icon: Settings },
];

const todayKey = "2026-11-03";
const pad = (value: number) => String(value).padStart(2, "0");
const toKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const addDays = (date: Date, amount: number) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next; };
const shortDay = (date: Date) => new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", "");
const dayNumber = (date: Date) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);

function StatusPill({ status }: { status: AppointmentStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status}</span>;
}

export default function AppDashboard() {
  const [section, setSection] = useState<Section>("Visão geral");
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [calendarView, setCalendarView] = useState<CalendarView>("Dia");
  const [selectedDate, setSelectedDate] = useState(new Date(todayKey + "T12:00:00"));
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const selectedKey = toKey(selectedDate);
  const dayAppointments = useMemo(() => appointments.filter((item) => item.date === selectedKey).sort((a, b) => a.time.localeCompare(b.time)), [appointments, selectedKey]);
  const todayAppointments = appointments.filter((item) => item.date === todayKey);
  const revenue = todayAppointments.filter((item) => item.status !== "Cancelado").reduce((sum, item) => sum + item.price, 0);
  const confirmedCount = todayAppointments.filter((item) => item.status === "Confirmado").length;

  function updateStatus(id: number, status: AppointmentStatus) {
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  function addAppointment(data: Omit<Appointment, "id" | "status">) {
    setAppointments((current) => [...current, { ...data, id: Math.max(0, ...current.map((item) => item.id)) + 1, status: "Pendente" }]);
    setModalOpen(false);
    setSection("Agenda");
    setSelectedDate(new Date(data.date + "T12:00:00"));
    setCalendarView("Dia");
  }

  function moveDate(direction: number) {
    setSelectedDate((current) => addDays(current, calendarView === "Semana" ? direction * 7 : calendarView === "Mês" ? direction * 30 : direction));
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><CarFront size={23} strokeWidth={2.3}/></div>
          <div><div className="brand-name">auto<span>agenda</span></div><div className="brand-subtitle">GESTÃO AUTOMOTIVA</div></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={18}/></button>
        </div>
        <div className="workspace-label">ESPAÇO DE TRABALHO</div>
        <button className="workspace-switcher"><div className="workspace-avatar">DA</div><span><strong>Detail Auto Center</strong><small>Plano demonstração</small></span><ChevronDown size={16}/></button>
        <div className="nav-label">MENU PRINCIPAL</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${section === label ? "active" : ""}`} onClick={() => { setSection(label); setMobileMenu(false); }}>
              <Icon size={18}/><span>{label}</span>{label === "Agenda" && <span className="nav-count">{todayAppointments.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16}/></div><strong>Seu negócio, no ritmo certo.</strong><p>Tenha mais controle sobre cada atendimento.</p><button onClick={() => setSection("Configurações")}>Conhecer recursos <ArrowUpRight size={14}/></button></div>
          <div className="profile-mini"><div className="profile-avatar">GA</div><div><strong>Gestor Auto</strong><small>Administrador</small></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{section}</strong></div>
          <div className="topbar-actions"><div className="top-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nesta página..."/></div><button className="icon-button notification-button" aria-label="Notificações"><Bell size={18}/><i/></button><div className="top-divider"/><div className="top-user"><div className="profile-avatar small">GA</div><span>Gestor Auto</span><ChevronDown size={15}/></div></div>
        </header>

        <div className="page-content">
          {section === "Visão geral" && <Overview appointments={appointments} revenue={revenue} confirmedCount={confirmedCount} onOpenAgenda={() => setSection("Agenda")} onNew={() => setModalOpen(true)} onStatus={updateStatus}/>}
          {section === "Agenda" && <Agenda appointments={appointments} view={calendarView} setView={setCalendarView} selectedDate={selectedDate} setSelectedDate={setSelectedDate} onMove={moveDate} onNew={() => setModalOpen(true)} onStatus={updateStatus}/>}
          {section === "Clientes" && <Customers search={search}/>}
          {section === "Serviços" && <Services/>}
          {section === "Equipe" && <Team/>}
          {section === "Configurações" && <SettingsPanel/>}
        </div>
      </main>
      {modalOpen && <NewAppointmentModal onClose={() => setModalOpen(false)} onSave={addAppointment}/>}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Overview({ appointments, revenue, confirmedCount, onOpenAgenda, onNew, onStatus }: { appointments: Appointment[]; revenue: number; confirmedCount: number; onOpenAgenda: () => void; onNew: () => void; onStatus: (id: number, status: AppointmentStatus) => void }) {
  const today = appointments.filter((a) => a.date === todayKey).sort((a,b) => a.time.localeCompare(b.time));
  const pending = today.filter((a) => a.status === "Pendente").length;
  return <>
    <PageHeading eyebrow="TERÇA-FEIRA, 03 DE NOVEMBRO" title="Bom dia! 👋" description="Aqui está o resumo do que está acontecendo no seu negócio hoje." action={<button className="primary-button" onClick={onNew}><Plus size={17}/> Novo agendamento</button>}/>
    <div className="stats-grid">
      <StatCard title="Agendamentos hoje" value={String(today.length).padStart(2,"0")} helper={`${confirmedCount} confirmados`} icon={<CalendarCheck2 size={19}/>} trend="+2" trendText="vs. ontem"/>
      <StatCard title="Faturamento previsto" value={formatCurrency(revenue)} helper="Com base nos serviços agendados" icon={<CircleDollarSign size={19}/>} trend="+12%" trendText="vs. semana passada"/>
      <StatCard title="Aguardando confirmação" value={String(pending).padStart(2,"0")} helper="Precisam da sua atenção" icon={<Clock3 size={19}/>} neutral/>
      <StatCard title="Clientes atendidos" value="18" helper="Neste mês" icon={<Users size={19}/>} trend="+8%" trendText="vs. mês passado"/>
    </div>
    <div className="content-grid overview-grid">
      <section className="panel appointments-panel">
        <div className="panel-heading"><div><h2>Agenda de hoje</h2><p>Seus próximos atendimentos</p></div><button className="text-button" onClick={onOpenAgenda}>Ver agenda completa <ArrowUpRight size={15}/></button></div>
        <div className="appointment-list">{today.map((item) => <AppointmentRow key={item.id} item={item} onStatus={onStatus}/>)}{today.length === 0 && <EmptyState title="Nenhum agendamento" text="Sua agenda está livre para este dia."/>}</div>
      </section>
      <section className="panel quick-panel">
        <div className="panel-heading"><div><h2>Acesso rápido</h2><p>Atalhos para sua rotina</p></div></div>
        <div className="quick-actions">
          <button onClick={onNew}><span className="quick-icon blue"><Plus size={19}/></span><span><strong>Novo agendamento</strong><small>Reserve um horário para um cliente</small></span><ChevronRight size={17}/></button>
          <button onClick={onOpenAgenda}><span className="quick-icon purple"><CalendarDays size={19}/></span><span><strong>Visualizar agenda</strong><small>Consulte os horários disponíveis</small></span><ChevronRight size={17}/></button>
          <button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/agendar/detail-auto-center`)}><span className="quick-icon green"><Link2 size={19}/></span><span><strong>Copiar link de agendamento</strong><small>Compartilhe com seus clientes</small></span><Copy size={15}/></button>
        </div>
        <div className="public-link-card"><div className="public-link-top"><span><span className="live-dot"/> Página pública ativa</span><ExternalLink size={15}/></div><strong>Seu cliente agenda sem precisar ligar.</strong><p>Compartilhe seu link nas redes sociais e no WhatsApp.</p><a href="/agendar/detail-auto-center" target="_blank" rel="noreferrer">autoagenda.app/detail-auto-center <ArrowUpRight size={13}/></a></div>
      </section>
    </div>
    <section className="panel week-preview"><div className="panel-heading"><div><h2>Resumo da semana</h2><p>Agendamentos distribuídos pelos próximos dias</p></div><span className="subtle-tag">03 — 09 NOV</span></div><div className="week-bars">{[ {d:"Seg",n:4},{d:"Ter",n:6},{d:"Qua",n:5},{d:"Qui",n:7},{d:"Sex",n:4},{d:"Sáb",n:3},{d:"Dom",n:0} ].map((day) => <div className="week-bar-item" key={day.d}><span>{day.n}</span><div className="bar-track"><i style={{height:`${Math.max(5, day.n/7*100)}%`}}/></div><small>{day.d}</small></div>)}</div></section>
  </>;
}

function StatCard({ title, value, helper, icon, trend, trendText, neutral }: { title: string; value: string; helper: string; icon: React.ReactNode; trend?: string; trendText?: string; neutral?: boolean }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className="stat-icon">{icon}</div></div><div className="stat-value">{value}</div><div className="stat-bottom">{trend && <span className={`trend ${neutral ? "neutral" : ""}`}><ArrowUpRight size={13}/>{trend}</span>}<span>{trendText || helper}</span></div></div>;
}

function AppointmentRow({ item, onStatus }: { item: Appointment; onStatus: (id: number, status: AppointmentStatus) => void }) {
  return <div className="appointment-row"><div className="appointment-time"><strong>{item.time}</strong><span>{item.duration} min</span></div><div className="appointment-avatar">{item.customer.split(" ").map((s) => s[0]).slice(0,2).join("")}</div><div className="appointment-info"><strong>{item.customer}</strong><span>{item.service} <i>·</i> {item.vehicle}</span></div><div className="appointment-employee">{item.employee}</div><div className="appointment-price">{formatCurrency(item.price)}</div><div className="appointment-actions"><StatusPill status={item.status}/><select aria-label={`Alterar status de ${item.customer}`} value={item.status} onChange={(e) => onStatus(item.id, e.target.value as AppointmentStatus)}><option>Confirmado</option><option>Pendente</option><option>Concluído</option><option>Cancelado</option></select></div></div>;
}

function Agenda({ appointments, view, setView, selectedDate, setSelectedDate, onMove, onNew, onStatus }: { appointments: Appointment[]; view: CalendarView; setView: (view: CalendarView) => void; selectedDate: Date; setSelectedDate: (date: Date) => void; onMove: (direction: number) => void; onNew: () => void; onStatus: (id: number, status: AppointmentStatus) => void }) {
  const key = toKey(selectedDate);
  const visible = appointments.filter((a) => a.date === key).sort((a,b) => a.time.localeCompare(b.time));
  const weekDays = Array.from({length:7}, (_,i) => addDays(selectedDate, i - ((selectedDate.getDay()+6)%7)));
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const offset = (monthStart.getDay()+6)%7;
  const monthDays = Array.from({length:42}, (_,i) => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i-offset+1));
  const dateLabel = view === "Mês" ? new Intl.DateTimeFormat("pt-BR", {month:"long",year:"numeric"}).format(selectedDate) : view === "Semana" ? `${dayNumber(weekDays[0])} – ${dayNumber(weekDays[6])} ${new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(selectedDate)}` : formatDateLong(selectedDate);
  return <>
    <PageHeading eyebrow="GESTÃO DE HORÁRIOS" title="Agenda" description="Organize os atendimentos e mantenha sua operação em dia." action={<button className="primary-button" onClick={onNew}><Plus size={17}/> Novo agendamento</button>}/>
    <section className="panel calendar-panel"><div className="calendar-toolbar"><div className="calendar-date-controls"><button className="today-button" onClick={() => setSelectedDate(new Date(todayKey+"T12:00:00"))}>Hoje</button><button className="icon-button outlined" onClick={() => onMove(-1)} aria-label="Anterior"><ChevronLeft size={18}/></button><button className="icon-button outlined" onClick={() => onMove(1)} aria-label="Próximo"><ChevronRight size={18}/></button><h2>{dateLabel}</h2></div><div className="calendar-tools"><button className="filter-button"><Filter size={15}/> Filtros</button><div className="view-switch">{(["Dia","Semana","Mês"] as CalendarView[]).map((v)=><button key={v} onClick={()=>setView(v)} className={view===v?"selected":""}>{v}</button>)}</div></div></div>
      {view === "Dia" && <div className="day-calendar"><div className="day-date-strip"><div className="date-big"><strong>{dayNumber(selectedDate)}</strong><span>{new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(selectedDate).replace(".","")}</span></div><div><strong>{shortDay(selectedDate)}</strong><span>{visible.length} agendamentos</span></div><div className="day-capacity"><span>Ocupação estimada</span><strong>{Math.min(100, visible.length*17)}%</strong><div className="capacity-line"><i style={{width:`${Math.min(100,visible.length*17)}%`}}/></div></div></div><div className="timeline">{Array.from({length:11},(_,i)=>8+i).map((hour)=>{const items=visible.filter((a)=>Number(a.time.slice(0,2))===hour);return <div className="time-row" key={hour}><div className="time-label">{pad(hour)}:00</div><div className="time-slot">{items.map((item)=><div className={`time-event event-${item.status.toLowerCase()}`} key={item.id}><div><strong>{item.time} · {item.customer}</strong><span>{item.service} — {item.vehicle}</span></div><div className="event-end"><StatusPill status={item.status}/><button className="icon-button tiny" aria-label="Mais opções"><MoreHorizontal size={17}/></button></div></div>)}</div></div>})}</div>{visible.length===0&&<EmptyState title="Dia sem agendamentos" text="Aproveite para abrir novos horários ou adicionar um atendimento."/>}</div>}
      {view === "Semana" && <div className="week-calendar"><div className="week-grid-head"><div className="week-time-head">HORÁRIO</div>{weekDays.map((d)=><button key={toKey(d)} onClick={()=>{setSelectedDate(d);setView("Dia")}} className={`week-day-head ${toKey(d)===key?"chosen":""}`}><span>{shortDay(d)}</span><strong>{dayNumber(d)}</strong></button>)}</div>{[8,9,10,11,12,13,14,15,16,17,18].map((hour)=><div className="week-grid-row" key={hour}><div className="week-time">{pad(hour)}:00</div>{weekDays.map((d)=><button key={`${toKey(d)}-${hour}`} className="week-cell" onClick={()=>{setSelectedDate(d);setView("Dia")}}>{appointments.filter((a)=>a.date===toKey(d)&&Number(a.time.slice(0,2))===hour).map((a)=><span key={a.id} className={`week-event ${a.status.toLowerCase()}`}>{a.customer.split(" ")[0]}<small>{a.time}</small></span>)}</button>)}</div>)}</div>}
      {view === "Mês" && <div className="month-calendar"><div className="month-weekdays">{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((d)=><span key={d}>{d}</span>)}</div><div className="month-grid">{monthDays.map((d)=>{const count=appointments.filter((a)=>a.date===toKey(d)).length;return <button key={toKey(d)} onClick={()=>{setSelectedDate(d);setView("Dia")}} className={`month-cell ${d.getMonth()!==selectedDate.getMonth()?"muted":""} ${toKey(d)===key?"selected-day":""}`}><span>{dayNumber(d)}</span>{count>0&&<i>{count} {count===1?"agenda":"agendas"}</i>}</button>})}</div></div>}
    </section>
    {view !== "Dia" && <section className="panel selected-day-list"><div className="panel-heading"><div><h2>Atendimentos de {formatDateLong(selectedDate)}</h2><p>{visible.length} agendamentos neste dia</p></div></div>{visible.length?visible.map((item)=><AppointmentRow key={item.id} item={item} onStatus={onStatus}/>):<EmptyState title="Nenhum horário reservado" text="Selecione outro dia ou crie um novo agendamento."/>}</section>}
  </>;
}

function Customers({ search }: { search: string }) {
  const filtered = initialCustomers.filter((c)=>`${c.name} ${c.phone} ${c.vehicle}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading eyebrow="RELACIONAMENTO" title="Clientes" description="Consulte os clientes e os veículos atendidos pelo estabelecimento." action={<button className="primary-button"><Plus size={17}/> Novo cliente</button>}/><section className="panel table-panel"><div className="panel-heading"><div><h2>Todos os clientes</h2><p>{filtered.length} registros encontrados</p></div><button className="filter-button"><ListFilter size={15}/> Filtrar</button></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>CLIENTE</th><th>CONTATO</th><th>VEÍCULO</th><th>ATENDIMENTOS</th><th>ÚLTIMA VISITA</th><th></th></tr></thead><tbody>{filtered.map((c)=><tr key={c.id}><td><div className="table-person"><div className="appointment-avatar">{c.name.split(" ").map((s)=>s[0]).slice(0,2).join("")}</div><strong>{c.name}</strong></div></td><td>{c.phone}</td><td>{c.vehicle}</td><td><span className="visit-count">{c.visits} visitas</span></td><td>{c.lastVisit}</td><td><button className="icon-button tiny"><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table>{filtered.length===0&&<EmptyState title="Nenhum cliente encontrado" text="Tente buscar por outro nome, telefone ou veículo."/>}</div></section></>;
}

function Services() {
  const [services, setServices] = useState(initialServices);
  return <><PageHeading eyebrow="CATÁLOGO" title="Serviços" description="Configure o que seu estabelecimento oferece e quanto tempo cada atendimento leva." action={<button className="primary-button" onClick={()=>setServices((s)=>[...s,{id:Math.max(...s.map(x=>x.id))+1,name:"Novo serviço",category:"Geral",duration:60,price:0,active:true}])}><Plus size={17}/> Novo serviço</button>}/><div className="service-grid">{services.map((service)=><div className="service-card" key={service.id}><div className="service-card-top"><div className="service-icon"><Wrench size={19}/></div><button className="icon-button tiny"><MoreHorizontal size={18}/></button></div><span className="service-category">{service.category}</span><h3>{service.name}</h3><div className="service-meta"><span><Clock3 size={14}/>{service.duration} min</span><strong>{formatCurrency(service.price)}</strong></div><div className="service-card-footer"><span className={`active-label ${service.active?"yes":"no"}`}><i/>{service.active?"Ativo":"Inativo"}</span><button className="switch-button" onClick={()=>setServices((s)=>s.map((x)=>x.id===service.id?{...x,active:!x.active}:x))} aria-label="Alternar serviço"><span className={service.active?"on":""}/></button></div></div>)}</div></>;
}

function Team() {
  return <><PageHeading eyebrow="OPERAÇÃO" title="Equipe" description="Organize os profissionais e acompanhe a capacidade de atendimento." action={<button className="primary-button"><Plus size={17}/> Adicionar funcionário</button>}/><section className="team-grid">{initialTeam.map((person)=><div className="team-card" key={person.id}><div className={`team-avatar ${person.color}`}>{person.name.split(" ").map((s)=>s[0]).slice(0,2).join("")}</div><h3>{person.name}</h3><p>{person.role}</p><div className="team-card-stats"><span><CalendarDays size={15}/> {person.appointments} agendamentos hoje</span><span className="active-label yes"><i/> Disponível</span></div></div>)}</section><div className="info-banner"><ShieldCheck size={19}/><div><strong>Agenda por profissional</strong><p>Na próxima etapa, cada funcionário poderá ter horários, serviços e disponibilidade próprios.</p></div></div></>;
}

function SettingsPanel() {
  return <><PageHeading eyebrow="PERSONALIZAÇÃO" title="Configurações" description="Deixe o AutoAgenda com a cara do seu estabelecimento."/><div className="settings-grid"><section className="panel settings-card"><div className="settings-title"><div className="service-icon"><Wrench size={19}/></div><div><h2>Dados do estabelecimento</h2><p>Informações exibidas na página de agendamento.</p></div></div><label>Nome do estabelecimento<input defaultValue="Detail Auto Center"/></label><label>Endereço<input defaultValue="Rua Exemplo, 125 · Centro"/></label><label>Telefone / WhatsApp<input defaultValue="(32) 99999-0000"/></label><label>Descrição<textarea defaultValue="Cuidado automotivo com qualidade e atenção aos detalhes."/></label><button className="primary-button">Salvar alterações</button></section><section className="panel settings-card"><div className="settings-title"><div className="service-icon purple-icon"><Clock3 size={19}/></div><div><h2>Horário de funcionamento</h2><p>Defina quando os clientes podem agendar.</p></div></div>{["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"].map((day,i)=><div className="business-hours" key={day}><strong>{day}</strong>{i===6?<span className="closed-label">Fechado</span>:<span>08:00 – {i===5?"13:00":"18:00"}</span>}</div>)}</section><section className="panel settings-card link-settings"><div className="settings-title"><div className="service-icon green-icon"><Link2 size={19}/></div><div><h2>Link público</h2><p>Compartilhe sua página de agendamentos.</p></div></div><div className="share-link">autoagenda.app/agendar/detail-auto-center</div><button className="secondary-button" onClick={()=>navigator.clipboard?.writeText(`${window.location.origin}/agendar/detail-auto-center`)}><Copy size={15}/> Copiar link</button></section></div></>;
}

function EmptyState({ title, text }: { title: string; text: string }) { return <div className="empty-state"><div><CalendarDays size={22}/></div><strong>{title}</strong><span>{text}</span></div>; }

function NewAppointmentModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Omit<Appointment,"id"|"status">) => void }) {
  const [customer,setCustomer]=useState(""); const [phone,setPhone]=useState(""); const [vehicle,setVehicle]=useState(""); const [service,setService]=useState("Lavagem completa"); const [date,setDate]=useState(todayKey); const [time,setTime]=useState("10:00"); const [employee,setEmployee]=useState("Rafael Lima");
  const selected=initialServices.find((s)=>s.name===service) || initialServices[0];
  function submit(e:React.FormEvent){e.preventDefault();if(!customer.trim()||!phone.trim())return;onSave({customer,phone,vehicle:vehicle||"Veículo não informado",service,date,time,duration:selected.duration,price:selected.price,employee});}
  return <div className="modal-backdrop" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose()}}><form className="modal-card" onSubmit={submit}><div className="modal-header"><div><span className="eyebrow">NOVO ATENDIMENTO</span><h2>Adicionar agendamento</h2><p>Preencha os dados para reservar um horário.</p></div><button type="button" className="icon-button" onClick={onClose}><X size={19}/></button></div><div className="form-grid"><label className="full">Nome do cliente<input value={customer} onChange={(e)=>setCustomer(e.target.value)} placeholder="Ex.: João da Silva" required/></label><label>Telefone / WhatsApp<input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(00) 00000-0000" required/></label><label>Veículo<input value={vehicle} onChange={(e)=>setVehicle(e.target.value)} placeholder="Ex.: Fiat Strada · 2013"/></label><label className="full">Serviço<select value={service} onChange={(e)=>setService(e.target.value)}>{initialServices.filter((s)=>s.active).map((s)=><option key={s.id}>{s.name}</option>)}</select></label><label>Data<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required/></label><label>Horário<input type="time" value={time} onChange={(e)=>setTime(e.target.value)} required/></label><label className="full">Responsável<select value={employee} onChange={(e)=>setEmployee(e.target.value)}><option>Rafael Lima</option><option>Lucas Alves</option></select></label></div><div className="modal-summary"><span>{selected.duration} minutos</span><strong>{formatCurrency(selected.price)}</strong></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="primary-button"><Check size={16}/> Salvar agendamento</button></div></form></div>;
}
