/* =====================================================
   STar Runtime v2
   ===================================================== */

class STarRuntime {

    constructor() {
        this.variables = {};
        this.functions = {};
    }

    run(ast) {

        for (const node of ast.body) {
            this.execute(node);
        }

    }

    execute(node) {

        switch (node.type) {

            case "VariableDeclaration":
                return this.executeVar(node);

            case "PrintStatement":
                return this.executePrint(node);

            case "BinaryExpression":
                return this.evalBinary(node);

            case "Identifier":
            case "NumberLiteral":
            case "StringLiteral":
                return this.evaluate(node);

        }

    }

    /* =====================================================
       変数（再定義OK）
       ===================================================== */

    executeVar(node) {

        const value = this.evaluate(node.value);

        // 🔥 再定義OK（上書き）
        this.variables[node.name] = value;

    }

    /* =====================================================
       print
       ===================================================== */

    executePrint(node) {

        const value = this.evaluate(node.value);

        console.log(value);

    }

    /* =====================================================
       評価
       ===================================================== */

    evaluate(node) {

        switch (node.type) {

            case "NumberLiteral":
                return node.value;

            case "StringLiteral":
                return node.value;

            case "Identifier":
                return this.variables[node.name];

            case "BinaryExpression":
                return this.evalBinary(node);

        }

    }

    /* =====================================================
       四則演算
       ===================================================== */

    evalBinary(node) {

        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);

        switch (node.operator) {

            case "+":
                return left + right;

            case "-":
                return left - right;

            case "*":
                return left * right;

            case "/":
                return left / right;

        }

    }

}

/* =====================================================
   helper
   ===================================================== */

function runSTar(ast) {
    const runtime = new STarRuntime();
    runtime.run(ast);
}

/* =====================================================
   Helper
   ===================================================== */

function runSTarAST(ast) {

    const runtime =
        new STarRuntime();

    return runtime.run(ast);

}

function executeSTar(code) {

    const tokens =
        lexSTar(code);

    const ast =
        parseSTar(tokens);

    return runSTarAST(ast);

}