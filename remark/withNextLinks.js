const { addDefaultImport } = require("./utils");

// 这个文件已经不用了

module.exports.withNextLinks = () => {
  return (tree) => {
    const component = addDefaultImport(tree, "next/link", "Link");

    function walk(root) {
      if (!root.children) return;
      let i = 0;
      while (i < root.children.length) {
        let node = root.children[i];
        // 仅处理相对路径
        if (node.type === "link" && node.url.startsWith("/")) {
          root.children = [
            ...root.children.slice(0, i),
            {
              type: "jsx",
              value: `<${component} href="${node.url}" passHref><a>`,
            },
            ...node.children,
            { type: "jsx", value: `</a></${component}>` },
            ...root.children.slice(i + 1),
          ];
          i += node.children.length + 2;
        } else {
          i += 1;
        }
        walk(node);
      }
    }
    walk(tree);
  };
};
