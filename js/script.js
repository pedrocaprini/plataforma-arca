const USUARIOS = {
    "tutor": { senha: "123456", perfil: "tutor", home: "tela-home-tutor", nome: "Tutor" },
    "candidato": { senha: "cand!098", perfil: "candidato", home: "tela-home-candidato", nome: "Candidato a adotante" },
    "Ong": { senha: "ong$-135", perfil: "ong", home: "tela-home-ong", nome: "ONG" },
    "prefeitura": { senha: "pref@456", perfil: "prefeitura", home: "tela-home-prefeitura", nome: "Prefeitura" }
};

const PERMISSOES = {
    tutor: ["tela-home-tutor", "tela-adocao", "tela-detalhe-animal", "tela-favoritos", "tela-agendamento", "tela-clinica", "tela-solicitacoes", "tela-perfil"],
    candidato: ["tela-home-candidato", "tela-adocao", "tela-detalhe-animal", "tela-favoritos", "tela-filtro", "tela-fale-ong", "tela-solicitacoes", "tela-perfil"],
    ong: ["tela-home-ong", "tela-crud-animais", "tela-meus-animais", "tela-mensagens", "tela-voluntarios", "tela-favoritos", "tela-solicitacoes", "tela-perfil"],
    prefeitura: ["tela-home-prefeitura", "tela-denuncias", "tela-resgates", "tela-relatorios", "tela-campanhas", "tela-solicitacoes", "tela-perfil"],
    anonimo: ["tela-home-anonimo", "tela-denuncia-anonima", "tela-resgate-anonimo", "tela-adocao", "tela-detalhe-animal"]
};

