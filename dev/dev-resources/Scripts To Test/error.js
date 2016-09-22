Ext.namespace('Techne.Format');
Ext.namespace('Techne.Validation');

Techne.Format.diaMesAno = function(value) {
    if (typeof(value) == Date) {
        return Ext.util.Format.date(value, 'd/m/Y');
    } else {
        var data = Date.parseDate(value, 'm/d/Y');
        if (data) {
            return Ext.util.Format.date(data, 'd/m/Y');
        } else {
            return value;
        }
    }
}

Techne.Format.percent = function(value) {
    return Ext.util.Format.number(value * 100, '000,00/i');
};

Techne.Format.duasCasasDecimais = function(value) {
    return Ext.util.Format.number(value, '000,00/i');
};

Techne.Format.umaCasaDecimal = function(value) {
    return Ext.util.Format.number(value, '00,0/i');
};

// ------------------ Valicaoes ----------------------
// ****************** Essa é a função Default de validação do GridEditável, e NÃO deve ser alterada. ************************//
Techne.Validation.validacaoDefaulfGrid = function(novoValor, valorAntigo, nomeColuna, registro) {
    var valido = true;
    var msgJs = '';

    /* ------------- Aqui deveria ir a lógica de validação ------------ */
    //	if(nomeColuna == 'notaAluno' && novoValor<4){
    //		valido=false;
    //		msgJs='Nota muito baixa!';
    //	}
    //	if(nomeColuna == 'works' && novoValor=='Item 2'){
    //		valido=false;
    //		msgJs='Escolha o Item 1';
    //	}
    /* ----------------------------------------------------------------- */

    var retornoValida = {
        // parametro para dizer se será chamado um método java na validação
        chamaMetodoJava: false,
        // objeto js que será transformado no DataMao passado ao método java de validação
        parametrosMetodoJava: {
            novoValor: novoValor,
            valorAntigo: valorAntigo,
            nomeColuna: nomeColuna,
            registro: registro
        },
        // caso a validação seja somente js, essa variável será um booleano definido se o dado é valido ou não
        valido: valido,
        // mensagem de erro que será exibida se a validação via JS retornar que o campo não é válido
        msgJs: msgJs
    };
    return retornoValida;
};
//**************************************************************************************************************************//
Techne.Validation.validacaoLancNotas = function(novoValor, valorAntigo, nomeColuna, registro) {
    var valido = false;
    var msgJs = '';
    var retornoValida = {
        chamaMetodoJava: true,
        parametrosMetodoJava: {
            novoValor: novoValor,
            valorAntigo: valorAntigo,
            nomeColuna: nomeColuna,
            registro: registro
        },
        valido: valido,
        msgJs: msgJs
    };
    return retornoValida;
};
// validação default que delega a validação para o método java
Techne.Validation.validacaoDefaultJava = function(novoValor, valorAntigo, nomeColuna, registro) {
    var valido = false;
    var msgJs = '';
    var retornoValida = {
        chamaMetodoJava: true,
        parametrosMetodoJava: {
            novoValor: novoValor,
            valorAntigo: valorAntigo,
            nomeColuna: nomeColuna,
            registro: registro
        },
        valido: valido,
        msgJs: msgJs
    };
    return retornoValida;
};
// ---------------------------------------------------


/*
 * Funcao de validacao que indica que o campo deve ser formatado como horário.
 * No formato HH:MM
 */
Techne.Validation.prototype.horario = function(msg) {
    msg = msg != null ? msg : 'Este campo deve estar no formato HH:MM (HH - hora de 0 a 23, MM - minuto de 0 a 59).';
    var validator = function(value) {
        value = value + '';
        if (value.length == 0)
            return true;

        var parts = value.split(":");
        if (parts.length != 2)
            return msg;
        if (parts[0].length == 0 || parts[0].length > 2)
            return msg;
        if (parts[1].length == 0 || parts[1].length > 2)
            return msg;
        if (Ext.num(parts[0], -1) < 0 || Ext.num(parts[0], 0) > 23)
            return msg;
        if (Ext.num(parts[1], -1) < 0 || Ext.num(parts[1], 0) > 59)
            return msg;

        return true;
    };
    this.response.push(validator);
};

Techne.Validation.prototype.validaCargaHoraria = function(msg) {
    msg = msg || 'Carga horária inválida! Deve estar no formato hh:mm.';
    var validator = function(value) {
        if (value && value.length > 0) {
            /*
             * pega o match para uma espressão regular de N números antes dos dois pontos e
             * dois número dos dois pontos.
             */
            var match = value.match('[0-9]+[:][0-9][0-9]');
            /*
             * se o tamanho da string de match for diferente do value, está errado, pois se estiver
             * no formato correto o match será para o value inteiro
             */
            if (match == null || match.length == 0 || match[0].length != value.length) {
                return msg;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };
    this.response.push(validator);
};
