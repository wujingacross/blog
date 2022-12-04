module.exports.addImport = function addImport(tree, mod, name) {
  tree.children.unshift({
    type: "import",
    value: `import { ${name} as _${name} } from '${mod}'`,
  });
  return `_${name}`;
};

module.exports.addDefaultImport = function addImport(tree, mod, name) {
  tree.children.unshift({
    type: "import",
    value: `import _${name} from '${mod}'`,
  });
  return `_${name}`;
};

module.exports.addExport = function addExport(tree, name, value) {
  tree.children.push({
    type: "export",
    value: `export const ${name} = ${JSON.stringify(value)}`,
  });
};

function hasLineHighlights(code) {
  if (!/^>/m.test(code)) {
    return false;
  }
  return code.split("\n").every((line) => line === "" || /^[> ] /.test(line));
}

module.exports.highlightCode = function highlightCode(code, prismLanguage) {
  const isDiff = prismLanguage.startsWith("diff-");
  const language = isDiff ? prismLanguage.substr(5) : prismLanguage;
  const grammar = Prism.languages[language];
  if (!grammar) {
    console.warn(`Unrecognised language: ${prismLanguage}`);
    return Prism.util.encode(code);
  }

  let addedLines = [];
  let removedLines = [];
  if (isDiff) {
    code = code.replace(/(?:^[+\- ] |^[+-]$)/gm, (match, offset) => {
      let line = code.substr(0, offset).split("\n").length - 1;
      if (match.startsWith("+")) {
        addedLines.push(line);
      } else if (match.startsWith("-")) {
        removedLines.push(line);
      }
      return "";
    });
  }

  let highlightedLines = [];

  if (hasLineHighlights(code)) {
    let match;
    let re = /^>/m;
    while ((match = re.exec(code)) !== null) {
      let line = code.substr(0, match.index).split("\n").length - 1;
      highlightedLines.push(line);
      code = code.substr(0, match.index) + " " + code.substr(match.index + 1);
    }
    code = redent(code);
  }

  function stringify(line, className) {
    let empty = line.every((token) => token.empty);

    if (!className && empty) {
      return "\n";
    }

    let commonTypes = [];
    for (let i = 0; i < line.length; i++) {
      let token = line[i];
      if (i === 0) {
        commonTypes.push(...token.types);
      } else {
        commonTypes = commonTypes.filter((type) => token.types.includes(type));
      }
    }
    if (commonTypes.length) {
      for (let i = 0; i < line.length; i++) {
        let token = line[i];
        token.types = token.types.filter((type) => !commonTypes.includes(type));
      }
    }

    let lineClassName = ["token", ...commonTypes, className]
      .filter(Boolean)
      .join(" ");

    if (empty) {
      return `<span class="${lineClassName}">\n</span>`;
    }

    return `<span class="${lineClassName}">${line
      .map((token) =>
        token.types.length
          ? `<span class="token ${token.types.join(" ")}">${
              token.content
            }</span>`
          : token.content
      )
      .join("")}\n</span>`;
  }

  if (isDiff || highlightedLines.length) {
    let lines = normalizeTokens(
      Prism.util.encode(Prism.tokenize(code, grammar))
    );

    if (isDiff) {
      code = lines
        .map((line, index) =>
          stringify(
            line,
            `language-${language} ${
              addedLines.includes(index)
                ? "inserted"
                : removedLines.includes(index)
                ? "deleted"
                : "unchanged"
            }`
          )
        )
        .join("");
    } else {
      code = lines
        .map((line, index) =>
          stringify(
            line,
            `block${
              highlightedLines.includes(index)
                ? " -mx-5 pl-4 pr-5 border-l-4 border-sky-400 bg-sky-300/[0.15]"
                : ""
            }`
          )
        )
        .join("");
    }
  } else {
    code = Prism.highlight(code, grammar, prismLanguage);
  }

  return language === "html"
    ? code.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) =>
          `<span class="code-highlight bg-code-highlight">${text}</span>`
      )
    : code;
};
