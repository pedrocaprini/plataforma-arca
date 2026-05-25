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
    prefeitura: ["tela-home-prefeitura", "tela-denuncias", "tela-resgates", "tela-relatorios", "tela-campanhas", "tela-solicitacoes", "tela-perfil"]
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
    document.getElementById("tela-login").style.display = "flex";
    document.getElementById("tela-login").classList.add("ativa");

    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("msg-login").textContent = "";
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

function abrirAjuda() {
    alert("Central de ajuda do Programa ARCA. Para suporte, ligue para (27) 3252-9000 ou envie um e-mail para arca@serra.es.gov.br.");
}

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
