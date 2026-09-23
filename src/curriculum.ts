import { ModuleNode, ChapterItem } from './types';

export const CURRICULUM_TREE: ModuleNode[] = [
  {
    "id": "visao-geral",
    "title": "Início",
    "badge": "FATEC",
    "files": [
      {
        "id": "README.md",
        "title": "Visão Geral do Curso",
        "subtitle": "Estrutura da Trilha Fullstack, Pilares Pedagógicos e Ementa",
        "moduleTitle": "Desenvolvimento Web Fullstack — FATEC",
        "estimatedMinutes": 6
      }
    ]
  },
  {
    "id": "00-bases-da-web",
    "title": "00 · Bases da Web",
    "badge": "Core",
    "description": "Arquitetura da rede, modelo cliente-servidor, HTTP e as duas pontas da web.",
    "files": [
      {
        "id": "00-bases-da-web/01-como-a-web-funciona-e-o-modelo-cliente-servidor.md",
        "title": "Como a Web Funciona e o Modelo Cliente-Servidor",
        "subtitle": "Olá, servidor! Eu sou o navegador Chrome. Gostaria de obter o recurso",
        "moduleTitle": "00 · Bases da Web",
        "estimatedMinutes": 8
      },
      {
        "id": "00-bases-da-web/02-as-duas-pontas-da-web-frontend-e-backend.md",
        "title": "As Duas Pontas da Web: Frontend e Backend",
        "subtitle": "⚠️ O Trade-off da Manutenção:",
        "moduleTitle": "00 · Bases da Web",
        "estimatedMinutes": 10
      }
    ]
  },
  {
    "id": "01-linguagens-de-programacao",
    "title": "01 · Linguagens de Programação",
    "badge": "Linguagens",
    "description": "Domínio sintático e estrutural de TypeScript no ecossistema JS e PHP 8 moderno.",
    "submodules": [
      {
        "id": "01-linguagens-de-programacao/typescript",
        "title": "01.A · TypeScript",
        "badge": "TS",
        "description": "Tipagem estática rigorosa, sistemas de tipos, coleções, POO e assincronia.",
        "files": [
          {
            "id": "01-linguagens-de-programacao/typescript/01-o-que-e-typescript-e-por-que-ele-existe.md",
            "title": "01. O Que É o TypeScript e Por Que Ele Existe?",
            "subtitle": "Os tipos do TypeScript só existem durante o desenvolvimento (em tempo de",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/02-o-que-e-um-runtime-js.md",
            "title": "02. O Que É um Runtime JavaScript?",
            "subtitle": "Por que isso é vital?",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/03-gerenciadores-de-pacotes.md",
            "title": "03. Gerenciadores de Pacotes e o Ecossistema NPM",
            "subtitle": "Essa biblioteca é necessária para o usuário final usar a aplicação em",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/typescript/04-instalacao-e-primeiro-programa.md",
            "title": "04. Instalação e Primeiro Programa em TypeScript",
            "subtitle": "Instalação Manual Alternativa:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 9
          },
          {
            "id": "01-linguagens-de-programacao/typescript/05-tipos-primitivos-e-especiais.md",
            "title": "05. Tipos Primitivos e Especiais",
            "subtitle": "Atenção ao NaN (Not a Number):",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/06-string-e-template-literals.md",
            "title": "06. Strings e Template Literals",
            "subtitle": "Regra de Ouro:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/07-variaveis.md",
            "title": "07. Variáveis: const, let e o Fim do var",
            "subtitle": "Regra de Ouro:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/typescript/08-objetos-literais.md",
            "title": "08. Objetos Literais",
            "subtitle": "Regra de Ouro:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 5
          },
          {
            "id": "01-linguagens-de-programacao/typescript/09-tipos-por-referencia-e-memoria.md",
            "title": "09. Tipos por Referência e Modelo de Memória",
            "subtitle": "Nota: Vamos aprofundar em detalhes como a Stack aloca e organiza variáveis",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/typescript/10-type-aliases.md",
            "title": "10. Type Aliases: Nomeando Contratos",
            "subtitle": "Convenção de Nomenclatura (PascalCase):",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 5
          },
          {
            "id": "01-linguagens-de-programacao/typescript/11-expressoes-e-operadores.md",
            "title": "11. Expressões e Operadores Modernos",
            "subtitle": "Prefixado vs. Posfixado:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/typescript/12-estruturas-condicionais.md",
            "title": "12. Estruturas Condicionais",
            "subtitle": "Boas Práticas: Mesmo quando o bloco possui apenas uma linha, sempre",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 4
          },
          {
            "id": "01-linguagens-de-programacao/typescript/13-lacos-de-repeticao.md",
            "title": "13. Laços de Repetição",
            "subtitle": "Alerta de Loop Infinito: Se a condição do while nunca se tornar falsa, o",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/typescript/14-funcoes-anatomia-e-sintaxe.md",
            "title": "14. Funções: Anatomia, Sintaxe e Contratos",
            "subtitle": "Convenção de Nomenclatura:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/15-funcoes-de-primeira-classe.md",
            "title": "15. Funções de Primeira Classe e Callbacks",
            "subtitle": "Auto-Documentação nos Parâmetros do Tipo:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/typescript/16-escopo-e-sombreamento.md",
            "title": "16. Escopo, Cadeia Léxica e Sombreamento",
            "subtitle": "Onde exatamente uma variável pode ser acessada dentro do código e onde ela é",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 13
          },
          {
            "id": "01-linguagens-de-programacao/typescript/17-excecoes-e-tratamento-de-erros.md",
            "title": "17. Exceções e Tratamento de Erros",
            "subtitle": "Por que o TypeScript tipa o erro como unknown?",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 11
          },
          {
            "id": "01-linguagens-de-programacao/typescript/18-arrays.md",
            "title": "18. Arrays Tipados",
            "subtitle": "Atenção:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/19-tuplas.md",
            "title": "19. Tuplas: Estruturas Heterogêneas Fixas",
            "subtitle": "Aviso Importante sobre Rótulos:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/20-desestruturacao-de-arrays-e-objetos.md",
            "title": "20. Desestruturação de Arrays e Objetos",
            "subtitle": "Atenção à sintaxe no TypeScript: Renomeação NÃO é Tipagem!",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 11
          },
          {
            "id": "01-linguagens-de-programacao/typescript/21-operadores-rest-e-spread.md",
            "title": "21. Operadores Rest e Spread",
            "subtitle": "Regra Obrigatória do Operador Rest:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/22-metodos-funcionais-de-array.md",
            "title": "22. Métodos Funcionais de Array",
            "subtitle": "Retorno de Objetos Literais em Arrow Functions:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 16
          },
          {
            "id": "01-linguagens-de-programacao/typescript/23-closures-e-fabricas-de-funcoes.md",
            "title": "23. Closures e Fábricas de Funções",
            "subtitle": "Regra de Ouro: Atenção ao Ciclo de Vida da Memória",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 15
          },
          {
            "id": "01-linguagens-de-programacao/typescript/24-colecoes-set-e-map.md",
            "title": "24. Coleções Nativas: Set e Map",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/25-interfaces.md",
            "title": "25. Interfaces: Modelagem de Contratos",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/26-tipagem-estrutural-e-duck-typing.md",
            "title": "26. Tipagem Estrutural (Duck Typing)",
            "subtitle": "Se anda como um pato, nada como um pato e voa como um pato, então para todos",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/27-unioes-literais-e-discriminated-unions.md",
            "title": "27. Uniões Literais e Discriminated Unions",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/typescript/28-type-narrowing-e-type-guards.md",
            "title": "28. Type Narrowing e Type Guards",
            "subtitle": "Cuidado com null: Em JavaScript, a expressão histórica typeof null",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/29-generics.md",
            "title": "29. Generics: Tipagem Parametrizada",
            "subtitle": "Convenções de Nomenclatura para Generics:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/30-tipos-utilitarios.md",
            "title": "30. Tipos Utilitários Essenciais",
            "subtitle": "💡 Regra de Escolha entre Pick e Omit:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/31-sistema-de-modulos.md",
            "title": "31. Sistema de Módulos (ES Modules)",
            "subtitle": "Regra de Ouro: Sempre que estiver importando apenas interfaces ou",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/32-o-paradigma-orientado-a-objetos-na-web.md",
            "title": "32. O Paradigma Orientado a Objetos na Web",
            "subtitle": "Açúcar Sintático (Syntactic Sugar): No JavaScript, as classes não",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/typescript/33-classes.md",
            "title": "33. Classes em TypeScript",
            "subtitle": "💡 Regra de Ouro da Web Moderna:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/typescript/34-modificadores.md",
            "title": "34. Modificadores de Acesso e Propriedades",
            "subtitle": "Convenção: Como public é o padrão implícito, a maioria dos times omite a",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 15
          },
          {
            "id": "01-linguagens-de-programacao/typescript/35-heranca-e-sobrescrita-de-metodos.md",
            "title": "35. Herança e Sobrescrita de Métodos",
            "subtitle": "⚠️ Limitação das Interfaces:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 11
          },
          {
            "id": "01-linguagens-de-programacao/typescript/36-classes-abstratas.md",
            "title": "36. Classes Abstratas e Template Method",
            "subtitle": "💡 Paralelo com Interfaces:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/typescript/37-programacao-assincrona.md",
            "title": "37. Programação Assíncrona: Promises e Async/Await",
            "subtitle": "A Analogia do Restaurante Fast-Food:",
            "moduleTitle": "TypeScript",
            "estimatedMinutes": 11
          }
        ]
      },
      {
        "id": "01-linguagens-de-programacao/php",
        "title": "01.B · PHP 8 Moderno",
        "badge": "PHP",
        "description": "Sintaxe moderna, tipagem estrita, closures, POO, atributos, enums e PSR-4.",
        "files": [
          {
            "id": "01-linguagens-de-programacao/php/01-o-que-e-php-e-o-modelo-de-execucao-web.md",
            "title": "01. O Que É o PHP e o Modelo de Execução Web?",
            "subtitle": "Como configurar o interpretador PHP no nosso computador e executar nossos",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/php/02-configuracao-do-ambiente-php-e-cli.md",
            "title": "02. Configuração do Ambiente PHP e o Terminal (CLI)",
            "subtitle": "Instalação Manual Alternativa (sem gerenciador de pacotes):",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/php/03-tipos-primitivos.md",
            "title": "03. Tipos Primitivos Escalares",
            "subtitle": "Como o PHP diferencia aspas simples de aspas duplas, como funciona a",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 4
          },
          {
            "id": "01-linguagens-de-programacao/php/04-strings-e-interpolacao.md",
            "title": "04. Strings e Interpolação",
            "subtitle": "Regra de Ouro para Backend Web:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 9
          },
          {
            "id": "01-linguagens-de-programacao/php/05-variaveis-e-constantes.md",
            "title": "05. Variáveis e Constantes",
            "subtitle": "Lembrete do Modelo Shared-Nothing:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/php/06-atribuicao-por-valor-e-referencia.md",
            "title": "06. Atribuição por Valor e Referência",
            "subtitle": "Regra de Ouro do PHP Moderno:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/php/07-operadores-e-expressoes.md",
            "title": "07. Expressões e Operadores",
            "subtitle": "Prefixado vs. Posfixado:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/php/08-estruturas-condicionais.md",
            "title": "08. Estruturas Condicionais",
            "subtitle": "Boas Práticas: Mesmo quando o bloco possui apenas uma única instrução,",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/php/09-expressoes-match.md",
            "title": "09. Expressões Match (PHP 8+)",
            "subtitle": "Atenção à Pontuação: Como toda atribuição ou expressão no PHP, o bloco do",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 6
          },
          {
            "id": "01-linguagens-de-programacao/php/10-estruturas-de-repeticao.md",
            "title": "10. Estruturas de Repetição",
            "subtitle": "Alerta de Loop Infinito: Se a condição do while nunca se tornar falsa",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 7
          },
          {
            "id": "01-linguagens-de-programacao/php/11-declaracao-de-funcoes-e-parametros.md",
            "title": "11. Declaração de Funções e Parâmetros",
            "subtitle": "Convenção de Nomenclatura (PSR-12 / PER Coding Style):",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/php/12-funcoes-de-primeira-classe-e-callables.md",
            "title": "12. Funções de Primeira Classe e Callables",
            "subtitle": "Atenção à Sintaxe: A declaração de uma função anônima atribuída a uma",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 8
          },
          {
            "id": "01-linguagens-de-programacao/php/13-escopo-de-variaveis.md",
            "title": "13. Escopo de Variáveis",
            "subtitle": "Onde exatamente uma variável nasce, onde ela pode ser acessada e quando ela",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 11
          },
          {
            "id": "01-linguagens-de-programacao/php/14-tratamento-de-erros-e-excecoes.md",
            "title": "14. Tratamento de Erros e Exceções",
            "subtitle": "Aprenderemos a fundo os conceitos de Classes, Construtores e Herança no",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/php/15-arrays-indexados-e-associativos.md",
            "title": "15. Arrays Indexados e Associativos",
            "subtitle": "Regra de Ouro:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/php/16-desestruturacao-e-operador-spread.md",
            "title": "16. Desestruturação e Operador Spread",
            "subtitle": "Atenção: As chaves que não forem listadas na desestruturação são",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 9
          },
          {
            "id": "01-linguagens-de-programacao/php/17-closures-e-fabricas-de-funcoes.md",
            "title": "17. Closures e Fábricas de Funções",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 11
          },
          {
            "id": "01-linguagens-de-programacao/php/18-funcoes-nativas-de-manipulacao-de-arrays.md",
            "title": "18. Funções Nativas de Manipulação de Arrays",
            "subtitle": "Dica Mnemônica para Memorização:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 16
          },
          {
            "id": "01-linguagens-de-programacao/php/19-manipulacao-de-json-e-serializacao.md",
            "title": "19. Manipulação de JSON e Serialização",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 9
          },
          {
            "id": "01-linguagens-de-programacao/php/20-classes-e-objetos.md",
            "title": "20. Classes e Objetos",
            "subtitle": "Nota sobre visibilidade:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 12
          },
          {
            "id": "01-linguagens-de-programacao/php/21-modificadores-de-acesso-e-encapsulamento.md",
            "title": "21. Modificadores de Acesso e Encapsulamento",
            "subtitle": "Exploraremos a herança e o modificador protected em profundidade no",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 15
          },
          {
            "id": "01-linguagens-de-programacao/php/22-clonagem-e-comparacao-de-objetos.md",
            "title": "22. Clonagem e Comparação de Objetos",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/php/23-interfaces-e-polimorfismo.md",
            "title": "23. Interfaces e Polimorfismo",
            "subtitle": "⚠️ Regra do Compilador:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 13
          },
          {
            "id": "01-linguagens-de-programacao/php/24-heranca-e-sobrescrita-de-metodos.md",
            "title": "24. Herança e Sobrescrita de Métodos",
            "subtitle": "⚠️ Aviso de Design: Proteja as Invariantes com protected",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 15
          },
          {
            "id": "01-linguagens-de-programacao/php/25-classes-abstratas-e-modificador-final.md",
            "title": "25. Controle de Herança: Classes Abstratas e Modificador Final",
            "subtitle": "💡 Design Defensivo:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 14
          },
          {
            "id": "01-linguagens-de-programacao/php/26-superglobais-e-ciclo-de-vida-da-requisicao.md",
            "title": "26. Superglobais e Ciclo de Vida da Requisição",
            "subtitle": "💡 Como o PHP nomeia cabeçalhos HTTP em $SERVER:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 13
          },
          {
            "id": "01-linguagens-de-programacao/php/27-namespaces-e-psr-4-autoloading.md",
            "title": "27. Namespaces e Autoloading PSR-4",
            "subtitle": "💡 A Analogia das Pastas no Computador:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 13
          },
          {
            "id": "01-linguagens-de-programacao/php/28-gerenciamento-de-pacotes-com-composer.md",
            "title": "28. Gerenciamento de Pacotes com Composer",
            "subtitle": "⚠️ A Regra de Ouro do composer.lock:",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 9
          },
          {
            "id": "01-linguagens-de-programacao/php/29-enums-e-backed-enums.md",
            "title": "29. Enums e Backed Enums",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/php/30-traits-e-composicao-horizontal.md",
            "title": "30. Traits e Composição Horizontal",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/php/31-metodos-magicos.md",
            "title": "31. Métodos Mágicos",
            "subtitle": "💡 É possível fazer Sobrecarga (Overload) de invoke()?",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 10
          },
          {
            "id": "01-linguagens-de-programacao/php/32-atributos-metadados-nativos.md",
            "title": "32. Atributos e Metadados Nativos",
            "subtitle": "💡 Você vai escrever Reflection no dia a dia?",
            "moduleTitle": "PHP 8 Moderno",
            "estimatedMinutes": 8
          }
        ]
      }
    ]
  },
  {
    "id": "02-plataformas-e-integracao",
    "title": "02 · Plataformas & Integração",
    "badge": "Plataformas",
    "description": "Protocolos, Browser, manipulação do DOM, Web APIs, backend e arquitetura.",
    "submodules": [
      {
        "id": "02-plataformas-e-integracao/protocolos",
        "title": "Protocolos de Rede",
        "badge": "HTTP",
        "description": "Fundamentos de rede, HTTP/HTTPS, WebSockets e Server-Sent Events.",
        "files": [
          {
            "id": "02-plataformas-e-integracao/protocolos/01-fundamentos-de-redes-na-web.md",
            "title": "01. Fundamentos de Redes na Web",
            "subtitle": "Regra de Ouro:",
            "moduleTitle": "Protocolos de Rede",
            "estimatedMinutes": 8
          },
          {
            "id": "02-plataformas-e-integracao/protocolos/02-o-protocolo-http-e-https.md",
            "title": "02. O Protocolo HTTP e HTTPS",
            "subtitle": "Conceitos Fundamentais:",
            "moduleTitle": "Protocolos de Rede",
            "estimatedMinutes": 11
          },
          {
            "id": "02-plataformas-e-integracao/protocolos/03-websockets-e-sse.md",
            "title": "04. WebSockets e Server-Sent Events (SSE)",
            "moduleTitle": "Protocolos de Rede",
            "estimatedMinutes": 9
          }
        ]
      },
      {
        "id": "02-plataformas-e-integracao/browser",
        "title": "Browser & Client-Side",
        "badge": "Browser",
        "description": "Manipulação de DOM com TypeScript, Web Components e Catálogo de Web APIs.",
        "submodules": [
          {
            "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom",
            "title": "Manipulação do DOM",
            "badge": "DOM",
            "description": "Árvore do DOM, renderização, eventos e Custom Elements.",
            "files": [
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/01-a-arvore-do-dom-e-renderizacao.md",
                "title": "01. A Árvore do DOM e o Pipeline de Renderização",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 7
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/02-selecao-e-manipulacao-com-typescript.md",
                "title": "02. Seleção e Manipulação com TypeScript",
                "subtitle": "Generics não existem em tempo de execução (runtime)!",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/03-sistema-de-eventos-e-propagacao.md",
                "title": "03. Sistema de Eventos e Propagação",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/04-introducao-aos-web-components.md",
                "title": "04. Introdução aos Web Components",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 6
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/05-custom-elements-e-ciclo-de-vida.md",
                "title": "05. Custom Elements e Ciclo de Vida",
                "subtitle": "Por que o hífen é obrigatório? Todas as tags nativas do HTML (como",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 7
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/06-shadow-dom-e-encapsulamento.md",
                "title": "06. Shadow DOM e Encapsulamento",
                "subtitle": "A Regra da Raiz Única: Cada elemento hospedeiro (host) pode possuir no",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 7
              },
              {
                "id": "02-plataformas-e-integracao/browser/manipulacao-do-dom/07-templates-e-slots.md",
                "title": "07. Templates e Slots",
                "subtitle": "Por que cloneNode(true) é a melhor prática? Ao invés de o navegador ter",
                "moduleTitle": "Manipulação do DOM",
                "estimatedMinutes": 8
              }
            ]
          },
          {
            "id": "02-plataformas-e-integracao/browser/web-apis",
            "title": "Catálogo de Web APIs",
            "badge": "APIs",
            "description": "Fetch API, Local/SessionStorage, IndexedDB, Geolocation, Observer e Notifications.",
            "files": [
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/01-o-que-sao-web-apis.md",
                "title": "01. O Que São Web APIs",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/fetch-api-e-consumo-nativo.md",
                "title": "Fetch API e Consumo Nativo de Dados",
                "subtitle": "Uma Promise retornada por fetch() só é rejeitada se ocorrer uma falha de",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/geolocation.md",
                "title": "Geolocation API",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/indexeddb.md",
                "title": "IndexedDB",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/intersection-observer.md",
                "title": "Intersection Observer API",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/local-storage-e-session-storage.md",
                "title": "LocalStorage e SessionStorage",
                "subtitle": "Atenção: O evento storage não é disparado na própria aba que executou",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 8
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/notifications.md",
                "title": "Notification API",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 7
              },
              {
                "id": "02-plataformas-e-integracao/browser/web-apis/permissions.md",
                "title": "Permissions API",
                "moduleTitle": "Web APIs",
                "estimatedMinutes": 6
              }
            ]
          }
        ]
      },
      {
        "id": "02-plataformas-e-integracao/backend",
        "title": "Backend Agnóstico",
        "badge": "Backend",
        "description": "Ciclo de requisição no servidor, pipelines de middlewares e arquitetura REST.",
        "submodules": [
          {
            "id": "02-plataformas-e-integracao/backend/fundamentos-e-ciclo-de-vida",
            "title": "Fundamentos & Ciclo de Vida",
            "badge": "Pipeline",
            "description": "Ciclo de vida de requisição e pipeline de middlewares.",
            "files": [
              {
                "id": "02-plataformas-e-integracao/backend/fundamentos-e-ciclo-de-vida/01-o-ciclo-de-vida-de-uma-requisicao-no-servidor.md",
                "title": "01. O Ciclo de Vida de uma Requisição no Servidor",
                "subtitle": "Importante: O servidor não repete listen() a cada requisição. O",
                "moduleTitle": "Backend · Ciclo de Vida",
                "estimatedMinutes": 14
              },
              {
                "id": "02-plataformas-e-integracao/backend/fundamentos-e-ciclo-de-vida/02-middlewares-e-pipeline-de-execucao.md",
                "title": "02. Middlewares e Pipeline de Execução",
                "subtitle": "Regra de Ouro: A Ordem dos Middlewares Importa Crucialmente!",
                "moduleTitle": "Backend · Ciclo de Vida",
                "estimatedMinutes": 13
              }
            ]
          },
          {
            "id": "02-plataformas-e-integracao/backend/design-e-arquitetura-de-apis",
            "title": "Design & Arquitetura de APIs",
            "badge": "REST",
            "description": "Boas práticas de design, REST semântico, GraphQL e gRPC.",
            "files": [
              {
                "id": "02-plataformas-e-integracao/backend/design-e-arquitetura-de-apis/01-o-que-sao-apis-e-boas-praticas-de-design.md",
                "title": "01. O Que São APIs e Boas Práticas de Design",
                "subtitle": "Dica de Design: A abordagem por valores separados por vírgula",
                "moduleTitle": "Backend · Design de APIs",
                "estimatedMinutes": 15
              },
              {
                "id": "02-plataformas-e-integracao/backend/design-e-arquitetura-de-apis/02-apis-rest-e-design-semantico.md",
                "title": "02. APIs REST e Design Semântico",
                "subtitle": "Atenção Prática de Design: Evite aninhamentos com mais de dois níveis de",
                "moduleTitle": "Backend · Design de APIs",
                "estimatedMinutes": 14
              },
              {
                "id": "02-plataformas-e-integracao/backend/design-e-arquitetura-de-apis/03-paradigmas-alternativos-soap-graphql-e-grpc.md",
                "title": "03. Paradigmas Alternativos: SOAP, GraphQL e gRPC",
                "subtitle": "Onde o SOAP ainda vive?",
                "moduleTitle": "Backend · Design de APIs",
                "estimatedMinutes": 12
              }
            ]
          }
        ]
      },
      {
        "id": "02-plataformas-e-integracao/padroes-de-arquitetura",
        "title": "Padrões de Arquitetura",
        "badge": "Arquitetura",
        "description": "MVC em APIs, Controllers/Services/Repositories, DTOs, IoC/DI e MVVM.",
        "files": [
          {
            "id": "02-plataformas-e-integracao/padroes-de-arquitetura/01-o-padrao-mvc-no-contexto-de-apis.md",
            "title": "01. O Padrão MVC no Contexto de APIs",
            "subtitle": "Analogia Prática: O Restaurante",
            "moduleTitle": "Padrões de Arquitetura",
            "estimatedMinutes": 13
          },
          {
            "id": "02-plataformas-e-integracao/padroes-de-arquitetura/02-arquitetura-em-camadas-controllers-services-repositories.md",
            "title": "02. Arquitetura em Camadas: Controllers, Services e Repositories",
            "moduleTitle": "Padrões de Arquitetura",
            "estimatedMinutes": 12
          },
          {
            "id": "02-plataformas-e-integracao/padroes-de-arquitetura/03-dtos-e-transferencia-de-dados.md",
            "title": "03. DTOs e Transferência de Dados",
            "subtitle": "Um DTO é um objeto anêmico (ou seja, sem lógica de negócio ou",
            "moduleTitle": "Padrões de Arquitetura",
            "estimatedMinutes": 10
          },
          {
            "id": "02-plataformas-e-integracao/padroes-de-arquitetura/04-inversao-de-controle-e-injecao-de-dependencias.md",
            "title": "04. Inversão de Controle e Injeção de Dependências",
            "subtitle": "Não nos ligue, nós ligamos para você\" (Don't call us, we'll call you).",
            "moduleTitle": "Padrões de Arquitetura",
            "estimatedMinutes": 13
          },
          {
            "id": "02-plataformas-e-integracao/padroes-de-arquitetura/05-padroes-de-apresentacao-e-reatividade-mvvm.md",
            "title": "05. Padrões de Apresentação e Reatividade: MVVM",
            "moduleTitle": "Padrões de Arquitetura",
            "estimatedMinutes": 11
          }
        ]
      },
      {
        "id": "02-plataformas-e-integracao/seguranca-e-sessao",
        "title": "Segurança & Sessão",
        "badge": "Segurança",
        "description": "SOP, CORS, Cookies vs Tokens, JWT e práticas contra XSS/CSRF.",
        "files": [
          {
            "id": "02-plataformas-e-integracao/seguranca-e-sessao/01-same-origin-policy-e-cors.md",
            "title": "01. Same-Origin Policy e CORS",
            "subtitle": "Access to fetch at 'http://localhost:3000/api/users' from origin",
            "moduleTitle": "Segurança & Sessão",
            "estimatedMinutes": 9
          },
          {
            "id": "02-plataformas-e-integracao/seguranca-e-sessao/02-metodos-de-persistencia-de-sessao.md",
            "title": "02. Métodos de Persistência de Sessão",
            "subtitle": "⚠️ REGRA DE OURO VITAL DE SEGURANÇA:",
            "moduleTitle": "Segurança & Sessão",
            "estimatedMinutes": 10
          },
          {
            "id": "02-plataformas-e-integracao/seguranca-e-sessao/03-armazenamento-de-tokens-e-seguranca-no-frontend.md",
            "title": "03. Armazenamento de Tokens e Segurança no Frontend",
            "subtitle": "Onde a aplicação deve armazenar o token de autenticação no navegador?",
            "moduleTitle": "Segurança & Sessão",
            "estimatedMinutes": 8
          }
        ]
      }
    ]
  },
  {
    "id": "ecossistema",
    "title": "03 · Ecossistema & Frameworks",
    "badge": "Ecossistema",
    "description": "Frameworks e bibliotecas consagradas para frontend e backend.",
    "submodules": [
      {
        "id": "ecossistema/typescript",
        "title": "Eixo TypeScript",
        "badge": "TS",
        "description": "Validação em runtime com Zod, clientes HTTP com Axios e UI com React.",
        "submodules": [
          {
            "id": "ecossistema/typescript/zod",
            "title": "Zod · Validação de Runtime",
            "badge": "Zod",
            "description": "Schemas, tipos primitivos, coerção, arrays, discriminated unions e refinamentos.",
            "files": [
              {
                "id": "ecossistema/typescript/zod/01-o-problema-do-runtime-e-introducao-ao-zod.md",
                "title": "01. O Problema do Runtime e Introdução ao Zod",
                "subtitle": "O TypeScript só existe em tempo de compilação. Em tempo de execução",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 7
              },
              {
                "id": "ecossistema/typescript/zod/02-schemas-primitivos-validacoes-e-coercao.md",
                "title": "02. Schemas Primitivos, Validações e Coerção",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 7
              },
              {
                "id": "ecossistema/typescript/zod/03-objetos-arrays-e-inferencia-de-tipos.md",
                "title": "03. Objetos, Arrays e Inferência de Tipos",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 6
              },
              {
                "id": "ecossistema/typescript/zod/04-unions-enums-e-discriminated-unions.md",
                "title": "04. Unions, Enums e Discriminated Unions",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 5
              },
              {
                "id": "ecossistema/typescript/zod/05-refinamentos-e-transformacoes.md",
                "title": "05. Refinamentos e Transformações",
                "subtitle": "O método .pipe() permite encadear outro schema do Zod para validar o",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 6
              },
              {
                "id": "ecossistema/typescript/zod/06-tratamento-de-erros-e-casos-reais.md",
                "title": "06. Tratamento de Erros e Casos Reais",
                "moduleTitle": "Ecossistema TS · Zod",
                "estimatedMinutes": 6
              }
            ]
          },
          {
            "id": "ecossistema/typescript/axios",
            "title": "Axios · Cliente HTTP",
            "badge": "Axios",
            "description": "Fetch vs Axios, instâncias customizadas, tratamento de erros e interceptors.",
            "files": [
              {
                "id": "ecossistema/typescript/axios/01-introducao-ao-axios-vs-fetch.md",
                "title": "01. Introdução ao Axios vs. Fetch Nativo",
                "moduleTitle": "Ecossistema TS · Axios",
                "estimatedMinutes": 4
              },
              {
                "id": "ecossistema/typescript/axios/02-metodos-http-query-params-e-tipagem.md",
                "title": "Métodos HTTP, Query Params e Tipagem",
                "moduleTitle": "Ecossistema TS · Axios",
                "estimatedMinutes": 6
              },
              {
                "id": "ecossistema/typescript/axios/03-instancias-customizadas-e-configuracoes.md",
                "title": "Instâncias Customizadas e Configurações",
                "moduleTitle": "Ecossistema TS · Axios",
                "estimatedMinutes": 7
              },
              {
                "id": "ecossistema/typescript/axios/04-tratamento-de-erros-e-excecoes.md",
                "title": "Tratamento de Erros e Exceções",
                "moduleTitle": "Ecossistema TS · Axios",
                "estimatedMinutes": 5
              },
              {
                "id": "ecossistema/typescript/axios/05-interceptors-de-requisicao-e-resposta.md",
                "title": "Interceptors de Requisição e Resposta",
                "moduleTitle": "Ecossistema TS · Axios",
                "estimatedMinutes": 5
              }
            ]
          },
          {
            "id": "ecossistema/typescript/react",
            "title": "React · Biblioteca de UI",
            "badge": "React",
            "description": "Paradigma declarativo, JSX, componentes, eventos e useState.",
            "files": [
              {
                "id": "ecossistema/typescript/react/01-o-que-e-react-e-o-paradigma-declarativo.md",
                "title": "01. O Que É o React e o Paradigma Declarativo",
                "subtitle": "Como construir e manter interfaces ricas em que dezenas de elementos mudam",
                "moduleTitle": "Ecossistema TS · React",
                "estimatedMinutes": 9
              },
              {
                "id": "ecossistema/typescript/react/02-o-ponto-de-entrada-e-componentes.md",
                "title": "02. O Ponto de Entrada e a Árvore de Componentes",
                "subtitle": "Como o navegador — que só entende HTML, CSS e JavaScript nativos — consegue",
                "moduleTitle": "Ecossistema TS · React",
                "estimatedMinutes": 10
              },
              {
                "id": "ecossistema/typescript/react/03-conteudo-e-atributos-dinamicos-no-jsx.md",
                "title": "03. Conteúdo e Atributos Dinâmicos no JSX",
                "subtitle": "Como podemos misturar marcação visual com variáveis, expressões matemáticas,",
                "moduleTitle": "Ecossistema TS · React",
                "estimatedMinutes": 10
              },
              {
                "id": "ecossistema/typescript/react/04-eventos-no-react.md",
                "title": "04. Eventos no React: Escutando Interações do Usuário",
                "subtitle": "Como escutamos e reagimos às ações do usuário no React de forma declarativa",
                "moduleTitle": "Ecossistema TS · React",
                "estimatedMinutes": 8
              },
              {
                "id": "ecossistema/typescript/react/05-estado-e-reatividade-com-usestate.md",
                "title": "05. Estado e Reatividade com useState",
                "subtitle": "Se variáveis locais normais não conseguem atualizar o que o usuário vê, como",
                "moduleTitle": "Ecossistema TS · React",
                "estimatedMinutes": 11
              }
            ]
          }
        ]
      },
      {
        "id": "ecossistema/php/laravel",
        "title": "Eixo PHP · Laravel 11",
        "badge": "Laravel",
        "description": "Arquitetura Laravel, Eloquent ORM, Migrations, Seeders, Rotas e Controllers.",
        "submodules": [
          {
            "id": "ecossistema/php/laravel/base",
            "title": "Base & Arquitetura",
            "badge": "Base",
            "description": "Introdução, CLI Artisan e arquitetura MVC no Laravel.",
            "files": [
              {
                "id": "ecossistema/php/laravel/01-introducao-ao-laravel-e-arquitetura.md",
                "title": "01. Introdução ao Laravel, Arquitetura e Artisan",
                "subtitle": "Se já dominamos a linguagem e os padrões de arquitetura, como os times de",
                "moduleTitle": "Laravel · Base",
                "estimatedMinutes": 13
              },
              {
                "id": "ecossistema/php/laravel/02-o-padrao-mvc-no-laravel.md",
                "title": "02. O Padrão MVC no Laravel para APIs",
                "subtitle": "Regra de Ouro:",
                "moduleTitle": "Laravel · Base",
                "estimatedMinutes": 10
              }
            ]
          },
          {
            "id": "ecossistema/php/laravel/orm-e-banco-de-dados",
            "title": "ORM & Banco de Dados",
            "badge": "Eloquent",
            "description": "Models, Eloquent ORM, Migrations, Seeders e Factories.",
            "files": [
              {
                "id": "ecossistema/php/laravel/orm-e-banco-de-dados/01-o-conceito-de-model-e-entidades.md",
                "title": "01. O Conceito de Model e Entidades",
                "subtitle": "O que é exatamente um Model no paradigma de Orientação a Objetos, qual é a",
                "moduleTitle": "Laravel · Eloquent ORM",
                "estimatedMinutes": 11
              },
              {
                "id": "ecossistema/php/laravel/orm-e-banco-de-dados/02-eloquent-orm-e-metodos-do-model.md",
                "title": "02. Eloquent ORM e Métodos do Model",
                "subtitle": "Como criar classes de Model usando a CLI Artisan, proteger nossos dados",
                "moduleTitle": "Laravel · Eloquent ORM",
                "estimatedMinutes": 11
              },
              {
                "id": "ecossistema/php/laravel/orm-e-banco-de-dados/03-migrations-e-esquemas-de-banco.md",
                "title": "03. Migrations e Esquemas de Banco",
                "subtitle": "Como as tabelas do banco de dados são criadas, como garantimos que todos os",
                "moduleTitle": "Laravel · Eloquent ORM",
                "estimatedMinutes": 14
              },
              {
                "id": "ecossistema/php/laravel/orm-e-banco-de-dados/04-seeders-e-factories-para-testes.md",
                "title": "04. Seeders e Factories para Testes",
                "subtitle": "As tabelas existem no banco, mas estão completamente vazias. Como",
                "moduleTitle": "Laravel · Eloquent ORM",
                "estimatedMinutes": 14
              },
              {
                "id": "ecossistema/php/laravel/orm-e-banco-de-dados/05-relacionamentos-no-eloquent-e-joins.md",
                "title": "05. Relacionamentos no Eloquent e JOINs",
                "subtitle": "Como consultar os produtos de uma categoria ou descobrir a categoria de um",
                "moduleTitle": "Laravel · Eloquent ORM",
                "estimatedMinutes": 12
              }
            ]
          },
          {
            "id": "ecossistema/php/laravel/rotas-e-controllers",
            "title": "Rotas & Controllers",
            "badge": "Rotas",
            "description": "Rotas de API, verbos HTTP, controllers CRUD e Route Model Binding.",
            "files": [
              {
                "id": "ecossistema/php/laravel/rotas-e-controllers/01-rotas-de-api-e-verbos-http.md",
                "title": "01. Rotas de API e Verbos HTTP",
                "subtitle": "Como o Laravel recebe uma requisição HTTP vinda da internet (como um GET",
                "moduleTitle": "Laravel · Rotas & Controllers",
                "estimatedMinutes": 10
              },
              {
                "id": "ecossistema/php/laravel/rotas-e-controllers/02-controllers-e-acoes-crud.md",
                "title": "02. Controllers e Ações CRUD",
                "subtitle": "Se colocarmos a lógica de consulta, validação, persistência e formatação de",
                "moduleTitle": "Laravel · Rotas & Controllers",
                "estimatedMinutes": 9
              },
              {
                "id": "ecossistema/php/laravel/rotas-e-controllers/03-route-model-binding-e-respostas.md",
                "title": "03. Route Model Binding e Respostas Semânticas",
                "subtitle": "Se a rota já sabe qual recurso estamos tentando acessar através do parâmetro",
                "moduleTitle": "Laravel · Rotas & Controllers",
                "estimatedMinutes": 9
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Recursively collects all ChapterItem instances from a module tree
 */
export function flattenModuleChapters(node: ModuleNode): ChapterItem[] {
  const result: ChapterItem[] = [];
  if (node.files && node.files.length > 0) {
    result.push(...node.files);
  }
  if (node.submodules && node.submodules.length > 0) {
    for (const sub of node.submodules) {
      result.push(...flattenModuleChapters(sub));
    }
  }
  return result;
}

export const ALL_CHAPTERS: ChapterItem[] = CURRICULUM_TREE.flatMap(flattenModuleChapters);

export function getChapterById(id: string): ChapterItem {
  return ALL_CHAPTERS.find((c) => c.id === id) || ALL_CHAPTERS[0];
}

export function getPrevNextChapter(currentId: string) {
  const index = ALL_CHAPTERS.findIndex((c) => c.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ALL_CHAPTERS[index - 1] : null,
    next: index < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[index + 1] : null,
  };
}
