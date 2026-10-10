import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoImg from './imagens/lacos maternos imagem.png';
import './App.css';

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
    <div className="map-wrapper">
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
    <div className="app-container">
      
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      {isModalOpen && activeModalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{activeModalData.name}</h2>
            <p className="modal-subtitle">{activeModalData.sub}</p>
            <hr className="modal-divider" />
            <p className="modal-text"><strong>Endereço:</strong> {activeModalData.address}</p>
            <p className="modal-text"><strong>Telefone:</strong> {activeModalData.phone || 'Não informado'}</p>
            <p className="modal-text"><strong>Horário:</strong> {activeModalData.hours}</p>
            <p className="modal-text"><strong>Coleta Domiciliar:</strong> {activeModalData.homeCollection ? 'Sim' : 'Não'}</p>
            <div className="modal-buttons">
              <button onClick={() => handleContact(activeModalData)} className="btn-primary">Ligar Agora</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Acessar Conta</h2>
            <p className="modal-subtitle" style={{ marginBottom: '20px' }}>Entre para acompanhar suas doações e agendamentos.</p>
            <form onSubmit={handleLoginSubmit}>
              <div className="login-form-group">
                <label className="login-label">E-mail:</label>
                <input 
                  type="email" 
                  placeholder="seu-email@exemplo.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Entrar</button>
                <button type="button" onClick={() => setIsLoginModalOpen(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="header-container">
        <div onClick={() => setCurrentPage('inicio')} className="logo-box">
          <img src={logoImg} alt="Laços Maternos" className="logo-img" />
        </div>

        <nav className="nav-links">
          <button onClick={() => setCurrentPage('inicio')} className={`nav-btn ${currentPage === 'inicio' ? 'active' : 'inactive'}`}>Início</button>
          <button onClick={() => setCurrentPage('porque')} className={`nav-btn ${currentPage === 'porque' ? 'active' : 'inactive'}`}>Por que doar</button>
          <button onClick={() => setCurrentPage('triagem')} className={`nav-btn ${currentPage === 'triagem' ? 'active' : 'inactive'}`}>Como funciona</button>
          <button onClick={() => setCurrentPage('bancos')} className={`nav-btn ${currentPage === 'bancos' ? 'active' : 'inactive'}`}>Bancos de Leite</button>
          <button onClick={() => setCurrentPage('guia')} className={`nav-btn ${currentPage === 'guia' ? 'active' : 'inactive'}`}>Guia da Doadora</button>
        </nav>

        <div className="header-actions">
          <button onClick={() => isLoggedIn ? showToast(`Você já está logada como ${userEmail}`) : setIsLoginModalOpen(true)} className="login-btn">
            {isLoggedIn ? 'Minha Conta' : 'Entrar'}
          </button>
          <button onClick={() => setCurrentPage('triagem')} className="donate-btn">Quero Doar</button>
        </div>
      </header>

      {currentPage === 'inicio' && (
        <main className="hero-main">
          <h1 className="hero-title">Cada gota faz a diferença</h1>
          <p className="hero-text">Conectamos mães doadoras a bancos de leite humano com carinho, praticidade e segurança.</p>
          <div className="hero-buttons">
            <button onClick={() => setCurrentPage('triagem')} className="btn-fill">Iniciar Pré-Triagem</button>
            <button onClick={() => setCurrentPage('bancos')} className="btn-outline">Buscar Bancos de Leite</button>
          </div>
        </main>
      )}

      {currentPage === 'porque' && (
        <main className="content-section">
          <h1 className="section-title">Por que ser uma Doadora?</h1>
          <div className="card-box">
            <p className="card-text">
              O leite materno é o alimento mais completo para o recém-nascido. Para bebês prematuros ou de baixo peso internados em UTIs neonatais, a doação de leite humano representa uma verdadeira chance de vida e recuperação rápida.
            </p>
            <button onClick={() => setCurrentPage('triagem')} className="btn-fill" style={{ marginTop: '20px', padding: '12px 28px', fontSize: '1rem' }}>Quero me Cadastrar</button>
          </div>
        </main>
      )}

      {currentPage === 'guia' && (
        <main className="content-section">
          <h1 className="section-title">Guia Rápido da Doadora</h1>
          <div className="card-box">
            <ul className="guide-list">
              <li>Higienize bem as mãos e os braços até o cotovelo.</li>
              <li>Utilize máscara e lenço para prender os cabelos.</li>
              <li>Higienize o frasco de vidro com tampa de plástico fervendo por 15 minutos.</li>
              <li>Guarde o leite no congelador ou freezer por até 15 dias.</li>
            </ul>
          </div>
        </main>
      )}

      {currentPage === 'triagem' && (
        <main className="triagem-main">
          <div className="triagem-header">
            <span className="triagem-badge">PASSO INICIAL ESSENCIAL</span>
            <h1 className="triagem-heading">Vamos verificar algumas informações iniciais.</h1>
            <p className="triagem-subtext">
              Esta pré-triagem baseia-se nos critérios básicos estabelecidos pela ANVISA e Fiocruz. Suas respostas nos ajudam a antecipar o processo para que sua doação seja o mais ágil possível.
            </p>
          </div>

          <div className="triagem-card">
            <div className="triagem-step-header">
              <span>PERGUNTA ATUAL</span>
              <span>0{currentStep}/08</span>
            </div>
            
            {currentStep === 1 ? (
              <>
                <h2 className="triagem-question-title">Você está amamentando ou produzindo leite excedente atualmente?</h2>
                <p className="triagem-question-desc">Para se tornar doadora de leite humano, é necessário estar saudável e apresentar uma produção excedente de leite para oferecer aos bebês necessitados.</p>
              </>
            ) : (
              <>
                <h2 className="triagem-question-title">Você faz uso de algum medicamento de uso contínuo?</h2>
                <p className="triagem-question-desc">Alguns medicamentos podem passar para o leite materno. Essa informação é analisada sigilosamente pela equipe do banco.</p>
              </>
            )}

            <div className="triagem-options-group">
              <button 
                onClick={() => { setSelectedOption(true); setCurrentStep(prev => prev < 8 ? prev + 1 : 8); showToast('Resposta registrada com sucesso!'); }}
                className={selectedOption ? "triagem-option-btn-active" : "triagem-option-btn-inactive"}
              >
                Sim, estou produzindo leite
              </button>
              <button 
                onClick={() => { setSelectedOption(false); showToast('Agradecemos seu interesse. Doações necessitam de excedente.'); }}
                className={!selectedOption ? "triagem-option-btn-active" : "triagem-option-btn-inactive"}
              >
                Não, ainda não produzo
              </button>
            </div>

            <div className="triagem-privacy-box">
              Seu cadastro é sigiloso. O Laços Maternos apoia a privacidade de todas as mães doadoras.
            </div>
          </div>

          <div className="triagem-success-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#111827' }}>Pré-triagem concluída com sucesso!</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Você atende aos critérios prévios para ser uma doadora incrível de leite materno.</p>
              </div>
            </div>
            <p className="card-text" style={{ fontSize: '0.88rem', marginBottom: '24px' }}>
              <strong>O que acontece agora?</strong> Suas respostas indicam que você possui grande probabilidade de estar apta a iniciar o processo de doação de forma saudável. No entanto, a confirmação oficial e o fornecimento de exames de laboratório devem ser realizados por um profissional devidamente credenciado de um Banco de Leite Humano.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setCurrentPage('bancos')} className="btn-fill" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>Encontrar Banco de Leite Próximo</button>
              <button onClick={handleDownloadPDF} className="btn-outline" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>Salvar Resultados (PDF)</button>
            </div>
          </div>
        </main>
      )}

      {currentPage === 'bancos' && (
        <main className="bancos-main">
          <div style={{ marginBottom: '24px' }}>
            <span className="triagem-badge">BUSCA POR PROXIMIDADE</span>
            <h1 className="triagem-heading">Encontre um Banco de Leite</h1>

            <div className="search-filter-wrapper">
              <div className="search-input-box">
                <input 
                  type="text" 
                  value={searchCity} 
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="search-input" 
                />
              </div>

              <div className="filter-buttons-group">
                {['Todos', 'Banco de Leite', 'Posto de Coleta', 'Coleta Domiciliar', 'Aberto Agora'].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => { setSelectedFilter(filter); showToast(`Filtro aplicado: ${filter}`); }}
                    className={selectedFilter === filter ? "filter-btn-active" : "filter-btn-inactive"}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bancos-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>{filteredLocations.length} PONTOS DE COLETA ENCONTRADOS</span>
              {filteredLocations.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedCard(idx)}
                  className={`location-card ${selectedCard === idx ? 'selected' : 'unselected'}`}
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