const ANIMAIS_INICIAIS = [
    { id: 1, nome: "Mel", especie: "Cachorro", idade: 2, sexo: "Fêmea", porte: "Médio", ambiente: "Casa", foto: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400", descricao: "Carinhosa, brinca com crianças e adora passeio." },
    { id: 2, nome: "Max", especie: "Cachorro", idade: 7, sexo: "Macho", porte: "Grande", ambiente: "Casa", foto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", descricao: "Calmo, ideal para famílias com quintal." },
    { id: 3, nome: "Jorgin", especie: "Gato", idade: 1, sexo: "Macho", porte: "Pequeno", ambiente: "Apartamento", foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400", descricao: "Brincalhão e independente, gosta de carinho." },
    { id: 4, nome: "Luna", especie: "Gato", idade: 3, sexo: "Fêmea", porte: "Pequeno", ambiente: "Apartamento", foto: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400", descricao: "Tranquila, vive bem em apartamento." }
];

let estado = {
    usuarioLogado: null,
    perfilAtual: null,
    telaAtual: null,
    historico: [],
    animais: [...ANIMAIS_INICIAIS],
    proximoId: 5,
    favoritos: [],
    animalEmDetalhe: null,
    filtros: {}
};

function fazerLogin(evento) {
    evento.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const msg = document.getElementById("msg-login");

    const dados = USUARIOS[usuario];

    if (!dados) {
        msg.textContent = "Usuário não encontrado.";
        return;
    }

    if (dados.senha !== senha) {
        msg.textContent = "Senha incorreta.";
        return;
    }

    msg.textContent = "";
    estado.usuarioLogado = usuario;
    estado.perfilAtual = dados.perfil;

    document.getElementById("tela-login").classList.remove("ativa");
    document.getElementById("tela-login").style.display = "none";
    document.getElementById("app").classList.remove("oculto");

    document.getElementById("perfil-usuario").textContent = usuario;
    document.getElementById("perfil-tipo").textContent = dados.nome;

    estado.historico = [];
    mostrarTela(dados.home);
    renderizarTudo();
}

function sair() {
    estado.usuarioLogado = null;
    estado.perfilAtual = null;
    estado.historico = [];

    document.getElementById("app").classList.add("oculto");
    document.getElementById("tela-cadastro").classList.remove("ativa");
    document.getElementById("tela-cadastro").style.display = "none";
    document.getElementById("tela-login").style.display = "flex";
    document.getElementById("tela-login").classList.add("ativa");

    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("msg-login").textContent = "";
}

function entrarAnonimo() {
    estado.usuarioLogado = "anonimo";
    estado.perfilAtual = "anonimo";
    estado.historico = [];

    document.getElementById("tela-login").classList.remove("ativa");
    document.getElementById("tela-login").style.display = "none";
    document.getElementById("app").classList.remove("oculto");

    document.getElementById("perfil-usuario").textContent = "Visitante anônimo";
    document.getElementById("perfil-tipo").textContent = "Anônimo";

    mostrarTela("tela-home-anonimo");
}

function abrirCadastro(evento) {
    if (evento) evento.preventDefault();
    document.getElementById("tela-login").classList.remove("ativa");
    document.getElementById("tela-login").style.display = "none";
    document.getElementById("tela-cadastro").style.display = "flex";
    document.getElementById("tela-cadastro").classList.add("ativa");
}

function voltarLogin() {
    document.getElementById("tela-cadastro").classList.remove("ativa");
    document.getElementById("tela-cadastro").style.display = "none";
    document.getElementById("tela-login").style.display = "flex";
    document.getElementById("tela-login").classList.add("ativa");
    document.getElementById("msg-cadastro").textContent = "";
}

function criarConta(evento) {
    evento.preventDefault();
    const nome = document.getElementById("cad-nome").value.trim();
    const email = document.getElementById("cad-email").value.trim();
    const usuario = document.getElementById("cad-usuario").value.trim();
    const senha = document.getElementById("cad-senha").value;
    const perfil = document.getElementById("cad-perfil").value;
    const msg = document.getElementById("msg-cadastro");

    if (USUARIOS[usuario]) {
        msg.textContent = "Esse nome de usuário já existe.";
        return;
    }

    const homes = { tutor: "tela-home-tutor", candidato: "tela-home-candidato", ong: "tela-home-ong" };
    const nomes = { tutor: "Tutor", candidato: "Candidato a adotante", ong: "ONG" };

    USUARIOS[usuario] = { senha: senha, perfil: perfil, home: homes[perfil], nome: nomes[perfil] };

    msg.style.color = "#2E8C7A";
    msg.textContent = "Conta criada com sucesso! Fazendo login...";

    setTimeout(function () {
        msg.style.color = "";
        msg.textContent = "";
        voltarLogin();
        document.getElementById("usuario").value = usuario;
        document.getElementById("senha").value = senha;
    }, 900);
}

function enviarDenunciaAnonima(evento) {
    evento.preventDefault();
    const protocolo = Math.floor(20000 + Math.random() * 9000);
    alert("Denúncia anônima registrada com sucesso!\nProtocolo: #" + protocolo + "\n\nA prefeitura irá analisar e tomar as devidas providências.");
    document.querySelector("#tela-denuncia-anonima form").reset();
    mostrarTela("tela-home-anonimo");
}

function enviarResgateAnonimo(evento) {
    evento.preventDefault();
    const protocolo = Math.floor(30000 + Math.random() * 9000);
    alert("Pedido de resgate registrado!\nProtocolo: #" + protocolo + "\n\nA equipe de resgate será acionada o quanto antes.");
    document.querySelector("#tela-resgate-anonimo form").reset();
    mostrarTela("tela-home-anonimo");
}

function mostrarTela(idTela, semHistorico) {
    if (estado.perfilAtual && !PERMISSOES[estado.perfilAtual].includes(idTela)) {
        alert("Esta tela não está disponível para o seu perfil.");
        return;
    }

    document.querySelectorAll("#app .tela").forEach(function (t) {
        t.classList.remove("ativa");
    });

    const alvo = document.getElementById(idTela);
    if (!alvo) return;
    alvo.classList.add("ativa");

    if (!semHistorico && estado.telaAtual && estado.telaAtual !== idTela) {
        estado.historico.push(estado.telaAtual);
    }
    estado.telaAtual = idTela;

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (idTela === "tela-adocao") renderizarAnimais("grid-animais", estado.animais);
    if (idTela === "tela-meus-animais") renderizarAnimais("meus-animais-lista", estado.animais);
    if (idTela === "tela-favoritos") renderizarFavoritos();
    if (idTela === "tela-crud-animais") {
        renderizarTabelaAnimais();
        limparForm();
    }
}

function voltar() {
    if (estado.historico.length === 0) {
        irHome();
        return;
    }
    const anterior = estado.historico.pop();
    mostrarTela(anterior, true);
}

function irHome() {
    const dados = USUARIOS[estado.usuarioLogado];
    if (!dados) return;
    estado.historico = [];
    mostrarTela(dados.home, true);
}

const PASSOS_TOUR = {
    tutor: [
        { seletor: '[data-tour="logo"]', titulo: "Bem-vindo(a) ao ARCA!", texto: "Este é o cabeçalho do app. Sempre que ficar perdido(a), volte ao topo da tela." },
        { seletor: '[data-tour="voltar"]', titulo: "Botão voltar", texto: "Use este botão para retornar à tela anterior a qualquer momento." },
        { seletor: '[data-tour="ajuda"]', titulo: "Botão de ajuda", texto: "Clique no '?' sempre que quiser refazer este tour guiado." },
        { seletor: '[data-tour="card-adocao"]', titulo: "1 - Adoção", texto: "Clique aqui para conhecer animais disponíveis para adoção.", telaAlvo: "tela-home-tutor" },
        { seletor: '[data-tour="card-agendamento"]', titulo: "2 - Agendamento", texto: "Aqui você agenda serviços como castração, vacinação e check-up.", telaAlvo: "tela-home-tutor" },
        { seletor: '[data-tour="nav-favoritos"]', titulo: "3 - Favoritos", texto: "Animais que você marcar com o marcador ficam guardados aqui." },
        { seletor: '[data-tour="nav-solicit"]', titulo: "4 - Solicitações", texto: "Acompanhe o andamento das suas denúncias, adoções e agendamentos." },
        { seletor: '[data-tour="nav-perfil"]', titulo: "5 - Meu Perfil", texto: "Veja e gerencie seus dados de conta." },
        { seletor: '[data-tour="nav-sair"]', titulo: "6 - Sair", texto: "Quando terminar de usar, clique aqui para sair com segurança." }
    ],
    candidato: [
        { seletor: '[data-tour="logo"]', titulo: "Olá, futuro adotante!", texto: "Vamos te mostrar como encontrar seu novo melhor amigo." },
        { seletor: '[data-tour="card-adotar"]', titulo: "1 - Adotar", texto: "Clique aqui para ver todos os animais disponíveis para adoção.", telaAlvo: "tela-home-candidato" },
        { seletor: '[data-tour="nav-favoritos"]', titulo: "2 - Favoritos", texto: "Marque animais que você gostou para não perdê-los de vista." },
        { seletor: '[data-tour="nav-solicit"]', titulo: "3 - Solicitações", texto: "Veja o status dos seus pedidos de adoção." },
        { seletor: '[data-tour="ajuda"]', titulo: "Precisa de ajuda?", texto: "Clique no '?' a qualquer momento para refazer esse passo a passo." }
    ],
    ong: [
        { seletor: '[data-tour="logo"]', titulo: "Painel da ONG", texto: "Aqui você gerencia os animais e o relacionamento com candidatos." },
        { seletor: '[data-tour="card-cadastrar"]', titulo: "1 - Cadastrar Animal", texto: "Clique para adicionar, editar ou excluir os animais da sua ONG.", telaAlvo: "tela-home-ong" },
        { seletor: '[data-tour="nav-favoritos"]', titulo: "2 - Acompanhar interesse", texto: "Veja quais animais estão sendo favoritados pelos visitantes." },
        { seletor: '[data-tour="nav-perfil"]', titulo: "3 - Perfil da ONG", texto: "Mantenha os dados da sua ONG atualizados." },
        { seletor: '[data-tour="ajuda"]', titulo: "Refazer o tour", texto: "Clique no '?' sempre que precisar rever as funções." }
    ],
    prefeitura: [
        { seletor: '[data-tour="logo"]', titulo: "Painel da Prefeitura", texto: "Acompanhe denúncias, resgates e relatórios da região." },
        { seletor: '[data-tour="card-denuncias"]', titulo: "1 - Denúncias", texto: "Clique aqui para visualizar e atender denúncias da população.", telaAlvo: "tela-home-prefeitura" },
        { seletor: '[data-tour="nav-solicit"]', titulo: "2 - Solicitações", texto: "Veja o histórico de todas as solicitações atendidas." },
        { seletor: '[data-tour="ajuda"]', titulo: "Refazer o tour", texto: "Use o '?' a qualquer momento para rever este passo a passo." }
    ],
    anonimo: [
        { seletor: '[data-tour="logo"]', titulo: "Você está anônimo", texto: "Você pode registrar denúncias e pedidos de resgate sem se identificar." },
        { seletor: '.card-menu.destaque', titulo: "1 - Denúncia anônima", texto: "Clique aqui para registrar uma denúncia de maus-tratos ou abandono.", telaAlvo: "tela-home-anonimo" },
        { seletor: '[data-tour="ajuda"]', titulo: "Precisa de ajuda?", texto: "Clique no '?' a qualquer momento para rever este tour." }
    ]
};

let tourEstado = { passos: [], indice: 0, ativo: false };

function iniciarTour() {
    const passos = PASSOS_TOUR[estado.perfilAtual];
    if (!passos || passos.length === 0) {
        alert("Tour não disponível para este perfil.");
        return;
    }
    tourEstado.passos = passos;
    tourEstado.indice = 0;
    tourEstado.ativo = true;
    document.getElementById("tour-overlay").classList.remove("oculto");
    mostrarPassoTour();
}

function mostrarPassoTour() {
    const passo = tourEstado.passos[tourEstado.indice];
    if (!passo) {
        encerrarTour();
        return;
    }

    if (passo.telaAlvo && estado.telaAtual !== passo.telaAlvo) {
        mostrarTela(passo.telaAlvo, true);
    }

    setTimeout(function () {
        const alvo = document.querySelector(passo.seletor);
        const spotlight = document.getElementById("tour-spotlight");
        const tooltip = document.getElementById("tour-tooltip");

        document.getElementById("tour-titulo").textContent = passo.titulo;
        document.getElementById("tour-texto").textContent = passo.texto;
        document.getElementById("tour-progresso").textContent = (tourEstado.indice + 1) + " / " + tourEstado.passos.length;

        document.getElementById("tour-anterior").style.visibility = tourEstado.indice === 0 ? "hidden" : "visible";
        document.getElementById("tour-proximo").textContent = tourEstado.indice === tourEstado.passos.length - 1 ? "Concluir" : "Próximo";

        if (!alvo) {
            spotlight.style.display = "none";
            tooltip.style.top = "50%";
            tooltip.style.left = "50%";
            tooltip.style.transform = "translate(-50%, -50%)";
            return;
        }

        const rect = alvo.getBoundingClientRect();
        spotlight.style.display = "block";
        spotlight.style.top = (rect.top - 6) + "px";
        spotlight.style.left = (rect.left - 6) + "px";
        spotlight.style.width = (rect.width + 12) + "px";
        spotlight.style.height = (rect.height + 12) + "px";

        const tooltipAltura = 200;
        const tooltipLargura = 320;
        let top = rect.bottom + 14;
        let left = rect.left + (rect.width / 2) - (tooltipLargura / 2);

        if (top + tooltipAltura > window.innerHeight) {
            top = rect.top - tooltipAltura - 14;
        }
        if (top < 10) top = 10;
        if (left < 10) left = 10;
        if (left + tooltipLargura > window.innerWidth - 10) {
            left = window.innerWidth - tooltipLargura - 10;
        }

        tooltip.style.top = top + "px";
        tooltip.style.left = left + "px";
        tooltip.style.transform = "none";
    }, 80);
}

function tourProximo() {
    if (tourEstado.indice >= tourEstado.passos.length - 1) {
        encerrarTour();
        return;
    }
    tourEstado.indice++;
    mostrarPassoTour();
}

function tourAnterior() {
    if (tourEstado.indice === 0) return;
    tourEstado.indice--;
    mostrarPassoTour();
}

function encerrarTour() {
    tourEstado.ativo = false;
    document.getElementById("tour-overlay").classList.add("oculto");
}

window.addEventListener("resize", function () {
    if (tourEstado.ativo) mostrarPassoTour();
});

function renderizarAnimais(idContainer, lista) {
    const cont = document.getElementById(idContainer);
    if (!cont) return;

    if (lista.length === 0) {
        cont.innerHTML = '<p class="vazio">Nenhum animal encontrado.</p>';
        return;
    }

    cont.innerHTML = "";
    lista.forEach(function (a) {
        const card = document.createElement("article");
        card.className = "card-animal";
        card.onclick = function () { abrirDetalhe(a.id); };
        card.innerHTML =
            '<img src="' + (a.foto || placeholderImg(a.nome)) + '" alt="' + a.nome + '" onerror="this.src=\'' + placeholderImg(a.nome) + '\'">' +
            '<div class="info"><h3>' + a.nome + '</h3><p>' + a.sexo + ' · ' + a.idade + ' ' + (a.idade === 1 ? "ano" : "anos") + '</p></div>';
        cont.appendChild(card);
    });
}

function placeholderImg(nome) {
    const letra = encodeURIComponent((nome || "?").charAt(0).toUpperCase());
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23A6D9C5'/><text x='100' y='115' font-size='80' text-anchor='middle' fill='%232E8C7A' font-family='Alice'>" + letra + "</text></svg>";
}

function abrirDetalhe(idAnimal) {
    const a = estado.animais.find(function (x) { return x.id === idAnimal; });
    if (!a) return;

    estado.animalEmDetalhe = a.id;
    document.getElementById("detalhe-img").src = a.foto || placeholderImg(a.nome);
    document.getElementById("detalhe-img").alt = a.nome;
    document.getElementById("detalhe-nome").textContent = a.nome;
    document.getElementById("detalhe-info").textContent = a.especie + " · " + a.sexo + " · " + a.idade + " anos · Porte " + a.porte;
    document.getElementById("detalhe-descricao").textContent = a.descricao || "Sem descrição disponível.";

    mostrarTela("tela-detalhe-animal");
}

function favoritarAtual() {
    if (!estado.animalEmDetalhe) return;
    const id = estado.animalEmDetalhe;
    const idx = estado.favoritos.indexOf(id);
    if (idx === -1) {
        estado.favoritos.push(id);
        alert("Animal adicionado aos favoritos!");
    } else {
        estado.favoritos.splice(idx, 1);
        alert("Animal removido dos favoritos.");
    }
}

function adotarAtual() {
    if (!estado.animalEmDetalhe) return;
    const a = estado.animais.find(function (x) { return x.id === estado.animalEmDetalhe; });
    if (!a) return;
    alert("Pedido de adoção do " + a.nome + " enviado! A ONG entrará em contato em breve.");
    mostrarTela("tela-solicitacoes");
}

function renderizarFavoritos() {
    const cont = document.getElementById("lista-favoritos");
    if (!cont) return;

    const lista = estado.animais.filter(function (a) {
        return estado.favoritos.indexOf(a.id) !== -1;
    });

    if (lista.length === 0) {
        cont.innerHTML = '<p class="vazio">Você ainda não favoritou nenhum animal.</p>';
        return;
    }

    cont.innerHTML = "";
    lista.forEach(function (a) {
        const item = document.createElement("article");
        item.className = "item-favorito";
        item.onclick = function () { abrirDetalhe(a.id); };
        item.innerHTML =
            '<img src="' + (a.foto || placeholderImg(a.nome)) + '" alt="' + a.nome + '" onerror="this.src=\'' + placeholderImg(a.nome) + '\'">' +
            '<div class="info"><h3>' + a.nome + '</h3><p>' + a.sexo + ' · ' + a.idade + ' anos</p></div>' +
            '<span aria-hidden="true">🔖</span>';
        cont.appendChild(item);
    });
}

function aplicarFiltro(evento) {
    evento.preventDefault();
    const especie = document.getElementById("filtro-especie").value;
    const porte = document.getElementById("filtro-porte").value;
    const sexo = document.getElementById("filtro-sexo").value;
    const ambiente = document.getElementById("filtro-ambiente").value;

    const resultado = estado.animais.filter(function (a) {
        return (!especie || a.especie === especie)
            && (!porte || a.porte === porte)
            && (!sexo || a.sexo === sexo)
            && (!ambiente || a.ambiente === ambiente);
    });

    alert(resultado.length + " animais encontrados.");
    mostrarTela("tela-adocao");
    renderizarAnimais("grid-animais", resultado);
}

function alternarAba(botao, qual) {
    const irmaos = botao.parentElement.querySelectorAll(".aba");
    irmaos.forEach(function (b) { b.classList.remove("ativa"); });
    botao.classList.add("ativa");
}

function agendar(servico) {
    alert("Agendamento de " + servico + " confirmado! Você receberá uma notificação 1 dia antes.");
}

function salvarAnimal(evento) {
    evento.preventDefault();
    const id = document.getElementById("animal-id").value;
    const dados = {
        nome: document.getElementById("animal-nome").value.trim(),
        especie: document.getElementById("animal-especie").value,
        idade: parseInt(document.getElementById("animal-idade").value, 10),
        sexo: document.getElementById("animal-sexo").value,
        porte: document.getElementById("animal-porte").value,
        ambiente: document.getElementById("animal-ambiente").value,
        foto: document.getElementById("animal-foto").value.trim(),
        descricao: document.getElementById("animal-descricao").value.trim()
    };

    if (id) {
        const indice = estado.animais.findIndex(function (a) { return a.id === parseInt(id, 10); });
        if (indice !== -1) {
            estado.animais[indice] = Object.assign({}, estado.animais[indice], dados);
            alert("Animal atualizado com sucesso!");
        }
    } else {
        dados.id = estado.proximoId++;
        estado.animais.push(dados);
        alert("Animal cadastrado com sucesso!");
    }

    limparForm();
    renderizarTabelaAnimais();
    atualizarEstatisticas();
}

function editarAnimal(id) {
    const a = estado.animais.find(function (x) { return x.id === id; });
    if (!a) return;

    document.getElementById("animal-id").value = a.id;
    document.getElementById("animal-nome").value = a.nome;
    document.getElementById("animal-especie").value = a.especie;
    document.getElementById("animal-idade").value = a.idade;
    document.getElementById("animal-sexo").value = a.sexo;
    document.getElementById("animal-porte").value = a.porte;
    document.getElementById("animal-ambiente").value = a.ambiente;
    document.getElementById("animal-foto").value = a.foto || "";
    document.getElementById("animal-descricao").value = a.descricao || "";

    document.getElementById("titulo-form-animal").textContent = "Editar Animal";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirAnimal(id) {
    const a = estado.animais.find(function (x) { return x.id === id; });
    if (!a) return;
    const ok = confirm("Excluir o animal " + a.nome + "?");
    if (!ok) return;

    estado.animais = estado.animais.filter(function (x) { return x.id !== id; });
    estado.favoritos = estado.favoritos.filter(function (favId) { return favId !== id; });

    renderizarTabelaAnimais();
    atualizarEstatisticas();
}

function limparForm() {
    document.getElementById("animal-id").value = "";
    document.getElementById("animal-nome").value = "";
    document.getElementById("animal-especie").value = "";
    document.getElementById("animal-idade").value = "";
    document.getElementById("animal-sexo").value = "";
    document.getElementById("animal-porte").value = "";
    document.getElementById("animal-ambiente").value = "";
    document.getElementById("animal-foto").value = "";
    document.getElementById("animal-descricao").value = "";
    document.getElementById("titulo-form-animal").textContent = "Cadastrar Animal";
}

function renderizarTabelaAnimais() {
    const cont = document.getElementById("tabela-animais");
    if (!cont) return;

    if (estado.animais.length === 0) {
        cont.innerHTML = '<p class="vazio">Nenhum animal cadastrado ainda.</p>';
        return;
    }

    cont.innerHTML = "";
    estado.animais.forEach(function (a) {
        const linha = document.createElement("div");
        linha.className = "linha-animal";
        linha.innerHTML =
            '<img src="' + (a.foto || placeholderImg(a.nome)) + '" alt="' + a.nome + '" onerror="this.src=\'' + placeholderImg(a.nome) + '\'">' +
            '<div class="info"><strong>' + a.nome + '</strong><small>' + a.especie + ' · ' + a.sexo + ' · ' + a.idade + ' anos · ' + a.porte + '</small></div>' +
            '<div class="acoes">' +
                '<button onclick="editarAnimal(' + a.id + ')" aria-label="Editar">✏️</button>' +
                '<button class="btn-excluir" onclick="excluirAnimal(' + a.id + ')" aria-label="Excluir">🗑️</button>' +
            '</div>';
        cont.appendChild(linha);
    });
}

function atualizarEstatisticas() {
    const stat = document.getElementById("stat-total-animais");
    if (stat) stat.textContent = estado.animais.length;
}

function renderizarTudo() {
    renderizarAnimais("grid-animais", estado.animais);
    renderizarAnimais("meus-animais-lista", estado.animais);
    renderizarTabelaAnimais();
    renderizarFavoritos();
    atualizarEstatisticas();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("app").classList.add("oculto");
});
