/*
 "The curly braces are there to help the compiler figure out
 the scope of a variable, condition, function declaration, etc.
 It doesn't affect the runtime
 performance once the code is compiled into an executable."
 -- Stackoverflow
 http://stackoverflow.com/questions/633497/java-switch-cases-with-or-without-braces

 Verficar .JSCSRC
 */


var Model = {};


Model.abreTela = function abreTela(tela) {
    Model.nome("");
    Model.email("");
    Model.placa("Clique aqui");
    Model.resposta(new Model.objConsulta());
    Model.digitandoPlaca(false);
    Model.tela(tela);
};
Model.objConsulta = function (tipo, msg, dataConsulta) {
    var obj = {
        tipo: (tipo || ""),
        msg: (msg || ""),
        dataConsulta: (dataConsulta || "")
    };
    return obj;
};
Model.digitarPlaca = function digitarPlaca() {
    if (Model.placa() === "Clique aqui") {
        Model.placa("");
        Model.digitandoPlaca(true);
    }
};
Model.cadastrar = function cadastrar() {
    if (Model.consultando() === true) {
        return false;
    }
    if (!Model.podeCadastrar()) {
        alert("Digite corretamente seu nome e e-mail para se cadastrar.");
        return false;
    }
    Model.resposta(new Model.objConsulta("aguardando", "Aguarde.<br>Conectando à nossa base de dados..."));
    obterResposta();
};
Model.consultar = function consultar() {
    if(Model.tela() === "cadastro") {
        return Model.cadastrar();
    }
    if (Model.consultando() === true) {
        return false;
    }
    if (!Model.podeConsultar()) {
        alert("Digite corretamente uma placa para pesquisar.");
        return false;
    }
    Model.resposta(new Model.objConsulta("aguardando", "Aguarde.<br>Realizando consulta..."));
    obterResposta();
};
Model.consultarComEnter = function concluiConsulta(data, event) {
    var keycode = (event.which ? event.which : event.keycode);
    if (keycode === 13 && Model.podeConsultar()) {
        Model.consultar();
        return false;
    }
    return true;
};
Model.escolheCaptcha = function escolheCaptcha(botao) {
    botao.escolhido(!botao.escolhido());
};
Model.carregaCaptcha = function carregaCaptcha() {
    for(var i in Model.respostasCaptcha()) {
        Model.respostasCaptcha()[i].escolhido(false);
    }
    var d = new Date();
    var diferenciador = "&diferenciador=" + d.getTime();
    var pergunta = document.getElementById("pergunta");
    var img1 = document.getElementById("img1");
    var img2 = document.getElementById("img2");
    var img3 = document.getElementById("img3");
    var img4 = document.getElementById("img4");

    pergunta.style.backgroundImage = "url('" + Model.urlPlacaLegal() + "?idImg=0" + diferenciador + "')";
    img1.style.backgroundImage = "url('" + Model.urlPlacaLegal() + "?idImg=1" + diferenciador + "')";
    img2.style.backgroundImage = "url('" + Model.urlPlacaLegal() + "?idImg=2" + diferenciador + "')";
    img3.style.backgroundImage = "url('" + Model.urlPlacaLegal() + "?idImg=3" + diferenciador + "')";
    img4.style.backgroundImage = "url('" + Model.urlPlacaLegal() + "?idImg=4" + diferenciador + "')";

};
Model.formataResposta = function (dados) {
    var resposta = {};
    Model.captcha(false);
    if (dados.mensagemErro === "CAPTCHA") {
        Model.captcha(true);
        Model.carregaCaptcha();
        return;
    }
    if (dados.versao) {
        Model.info(dados);
        Model.versao(dados.versao);
        return;
    }
    var d = new Date();
    resposta.dataConsulta = zeros(d.getDate()) + "/" + zeros(d.getMonth() + 1) + "/" + d.getFullYear() + " " + zeros(d.getHours()) + ":" + zeros(d.getMinutes());
    if (dados.sucesso === false || dados.mensagemErro) {
        resposta.tipo = "erro";
        resposta.msg = dados.mensagemErro ? dados.mensagemErro : "Desculpe-nos. Ocorreu um erro e não foi possível realizar a consulta.";
        Model.resposta(resposta);
        return;
    }
    if (dados.tempoEsperaProximoAcesso > 0) {
        var t = dados.tempoEsperaProximoAcesso;
        var tempo = "";
        if (t > 59) {
            tempo = (t / 60).toFixed() + " minuto";
            tempo = tempo + (((t / 60).toFixed() > 1) ? "s" : "");
        }
        if (t % 60 > 1) {
            tempo = tempo + " e " + (t % 60);
        }
        if (t % 60 > 1 || t < 60) {
            tempo = tempo + " segundos.";
        }
        resposta.tipo = "excesso";
        resposta.msg = "Excesso de consultas no período. Tente novamente daqui a " + tempo;
        Model.resposta(resposta);
        return;
    }
    if (Model.tela() === "cadastro") {
        resposta.msg = dados.mensagemErro;
        if (dados.sucesso) {
            resposta.tipo = "cadastro_sucesso";
        } else {
            resposta.tipo = "cadastro_falha";
        }
        Model.resposta(resposta);
        return;
    }
    if (dados.marcaModelo) {
        resposta.msg = dados.marcaModelo + " / " + dados.cor;
        if (dados.veiculoRoubado) {
            resposta.tipo = "roubado";
        } else {
            resposta.tipo = "limpo";
        }
        Model.resposta(resposta);
        return;
    }
};


