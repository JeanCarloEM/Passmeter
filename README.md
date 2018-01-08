[Passmeter](http://opensource.jeancarloem.com/Passmeter/) 1.0.2
========================================

[![Passmeter|JeanCarloEM](http://opensource.jeancarloem.com/Passmeter/recursos/img/passmeter.png)](http://jeancarloem.com)

Passmeter é um completo medidor da força de senha que pretende ser multi-idioma e multi-linguagem. Através de sua API é possível obter diversas informações acerca da senha analisada como pontuação, tipos de caracteres utilizados, indicação para aceitação, força, dentre muitas outras.

Atualmente está disponível em JAVASCRIPT e PHP.

Para mais [informações e demonstração online](http://opensource.jeancarloem.com/Passmeter).

## Requisitos

Para execução em navegadores com javascript é necessário [XRegexp 2.0+](https://github.com/slevithan/xregexp).

Se identificar a ausência de algum recurso acima, Passmeter tenta fazer o download automaticamente utilizando CDN.

As demais linguagens de programação não necessitam de recursos adicionais até o momento, exceto o ambiente adequado para execução das mesmas.

## Contribuir

* ####Criar um BRANCH para adicionar novas linguagens de programação ou recursos.
Ao adicionar uma nova linguagem de programação, faça-o por meio de BRANCH. Crie `Passmeter.(extenção da linguagem)` dentro de `src`. Se a linguagem de programação exigir mais de um arquivo, deve-se preferencialmente manter o `Passmeter.(extenção)` dentro da pasta `scr` linkando os os demais arquivos que devem ser colocados dentro de uma pasta com o nome da linguagem em `src/lib/`, por exemplo `src/lib/php/` para conteúdo adicional para linguagem PHP. Se por qualquer motivo nenhuma destas localizações puder ser feita, então crie uma pasta em `scr` com o nome da linguagem.

* ####Crie um FORK para contribuir corrigindo, estendendo e aprimorando. 
Sempre que a edição resultar em mudança na LÓGICA, ocasionando um retorno de `meter` para uma mesma senha diferente do release atual, deve-se criar um FORK, por se tratar de correção ou aprimoramento. Ela apenas deve ser mesclada após todas as linguagens serem equiparadas, garantindo resultados iguais.

Ao desenvolver em uma nova linguagem de programação, procure seguir a mesma lógica e estrutura presente nas linguagens já disponibilizadas a fim de manter o padrão, e garanta que independentemente da linguagem o resultado obtido com Passmeter para uma mesma senha deve ser exatamente o mesmo.

Sempre dialogue previamente com o(s) desenvolvedor(es) ou colaborador(es) para evitar rejeição de contribuição e garantir unicidade da equipe desenvolvedora, e somente consolide a alteração se houver aceitação da equipe.

## Sobre

Passmeter copyright 2014 por [Jean Carlo EM](http://jeancarloem.com/).

Todo o código é disponibilizado nos termos da licença [LGPL 3.0 ou posterior](https://www.gnu.org/licenses/lgpl.html), SALVO informação expressa em contrário. As subpastas de `build/dic` e o conteúdo de `src/dic` são em parte ou no todo conteúdo/modificação do(s) [Dicionários e Pacotes de idioma do Mozilla](https://addons.mozilla.org/pt-BR/thunderbird/language-tools/) e estão licenciados sob [Creative Commons Attribution Share-Alike License v3.0 or any later version](http://creativecommons.org/licenses/by-sa/3.0/), ou outra licença de código aberto (consultar o site [Mozilla](https://addons.mozilla.org/pt-BR/thunderbird/language-tools/) para verificar o licenciamento), EXCETO conteúdo intitulado(s) `hacking` conforme arquivo `disclaimer`, possivelmente licenciado(s) sob DOMÍNIO PUBLICO.