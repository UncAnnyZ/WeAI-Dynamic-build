module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        // 首先检查父节点是否是VariableDeclarator
        // 检查当前的调用是否是链式调用且是链的开始
        if (path.parentPath.isVariableDeclarator()) {
          const callee = path.node.callee;
          // 检查callee是否是一个成员表达式
          if (
            t.isMemberExpression(callee) &&
            callee.object.type === "CallExpression"
          ) {
            // 创建一个唯一的标识符
            const identifier = path.scope.generateUidIdentifierBasedOnNode(
              callee.object
            );
            // 创建一个 const 变量声明
            const variableDeclaration = t.variableDeclaration("var", [
              t.variableDeclarator(identifier, callee.object),
            ]);
            // 替换 callee.object 为创建的唯一标识符
            callee.object = identifier;
            // 在当前作用域的节点之前插入const变量声明
            path.getStatementParent().insertBefore(variableDeclaration);
          }
        } else {
          const callee = path.node.callee;
          // 检查callee是否是一个成员表达式
          if (
            t.isMemberExpression(callee) &&
            callee.object.type === "CallExpression"
          ) {
            // 创建一个唯一的标识符
            const identifier = path.scope.generateUidIdentifierBasedOnNode(
              callee.object
            );
            // 创建一个 const 变量声明
            const variableDeclaration = t.variableDeclaration("const", [
              t.variableDeclarator(identifier, callee.object),
            ]);
            // 替换 callee.object 为创建的唯一标识符
            callee.object = identifier;
            // 在当前作用域的节点之前插入const变量声明
            path.getStatementParent().insertBefore(variableDeclaration);
          }
        }
      },
    },
  };
};
