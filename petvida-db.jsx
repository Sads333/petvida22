import { useState, useEffect } from "react";

const T = {
  teal50:"#E1F5EE",teal100:"#9FE1CB",teal400:"#1D9E75",teal600:"#0F6E56",
  amber50:"#FAEEDA",amber400:"#BA7517",coral50:"#FAECE7",coral400:"#D85A30",
  green50:"#EAF3DE",gray50:"#F1EFE8",gray100:"#D3D1C7",gray200:"#B4B2A9",
  gray600:"#5F5E5A",gray800:"#444441",gray900:"#2C2C2A",
};

// ── BANCO DE DADOS ────────────────────────────────────────────────────────────
// Três tabelas simples salvas no storage com auto-save a cada mudança
const DB = {
  async load(key, fallback) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fallback; }
    catch { return fallback; }
  },
  async save(key, value) {
    try { await window.storage.set(key, JSON.stringify(value)); } catch {}
  },
};

const PRODUTOS_INIT = [
  { id:1, emoji:"🛁", categoria:"Estética",    nome:"Banho & Tosa Completo",       preco:65,    precoOld:85,  estoque:30 },
  { id:2, emoji:"🥩", categoria:"Alimentação", nome:"Ração Premium Cão 15kg",       preco:189.9, precoOld:null,estoque:18 },
  { id:3, emoji:"😺", categoria:"Alimentação", nome:"Ração Premium Gato 3kg",        preco:59.9,  precoOld:75,  estoque:22 },
  { id:4, emoji:"🎾", categoria:"Brinquedos",  nome:"Kit Brinquedos Interativos",   preco:49.9,  precoOld:null,estoque:14 },
  { id:5, emoji:"💊", categoria:"Saúde",       nome:"Antipulgas Frontline 3 Meses", preco:78,    precoOld:null,estoque:40 },
  { id:6, emoji:"🛏️", categoria:"Acessórios", nome:"Cama Ortopédica Premium",      preco:119,   precoOld:159, estoque:7  },
];

const SERVICOS_INIT = [
  { id:1, emoji:"🩺", nome:"Consulta Clínica",      preco:90,  duracao:"45 min",      desc:"Avaliação completa com exame físico e diagnóstico preciso." },
  { id:2, emoji:"💉", nome:"Vacinação",              preco:50,  duracao:"20 min",      desc:"Protocolo completo de vacinas com carteirinha atualizada." },
  { id:3, emoji:"🔬", nome:"Exames Laboratoriais",  preco:120, duracao:"Resultado 24h",desc:"Hemograma, bioquímica, urinálise e parasitológico." },
  { id:4, emoji:"🔊", nome:"Ultrassonografia",       preco:180, duracao:"30 min",      desc:"Diagnóstico de gestação e órgãos abdominais." },
  { id:5, emoji:"🏥", nome:"Internação",             preco:200, duracao:"Por dia",     desc:"Monitoramento 24h com cuidados intensivos." },
  { id:6, emoji:"🦷", nome:"Odontologia",            preco:250, duracao:"1h 30min",    desc:"Limpeza dental, extração e tratamentos com anestesia segura." },
];

// ── COMPONENTES BASE ──────────────────────────────────────────────────────────
const Btn = ({ children, variant="primary", small, onClick, full }) => {
  const v = { primary:{background:T.teal400,color:"#fff"}, danger:{background:T.coral50,color:T.coral400}, ghost:{background:T.gray50,color:T.gray800} };
  return <button onClick={onClick} style={{ ...v[variant], border:"none", borderRadius:small?8:12, fontFamily:"inherit", fontWeight:700, cursor:"pointer", fontSize:small?12:14, padding:small?"6px 12px":"11px 22px", width:full?"100%":undefined }}>{children}</button>;
};

