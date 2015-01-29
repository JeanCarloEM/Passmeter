<?php
/**
 * Passmeter
 * Javascript Object
 * 
 * @author     Jean Carlo de Elias Moreira | http://www.jeancarloem.com
 * @license    LGPL | https://www.gnu.org/licenses/lgpl.html
 * @copyright  © 2014 Jean Carlo EM
 * @link       http://opensource.jeancarloem.com/Passmeter
 */

abstract class Passmeter{
  /*
   * O MAIS ADEQUADO SERIA USAR 'UCS-2LE' = UNICODE FULL
   * MAS PARECE COMPLICAR TUDO, PORTANTO NO FUTURO DEVERÁ SER IMPLEMENTADO
   */
  CONST CHARSET = 'UTF-8';
  
  protected static 
    $isLoaded = false,
    $LUR = array(),
    $cfg = array(
      "ws"  => array(),/* palavras do dicionário */
      "uB"  => '', /* a url base apontando para a pasta 'src' */

      /*
       * _a é a variável multiplcadora. Uma variação minima, como 0,5 a mais
       * já é suficiente para considerar uma senha forte em fraca ou uma fraca em forte
       */
      "_a"  => 8,

      /*
       * O TAMANHO MAXIMO PREVISTO DA SENHA
       */
      "mL"  => 32,

      /*
       * O IDEAL DE LETRAS DISTINTAS
       * 
       * CONSIDERANDO O MÁXIMO DE LETRAS SENDO 32, 12 EQUIVALE À 37,5% QUE
       * É UMA BOA PORCENTAGEM, SENDO SUPEDRIOR A 1 EM CADA 3
       * 
       * :: Ideal Distincs
       */
      "iDs" => 12,

      /*
       * CONTEM O REGEX PARA CASAR TIPOS DE CHARS
       */ 
      "_RX" => array()
   ),
          
  /*
   * O RESULTADO DO CALCULO DE FORÇA
   */    
  $_R = array();          

  /*
   * 
   */
  public function __invoke($pass, $LANG){
    return static::meter($pass, $LANG);
  }
  
  /*
   * Para mais detalhes do porque não usar a função nativa PHP
   * http://wpengineer.com/2410/dont-use-strlen/
   * 
   */
  protected static function strlen($str){
    $length = preg_match_all( '#.#sui', $str, $matches );
    
    if ($length === false){
      throw new Exception('Problemas ao verificar  o tamanho da senha ['.$str.']');
    }else{
      return $length;
    }
  }
  
  /*
   * 
   * @param   string langs o idioma atual [OPICIONAL]
   * @returns string o macro idioma, exemplo PT-BR = PT
   */  
   protected static function getMacroLang ($langs){    
    if ((!is_string($langs)) || (empty($langs)) || (trim($langs) === '')){
      $langs = static::getLang(); 
    }
    
    if (strpos($langs, '-') !== false){
      $langs = explode('-', $langs);
      $langs = $langs[0];
    }       

    /* REDUZINDO O TAMANHO */
    $langs = static::strtolower($langs);
    
    return trim($langs);
  }
  