Model.tela = ko.observable('consulta');
Model.info = ko.observable();
Model.captcha = ko.observable(false);
Model.versao = ko.observable();
Model.placa = ko.observable("Clique aqui");
Model.digitandoPlaca = ko.observable(false);
Model.nome = ko.observable("");
Model.email = ko.observable("");
Model.resposta = ko.observable(new Model.objConsulta());
Model.cssPlaca = ko.computed(function () {
    var resposta = Model.resposta();
    return Model.resposta().tipo;
}, Model);
Model.urlPlacaLegal = ko.observable("/placa-legal-web/remote/placaLegal");
Model.urlCadastroCidadao = ko.observable("/placa-legal-web/remote/cadastroCidadao");
Model.consultando = ko.observable(false);
Model.podeCadastrar = ko.computed(function () {
    var nome = /[a-zA-Z]{3}/.test(this.nome().substring(0, 3));
    var email = /([a-z0-9_.-]{3})@([a-z0-9_-]+\.+[a-z0-9_-]{2})/.test(this.email().toLowerCase());
    return (nome && email) ? true : false;
}, Model);
Model.podeConsultar = ko.computed(function () {
    var letras = /[a-zA-Z]{3}/.test(this.placa().substring(0, 3));
    var numeros = !isNaN(this.placa().substring(3));
    return (this.placa().length === 7 && letras && numeros) ? true : false;
}, Model);
Model.respostasCaptcha = ko.observableArray(
    [
        { id: 1, escolhido: ko.observable(false) },
        { id: 2, escolhido: ko.observable(false) },
        { id: 3, escolhido: ko.observable(false) },
        { id: 4, escolhido: ko.observable(false) }
    ]
);

function zeros(num) {
    var retorno = num;
    num = parseInt(num);
    if(!isNaN(num)) {
        if (num == 0) {
            retorno = "00";
        } 
        if (num < 9) {
            retorno = "0" + num;
        }
    }
    return retorno;
}

function obterResposta(tipo) {
    var usarAjax = true;
    var url = "", parametros = "";
    switch (Model.tela()) {
        case 'consulta':
            parametros = "?versaoApp=1.0-SNAPSHOT&placa=" + Model.placa();
            url = Model.urlPlacaLegal();
            break;
        case 'cadastro':
            parametros = "?nome=" + Model.nome() + "&email=" + Model.email();
            url = Model.urlCadastroCidadao();
            break;
        case 'contrato':
            url = "js/mock_contrato.json";
            break;
    }
    if (Model.captcha()) {
        var respostasCaptcha = Model.respostasCaptcha();
        var arrayResposta = [];
        for (var i = 0; i < respostasCaptcha.length; i++) {
            var respostaCaptcha = respostasCaptcha[i];
            arrayResposta.push(respostaCaptcha.escolhido() ? 1 : 0);
        }
        parametros = parametros + '&resposta=' + arrayResposta.join(',');
    }
    if (usarAjax) {
        setTimeout(function () {
            var resposta = consultaAjax(url + parametros);
        }, 500);
    } else {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url + parametros + '&cb=Model.formataResposta');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    }
}


// Ajax
var xmlHttp = GetXmlHttpObject();
function consultaAjax(url) {
    if (xmlHttp === null) {
        alert("Seu browser não suporta AJAX!");
        return;
    } else {
        xmlHttp.onreadystatechange = stateChanged;
        try {
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        } catch (e) {
            Model.resposta(new Model.objConsulta("erro", "Acesso negado. Não foi possível obter informações."));
        }
    }
}

function stateChanged() {
    var tipo = "", msg = "";
    if (xmlHttp.readyState === 1 || xmlHttp.readyState === 2 || xmlHttp.readyState === 3) {
        Model.consultando(true);
    }
    if (xmlHttp.readyState === 4) {
        Model.consultando(false);
        if (xmlHttp.status === 200) {
            if (xmlHttp.responseText !== "") {
                eval("resposta = " + xmlHttp.responseText + ";");
                Model.formataResposta(resposta);
                return;
            } else {
                tipo = "erro";
                msg = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
            }
        } else {
            tipo = "erro";
            switch (xmlHttp.status) {
                case 0:
                    msg = "Desculpe-nos. Não foi possível realizar a operação.";
                    break;
                case 404:
                    msg = "Não foi possível acessar a fonte de dados.";
                    break;
                case 500:
                    msg = "Desculpe-nos. Ocorreu um erro no servidor.";
                    break;
                default: {
                    msg = "Não foi possível realizar a operação. Verifique sua conexão com a internet.";
                    break;
                }
            }
        }
        Model.resposta(new Model.objConsulta(tipo, msg));
    }
}

function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}