const Field = ({ label, as="input", ...p }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:700, color:T.gray600, marginBottom:4 }}>{label}</label>}
    {as === "select"
      ? <select {...p} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.gray100}`, borderRadius:10, fontFamily:"inherit", fontSize:14, background:T.gray50, boxSizing:"border-box" }}>{p.children}</select>
      : <input  {...p} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.gray100}`, borderRadius:10, fontFamily:"inherit", fontSize:14, background:T.gray50, boxSizing:"border-box" }} />
    }
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:"#fff", borderRadius:20, padding:28, width:"100%", maxWidth:460, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontSize:17, fontWeight:800, color:T.gray900 }}>{title}</h3>
        <button onClick={onClose} style={{ background:T.gray50, border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", fontSize:17 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return <div style={{ position:"fixed", bottom:80, right:24, background:T.teal600, color:"#fff", padding:"12px 20px", borderRadius:12, fontWeight:700, fontSize:14, zIndex:9999, boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>{msg}</div>;
};

// ── PÁGINA: SITE (vitrine) ────────────────────────────────────────────────────
function SitePage({ produtos, servicos, irAgendar }) {
  return (
    <div>
      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg,${T.teal50},${T.amber50})`, padding:"60px 5% 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }}>
        <div>
          <span style={{ background:"#fff", border:`1px solid ${T.teal100}`, borderRadius:30, padding:"6px 16px", fontSize:13, fontWeight:700, color:T.teal600, display:"inline-block", marginBottom:18 }}>🌿 Cuidado com amor e excelência</span>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(28px,3.5vw,46px)", color:T.gray900, lineHeight:1.2, marginBottom:18 }}>A saúde do seu <span style={{ color:T.teal400 }}>pet</span> é nossa maior missão</h1>
          <p style={{ fontSize:16, color:T.gray600, marginBottom:28 }}>Clínica veterinária completa e petshop com atendimento humanizado, profissionais especializados e tudo que seu animal precisa.</p>
          <div style={{ display:"flex", gap:12 }}>
            <Btn onClick={irAgendar}>📅 Agendar Consulta</Btn>
            <button style={{ background:"transparent", color:T.teal400, border:`2px solid ${T.teal400}`, borderRadius:12, fontFamily:"inherit", fontWeight:700, fontSize:14, padding:"11px 22px", cursor:"pointer" }}>Ver Serviços ↓</button>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[{e:"🩺",t:"Consultas",d:"Clínica geral"},{e:"✂️",t:"Banho & Tosa",d:"Estética completa"},{e:"💊",t:"Farmácia Pet",d:"Remédios"},{e:"🚨",t:"Emergência 24h",d:"Plantão diário",f:true}].map(c=>(
            <div key={c.t} style={{ background:c.f?T.teal400:"#fff", borderRadius:18, padding:"20px 16px", textAlign:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.06)", gridColumn:c.f?"span 2":undefined }}>
              <div style={{ fontSize:34, marginBottom:8 }}>{c.e}</div>
              <div style={{ fontSize:14, fontWeight:800, color:c.f?"#fff":T.gray900 }}>{c.t}</div>
              <div style={{ fontSize:12, color:c.f?"rgba(255,255,255,0.8)":T.gray600 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ background:T.teal600, padding:"22px 5%", display:"grid", gridTemplateColumns:"repeat(4,1fr)", textAlign:"center" }}>
        {[["12+","Anos de experiência"],[`${produtos.length+servicos.length}`,"Produtos & Serviços"],["8.500+","Pacientes atendidos"],["4.9★","Avaliação média"]].map(([n,l])=>(
          <div key={l}><div style={{ fontSize:26, fontWeight:900, color:"#fff" }}>{n}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontWeight:600 }}>{l}</div></div>
        ))}
      </div>

      {/* SERVIÇOS */}
      <div style={{ padding:"56px 5%" }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.teal400, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>O que oferecemos</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,2.5vw,32px)", color:T.gray900, marginBottom:32 }}>Serviços da Clínica</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
          {servicos.map(s=>(
            <div key={s.id} style={{ background:"#fff", border:`1px solid ${T.gray100}`, borderRadius:18, padding:"22px 20px" }}>
              <div style={{ fontSize:34, marginBottom:12 }}>{s.emoji}</div>
              <h3 style={{ fontSize:15, fontWeight:800, color:T.gray900, marginBottom:6 }}>{s.nome}</h3>
              <p style={{ fontSize:13, color:T.gray600, marginBottom:12, lineHeight:1.55 }}>{s.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:18, fontWeight:900, color:T.teal400 }}>R$ {s.preco.toFixed(2)}</span>
                <span style={{ background:T.teal50, color:T.teal600, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{s.duracao}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUTOS */}
      <div style={{ padding:"56px 5%", background:T.gray50 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.teal400, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Nossa loja</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,2.5vw,32px)", color:T.gray900, marginBottom:32 }}>Petshop & Estética Animal</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:18 }}>
          {produtos.map(p=>(
            <div key={p.id} style={{ background:"#fff", borderRadius:16, overflow:"hidden", border:`1px solid ${T.gray100}` }}>
              <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, background:T.teal50 }}>{p.emoji}</div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.teal400, textTransform:"uppercase", marginBottom:4 }}>{p.categoria}</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.gray900, marginBottom:8 }}>{p.nome}</div>
                <div style={{ fontSize:17, fontWeight:900, color:T.gray900 }}>
                  {p.precoOld && <span style={{ fontSize:12, color:T.gray200, textDecoration:"line-through", marginRight:6 }}>R${p.precoOld}</span>}
                  R$ {p.preco.toFixed(2)}
                </div>
                <div style={{ fontSize:11, color:p.estoque<10?T.coral400:T.gray600, marginTop:4 }}>{p.estoque<10?"⚠️ ":""}Estoque: {p.estoque} un.</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPOIMENTOS */}
      <div style={{ padding:"56px 5%", background:T.teal50 }}>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,2.5vw,32px)", color:T.gray900, marginBottom:32 }}>💬 O que dizem nossos clientes</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
          {[{s:"⭐⭐⭐⭐⭐",txt:"Atendimento incrível! Meu cão foi atendido com muito carinho e profissionalismo. O Zeus se recuperou super bem.",n:"Mariana Costa",p:"Tutora do Zeus, Labrador",e:"🐕"},{s:"⭐⭐⭐⭐⭐",txt:"Fui ao petshop e adorei a variedade! Encontrei tudo que precisava para a minha gata.",n:"Lucas Ferreira",p:"Tutor da Mel, Persa",e:"🐱"},{s:"⭐⭐⭐⭐⭐",txt:"Serviço de emergência impecável. Atendido de madrugada imediatamente. Salvaram a vida do Bolinha!",n:"Patrícia Alves",p:"Tutora do Bolinha, SRD",e:"🐱"}].map(r=>(
            <div key={r.n} style={{ background:"#fff", borderRadius:18, padding:24, border:`1px solid rgba(29,158,117,0.12)` }}>
              <div style={{ fontSize:16, marginBottom:10 }}>{r.s}</div>
              <p style={{ fontSize:14, color:T.gray800, lineHeight:1.65, marginBottom:16 }}>{r.txt}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:T.teal50, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{r.e}</div>
                <div><div style={{ fontWeight:700, fontSize:14, color:T.gray900 }}>{r.n}</div><div style={{ fontSize:12, color:T.gray600 }}>{r.p}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTATO */}
      <div style={{ padding:"56px 5%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:T.teal400, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Onde estamos</div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:28, color:T.gray900, marginBottom:16 }}>Venha nos visitar</h2>
          {[{e:"📍",t:"Endereço",d:"Rua das Flores, 1.245 – Centro · Sua Cidade – CE"},{e:"📞",t:"Telefone",d:"(88) 3333-4444 · (88) 99999-8888"},{e:"✉️",t:"E-mail",d:"contato@petvida.com.br"},{e:"🕐",t:"Horário",d:"Seg–Sex 08–19h · Sáb 08–17h · Emergência 24h"}].map(c=>(
            <div key={c.t} style={{ display:"flex", gap:14, marginBottom:18 }}>
              <div style={{ width:44, height:44, background:T.teal50, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.e}</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:T.gray900 }}>{c.t}</div><div style={{ fontSize:13, color:T.gray600 }}>{c.d}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background:T.teal50, borderRadius:20, height:280, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, border:`2px dashed ${T.teal100}` }}>
          <span style={{ fontSize:64 }}>🗺️</span>
          <span style={{ fontSize:13, color:T.teal600, fontWeight:600 }}>Mapa interativo aqui</span>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA: AGENDAMENTOS ──────────────────────────────────────────────────────
function AgendamentosPage({ servicos, lista, setLista, toast }) {
  const vazio = { tutor:"", whatsapp:"", pet:"", especie:"Cão", servico:servicos[0]?.id||1, data:"", hora:"09:00" };
  const [form, setForm] = useState(vazio);
  const [filtro, setFiltro] = useState("todos");
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const salvar = async () => {
    if (!form.tutor||!form.pet||!form.data) { toast("⚠️ Preencha os campos obrigatórios"); return; }
    const novo = { ...form, id:Date.now(), status:"pendente" };
    const novo_lista = [novo, ...lista];
    setLista(novo_lista);
    await DB.save("petvida:agendamentos", novo_lista);
    setForm(vazio);
    toast("✅ Agendamento salvo!");
  };

  const mudarStatus = async (id, status) => {
    const atualizado = lista.map(a => a.id===id ? {...a,status} : a);
    setLista(atualizado);
    await DB.save("petvida:agendamentos", atualizado);
    toast("✅ Status atualizado");
  };

  const remover = async (id) => {
    const atualizado = lista.filter(a => a.id!==id);
    setLista(atualizado);
    await DB.save("petvida:agendamentos", atualizado);
    toast("🗑️ Removido");
  };

  const filtrado = filtro==="todos" ? lista : lista.filter(a=>a.status===filtro);
  const cores = { pendente:[T.amber50,T.amber400], confirmado:[T.teal50,T.teal600], cancelado:[T.coral50,T.coral400], concluido:[T.green50,"#639922"] };

  return (
    <div style={{ padding:"32px 5%" }}>
      <h2 style={{ fontSize:24, fontWeight:900, color:T.gray900, marginBottom:24 }}>📅 Agendamentos</h2>
      <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:28, alignItems:"start" }}>
        {/* FORM */}
        <div style={{ background:"#fff", border:`1px solid ${T.gray100}`, borderRadius:20, padding:22 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:T.gray900, marginBottom:16 }}>Novo Agendamento</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <Field label="Tutor *" value={form.tutor} onChange={f("tutor")} placeholder="Nome" />
            <Field label="WhatsApp" value={form.whatsapp} onChange={f("whatsapp")} placeholder="(XX) 9999-9999" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <Field label="Pet *" value={form.pet} onChange={f("pet")} placeholder="Nome do pet" />
            <Field label="Espécie" as="select" value={form.especie} onChange={f("especie")}>
              {["Cão","Gato","Pássaro","Coelho","Outro"].map(e=><option key={e}>{e}</option>)}
            </Field>
          </div>
          <Field label="Serviço" as="select" value={form.servico} onChange={f("servico")}>
            {servicos.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.nome} – R${s.preco}</option>)}
          </Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <Field label="Data *" type="date" value={form.data} onChange={f("data")} />
            <Field label="Horário" as="select" value={form.hora} onChange={f("hora")}>
              {["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].map(h=><option key={h}>{h}</option>)}
            </Field>
          </div>
          <Btn full onClick={salvar}>Salvar Agendamento</Btn>
        </div>

        {/* LISTA */}
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {["todos","pendente","confirmado","concluido","cancelado"].map(f=>(
              <button key={f} onClick={()=>setFiltro(f)} style={{ padding:"6px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontWeight:700, fontSize:12, cursor:"pointer", background:filtro===f?T.teal400:T.gray100, color:filtro===f?"#fff":T.gray800 }}>
                {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="todos"?lista.length:lista.filter(a=>a.status===f).length})
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtrado.length===0 && <div style={{ textAlign:"center", color:T.gray600, padding:40, background:T.gray50, borderRadius:16, fontSize:14 }}>Nenhum agendamento</div>}
            {filtrado.map(a=>{
              const sv = servicos.find(s=>s.id==a.servico);
              const [bg,col] = cores[a.status]||[T.gray50,T.gray600];
              return (
                <div key={a.id} style={{ background:"#fff", border:`1px solid ${T.gray100}`, borderRadius:14, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontWeight:800, fontSize:14, color:T.gray900 }}>{a.pet} <span style={{ fontWeight:400, color:T.gray600 }}>· {a.tutor}</span></span>
                    <span style={{ background:bg, color:col, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.gray600, marginBottom:10 }}>{sv?`${sv.emoji} ${sv.nome}`:""} · 📅 {a.data} às {a.hora}{a.whatsapp?` · 📱 ${a.whatsapp}`:""}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    {a.status==="pendente" && <Btn small onClick={()=>mudarStatus(a.id,"confirmado")}>Confirmar</Btn>}
                    {a.status==="confirmado" && <Btn small variant="ghost" onClick={()=>mudarStatus(a.id,"concluido")}>Concluído</Btn>}
                    {a.status!=="cancelado" && <Btn small variant="ghost" onClick={()=>mudarStatus(a.id,"cancelado")}>Cancelar</Btn>}
                    <Btn small variant="danger" onClick={()=>remover(a.id)}>🗑</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA: PRODUTOS ──────────────────────────────────────────────────────────
function ProdutosPage({ lista, setLista, toast }) {
  const [modal, setModal] = useState(null); // null | "novo" | id
  const [form, setForm] = useState({});
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const abrir = (p=null) => { setForm(p ? {...p,preco:String(p.preco),precoOld:String(p.precoOld||""),estoque:String(p.estoque)} : {emoji:"🐾",categoria:"Alimentação",nome:"",preco:"",precoOld:"",estoque:""}); setModal(p?p.id:"novo"); };

  const salvar = async () => {
    if (!form.nome||!form.preco) { toast("⚠️ Nome e preço obrigatórios"); return; }
    const item = { ...form, preco:parseFloat(form.preco), precoOld:form.precoOld?parseFloat(form.precoOld):null, estoque:parseInt(form.estoque)||0 };
    const nova = modal==="novo" ? [...lista,{...item,id:Date.now()}] : lista.map(p=>p.id===modal?{...p,...item}:p);
    setLista(nova); await DB.save("petvida:produtos",nova); setModal(null);
    toast(modal==="novo"?"✅ Produto adicionado!":"✅ Produto atualizado!");
  };

  const remover = async (id) => {
    const nova = lista.filter(p=>p.id!==id);
    setLista(nova); await DB.save("petvida:produtos",nova); toast("🗑️ Produto removido");
  };

  return (
    <div style={{ padding:"32px 5%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:T.gray900 }}>🛒 Produtos</h2>
        <Btn onClick={()=>abrir()}>+ Novo Produto</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
        {lista.map(p=>(
          <div key={p.id} style={{ background:"#fff", borderRadius:16, border:`1px solid ${T.gray100}`, overflow:"hidden" }}>
            <div style={{ height:100, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, background:T.teal50 }}>{p.emoji}</div>
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.teal400, textTransform:"uppercase", marginBottom:4 }}>{p.categoria}</div>
              <div style={{ fontSize:13, fontWeight:800, color:T.gray900, marginBottom:6 }}>{p.nome}</div>
              <div style={{ fontSize:16, fontWeight:900, color:T.gray900 }}>R$ {p.preco.toFixed(2)}</div>
              <div style={{ fontSize:11, color:p.estoque<10?T.coral400:T.gray600, marginBottom:10 }}>{p.estoque<10?"⚠️ ":""}Estoque: {p.estoque}</div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn small variant="ghost" onClick={()=>abrir(p)}>✏️</Btn>
                <Btn small variant="danger" onClick={()=>remover(p.id)}>🗑</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal==="novo"?"Novo Produto":"Editar Produto"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:8 }}>
            <Field label="Emoji" value={form.emoji} onChange={f("emoji")} style={{ textAlign:"center", fontSize:22 }} />
            <Field label="Categoria" as="select" value={form.categoria} onChange={f("categoria")}>
              {["Alimentação","Estética","Brinquedos","Saúde","Acessórios","Higiene"].map(c=><option key={c}>{c}</option>)}
            </Field>
          </div>
          <Field label="Nome *" value={form.nome} onChange={f("nome")} placeholder="Ex: Ração Premium 3kg" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            <Field label="Preço R$ *" type="number" value={form.preco} onChange={f("preco")} />
            <Field label="Preço antigo" type="number" value={form.precoOld} onChange={f("precoOld")} />
            <Field label="Estoque" type="number" value={form.estoque} onChange={f("estoque")} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn full onClick={salvar}>Salvar</Btn>
            <Btn full variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PÁGINA: SERVIÇOS ──────────────────────────────────────────────────────────
function ServicosPage({ lista, setLista, toast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const abrir = (s=null) => { setForm(s?{...s,preco:String(s.preco)}:{emoji:"🩺",nome:"",preco:"",duracao:"",desc:""}); setModal(s?s.id:"novo"); };

  const salvar = async () => {
    if (!form.nome||!form.preco) { toast("⚠️ Nome e preço obrigatórios"); return; }
    const item = { ...form, preco:parseFloat(form.preco) };
    const nova = modal==="novo" ? [...lista,{...item,id:Date.now()}] : lista.map(s=>s.id===modal?{...s,...item}:s);
    setLista(nova); await DB.save("petvida:servicos",nova); setModal(null);
    toast(modal==="novo"?"✅ Serviço adicionado!":"✅ Serviço atualizado!");
  };

  const remover = async (id) => {
    const nova = lista.filter(s=>s.id!==id);
    setLista(nova); await DB.save("petvida:servicos",nova); toast("🗑️ Serviço removido");
  };

  return (
    <div style={{ padding:"32px 5%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:T.gray900 }}>🩺 Serviços</h2>
        <Btn onClick={()=>abrir()}>+ Novo Serviço</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:18 }}>
        {lista.map(s=>(
          <div key={s.id} style={{ background:"#fff", border:`1px solid ${T.gray100}`, borderRadius:18, padding:"22px 20px" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>{s.emoji}</div>
            <h3 style={{ fontSize:15, fontWeight:800, color:T.gray900, marginBottom:6 }}>{s.nome}</h3>
            <p style={{ fontSize:13, color:T.gray600, marginBottom:12, lineHeight:1.5 }}>{s.desc}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:18, fontWeight:900, color:T.teal400 }}>R$ {s.preco.toFixed(2)}</span>
              <span style={{ background:T.teal50, color:T.teal600, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{s.duracao}</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn small variant="ghost" onClick={()=>abrir(s)}>✏️ Editar</Btn>
              <Btn small variant="danger" onClick={()=>remover(s.id)}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal==="novo"?"Novo Serviço":"Editar Serviço"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"70px 1fr", gap:8 }}>
            <Field label="Emoji" value={form.emoji} onChange={f("emoji")} style={{ textAlign:"center", fontSize:22 }} />
            <Field label="Nome *" value={form.nome} onChange={f("nome")} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <Field label="Preço R$ *" type="number" value={form.preco} onChange={f("preco")} />
            <Field label="Duração" value={form.duracao} onChange={f("duracao")} placeholder="Ex: 45 min" />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:T.gray600, marginBottom:4 }}>Descrição</label>
            <textarea value={form.desc} onChange={f("desc")} rows={3} style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${T.gray100}`, borderRadius:10, fontFamily:"inherit", fontSize:14, resize:"vertical", boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn full onClick={salvar}>Salvar</Btn>
            <Btn full variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [pagina, setPagina] = useState("site");
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  // Carrega banco de dados ao iniciar
  useEffect(() => {
    (async () => {
      const [p, s, a] = await Promise.all([
        DB.load("petvida:produtos", PRODUTOS_INIT),
        DB.load("petvida:servicos", SERVICOS_INIT),
        DB.load("petvida:agendamentos", []),
      ]);
      setProdutos(p); setServicos(s); setAgendamentos(a);
      // Salva defaults se for primeira vez
      if (!await DB.load("petvida:produtos",null)) { await DB.save("petvida:produtos",p); await DB.save("petvida:servicos",s); }
      setCarregando(false);
    })();
  }, []);

  const nav = [
    { id:"site",   label:"🏠 Site" },
    { id:"agenda", label:"📅 Agendamentos" },
    { id:"produtos",label:"🛒 Produtos" },
    { id:"servicos",label:"🩺 Serviços" },
  ];

  if (carregando) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh", flexDirection:"column", gap:14, color:T.gray600 }}>
      <div style={{ fontSize:48 }}>🐾</div>
      <div style={{ fontSize:15, fontWeight:700 }}>Carregando dados...</div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:"100vh", background:"#f9f9f7" }}>
      {/* NAV */}
      <nav style={{ background:"#fff", borderBottom:`1px solid ${T.gray100}`, padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:T.teal400, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🐾</div>
          <span style={{ fontSize:20, fontWeight:900, color:T.teal600 }}>Pet<span style={{ color:T.amber400 }}>Vida</span></span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPagina(n.id)} style={{ padding:"7px 14px", borderRadius:10, border:"none", fontFamily:"inherit", fontWeight:700, fontSize:13, cursor:"pointer", background:pagina===n.id?T.teal400:"transparent", color:pagina===n.id?"#fff":T.gray600 }}>
              {n.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:T.teal600, background:T.teal50, padding:"5px 12px", borderRadius:20 }}>💾 Auto-save ativo</span>
      </nav>

      {/* PÁGINAS */}
      {pagina==="site"    && <SitePage produtos={produtos} servicos={servicos} irAgendar={()=>setPagina("agenda")} />}
      {pagina==="agenda"  && <AgendamentosPage servicos={servicos} lista={agendamentos} setLista={setAgendamentos} toast={setToastMsg} />}
      {pagina==="produtos"&& <ProdutosPage lista={produtos} setLista={setProdutos} toast={setToastMsg} />}
      {pagina==="servicos"&& <ServicosPage lista={servicos} setLista={setServicos} toast={setToastMsg} />}

      {/* TOAST */}
      {toastMsg && <Toast msg={toastMsg} onDone={()=>setToastMsg(null)} />}

      {/* WHATSAPP */}
      <div style={{ position:"fixed", bottom:24, right:24, width:52, height:52, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, cursor:"pointer", boxShadow:"0 4px 16px rgba(37,211,102,0.4)", zIndex:98 }}>💬</div>
    </div>
  );
}
