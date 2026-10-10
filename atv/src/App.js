import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoImg from './imagens/lacos maternos imagem.png';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RealTimeMap({ points, activeIndex }) {
  const centerPos = points[activeIndex] ? [points[activeIndex].lat, points[activeIndex].lng] : [-22.8988, -47.0562];

  return (
    <div style={{ width: '100%', height: '580px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #f9a8d4', boxShadow: '0 10px 25px -5px rgba(216, 90, 128, 0.15)' }}>
      <MapContainer 
        center={centerPos} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
            <Popup>
              <div style={{ fontFamily: 'sans-serif' }}>
                <strong style={{ color: '#d85a80' }}>{point.name}</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#555' }}>{point.sub}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#777' }}>{point.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('bancos');
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedCard, setSelectedCard] = useState(0);
  const [searchCity, setSearchCity] = useState('Campinas, SP');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalData, setActiveModalData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const locations = [
    {
      name: 'Banco de Leite Humano - Campinas',
      sub: 'Maternidade de Campinas',
      type: 'Banco de Leite',
      distance: '2,4 km',
      open: true,
      homeCollection: true,
      address: 'Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP',
      phone: '(19) 3737-1234',
      hours: '08:00 - 17:00',
      lat: -22.8988,
      lng: -47.0562
    },
    {
      name: 'BLH Centro de Atenção Maternal',
      sub: 'CAISM / Unicamp',
      type: 'Banco de Leite',
      distance: '5,1 km',
      open: true,
      homeCollection: true,
      address: 'Rua Alexander Fleming, 101 - Cidade Universitária, Campinas - SP',
      phone: '(19) 3521-7000',
      hours: '07:30 - 18:00',
      lat: -22.8275,
      lng: -47.0628
    },
    {
      name: 'Posto de Coleta de Leite Humano',
      sub: 'Hospital Celso Pierro (PUC)',
      type: 'Posto de Coleta',
      distance: '8,3 km',
      open: false,
      homeCollection: false,
      address: 'Av. John Boyd Dunlop, s/n - Jd. Ipaussurama, Campinas - SP',
      phone: '(19) 3343-8600',
      hours: '08:00 - 16:00',
      lat: -22.9031,
      lng: -47.1245
    }
  ];

  const filteredLocations = locations.filter((loc) => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Banco de Leite') return loc.type === 'Banco de Leite';
    if (selectedFilter === 'Posto de Coleta') return loc.type === 'Posto de Coleta';
    if (selectedFilter === 'Coleta Domiciliar') return loc.homeCollection;
    if (selectedFilter === 'Aberto Agora') return loc.open;
    return true;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleOpenDetails = (loc) => {
    setActiveModalData(loc);
    setIsModalOpen(true);
  };

  const handleContact = (loc) => {
    if (loc.phone) {
      window.open(`tel:${loc.phone.replace(/\D/g, '')}`);
    } else {
      showToast('Telefone indisponível no momento.');
    }
  };

  const handleDownloadPDF = () => {
    showToast('Comprovante de Pré-triagem gerado com sucesso! Baixando...');
    const element = document.createElement("a");
    const file = new Blob([
      "LAÇOS MATERNOS - COMPROVANTE DE PRÉ-TRIAGEM\n\nStatus: Aprovada nos critérios iniciais.\nRecomendação: Procure um Banco de Leite próximo para validação final."
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "comprovante-pre-triagem-lacos-maternos.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!userEmail) {
      showToast('Por favor, digite seu e-mail.');
      return;
    }
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    showToast(`Bem-vinda de volta, ${userEmail}!`);
  };

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333', position: 'relative' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#333', color: '#fff', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 9999, fontSize: '0.9rem' }}>
          {toastMessage}
        </div>
      )}

      {isModalOpen && activeModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '16px', maxWidth: '450px', width: '90%', border: '2px solid #f9a8d4', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#d85a80', marginTop: 0 }}>{activeModalData.name}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{activeModalData.sub}</p>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />
            <p style={{ fontSize: '0.88rem', margin: '8px 0' }}><strong>Endereço:</strong> {activeModalData.address}</p>
            <p style={{ fontSize: '0.88rem', margin: '8px 0' }}><strong>Telefone:</strong> {activeModalData.phone || 'Não informado'}</p>
            <p style={{ fontSize: '0.88rem', margin: '8px 0' }}><strong>Horário:</strong> {activeModalData.hours}</p>
            <p style={{ fontSize: '0.88rem', margin: '8px 0' }}><strong>Coleta Domiciliar:</strong> {activeModalData.homeCollection ? 'Sim' : 'Não'}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => handleContact(activeModalData)} style={{ flex: 1, backgroundColor: '#d85a80', color: '#fff', border: 'none', padding: '10px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }}>Ligar Agora</button>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', border: 'none', color: '#555', padding: '10px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', border: '2px solid #f9a8d4', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#d85a80', marginTop: 0 }}>Acessar Conta</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Entre para acompanhar suas doações e agendamentos.</p>
            <form onSubmit={handleLoginSubmit}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#444' }}>E-mail:</label>
              <input 
                type="email" 
                placeholder="seu-email@exemplo.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', margin: '8px 0 20px 0', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#d85a80', color: '#fff', border: 'none', padding: '10px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar</button>
                <button type="button" onClick={() => setIsLoginModalOpen(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', border: 'none', color: '#555', padding: '10px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 80px', backgroundColor: '#ffffff', borderBottom: '2px solid #fce7f3', boxShadow: '0 2px 10px rgba(216, 90, 128, 0.05)' }}>
        <div onClick={() => setCurrentPage('inicio')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '12px', border: '1px solid #fbcfe8', backgroundColor: '#fff5f8', transition: 'all 0.2s' }}>
          <img src={logoImg} alt="Laços Maternos" style={{ height: '52px', borderRadius: '8px', objectFit: 'contain' }} />
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('inicio')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: currentPage === 'inicio' ? '#d85a80' : '#555', fontWeight: currentPage === 'inicio' ? 'bold' : 'normal' }}>Início</button>
          <button onClick={() => setCurrentPage('porque')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: currentPage === 'porque' ? '#d85a80' : '#555', fontWeight: currentPage === 'porque' ? 'bold' : 'normal' }}>Por que doar</button>
          <button onClick={() => setCurrentPage('triagem')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: currentPage === 'triagem' ? '#d85a80' : '#555', fontWeight: currentPage === 'triagem' ? 'bold' : 'normal' }}>Como funciona</button>
          <button onClick={() => setCurrentPage('bancos')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: currentPage === 'bancos' ? '#d85a80' : '#555', fontWeight: currentPage === 'bancos' ? 'bold' : 'normal' }}>Bancos de Leite</button>
          <button onClick={() => setCurrentPage('guia')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: currentPage === 'guia' ? '#d85a80' : '#555', fontWeight: currentPage === 'guia' ? 'bold' : 'normal' }}>Guia da Doadora</button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => isLoggedIn ? showToast(`Você já está logada como ${userEmail}`) : setIsLoginModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#222', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {isLoggedIn ? 'Minha Conta' : 'Entrar'}
          </button>
          <button onClick={() => setCurrentPage('triagem')} style={{ backgroundColor: '#d85a80', color: '#fff', border: '2px solid #f472b6', padding: '10px 24px', borderRadius: '999px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(216, 90, 128, 0.2)' }}>Quero Doar</button>
        </div>
      </header>

      {currentPage === 'inicio' && (
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#d85a80', marginBottom: '16px' }}>Cada gota faz a diferença</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto 32px' }}>Conectamos mães doadoras a bancos de leite humano com carinho, praticidade e segurança.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button onClick={() => setCurrentPage('triagem')} style={{ backgroundColor: '#d85a80', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Iniciar Pré-Triagem</button>
            <button onClick={() => setCurrentPage('bancos')} style={{ backgroundColor: '#fff', color: '#d85a80', border: '2px solid #d85a80', padding: '14px 32px', borderRadius: '999px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Buscar Bancos de Leite</button>
          </div>
        </main>
      )}

      {currentPage === 'porque' && (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '2rem', color: '#d85a80', marginBottom: '20px' }}>Por que ser uma Doadora?</h1>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <p style={{ lineHeight: '1.6', color: '#4b5563', fontSize: '1rem' }}>
              O leite materno é o alimento mais completo para o recém-nascido. Para bebês prematuros ou de baixo peso internados em UTIs neonatais, a doação de leite humano representa uma verdadeira chance de vida e recuperação rápida.
            </p>
            <button onClick={() => setCurrentPage('triagem')} style={{ marginTop: '20px', backgroundColor: '#d85a80', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }}>Quero me Cadastrar</button>
          </div>
        </main>
      )}

      {currentPage === 'guia' && (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '2rem', color: '#d85a80', marginBottom: '20px' }}>Guia Rápido da Doadora</h1>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #fbcfe8' }}>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#4b5563' }}>
              <li>Higienize bem as mãos e os braços até o cotovelo.</li>
              <li>Utilize máscara e lenço para prender os cabelos.</li>
              <li>Higienize o frasco de vidro com tampa de plástico fervendo por 15 minutos.</li>
              <li>Guarde o leite no congelador ou freezer por até 15 dias.</li>
            </ul>
          </div>
        </main>
      )}

      {currentPage === 'triagem' && (
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ backgroundColor: '#e8f4f0', color: '#2e7d5b', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '999px' }}>PASSO INICIAL ESSENCIAL</span>
            <h1 style={{ fontSize: '2rem', marginTop: '12px', marginBottom: '8px' }}>Vamos verificar algumas informações iniciais.</h1>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Esta pré-triagem baseia-se nos critérios básicos estabelecidos pela ANVISA e Fiocruz. Suas respostas nos ajudam a antecipar o processo para que sua doação seja o mais ágil possível.
            </p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px dashed #f9a8d4', borderRadius: '16px', padding: '32px', marginBottom: '28px', boxShadow: '0 4px 15px rgba(216, 90, 128, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#888', marginBottom: '16px' }}>
              <span>PERGUNTA ATUAL</span>
              <span>0{currentStep}/08</span>
            </div>
            
            {currentStep === 1 ? (
              <>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Você está amamentando ou produzindo leite excedente atualmente?</h2>
                <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '24px' }}>Para se tornar doadora de leite humano, é necessário estar saudável e apresentar uma produção excedente de leite para oferecer aos bebês necessitados.</p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Você faz uso de algum medicamento de uso contínuo?</h2>
                <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '24px' }}>Alguns medicamentos podem passar para o leite materno. Essa informação é analisada sigilosamente pela equipe do banco.</p>
              </>
            )}

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <button 
                onClick={() => { setSelectedOption(true); setCurrentStep(prev => prev < 8 ? prev + 1 : 8); showToast('Resposta registrada com sucesso!'); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: selectedOption ? '2px solid #d85a80' : '1px solid #e2e8f0', backgroundColor: selectedOption ? '#d85a80' : '#f8fafc', color: selectedOption ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer' }}
              >
                Sim, estou produzindo leite
              </button>
              <button 
                onClick={() => { setSelectedOption(false); showToast('Agradecemos seu interesse. Doações necessitam de excedente.'); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: !selectedOption ? '2px solid #d85a80' : '1px solid #e2e8f0', backgroundColor: !selectedOption ? '#d85a80' : '#f8fafc', color: !selectedOption ? '#fff' : '#334155', fontWeight: '600', cursor: 'pointer' }}
              >
                Não, ainda não produzo
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '10px 16px', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
              Seu cadastro é sigiloso. O Laços Maternos apoia a privacidade de todas as mães doadoras.
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px dashed #86efac', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#111827' }}>Pré-triagem concluída com sucesso!</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Você atende aos critérios prévios para ser uma doadora incrível de leite materno.</p>
              </div>
            </div>
            <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '24px' }}>
              <strong>O que acontece agora?</strong> Suas respostas indicam que você possui grande probabilidade de estar apta a iniciar o processo de doação de forma saudável. No entanto, a confirmação oficial e o fornecimento de exames de laboratório devem ser realizados por um profissional devidamente credenciado de um Banco de Leite Humano.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setCurrentPage('bancos')} style={{ backgroundColor: '#d85a80', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '999px', fontWeight: '600', cursor: 'pointer' }}>Encontrar Banco de Leite Próximo</button>
              <button onClick={handleDownloadPDF} style={{ backgroundColor: 'transparent', color: '#d85a80', border: '2px solid #d85a80', padding: '10px 22px', borderRadius: '999px', fontWeight: '600', cursor: 'pointer' }}>Salvar Resultados (PDF)</button>
            </div>
          </div>
        </main>
      )}

      {currentPage === 'bancos' && (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ backgroundColor: '#e8f4f0', color: '#2e7d5b', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '999px' }}>BUSCA POR PROXIMIDADE</span>
            <h1 style={{ fontSize: '2rem', marginTop: '12px', marginBottom: '20px' }}>Encontre um Banco de Leite</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', border: '2px solid #fbcfe8', padding: '10px 16px', borderRadius: '999px', width: '260px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <input 
                  type="text" 
                  value={searchCity} 
                  onChange={(e) => setSearchCity(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', fontWeight: 'bold', color: '#333', width: '100%' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Todos', 'Banco de Leite', 'Posto de Coleta', 'Coleta Domiciliar', 'Aberto Agora'].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => { setSelectedFilter(filter); showToast(`Filtro aplicado: ${filter}`); }}
                    style={{ backgroundColor: selectedFilter === filter ? '#d85a80' : '#fff', color: selectedFilter === filter ? '#fff' : '#4b5563', border: selectedFilter === filter ? '2px solid #d85a80' : '2px solid #e5e7eb', padding: '8px 16px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>{filteredLocations.length} PONTOS DE COLETA ENCONTRADOS</span>
              {filteredLocations.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedCard(idx)}
                  style={{ backgroundColor: '#fff', border: selectedCard === idx ? '2px solid #d85a80' : '2px solid #f3f4f6', borderRadius: '16px', padding: '18px', cursor: 'pointer', boxShadow: selectedCard === idx ? '0 8px 20px rgba(216, 90, 128, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#111827', margin: 0 }}>{loc.name}</h4>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{loc.distance}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0' }}>{loc.sub}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', backgroundColor: loc.open ? '#dcfce7' : '#fee2e2', color: loc.open ? '#15803d' : '#b91c1c' }}>
                      {loc.open ? 'ABERTO HOJE' : 'FECHADO'}
                    </span>
                    {loc.homeCollection && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 'normal', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                        Coleta em casa
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '6px' }}><strong>Endereço:</strong> {loc.address}</p>
                  {loc.phone && <p style={{ fontSize: '0.8rem', color: '#4b5563' }}><strong>Telefone:</strong> {loc.phone}</p>}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(loc); }} style={{ flex: 1, background: '#fff', border: '2px solid #e0e0e0', color: '#444', padding: '8px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Ver detalhes</button>
                    <button onClick={(e) => { e.stopPropagation(); handleContact(loc); }} style={{ flex: 1, background: '#d85a80', border: 'none', color: '#fff', padding: '8px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Contato</button>
                  </div>
                </div>
              ))}
            </div>

            <RealTimeMap points={filteredLocations} activeIndex={selectedCard} />
          </div>
        </main>
      )}
    </div>
  );
}