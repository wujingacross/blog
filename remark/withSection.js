const visit = require('unist-util-visit')

// 自定义markdown插件
// 在markdown中的h2标签标题前增加Section 22. 文本
module.exports.withSection = () => {
    return (tree) => {
        visit(tree, 'heading', (node) => {
            if (node.depth === 2 && node.children.length > 0) {
                node.children.unshift({
                    type: 'text',
                    value: `Section 22. `,
                });
            }
        })
    }
}
