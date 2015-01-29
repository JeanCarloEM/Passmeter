/**
 * Passmeter
 * Javascript Object
 * 
 * @author     Jean Carlo de Elias Moreira | http://www.jeancarloem.com
 * @license    LGPL | https://www.gnu.org/licenses/lgpl.html
 * @copyright  © 2014 Jean Carlo EM
 * @link       http://opensource.jeancarloem.com/Passmeter
 * @dependency xregexp | http://xregexp.com/
 */

/*
 * ENCAPSULAMENTO SEGURO
 *  
 * @param object   root   global reference
 * @param object   PM     Passmter variable
 * @param function xlog   function console.log
 * @returns object Passmeter
 */
(function( root, PM, xlog ) { 
  // Caso Não exista ARRAY.indexOf, vamos criá-lo
  // Mozilla IndexOf for Array from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
  // Production steps of ECMA-262, Edition 5, 15.4.4.14
  // Reference: http://es5.github.io/#x15.4.4.14
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

      var k;

      // 1. Let O be the result of calling ToObject passing
      //    the this value as the argument.
      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }

      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get
      //    internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If len is 0, return -1.
      if (len === 0) {
        return -1;
      }

      // 5. If argument fromIndex was passed let n be
      //    ToInteger(fromIndex); else let n be 0.
      var n = +fromIndex || 0;

      if (Math.abs(n) === Infinity) {
        n = 0;
      }

      // 6. If n >= len, return -1.
      if (n >= len) {
        return -1;
      }

      // 7. If n >= 0, then Let k be n.
      // 8. Else, n<0, Let k be len - abs(n).
      //    If k is less than 0, then let k be 0.
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 9. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the
        //    HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        //    i.  Let elementK be the result of calling the Get
        //        internal method of O with the argument ToString(k).
        //   ii.  Let same be the result of applying the
        //        Strict Equality Comparison Algorithm to
        //        searchElement and elementK.
        //  iii.  If same is true, return k.
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  };
  
  /*
   * OBTEM UM JSON
   * 
   * Dica obtida em 
   * http://stackoverflow.com/questions/9922101/get-json-data-from-external-url-and-display-it-in-a-div-as-plain-text
   * 
   * @param string url
   * @returns json
   */
  if (typeof root.getJSON !== 'function') {
    root.getJSON = function(url) {      
      return function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status === 200) {
            resolve(xhr.response);
          } else {
            reject(status);
          }
        };
        xhr.send();
      };
    };
  };
  

  /* VERIFICA SE A A CHAVE EXISTE EM UM ARRAY
   * 
   * discuss at: http://phpjs.org/functions/key_exists/
   * original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
   * example 1: key_exists('kevin', {'kevin': 'van Zonneveld'});
   * returns 1: true  
   */
  if (!root.key_exists) {  
    root.key_exists = function(key, search) {      
      if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
      }

      return key in search;
    };
  };
 
  
  /*
   * http://en.wikipedia.org/wiki/Writing_system
   * 
   * http://apps.timwhitlock.info/js/regex#
   * http://www.unicode.org/faq/blocks_ranges.html
   * http://www.unicode.org/Public/UCD/latest/ucd/Scripts.txt
   * http://www.unicode.org/Public/UNIDATA/PropertyValueAliases.txt
   * http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/scripts_languages_and_territories.html
   * http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/index.html
   * 
   * :: BANCO DE DADOS UNICODE RANGE
   * CONTÉM A RELAÇAO LINGUÁGEM E SISTEMA DE ESCRITA CONFORME WIKIPEDIA E UNICODE
   * E TAMBÉM O RANGE DE CADA SISTEMA DE ESCRITA
   */    
  PM.LUR = {"AF":["Latin"],"AM":["Ethiopic"],"AR":["Arabic"],"AY":["Latin"],"AZ":["Arabic","Cyrillic","Latin"],"BAL":["Latin"],"BAN":["Balinese"],"BBC":["Batak"],"BE":["Cyrillic"],"BG":["Cyrillic"],"BI":["Latin"],"BN":["Bengali"],"BRH":["Latin"],"BS":["Cyrillic","Latin"],"BUG":["Buginese"],"CA":["Latin"],"CH":["Latin"],"CS":["Latin"],"CSB":["Latin"],"DA":["Latin"],"DE":["Latin"],"DOI":["Takri"],"DV":["Thaana"],"DZ":["Tibetan"],"EL":["Greek"],"EN":["Latin"],"ES":["Latin"],"ET":["Latin"],"FA":["Arabic"],"FI":["Latin"],"FIL":["Latin"],"FJ":["Latin"],"FO":["Latin"],"FR":["Latin"],"GA":["Latin"],"GIL":["Latin"],"GN":["Latin"],"GSW":["Latin"],"GV":["Latin"],"HE":["Hebrew"],"HI":["Devanagari"],"HIF":["Devanagari","Latin"],"HO":["Latin"],"HOC":["Warang_citi"],"HR":["Latin"],"HT":["Latin"],"HU":["Latin"],"HY":["Armenian"],"ID":["Latin"],"II":["Latin"],"INH":["Arabic","Latin"],"IS":["Latin"],"IT":["Latin"],"JV":["Javanese"],"KA":["Georgian"],"KHA":["Bengali"],"KK":["Arabic","Cyrillic"],"KL":["Latin"],"KM":["Khmer"],"KV":["Old_permic"],"KY":["Arabic","Cyrillic","Latin"],"LA":["Latin"],"LB":["Latin"],"LEZ":["Caucasian_albanian"],"LO":["Lao"],"LT":["Latin"],"LV":["Latin"],"MAI":["Tirhuta"],"MAK":["Buginese"],"MEN":["Mende_kikakui"],"MG":["Latin"],"MH":["Latin"],"MI":["Latin"],"MK":["Cyrillic"],"MN":["Cyrillic","Mongolian"],"MNI":["Meetei_mayek"],"MR":["Modi"],"MS":["Arabic","Latin"],"MT":["Latin"],"MY":["Myanmar"],"NA":["Latin"],"NB":["Latin"],"ND":["Latin"],"NE":["Devanagari"],"NIU":["Latin"],"NL":["Latin"],"NN":["Latin"],"NY":["Latin"],"OM":["Ethiopic"],"PAP":["Latin"],"PAU":["Latin"],"PL":["Latin"],"PS":["Arabic"],"PT":["Latin"],"QU":["Latin"],"REJ":["Rejang"],"RN":["Latin"],"RO":["Latin"],"RU":["Cyrillic"],"RW":["Latin"],"SA":["Devanagari","Grantha","Sharada","Siddham","Sinhala"],"SAT":["Bengali","Devanagari","Ol_chiki","Oriya"],"SD":["Khojki","Khudawadi"],"SE":["Cyrillic"],"SG":["Latin"],"SI":["Sinhala"],"SK":["Latin"],"SL":["Latin"],"SM":["Latin"],"SN":["Latin"],"SO":["Latin"],"SQ":["Latin"],"SR":["Cyrillic","Latin"],"SS":["Latin"],"ST":["Latin"],"SU":["Sundanese"],"SUS":["Arabic"],"SV":["Latin"],"SW":["Latin"],"SWB":["Latin"],"SYL":["Syloti_nagri"],"TA":["Tamil"],"TET":["Latin"],"TG":["Arabic","Cyrillic","Latin"],"TH":["Thai"],"TI":["Ethiopic"],"TK":["Arabic","Cyrillic","Latin"],"TKL":["Latin"],"TN":["Latin"],"TO":["Latin"],"TPI":["Latin"],"TR":["Latin"],"TVL":["Latin"],"TY":["Latin"],"TZM":["Latin","Tifinagh"],"UDM":["Latin"],"UG":["Latin"],"UK":["Cyrillic"],"UR":["Arabic"],"UZ":["Arabic","Cyrillic","Latin"],"VI":["Latin"],"WO":["Latin"],"YO":["Latin"],"ZDJ":["Arabic"],"ZH":["Bopomofo","Phags_pa"]};
  
  /* VERSÃO */
  PM.version = 1;

  /*
   * Configurações
   */
  PM.cfg = {
    ws    : {}, /* palavras do dicionário */
    //dics  : [], /* url dos discionáros */
    uB    : '', /* a url base apontando para a pasta 'src' */

    /*
     * _a é a variável multiplcadora. Uma variação minima, como 0,5 a mais
     * já é suficiente para considerar uma senha forte em fraca ou uma fraca em forte
     */
    _a    : 8,

    /*
     * O TAMANHO MAXIMO PREVISTO DA SENHA
     */
    mL    : 32,

    /*
     * O IDEAL DE LETRAS DISTINTAS
     * 
     * CONSIDERANDO O MÁXIMO DE LETRAS SENDO 32, 12 EQUIVALE À 37,5% QUE
     * É UMA BOA PORCENTAGEM, SENDO SUPEDRIOR A 1 EM CADA 3
     * 
     * :: Ideal Distincs
     */
    iDs   : 12,
    
    /*
     * CONTEM O REGEX PARA CASAR TIPOS DE CHARS
     */ 
    _RX   : {}
  };       

  /*
   * CLASSE PASSMETER
   * 
   * @param     string    pass    a senha
   * @returns   json                  pontuação da senha
   */
  PM.meter = function (pass, LANG){             
    /*
     * ESpeificamente para as REGRAS deve-se veririfiar se o idioma usado
     * faz diferença entre Maiúsclas e Minusculas, porque se não fizer
     * será impossível ao usuário criar uma senha que atenda a regra de Casos
     * Diferentes.
     * 
     * Quanto a pontuação, isso não deve influenciar em nada. O usuário que
     * não utilizar letras em caso diferente por causa do seu sistema de escrita
     * ainda poderá ujsar o sistema latino quase universal, como inglês. Além
     * disso a pontuação não irá decrescer, apenas deixará de acescentar algo
     * não impedindo ou restringindo o funcionamento do passmeter
     * 
     * == IMPLEMENTAR ==
     * 
     * @param   string  lang
     * @returns bool    TRUE se linguagem/script faz diferença entre casos
     */    
    function asDifcaseScript(lang){
      return true;
    }
    
    /* defaultReturn
     * 
     * O VALOR PADRÃO (ZERADO) PARA O RETORNO
     * O RESULTADO DO CALCULO DE FORÇA
     */  
    function dR(){
      return {
        scor              : 0,
        candidateScor     : [],

        /* 0 - Ruim
         * 1 - Fraca
         * 2 - Regular
         * 3 - Boa
         * 4 - Forte
         */    
        level             : 0,    
        length            : 0,    
        distincts         : 0,
        charTypes         : 0,        
        pointsByType      : 0,    
        lowerCaseLetters  : 0,
        upperCaseLetters  : 0,
        moreLetters       : 0,
        numbers           : 0,
        punctuation       : 0,
        simbols           : 0,
        words             : [],    
        wordLetters       : 0,
        dates             : [],
        sequential        : 0,
        multipleScripts   : false,        

        /*
         * RULES, SÃO AS REGRAS MÍNIMA PADRÃO PARA A SENHA
         */
        rules             : {
          length          : false,
          distinct        : false,      
          difCaseLetter   : false,
          noSequential    : false,
          noDate          : false,
          strength        : false,
          noWords         : false,
          specialChar     : false
        }
      };
    }

    /*
     * findWords
     * PROCURA POR PALAVRAS NA SENHA (value), BASEANDO EM dicionario
     * 
     * @param     string    value       a senha
     * @returns   object                contendo a soma de letras e array com as palavras
     */
    function fW(V, lang){
      var pl = {
        letters : 0,
        words   : []
      };    
            
      lang = PM.getMacroLang(lang);
      
      if ((PM.cfg.ws.length <= 0) || (!lang in PM.cfg.ws)){
        PM.getDic(lang);
        return null;
      }      
           
      if ((!root.key_exists('en', PM.cfg.ws)) || (!root.key_exists('hacking', PM.cfg.ws))){
        throw Error('Dicionários "en" e "hacking" não localizados');
      }
           
      var MacroIdiomas = ['hacking', 'en'];
            
      if (root.key_exists(lang, PM.cfg.ws)){        
        MacroIdiomas.push(lang);        
      }
        
      var ws;
      for (var index = 0; index < MacroIdiomas.length; index++){
        if (root.key_exists(MacroIdiomas[index], PM.cfg.ws)){
          ws = PM.cfg.ws[MacroIdiomas[index]];

          /* PROCURANDO PELAS PALAVRAS */
          if (ws.length > 0){
            var w;

            for (var i = ws.length;--i;){
              w = ws[i];

              if ((typeof w === "string") && (w.length > 0)){
                w = w.toLowerCase();

                if (pl.words.indexOf(w) < 0){
                  if ((V.indexOf(w)) >= 0){ /* PROCURANDO INSENSITIVE */
                    pl.letters += w.length;
                    pl.words.push(w);
                  }            
                }
              }
            }
          }
        }
      }
      
      return pl;
    };

    /* removeDubCharacters
     * 
     * REMOVE LETRAS DUPLICADAS DE FORMA INSENSIVEL
     * OU SEJA, A=a, SE HOUVER AMBAS UMA DELES SERÁ REMOVIDA
     * DESTA FORMA É POSÍVEL SABER QUANTO CARACTERES ÚNICOS EXISTEM
     * 
     * @param     string    str         a senha
     * @returns   string                a senha com caracteres duplicados removidos
     */  
    function rDC(str) {
      str = str.replace(/(.)(?=.*\1)/gi, '');
      return str;
    };

    /* hasSequential
     * 
     * VERIFICA SE EXISTEM CARACTERES SEQUENCIAIS, CRECENTE E DECRECENTEMENTE
     * RECURSIVAMENTE
     * 
     * ## APRIMORAR ##
     * ATUALMENTE USA COMO BASE DE COMPARAÇÃO APENAS UNICODE, DEVE SER EXPANDIDO
     * PARA CONSIDERAR TAMBÉM AS SEQUENCIAS DOS DIVERSOS LAYOUTS E IDIOMAS DE
     * TECLADO E SUAS POSSIVEIS SEQUENCIAS, E OUTRAS FORMAS QUE PODEM SER
     * CONSIDERADAS SEQUENCIAIS COMO A ORDEM ALFABÉTICA QUANDO DIFERE DA ORDEM
     * UNICODE DENTRE OUTROS    
     * 
     * @param     string    pass        a senha
     * @param     bool      ignorarReverso  true indica NÃO verificar no reverso
     * @returns   bool                      retorna true se houver caracteres sequenciais
     */    
    function hS(pass){
      /* SEQUENCIAL IDENPENDENTEMENTE DO CASO */    
      pass = pass.toLowerCase();

      if (pass.length >= 3){      
        var
            LC   = -1, /* Last Char */
            o    = -1, /* ATUAL */
            LLC  = -1, /* Last Last Char */
            EC   = 0;  /* Encontantrados */

        for (var i = pass.length; i--;){
          o = pass.charCodeAt(i);

          if (
              (LC !== -1) && 
              (LLC !== -1) && 
              (
                ((o === LC) && ((LLC === LC - 1) || (LLC === LC + 1) || (LLC === LC))) || 
                ((o === LC + 1) && ((LLC === LC - 1) || (LLC === LC))) || 
                ((o === LC - 1) && ((LLC === LC + 1) || (LLC === LC)))
              )
            ){
            EC++;
          }

          LLC = LC;
          LC = o;
        }

        return EC;
      }

      return 0;
    };


    /*
     * SOMA UM ARRAY DE VALORES NUMERICOS
     * 
     * @param   arr       array     Array com valores numericos a serem somados     
     * @returns           interger  Resultado da soma
     */
    function sum(ar){
      var t = 0;

      for (var i = ar.length; i--;) {
        t += ar[i] << 0;
      }

      return t;
    };


    /*  
     * SUBSTITUI STR PO SUB COM BASE NO REGEX RX
     * 
     * @param     string    str     O integral
     * @param     XRegExp    rx     O regex
     * @param     string    sub     O texto a ser colocado no lugar
     * @returns   string            texto str substituido por sub
     */
    function XRP(str, rx, sub){
      return XRegExp.replace(str, rx, sub);
    };
    
    /*
     * 
     * @param   string  código da linguagem a ser obtida a expreção
     * @returns string  A expreção para a linguagem específica
     */
    function getExpLang(idioma){
      /*
       * LUR = PM.LUR
       */
      idioma = idioma.toUpperCase();
      var sexp = '';
      
      for (var index = 0; index < PM.LUR[idioma].length; ++index) {        
        sexp += "\\p{" + PM.LUR[idioma][index]+"}";
      } 
      
      sexp += '\\p{Common}';
      
      /* O Latim é um sistema de escrita quase universal, ele deve sempre ser
       * considerado
       */
      if (sexp.indexOf('\\p{Latin}') < 0)
        sexp += '\\p{Latin}';
            
      return sexp;
    };

    /*
     * TESTA A SENHA
     * 
     * @param     string    pass    a senha
     * @param     string    LANG    o idioma, OPCIONAL
     * @returns   json                  pontuação da senha
     */
    function medir(pass, LANG){                
      _R = dR();

      if ((typeof pass) !== 'string'){
        return {approved:false,passinfo:_R};
      }   

      _R.length = pass.length;

      if (_R.length > 0){
        /*** OBTEM OS CARACTERES DISTINDOS DESCONSIDERANDO PRIMEIRO E ÚLTIMO DIGITO ***/
        var distintas = rDC(pass.substring(1).substring(0, pass.length-2));
        
        /* OBTENDO A QUANTIDADE TOTAL DE DISTINTAS */
        _R.distincts = rDC(pass);
        _R.distincts = (_R.distincts!==null&&_R.distincts.length>0)?_R.distincts.length:0;

        _R.scor  = 1;

        /*** TAMANHO DE 9 à 15 ***/
        if(_R.length >= 9){
          _R.scor+= 1;

          var amais = ((_R.length-9)>0)?(_R.length-9):0;      
          _R.scor+= (amais>0)?(amais/4):0;        
        }       

         /*
          * SOMANDO OS TIPOS DE CARACTERES EXISTENTES
          */
        _R.charTypes          = 0;
        _R.pointsByType       = 0;     

        var maxPointsChars = 0;
        
        /*** SE HOVER LETRAS MINUSCULAS ***/
        maxPointsChars = maxPointsChars + 1;
        _R.lowerCaseLetters   = distintas.match(PM.cfg._RX.lowerLetters);
        _R.pointsByType      += (_R.lowerCaseLetters!==null)?1:0;
        _R.charTypes         += (_R.lowerCaseLetters!==null)?1:0;
        _R.lowerCaseLetters   = (_R.lowerCaseLetters!==null)?_R.lowerCaseLetters.length:0;             

        /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
        distintas = XRP(distintas, PM.cfg._RX.lowerLetters, "");

        /*** SE HOUVER LETRAS MAIUSCULAS  ***/
        maxPointsChars = maxPointsChars + 1;
        _R.upperCaseLetters   = distintas.match(PM.cfg._RX.upperLetters);
        _R.pointsByType      += (_R.upperCaseLetters!==null)?1:0;
        _R.charTypes         += (_R.upperCaseLetters!==null)?1:0;
        _R.upperCaseLetters   = (_R.upperCaseLetters!==null)?_R.upperCaseLetters.length:0;     
    
        /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
        distintas = XRP(distintas, PM.cfg._RX.upperLetters, "");    

        /*** SE HOUVER OUTROS TIPOS DE LETRAS ***/
        maxPointsChars = maxPointsChars + 1;
        _R.moreLetters        = distintas.match(PM.cfg._RX.otherLetters);
        _R.pointsByType      += (_R.moreLetters!==null)?1:0;
        _R.charTypes         += (_R.moreLetters!==null)?1:0;     
        _R.moreLetters        = (_R.moreLetters!==null)?_R.moreLetters.length:0;

        /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
        distintas = XRP(distintas, PM.cfg._RX.otherLetters, "");

        /*** SE HOUVER NUMEROS ***/
        maxPointsChars = maxPointsChars + 1.1;
        _R.numbers            = distintas.match(PM.cfg._RX.numbers);
        _R.pointsByType      += (_R.numbers!==null)?1.1:0;      
        _R.charTypes         += (_R.numbers!==null)?1:0;          
        _R.numbers            = (_R.numbers!==null)?_R.numbers.length:0;     

        /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
        distintas = XRP(distintas, PM.cfg._RX.numbers, "");    

        /*** SE HOUVER PONTUAÇÃO ***/
        maxPointsChars = maxPointsChars + 1.1;        
        _R.punctuation        = distintas.match(PM.cfg._RX.punctuation);
        _R.pointsByType      += (_R.punctuation!==null)?1.1:0;
        _R.charTypes         += (_R.punctuation!==null)?1:0;       
        _R.punctuation        = (_R.punctuation!==null)?_R.punctuation.length:0;          

        /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
        distintas = XRP(distintas, PM.cfg._RX.punctuation, "");    

        /*** SE HOUVER SIMBOLOS ***/        
        /* AQUI USAMOS < 1, POIS INCREMENTAREMOS ADIANTE */
        maxPointsChars = maxPointsChars + 0.9;
        _R.simbols            = distintas.match(PM.cfg._RX.symbols);
        _R.pointsByType      += (_R.simbols!==null)?0.9:0;
        _R.charTypes         += (_R.simbols!==null)?1:0;            
        _R.simbols            = (_R.simbols!==null)?_R.simbols.length:0;                  
      
        /* VERIFICANDO OS TIPOS DE SIMBOLOS ENCONTRANDO,  
         * E INCREMENTANDO LEVEMENTE A PONTUAÇÃO
         */
        maxPointsChars = maxPointsChars + 0.8;        
        var simtypecount = 0;
        
        // símbolo de moeda
        var matchsSTC = distintas.match(XRegExp('\\p{Sc}', 'gi'));        
        simtypecount += (matchsSTC!==null)?1:0;
        
        // Modifier symbol
        matchsSTC = null;
        matchsSTC = distintas.match(XRegExp('\\p{Sk}', 'gi'));        
        simtypecount += (matchsSTC!==null)?1:0;

        // Mathematical symbol
        matchsSTC = null;
        matchsSTC = distintas.match(XRegExp('\\p{Sm}', 'gi'));        
        simtypecount += (matchsSTC!==null)?1:0;

        // Other symbol
        matchsSTC = null;
        matchsSTC = distintas.match(XRegExp('\\p{So}', 'gi'));        
        simtypecount += (matchsSTC!==null)?1:0;                                

        /* INCREMENTANDO CASO EXISTAM MULTIPLOS TIPOS DE SIMBOLOS */        
        _R.pointsByType      += (simtypecount>0)?((simtypecount*2)/10):0;

        /*
         * CONSIDERANDO O IDIOMA DA PÁGINA/BROWSER, CRÊ-SE QUE SEJA O MESMO DO
         * CLIENTE, PORTANTO IDENTIFICA-SE OS TIPOS DE CARACTERE QUE SÃO USADOS,
         * COMO O LATINOS PARA PAISES DO CONTINENTE AMERICANO, ASSIM, DÁ-SE MAIS
         * PONTO CASO EXISTAM CARACTERES NÃO-LATINOS, NESTE CASO. ASSIM COM TODAS
         * AS DEMAIS LINGUAS
         * 
         * - ADICIONAR 2 PONTOS
         * 
         * ALGARISMO LATINO SÃO SEMPRE DESCONSIDERADOS DADO SEU USO GLOBALIZADO
         * OU SEJA, PARA QUE A PONTUAÇÃO FUNCIONE É OBRIGATÓRIO O USO DE ALGARISMO
         * NÃO LATINO, ALEM DE NÃO USAR ALGARISMO DO IDIOMA CORRENTE (CASO ESTE
         * NÃO SEJA LATINO)
         * 
         * AQUI USAMOS O LUR - PM.LUR
         * 
         */
        maxPointsChars = maxPointsChars + 2;
        var range = getExpLang(LANG);
               
        var rMeuIdioma    = new XRegExp('[' +range+']');
        var rDiferIdioma  = new XRegExp('[^'+range+']');
        
        if ((pass.match(rMeuIdioma)!==null) && (pass.match(rDiferIdioma)!==null)){
          //xlog('Uso de algarismo de multiplos sistemas de escrita.');
          _R.pointsByType     += 2; /* PONTUAÇÃO POR USAR MULTIPLOS DISTEMAS DE ESCRITA */          
          _R.multipleScripts  = true;
        }

        /*
         * ALGUMAS DEDUÇÕES ABAIXO SOMENTE FUNCIONAM PARA IDIOMA LATINOS,
         * PRÓXIMO PASSO: IMPLEMENTAR AS VERIFICAÇÕES PARA TODOS OS IDIOMAS
         * == IMPLEMENTAR ==
         */

        /* NÃO TER DATA NÃO ACRESCENTA PONTO, MAS TER RETIRA PONTOS */
        _R.dates        = pass.match(PM.cfg._RX.data);
        _R.pointsByType-= (_R.dates===null)?0:(1 + (_R.dates.length*.5));
        _R.dates        = (_R.dates===null)?[]:_R.dates;

        /* NÃO TER NUMERO SEQUANCIAL NÃO ACRESCENTA PONTO, MAS TER RETIRA PONTOS */
        _R.sequential     = hS(pass);
        
        _R.pointsByType  -= (_R.sequential>0)?(1 + (_R.sequential*0.5)):0;

        /* CADA PALAVRA, REDUÇÃO DE PONTOS */                
        if ((PM.cfg.ws.length <= 0) || (!root.key_exists(LANG, PM.cfg.ws))){
          PM.getDic(LANG);
          xlog('PASSMETER :: Inexistência de dicionário. Considerando haver palavras na senha.');
          var words = {"words":['Dicionário não baixado/existente.'],"letters":0};
        }else{
          var words = fW(pass);
        }
        
        _R.words          = words.words;
        _R.wordLetters    = words.letters;
        _R.pointsByType  -= (_R.words.length>0)?(1 + (_R.words.length*0.15)):0; /* 0,15 de peso por palavra  */

        /* SE STRENGHT FOR ZERO OU MENOR, QUER DIZER QUE HOUVE MUITOS DESCONTOS,
         * INDICANDO QUE A SENHA TEM MUITOS PROBLEMAS
         * ENTÃO A FORÇA É FRACA
         */
        if (_R.pointsByType < 1){
          _R.scor = 0;
        }else{                    
          /* INICIALIZANDO */
          _R.candidateScor = [];      

          /* ## METODO 01
           * 
           * ESTE MÉTODO DEMONSTROU INICIALMENTE SER EFICAZ, PORÉM PARECE NÃO POSSUIR
           * UMA LÓGICA SUSTENTÁVEL, JÁ QUE NÃO EXISTE UMA RAZÃO JUSTA PARA A
           * EXISTENCIA DO "_a", SEM O QUAL A FORMULA NÃO ATINGE PONTUAÇÃO
           * SATISFATÓRIA. MESMO ASSIM ESTA FORMULA CONTINUA SENDO UTILIZADA
           * NÃO COMO PRINCIPAL E DEFINITIVA, MAS COMO PONTO DE EQUILÍBRIO, JÁ QUE
           * ELA TENDE A APRESENTAR RESULTADOS MAIS ELEVADOS, ELA TAMBÉM NÃO POSSUI
           * UM TETO, COMO SE SEGUE:
           * 
           * CALCULANDO A COMPLEXIDADE DA SENHA COM BASE NOS PONTOS STRENGHT ADQUIRIDO
           * E NA QUANTIDADE DE DIGITOS DISTINTOS ... 
           * PONTUAÇÃO * QUANTIDADE DISTINTOS = FORÇA PROJETADA
           * FORÇA PROJETADA / TOTAL DE CARACTERES = FORÇA POR CARACTER
           * FORÇA POR CARACTER * _a = FORÇA POR CARACTER AJUSTADA
           */      
          _R.candidateScor.push(((_R.distincts * _R.pointsByType)/_R.length)*PM.cfg._a);
          _R.candidateScor[_R.candidateScor.length-1] = Math.floor(
            (_R.candidateScor[_R.candidateScor.length-1]>99)
              ?99
              :_R.candidateScor[_R.candidateScor.length-1]
          );

          /* ## METODO 02 (PREFERENCIAL)
           * 
           * CALCULANDO A SUB-PORCENTAGEM BASEANDO-SE NA QUANTIDADE DE LETRAS E NA
           * QUANTIDADE DE LETRAS DISTINTAS
           */          
          var pt = (
            (
              (
                ((((_R.distincts/PM.cfg.iDs)>1)?1:(_R.distincts/PM.cfg.iDs)) * 100) /* <<< PORCENTAGEM DE DISTINTAS */
               +((((_R.length   /PM.cfg.mL)     >1)?1:(_R.length   /PM.cfg.mL))      * 100) /* <<< PORCENTAGEM DE LETRAS */
              ) / 2 /* <<< MÉDIA */
            ) / 100 /* <<< PORCENTAGEM/DECIAMAL FINAL */
          );

          /*
           * VAMOS CALCULAR A PONSTUAÇÃO REAL COM BASE NO PERCENTUAL MÁXIMO POSSÍVEL
           * EMBORA SEJA MAIS ASSERTIVA, ESTA FORMULA PARECE TER DIFICULDADE
           * DE ATINGIR O MÁXIMO (100%)
           */
          _R.candidateScor.push(Math.floor(((_R.pointsByType/maxPointsChars)*pt)*100));

          /* PONDERANDO PONTUAÇÃO */
          _R.scor = Math.floor(sum(_R.candidateScor)/_R.candidateScor.length);
        } 

        /*
         * LEVEL COM BASE NA PONTUAÇÃO
         */
        if (_R.scor >= 60){
          _R.level = 4; /* FORTE */
        }else if ((_R.scor >= 25) && (_R.scor < 60)){
          _R.level = 3; /* BOA */
        }else if ((_R.scor >= 20) && (_R.scor < 25)){
          _R.level = 2; /* REGULAR */
        }else if ((_R.scor >= 10) && (_R.scor < 20)){
          _R.level = 1; /* FRACO */
        }else{
          _R.level = 0; /* PESSIMO */
        }
      }
      
      /*
       * VAMOS ANALISAR AS RULES AGORA
       */
      var approved = true;     

      if (_R.level >= 3){
        _R.rules.strength = true;
      }else{
        _R.rules.strength = false;
        approved = false;      
      }

      if ((_R.numbers + _R.punctuation + _R.simbols) > 1){
        _R.rules.specialChar = true;
      }else{
        _R.rules.specialChar = false;
        approved = false;      
      }    

      if (((_R.lowerCaseLetters > 0) && (_R.upperCaseLetters > 0)) || (!asDifcaseScript(LANG))){
        _R.rules.difCaseLetter = true;
      }else{
        _R.rules.difCaseLetter = false;
        approved = false;      
      }

      if (_R.length >= 9){
        _R.rules.length = true;
      }else{
        _R.rules.length = false;
        approved = false;      
      }

      if (_R.distincts >= 6){
        _R.rules.distinct = true;
      }else{
        _R.rules.distinct = false;
        approved = false;      
      }

      if (!_R.sequential){
        _R.rules.noSequential = true;
      }else{
        _R.rules.noSequential = false;
        approved = false;      
      }

      if (_R.dates.length <= 0){
        _R.rules.noDate = true;
      }else{
        _R.rules.noDate = false;
        approved = false;      
      }

      /* ASSUMINDO OK */
      _R.rules.noWords = true;  

      if ((_R.wordLetters > 0) && (_R.words.length > 0)){
        if (
            ((_R.length - _R.wordLetters) < 3) || 
            (_R.wordLetters >= (0.60*_R.length))
        ){
          _R.rules.noWords = false;
          approved = false;      
        }
      }

      return {approved:approved,passinfo:_R};
    };
    
    /* GARANTINDO QUE ESTÁ INICIALIZADO */
    if (!PM.isLoaded){
      PM.dependencias();
    };    
    
    /* OBTENDO E PASSING LANG */
    LANG = PM.getMacroLang(LANG);          
    
    /*
     * O RESULTADO DO CALCULO DE FORÇA
     */
    var _R = {};

    return medir(pass, LANG);
  };


  /*
   * 
   * @returns string a linguagem de preferencia / MACRO LINGUAGEM
   */
  PM.getLang = function(){   
    if (typeof root.window.idioma !== 'string'){
      var bl = root.window.navigator.userLanguage || root.window.navigator.language;    
      var hl = root.jQuery('html').attr('lang');

      var retorno = ((typeof bl === 'string') && (bl.length >=2))?bl:(((typeof hl === 'string') && (hl.length >= 2))?hl:'pt-br');

      macro = typeof macro !== 'undefined' ? macro : true;
      if ((macro === true) && (retorno.indexOf('-') >= 0)){
        retorno = retorno.split('-');
        retorno = retorno[0];      
      }

      xlog('PASSMETER :: Macro-idioma atual: ' + retorno);

      root.window.idioma = retorno;
    }
    
    return root.window.idioma;
  };
  
  /*
   * 
   * @param   string langs o idioma atual [OPICIONAL]
   * @returns string o macro idioma, exemplo PT-BR = PT
   */
  PM.getMacroLang = function(langs){    
    if ((typeof langs !== 'string') || (langs === null) || (langs === '')){
      langs = PM.getLang();
    }        

    if (langs.indexOf('-')>=0){
      langs = langs.split('-');
      langs = langs[0];         
    }       

    /* REDUZINDO O TAMANHO */
    langs = langs.toLowerCase();    
    
    return langs;
  };

  /*
   * 
   * @param string macro lang
   * @returns boolean
   */
  PM.getDic = function(langs){
      /*
       * FAZ A BAIXA DE UM DICIONÁRIO E ANEXA A LISTA GERAL DE PALAVRAS PARA ANÁLISE
       * DA SENHA
       */
      function downDic(url, descri){          
        /* VERIFICANDO SE É UMA STRING */
        if ((typeof url !== "string") || (url.length <= 12)){
          throw Error('Impossível carregar dicionário: URL fornecida não é aceitável.');    
          return false;
        }   

        /* caso esteja abreviado */
        if (url.indexOf('//') === 0){
          url = url.replace('//', 'http://');
        }

        /* VALIDANDO URL */
        if (url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/).length <= 0){
          throw Error('Impossível carregar dicionário: URL inválida: "'+url+'".');        
          return false;
        }

        /* DEFININDO DESCRI, CASO NÃO SEJA FORNECIDA */
        if ((descri === null) || (typeof descri !== "string") || (descri.length <= 0)){
          descri = url.substring(url.lastIndexOf('/')+1);
          descri = descri.replace('.json', '');
        } 
        
        descri = descri.toLowerCase();

        root.getJSON(url)(function(json){
          PM.cfg.ws[descri] = json;
          xlog( "PASSMETER :: Dicionário ["+descri+"] carregado! ... " + PM.cfg.ws[descri].length + " palavra(s).");          
        }, function(status){
          throw Error('Impossível carregar dicionário: [' + url + "'].");
          return false;
        }); 
      };    
      
    langs = PM.getMacroLang(langs);
    
    if ((typeof langs !== 'string') || (langs.length <2)){
      throw Error('PASSMETER :: HTML tag não possui atributo "lang" ou idioma solicitado em formato incorreto, impossibilitando reconhecer a linguagem');  
      return null;
    }    
    
   /*
    * OBTENDO O DICIONÁRIO DE PALAVRAS
    */
    if (!PM.cfg.uB.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/)){
      throw Error('PASSMETER :: URL inválida: [' + PM.cfg.uB + "].");
    }           
    
    if ((PM.cfg.ws.length <= 0) || (!root.key_exists(langs, PM.cfg.ws))){      
      try{           
        downDic(PM.cfg.uB + "/dic/"+langs+".json", langs);
      }catch(err) {
      }      
    }
    
    if ((langs !== "hacking") && (!root.key_exists("hacking", PM.cfg.ws))){
      try{
        downDic(PM.cfg.uB + "/dic/hacking.json", "hacking");
      }catch(err) {
      }
    }
    
    if ((langs !== "en") && (!root.key_exists("en", PM.cfg.ws))){
      try{
        downDic(PM.cfg.uB + "/dic/en.json", "en");
      }catch(err) {
      }
    }    
  };    

  /*
   * CONSTRUTOR
   */
  PM.init = function(){
    /*
     * Fonte de inspiração:
     *  - http://xregexp.com
     *  - http://inimino.org/~inimino/blog/javascript_cset
     *  - http://apps.timwhitlock.info/js/regex
     * 
     * 
     * >> RBC = Regex By Category
     * 
     * @param     array     category   array com os códigos das categorias
     * @returns   regex                retorno um RegExp com a categoria escolhida
     */
    function RBC(category){
      function unirTudo(cat){
        if (cat.length > 1){
          var retorno = [];

          for (var index = 0; index < cat.length; ++index) {
            retorno.push(XRegExp("\\p{"+cat[index]+"}"));
          }

          return retorno;
        }else{
          return [XRegExp("\\p{"+cat+"}")];
        }
      };

      if ((typeof category) === 'string' ){
        category = [category];
      }

      /* UNIFICANDO CATEGORIAS E RETORNANDO REGEX */
      return XRegExp.union(unirTudo(category), "g");
    };

    /*
     * Carrega os Dicionários
     */
    function initDic(){
      return PM.getDic();
    };
    
    if (!PM.isLoaded){    
      if (typeof XRegExp === "function"){
        /* DESCOBRINDO A URL ATUAL */
        if (PM.cfg.uB.length <= 10){
          var scriptsTags = root.document.getElementsByTagName("script");    

          if (scriptsTags !== null){
            var achado = false;
            var index = -1;
            while ((!achado) && (++index < scriptsTags.length)) {
              if (scriptsTags[index].src.match(XRegExp("(Passmeter(\.min)?\.js)$", "i")) !== null){                          
                PM.cfg.uB = XRegExp.replace(scriptsTags[index].src, XRegExp('(.+)(Passmeter(\.min)?\.js)$', 'i'), '$1');
                achado = true;              
                xlog('PASSMETER :: URL path: ' + scriptsTags[index].src);              
                xlog('PASSMETER :: URL base: ' + PM.cfg.uB);                          
              }
            }
          }
        }

        /*
         * REGEX PARA CASAR GRUPO DE CHAR POR CATEGORIA
         * 
         * TENTAR SIMPLIFICAR, DIMINUIR DEPENDENCIAS OU TAMANHO BAIXADO
         * IDÉIAS PODEM SER OBTIDAS EM:
         * https://stackoverflow.com/questions/27829640/how-to-match-unicode-by-writing-system-script
         * 
         * == IMPLEMENTAR ==
         */
        PM.cfg._RX = {
           lowerLetters   : RBC('Ll')
          ,upperLetters   : RBC('Lu')

          ,otherLetters   : RBC(['Lm','Lo','Lt'])

          ,punctuation    : RBC([
                              'Mc','Me','Mn',
                              'Zl','Zp','Zs',
                              'Pc','Pd','Pe','Pf','Pi','Po','Ps'
                            ])

          ,symbols        : RBC(['Sc','Sk','Sm','So'])

          ,numbers        : RBC('Nd')

          /*
           * CONSIDERA DATAS APENAS COM NUMERO LATINOS [0-9].
           * 
           * == APRIMORAR ==
           * PRECISA EVOLUIR PARA CONTEMPLAR FORMATO DE DATAS E CARACTERES 
           * EM OUTROS IDIOMAS E REGIÕES
           * 
           * DD/MM/AAAA   DD/MM/AA   DD/MM     AA/MM
           * MM/DD/AAAA   MM/DD/AA   MM/DD     MM/AA
           * AAAA/DD/MM   AA/DD/MM   AAAA/MM
           * AAAA/MM/DD   AA/MM/DD   MM/AAAA
           * 
           */
          ,data           : XRegExp([
'('
   ,'(0[1-9]|[1-2][0-9]|3[01]).?(0[1-9]|1[0-2]).?((1[89]|20)?[0-9]{2})'
  ,'|(0[1-9]|1[0-2]).?(0[1-9]|[1-2][0-9]|3[01]).?((1[89]|20)?[0-9]{2})'
  ,'|((1[89]|20)?[0-9]{2}).?(0[1-9]|[1-2][0-9]|3[01]).?(0[1-9]|1[0-2])'
  ,'|((1[89]|20)?[0-9]{2}).?(0[1-9]|1[0-2]).?(0[1-9]|[1-2][0-9]|3[01])'
  ,'|(0[1-9]|1[0-2]).?(0[1-9]|[1-2][0-9]|3[01])'
  ,'|(0[1-9]|[1-2][0-9]|3[01]).?(0[1-9]|1[0-2])'
  ,'|((1[89]|20)?[0-9]{2}).?(0[1-9]|1[0-2])'
  ,'|(0[1-9]|1[0-2]).?((1[89]|20)?[0-9]{2})'
,')'
                ].join('\n') , 'gix')
        };

        /* BAIXANDO DICIONÁRIOS AUTOMATICAMENTE */
        initDic();
        PM.isLoaded = true; // PRONTO
      }else{
        root.window.setTimeout("Passmeter.init();", 300);
      };   
    };
  };    
}(this, (function( global ) {
  /* LOAD JAVASCRIPT */
  global.loadScript = function(src, async, onload) {
    if ((typeof async === 'undefined') || (async === null) || (async === '')){
      async = true;
    }
    
    var head      = document.getElementsByTagName('head')[0];
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = src;
    script.async  = async;
    
    if (typeof onload === 'function'){
      script.onload   = onload;
    };
    
    head.appendChild(script);
  };
    
 /*
  * CLASSE PASSMETER
  * 
  */
  global.window.Passmeter = function (pass, LANG){
    return Passmeter.meter(pass, LANG);
  }; 
  
  Passmeter.isLoaded = false;
  
  /* VERIFICANDO E CARREGANDO RECURSOS ADICIONAIS */
  global.window.Passmeter.dependencias = function(){       
    if (!global.window.Passmeter.isLoaded){
      if (typeof XRegExp !== "function"){        
        console.log( "PASSMETER :: XRegexp Ausente, carregando ...");
        global.loadScript("http://cdnjs.cloudflare.com/ajax/libs/xregexp/2.0.0/xregexp-all-min.js", false, function(){
          console.log( "PASSMETER :: XRegexp Carregado!");          
        });        
      };    

      try{    
        /*
         * INICIALIZANDO OBJETO
         */      
        global.window.Passmeter.init();        
      }catch(err){
        global.window.setTimeout("console.log('PASSMETER :: Falha retentando...');window.Passmeter.dependencias();", 300);
      }; 
    };
  };
        
  if (global.window.addEventListener) { // W3C standard
    global.window.addEventListener('load', global.window.Passmeter.dependencias, false); // not 'onload'
  }else if (global.window.attachEvent) { // Microsoft
    global.window.attachEvent('onload', global.window.Passmeter.dependencias);
  }   
    
     
 /*
  * COMPATIBILIDADE COM REQUIREJS
  */
  if ( (typeof global.define === "function") && (global.define.amd || global.define['amd']) ) {
    global.define( ["XRegExp"] , function() {      
      return global.window.Passmeter;
    });
  }else{
    global.Passmeter = global.window.Passmeter;
  };        
    
  return global.window.Passmeter;
})(this), function(text){
  console.log(text);
}));