  /*
   * 
   * @returns string a linguagem de preferencia / MACRO LINGUAGEM
   */
  public static function getLang(){       
    if ((isset($_SERVER)) && (is_array($_SERVER)) && (array_key_exists('HTTP_ACCEPT_LANGUAGE', $_SERVER))){
      return substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 4)*100;
    }else{
      return 'PT-BR';
    }
  }  
  
  /* defaultReturn
   * 
   * O VALOR PADRÃO (ZERADO) PARA O RETORNO
   * O RESULTADO DO CALCULO DE FORÇA
   */  
  protected static function dR(){
    return array(
       'scor'               => 0
      ,'candidateScor'      => []

      /* 0 - Ruim
       * 1 - Fraca
       * 2 - Regular
       * 3 - Boa
       * 4 - Forte
       */    
      ,'level'             => 0
      ,'length'            => 0    
      ,'distincts'         => 0
      ,'charTypes'         => 0        
      ,'pointsByType'      => 0    
      ,'lowerCaseLetters'  => 0
      ,'upperCaseLetters'  => 0
      ,'moreLetters'       => 0
      ,'numbers'           => 0
      ,'punctuation'       => 0
      ,'simbols'           => 0
      ,'words'             => array()
      ,'wordLetters'       => 0
      ,'dates'             => array()
      ,'sequential'        => 0
      ,'multipleScripts'   => false        

      /*
       * RULES, SÃO AS REGRAS MÍNIMA PADRÃO PARA A SENHA
       */
      ,'rules'             => array(
         'length'          => false
        ,'distinct'        => false      
        ,'difCaseLetter'   => false
        ,'noSequential'    => false
        ,'noDate'          => false
        ,'strength'        => false
        ,'noWords'         => false
        ,'specialChar'     => false
      )
    );     
  }  
  
 /*
  * findWords
  * PROCURA POR PALAVRAS NA SENHA (value), BASEANDO EM dicionario
  * 
  * @param     string    value       a senha
  * @returns   object                contendo a soma de letras e array com as palavras
  */
  protected static function fW($V, $lang){
    $pl = array("letters" => 0, "words" => array());

    $lang = static::strtolower(static::getMacroLang($lang));

    if ((count(static::$cfg["ws"]) <= 0) || (!array_key_exists($lang, static::$cfg["ws"]))){
      static::getDic($lang);
      return null;
    }      

    if ((!array_key_exists('en', static::$cfg["ws"])) || (!array_key_exists('hacking', static::$cfg["ws"]))){
      static::getDic($lang);
      
      if ((!array_key_exists('en', static::$cfg["ws"])) || (!array_key_exists('hacking', static::$cfg["ws"]))){     
        throw new Exception('Dicionários "en" e "hacking" não localizados');
      }
    }

    $MacroIdiomas = array('hacking', 'en');

    if (array_key_exists($lang, static::$cfg["ws"])){        
     $MacroIdiomas[] = $lang;
    }

    foreach ($MacroIdiomas as $key => $ws) {
      if (array_key_exists($ws, static::$cfg["ws"])){
        $ws = &static::$cfg["ws"][$ws];

        /* PROCURANDO PELAS PALAVRAS */
        if ((is_array($ws)) &&(count($ws) > 0)){       
          foreach ($ws as $key => &$w) {
            if (is_string($w) && (static::strlen($w) > 0)){
              $w = static::strtolower($w);

              if (!in_array($w, $pl['words'])){             
                if (strpos($V, $w) !== false){ /* PROCURANDO INSENSITIVE */
                  $pl["letters"] += static::strlen($w);
                  $pl["words"][]  = $w;
                }            
              }
            }
          }
        }
      }
    }

    return $pl;
  }  
  
  /* removeDubCharacters
   * 
   * REMOVE LETRAS DUPLICADAS DE FORMA INSENSIVEL
   * OU SEJA, A=a, SE HOUVER AMBAS UMA DELES SERÁ REMOVIDA
   * DESTA FORMA É POSÍVEL SABER QUANTO CARACTERES ÚNICOS EXISTEM
   * 
   * @param     string    str         a senha
   * @returns   string                a senha com caracteres duplicados removidos
   */  
  protected static function rDC($str) {
    return preg_replace('#(.)(?=.*\1)#ui', '', $str);    
  }
    
  /*
   * 
   */
  public static function strtolower($str){
    return mb_convert_case($str, MB_CASE_LOWER, @mb_detect_encoding($str));
  }
  
  /*
   * 
   */
  public static function strtoupper($str){
    return mb_convert_case($str, MB_CASE_UPPER, @mb_detect_encoding($str));
  }

  
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
  protected static function hS($pass){        
    /* PARECE FUNCIONAR APENAS COM CARACTERES UTF-8, E DEVERIA SER TODA
     * A TABELA UNICODE */
    $uniord = function($utf8, $hex = true) { 
      /* CONVERTENDO PARA UNICODE */
      $k = @mb_convert_encoding($utf8, 'UCS-2LE', @mb_detect_encoding($utf8));
      $k1 = ord(substr($k, 0, 1)); 
      $k2 = ord(substr($k, 1, 1)); 

      $intval = $k2 * 256 + $k1;

      if ($hex){
        return static::strtoupper(dechex($intval));
      }else{
        return $intval;
      }
    };    
    
    if (static::strlen($pass) >= 3){                 
      /* SEQUENCIAL IDENPENDENTEMENTE DO CASO */    
      $pass = static::strtolower($pass);   
    
      $LC   = -1; /* Last Char */
      $o    = -1; /* ATUAL */
      $LLC  = -1; /* Last Last Char */
      $EC   = 0;  /* Encontantrados */

      for ($i = static::strlen($pass)-1; $i >= 0; $i--){
        $o = $uniord(mb_substr($pass, $i, 1));                
        
        if (
            ($LC != -1) && 
            ($LLC != -1) && 
            (
              (($o == $LC) && (($LLC == $LC - 1) || ($LLC == $LC + 1) || ($LLC == $LC))) || 
              (($o == $LC + 1) && (($LLC == $LC - 1) || ($LLC == $LC))) || 
              (($o == $LC - 1) && (($LLC == $LC + 1) || ($LLC == $LC)))
            )
          ){
          $EC++;          
        }

        $LLC = $LC;
        $LC = $o;
      }

      return $EC;
    }

    return 0;
  }
    
  /*
   * SOMA UM ARRAY DE VALORES NUMERICOS
   * 
   * @param   arr       array     Array com valores numericos a serem somados     
   * @returns           interger  Resultado da soma
   */
  protected static function sum($ar){
    return array_sum($ar);
  }
  
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
  public static function asDifcaseScript($lang){
    return true;
  }  
  
  /*
   * 
   * @param   string  código da linguagem a ser obtida a expreção
   * @returns string  A expreção para a linguagem específica
   */
  protected static function getExpLang($idioma){
    /*
     * LUR = PM.LUR
     */
    $idioma = static::strtoupper($idioma);
    $sexp = '';
    
    foreach (static::$LUR[$idioma] as $key => $value) {
      $sexp += "\p{" . $value . "}";
    }

    $sexp .= '\p{Common}';

    /* O Latim é um sistema de escrita quase universal, ele deve sempre ser
     * considerado
     */
    if (strpos($sexp, '\p{Latin}') === false){
      $sexp .= '\p{Latin}';
    }

    return $sexp;
  }  
  
  /*  
   * SUBSTITUI STR PO SUB COM BASE NO REGEX RX
   * 
   * @param     string    str     O integral
   * @param     XRegExp    rx     O regex
   * @param     string    sub     O texto a ser colocado no lugar
   * @returns   string            texto str substituido por sub
   */
  protected static function XRP($str, $rx, $sub){
    return preg_replace($rx, $sub, $str);
  }
  
  /*
   * CLASSE PASSMETER
   * 
   * @param     string    pass    a senha
   * @returns   json                  pontuação da senha
   */  
  public static function meter($pass, $LANG){
   /* HABILITANDO UNICODE */
    $old_mb_internal_encoding = @mb_internal_encoding();
    @mb_internal_encoding(static::CHARSET);    
    
    /* 
     * CONVERTENDO PARA UNICODE
     * O MAIS ADEQUADO SERIA USAR 'UCS-2LE' = UNICODE FULL
     * MAS PARECE COMPLICAR TUDO, PORTANTO NO FUTURO DEVERÁ SER IMPLEMENTADO
     */        
    $pass = @mb_convert_encoding($pass, static::CHARSET, @mb_detect_encoding($pass));  
    
    /* GARANTINDO QUE ESTÁ INICIALIZADO */
    if (!static::$isLoaded){
      static::dependencias($LANG);
    } 
        
    /* OBTENDO E PASSING LANG */
    $LANG = static::getMacroLang($LANG);                              
    
    if (mb_strlen($pass) > 128){
      return static::dR();
    }
    
    static::$_R = static::dR();
    
    if (!is_string($pass)){
      return array("approved" => false, "passinfo" => static::$_R);
    }
    
    static::$_R['length'] = static::strlen($pass);    
    
    if (static::$_R['length'] > 0){
      /*** OBTEM OS CARACTERES DISTINDOS DESCONSIDERANDO PRIMEIRO E ÚLTIMO DIGITO ***/
      $distintas = static::rDC(substr(substr($pass, 1), 0, -1));

      /* OBTENDO A QUANTIDADE TOTAL DE DISTINTAS */
      static::$_R["distincts"] = static::rDC($pass);      
      static::$_R["distincts"] = ((!empty(static::$_R["distincts"])) && static::strlen(static::$_R["distincts"])>0)?static::strlen(static::$_R["distincts"]):0;

      static::$_R["scor"]  = 1;

      /*** TAMANHO DE 9 à 15 ***/
      if (static::$_R["length"] >= 9){
        static::$_R["scor"] += 1;

        $amais = ((static::$_R["length"]-9)>0)?(static::$_R["length"]-9):0;      
        static::$_R["scor"] += ($amais>0)?($amais/4):0;        
      }       

       /*
        * SOMANDO OS TIPOS DE CARACTERES EXISTENTES
        */
      static::$_R["charTypes"]        = 0;
      static::$_R["pointsByType"]     = 0;     

      $maxPointsChars = 0;

      /*** SE HOVER LETRAS MINUSCULAS ***/
      $maxPointsChars = $maxPointsChars + 1;      
      preg_match_all(static::$cfg["_RX"]["lowerLetters"], $distintas, static::$_R["lowerCaseLetters"]);     
      static::$_R["pointsByType"]      += (!empty(static::$_R["lowerCaseLetters"][0]))?1:0;
      static::$_R["charTypes"]         += (!empty(static::$_R["lowerCaseLetters"][0]))?1:0;
      static::$_R["lowerCaseLetters"]   = (count(static::$_R["lowerCaseLetters"][0])>0)?count(static::$_R["lowerCaseLetters"][0]):0;     

      /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
      $distintas = static::XRP($distintas, static::$cfg["_RX"]["lowerLetters"], "");

      /*** SE HOUVER LETRAS MAIUSCULAS  ***/
      $maxPointsChars = $maxPointsChars + 1;
      preg_match_all(static::$cfg["_RX"]["upperLetters"], $distintas, static::$_R["upperCaseLetters"]);
      static::$_R["pointsByType"]      += (!empty(static::$_R["upperCaseLetters"][0]))?1:0;
      static::$_R["charTypes"]         += (!empty(static::$_R["upperCaseLetters"][0]))?1:0;
      static::$_R["upperCaseLetters"]   = (count(static::$_R["upperCaseLetters"][0])>0)?count(static::$_R["upperCaseLetters"][0]):0;     

      /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
      $distintas = static::XRP($distintas, static::$cfg["_RX"]["upperLetters"], "");    

      /*** SE HOUVER OUTROS TIPOS DE LETRAS ***/
      $maxPointsChars = $maxPointsChars + 1;
      preg_match_all(static::$cfg["_RX"]["otherLetters"], $distintas, static::$_R["moreLetters"]);            
      static::$_R["pointsByType"]      += (!empty(static::$_R["moreLetters"][0]))?1:0;
      static::$_R["charTypes"]         += (!empty(static::$_R["moreLetters"][0]))?1:0;     
      static::$_R["moreLetters"]        = (count(static::$_R["moreLetters"][0])>0)?count(static::$_R["moreLetters"][0]):0;

      /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
      $distintas = static::XRP($distintas, static::$cfg["_RX"]["otherLetters"], "");

      /*** SE HOUVER NUMEROS ***/
      $maxPointsChars = $maxPointsChars + 1.1;
      preg_match_all(static::$cfg["_RX"]["numbers"], $distintas, static::$_R["numbers"]);
      static::$_R["pointsByType"]      += (!empty(static::$_R["numbers"][0]))?1.1:0;      
      static::$_R["charTypes"]         += (!empty(static::$_R["numbers"][0]))?1:0;          
      static::$_R["numbers"]            = (count(static::$_R["numbers"][0])>0)?count(static::$_R["numbers"][0]):0;     

      /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
      $distintas = static::XRP($distintas, static::$cfg["_RX"]["numbers"], "");    

      /*** SE HOUVER PONTUAÇÃO ***/
      $maxPointsChars = $maxPointsChars + 1.1;        
      preg_match_all(static::$cfg["_RX"]["punctuation"], $distintas, static::$_R["punctuation"]);            
      static::$_R["pointsByType"]      += (!empty(static::$_R["punctuation"][0]))?1.1:0;
      static::$_R["charTypes"]         += (!empty(static::$_R["punctuation"][0]))?1:0;       
      static::$_R["punctuation"]        = (count(static::$_R["punctuation"][0])>0)?count(static::$_R["punctuation"][0]):0;

      /* REMOVENDO AS LETRAS JÁ PONTUADAS, PARA EVITAR QUE PONTUEM DUPLAMENTE EM OUTRA CATEGORIA */
      $distintas = static::XRP($distintas, static::$cfg["_RX"]["punctuation"], "");    

      /*** SE HOUVER SIMBOLOS ***/        
      /* AQUI USAMOS < 1, POIS INCREMENTAREMOS ADIANTE */
      $maxPointsChars = $maxPointsChars + 0.9;
      preg_match_all(static::$cfg["_RX"]["symbols"], $distintas, static::$_R["simbols"]);                        
      static::$_R["pointsByType"]      += (!empty(static::$_R["simbols"][0]))?0.9:0;
      static::$_R["charTypes"]         += (!empty(static::$_R["simbols"][0]))?1:0;            
      static::$_R["simbols"]            = (count(static::$_R["simbols"][0])>0)?count(static::$_R["simbols"][0]):0;      

      /* VERIFICANDO OS TIPOS DE SIMBOLOS ENCONTRANDO,  
       * E INCREMENTANDO LEVEMENTE A PONTUAÇÃO
       */
      $maxPointsChars = $maxPointsChars + 0.8;        
      $simtypecount = 0;

      // símbolo de moeda
      preg_match_all('#[\p{Sc}]#ui', $distintas, $matchsSTC);
      $simtypecount += (!empty($matchsSTC[0]))?1:0;

      // Modifier symbol
      $matchsSTC = null;
      preg_match_all('#[\p{Sk}]#ui', $distintas, $matchsSTC);      
      $simtypecount += (!empty($matchsSTC[0]))?1:0;           

      // Mathematical symbol
      $matchsSTC = null;
      preg_match_all('#[\p{Sm}]#ui', $distintas, $matchsSTC);                 
      $simtypecount += (!empty($matchsSTC[0]))?1:0;      

      // Other symbol
      $matchsSTC = null;
      preg_match_all('#[\p{So}]#ui', $distintas, $matchsSTC);
      $simtypecount += (!empty($matchsSTC[0]))?1:0;            
      
      /* INCREMENTANDO CASO EXISTAM MULTIPLOS TIPOS DE SIMBOLOS */        
      static::$_R["pointsByType"]      += ($simtypecount>0)?(($simtypecount*2)/10):0;

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
      $maxPointsChars = $maxPointsChars + 2;
      $range = static::getExpLang($LANG);

      $rMeuIdioma    = '#[' .$range.']#u';
      $rDiferIdioma  = '#[^'.$range.']#u';
      
      if ((preg_match($rMeuIdioma, $pass)>=1) && (preg_match($rDiferIdioma, $pass)>=1)){       
        //xlog('Uso de algarismo de multiplos sistemas de escrita.');
        static::$_R["pointsByType"]     += 2; /* PONTUAÇÃO POR USAR MULTIPLOS DISTEMAS DE ESCRITA */          
        static::$_R["multipleScripts"]  = true;
      }else{
        static::$_R["multipleScripts"]  = false;
      }

      /*
       * ALGUMAS DEDUÇÕES ABAIXO SOMENTE FUNCIONAM PARA IDIOMA LATINOS,
       * PRÓXIMO PASSO: IMPLEMENTAR AS VERIFICAÇÕES PARA TODOS OS IDIOMAS
       * == IMPLEMENTAR ==
       */

      /* NÃO TER DATA NÃO ACRESCENTA PONTO, MAS TER RETIRA PONTOS */
      preg_match_all("/".static::$cfg["_RX"]["data"]."/xui", $pass, static::$_R["dates"]);                              
      static::$_R["pointsByType"]-= (count(static::$_R["dates"][0])<=0)?0:(1 + (count(static::$_R["dates"][0])*.5));
      static::$_R["dates"]        = (count(static::$_R["dates"][0])<=0)?array():static::$_R["dates"][0];

      /* NÃO TER NUMERO SEQUANCIAL NÃO ACRESCENTA PONTO, MAS TER RETIRA PONTOS */
      static::$_R["sequential"]     = static::hS($pass);                  
      static::$_R["pointsByType"]  -= (static::$_R["sequential"]>0)?(1 + (static::$_R["sequential"]*0.5)):0;

      /* CADA PALAVRA, REDUÇÃO DE PONTOS */                
      if ((count(static::$cfg["ws"]) <= 0) || (!array_key_exists($LANG, static::$cfg["ws"]))){
        static::getDic($LANG);        
        $words = array("words" => array('Dicionário não baixado/existente.'),"letters" => 0);
      }else{
        $words = static::fW($pass, $LANG);
      }

      static::$_R["words"]          = $words["words"];
      static::$_R["wordLetters"]    = $words["letters"];
      static::$_R["pointsByType"]  -= (count(static::$_R["words"])>0)?(1 + (count(static::$_R["words"])*0.15)):0; /* 0,15 de peso por palavra  */

      /* SE STRENGHT FOR ZERO OU MENOR, QUER DIZER QUE HOUVE MUITOS DESCONTOS,
       * INDICANDO QUE A SENHA TEM MUITOS PROBLEMAS
       * ENTÃO A FORÇA É FRACA
       */
      if (static::$_R["pointsByType"] < 1){
        static::$_R["scor"] = 0;
      }else{                    
        /* INICIALIZANDO */
        static::$_R["candidateScor"] = array();      

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
        static::$_R["candidateScor"][] = (((static::$_R["distincts"] * static::$_R["pointsByType"])/static::$_R["length"])*static::$cfg["_a"]);
        static::$_R["candidateScor"][count(static::$_R["candidateScor"])-1] = floor(
          (static::$_R["candidateScor"][count(static::$_R["candidateScor"])-1]>99)
            ?99
            :static::$_R["candidateScor"][count(static::$_R["candidateScor"])-1]
        );

        /* ## METODO 02 (PREFERENCIAL)
         * 
         * CALCULANDO A SUB-PORCENTAGEM BASEANDO-SE NA QUANTIDADE DE LETRAS E NA
         * QUANTIDADE DE LETRAS DISTINTAS
         */          
        $pt = (
          (
            (
              ((((static::$_R["distincts"]/static::$cfg["iDs"])>1)?1:(static::$_R["distincts"]/static::$cfg["iDs"])) * 100) /* <<< PORCENTAGEM DE DISTINTAS */
             +((((static::$_R["length"]   /static::$cfg["mL"])     >1)?1:(static::$_R["length"]   /static::$cfg["mL"]))      * 100) /* <<< PORCENTAGEM DE LETRAS */
            ) / 2 /* <<< MÉDIA */
          ) / 100 /* <<< PORCENTAGEM/DECIAMAL FINAL */
        );

        /*
         * VAMOS CALCULAR A PONSTUAÇÃO REAL COM BASE NO PERCENTUAL MÁXIMO POSSÍVEL
         * EMBORA SEJA MAIS ASSERTIVA, ESTA FORMULA PARECE TER DIFICULDADE
         * DE ATINGIR O MÁXIMO (100%)
         */
        static::$_R["candidateScor"][] = floor(((static::$_R["pointsByType"]/$maxPointsChars)*$pt)*100);

        /* PONDERANDO PONTUAÇÃO */
        static::$_R["scor"] = floor(static::sum(static::$_R["candidateScor"])/count(static::$_R["candidateScor"]));
      } 

      /*
       * LEVEL COM BASE NA PONTUAÇÃO
       */
      if (static::$_R["scor"] >= 60){
        static::$_R["level"] = 4; /* FORTE */
      }else if ((static::$_R["scor"] >= 25) && (static::$_R["scor"] < 60)){
        static::$_R["level"] = 3; /* BOA */
      }else if ((static::$_R["scor"] >= 20) && (static::$_R["scor"] < 25)){
        static::$_R["level"] = 2; /* REGULAR */
      }else if ((static::$_R["scor"] >= 10) && (static::$_R["scor"] < 20)){
        static::$_R["level"] = 1; /* FRACO */
      }else{
        static::$_R["level"] = 0; /* PESSIMO */
      }
    }

    /*
     * VAMOS ANALISAR AS RULES AGORA
     */
    $approved = true;     

    if (static::$_R["level"] >= 3){
      static::$_R["rules"]["strength"] = true;
    }else{
      static::$_R["rules"]["strength"] = false;
      $approved = false;      
    }

    if ((static::$_R["numbers"] + static::$_R["punctuation"] + static::$_R["simbols"]) > 1){
      static::$_R["rules"]["specialChar"] = true;
    }else{
      static::$_R["rules"]["specialChar"] = false;
      $approved = false;      
    }    

    if (((static::$_R["lowerCaseLetters"] > 0) && (static::$_R["upperCaseLetters"] > 0)) || (!static::asDifcaseScript($LANG))){
      static::$_R["rules"]["difCaseLetter"] = true;
    }else{
      static::$_R["rules"]["difCaseLetter"] = false;
      $approved = false;      
    }

    if (static::$_R["length"] >= 9){
      static::$_R["rules"]["length"] = true;
    }else{
      static::$_R["rules"]["length"] = false;
      $approved = false;      
    }

    if (static::$_R["distincts"] >= 6){
      static::$_R["rules"]["distinct"] = true;
    }else{
      static::$_R["rules"]["distinct"] = false;
      $approved = false;      
    }

    if (!static::$_R["sequential"]){
      static::$_R["rules"]["noSequential"] = true;
    }else{
      static::$_R["rules"]["noSequential"] = false;
      $approved = false;      
    }

    if (count(static::$_R["dates"]) <= 0){
      static::$_R["rules"]["noDate"] = true;
    }else{
      static::$_R["rules"]["noDate"] = false;
      $approved = false;      
    }

    /* ASSUMINDO OK */
    static::$_R["rules"]["noWords"] = true;  

    if ((static::$_R["wordLetters"] > 0) && (count(static::$_R["words"]) > 0)){
      if (
          ((static::$_R["length"] - static::$_R["wordLetters"]) < 3) || 
          (static::$_R["wordLetters"] >= (0.60*static::$_R["length"]))
      ){
        static::$_R["rules"]["noWords"] = false;
        $approved = false;      
      }
    }

   /* REESTABELECENDO O ENCODING INTERNO ANTERIOR */
    @mb_internal_encoding($old_mb_internal_encoding); 
    
    return array("approved" => $approved, "passinfo" => static::$_R);          
  }
  
  /*
   * 
   * @param string macro lang
   * @returns boolean
   */
  protected static function getDic($langs = null){
    /*
     * FAZ A BAIXA DE UM DICIONÁRIO E ANEXA A LISTA GERAL DE PALAVRAS PARA ANÁLISE
     * DA SENHA
     */
    $downDic = function ($path, $descri){          
      /* VERIFICANDO SE É UMA STRING */
      if ((!is_string($path)) || (static::strlen($path) <= 3)){
        throw new Exception('Impossível carregar dicionário: URL fornecida não é aceitável ['.$path.'].');    
        return false;
      }   

      /* DEFININDO DESCRI, CASO NÃO SEJA FORNECIDA */
      if (($descri === null) || (!is_string($descri)) || (static::strlen($descri) <= 0)){
        $descri = substr($path, 0, strrpos($path, DIRECTORY_SEPARATOR)+1);
        $descri = str_replace('.json', '', $descri);
      } 

      $descri = static::strtolower($descri);

      if ((file_exists($path)) && ($json = (array) json_decode(file_get_contents($path), true))){
        static::$cfg["ws"][$descri] = $json;
      }else{
        #throw new Exception('Impossível carregar dicionário: [' + url + "'].");
        return false;
      }
    };
      
    $langs = static::getMacroLang($langs);
    
    if ((!is_string($langs)) || (static::strlen($langs) <2)){
      throw new Exception('PASSMETER :: Idioma não fornecido.');  
      return null;
    }    
    
   /*
    * OBTENDO O DICIONÁRIO DE PALAVRAS
    */   
    if ((count(static::$cfg["ws"]) <= 0) || (!array_key_exists($langs, static::$cfg["ws"]))){      
      $downDic(__DIR__ . "/dic/".$langs.".json", $langs);
    }
    
    if (($langs !== "hacking") && (!array_key_exists("hacking", static::$cfg["ws"]))){
      $downDic(__DIR__ . "/dic/hacking.json", 'hacking');
    }
    
    if (($langs !== "en") && (!array_key_exists("en", static::$cfg["ws"]))){    
      $downDic(__DIR__ . "/dic/en.json", 'en');
    }    
  }
  
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
  protected static function RBC($category){
    $unirTudo = function ($cat){
      if (count($cat) > 1){
        foreach ($cat as $key => &$value) {
          $value = '\p{'.$value.'}';
        }
        
        return $cat;
      }else{
        return array("\p{".$cat."}");
      }
    };

    if (is_string($category) === 'string' ){
      $category = array($category);
    }
   
    /* UNIFICANDO CATEGORIAS E RETORNANDO REGEX */    
    return '#['.implode("", $unirTudo($category))."]#u";
  }

  /*
   * Carrega os Dicionários
   */
  protected static function initDic($lang){
    return static::getDic($lang);
  }  
  
  /*
   * VERIFICA E CREEGA DEPENDENCIAS
   */
  protected static function dependencias($lang){
    if (!static::$isLoaded){
      static::init($lang);
    }        
  }  
  
  /*
   * CONSTRUTOR
   */
  protected static function init($LANG){
    if (!static::$isLoaded){    
      static::$LUR = (array) json_decode(file_get_contents(__DIR__ . '/lib/LUR.json'), true);  
      
      /*
       * REGEX PARA CASAR GRUPO DE CHAR POR CATEGORIA
       * 
       * TENTAR SIMPLIFICAR, DIMINUIR DEPENDENCIAS OU TAMANHO BAIXADO
       * IDÉIAS PODEM SER OBTIDAS EM:
       * https://stackoverflow.com/questions/27829640/how-to-match-unicode-by-writing-system-script
       * 
       * == IMPLEMENTAR ==
       */
      static::$cfg["_RX"] = array(
        "lowerLetters"    => static::RBC('Ll')
        ,"upperLetters"   => static::RBC('Lu')

        ,"otherLetters"   => static::RBC(array('Lm','Lo','Lt'))

        ,"punctuation"    => static::RBC(array(
                           'Mc','Me','Mn',
                           'Zl','Zp','Zs',
                           'Pc','Pd','Pe','Pf','Pi','Po','Ps'
                          ))

        ,"symbols"        => static::RBC(array('Sc','Sk','Sm','So'))

        ,"numbers"        => static::RBC('Nd')

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
        ,"data"           => <<<EOF
(?(DEFINE)
  (?<dia>0[1-9]|[1-2][0-9]|3[01]) # dia
  (?<mes>0[1-9]|1[0-2])           # mês
  (?<ano>(1[89]|20)?[0-9]{2})     # ano
)
(
   \g<dia>.?\g<mes>.?\g<ano>
  |\g<mes>.?\g<dia>.?\g<ano>
  |\g<ano>.?\g<dia>.?\g<mes>
  |\g<ano>.?\g<mes>.?\g<dia>
  |\g<mes>.?\g<dia>
  |\g<dia>.?\g<mes>
  |\g<ano>.?\g<mes>
  |\g<mes>.?\g<ano>
)         
EOF
      );

      /* BAIXANDO DICIONÁRIOS AUTOMATICAMENTE */
      static::initDic($LANG);
      static::$isLoaded = true; // PRONTO         
    }
  }    
}