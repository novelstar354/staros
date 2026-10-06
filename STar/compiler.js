/* =====================================================
   STar Compiler
   compiler.js
   ===================================================== */

class STarCompiler {

    constructor() {

        this.indentLevel = 0;

    }

    indent() {

        return "    ".repeat(
            this.indentLevel
        );

    }

    compile(ast) {

        if (
            ast.type !== "Program"
        ) {

            throw new Error(
                "Program expected"
            );

        }

        let output = "";

        for (
            const node
            of ast.body
        ) {

            output +=
                this.compileNode(node);

        }

        return output;

    }

    compileNode(node) {

        switch (
            node.type
        ) {

            case "VariableDeclaration":
                return this.compileVariable(node);

            case "PrintStatement":
                return this.compilePrint(node);

            case "RepeatStatement":
                return this.compileRepeat(node);

            case "IfStatement":
                return this.compileIf(node);

            case "FunctionDeclaration":
                return this.compileFunction(node);

            case "FunctionCall":
                return this.compileFunctionCall(node);

            default:

                throw new Error(
                    "Unknown node type: " +
                    node.type
                );

        }

    }

    /* ==========================================
       let
       ========================================== */

    compileVariable(node) {

        return (
            this.indent() +
            "let " +
            node.name +
            " = " +
            this.compileExpression(
                node.value
            ) +
            ";\n"
        );

    }

    /* ==========================================
       print
       ========================================== */

    compilePrint(node) {

        return (
            this.indent() +
            "console.log(" +
            this.compileExpression(
                node.value
            ) +
            ");\n"
        );

    }

    /* ==========================================
       repeat
       ========================================== */

    compileRepeat(node) {

        let result =
            this.indent() +
            "for(let i = 0; i < " +
            this.compileExpression(
                node.count
            ) +
            "; i++) {\n";

        this.indentLevel++;

        for (
            const stmt
            of node.body
        ) {

            result +=
                this.compileNode(stmt);

        }

        this.indentLevel--;

        result +=
            this.indent() +
            "}\n";

        return result;

    }

    /* ==========================================
       if
       ========================================== */

    compileIf(node) {

        let result =
            this.indent() +
            "if (" +
            this.compileExpression(
                node.condition
            ) +
            ") {\n";

        this.indentLevel++;

        for (
            const stmt
            of node.body
        ) {

            result +=
                this.compileNode(stmt);

        }

        this.indentLevel--;

        result +=
            this.indent() +
            "}";

        if (
            node.elseBody &&
            node.elseBody.length
        ) {

            result +=
                " else {\n";

            this.indentLevel++;

            for (
                const stmt
                of node.elseBody
            ) {

                result +=
                    this.compileNode(stmt);

            }

            this.indentLevel--;

            result +=
                this.indent() +
                "}";

        }

        result += "\n";

        return result;

    }

    /* ==========================================
       func
       ========================================== */

    compileFunction(node) {

        let result =
            this.indent() +
            "function " +
            node.name +
            "(" +
            node.params.join(", ") +
            ") {\n";

        this.indentLevel++;

        for (
            const stmt
            of node.body
        ) {

            result +=
                this.compileNode(stmt);

        }

        this.indentLevel--;

        result +=
            this.indent() +
            "}\n";

        return result;

    }

    /* ==========================================
       function call
       ========================================== */

    compileFunctionCall(node) {

        const args =
            node.arguments
                .map(arg =>
                    this.compileExpression(arg)
                )
                .join(", ");

        return (
            this.indent() +
            node.name +
            "(" +
            args +
            ");\n"
        );

    }

    /* ==========================================
       expressions
       ========================================== */

    compileExpression(node) {

        switch (
            node.type
        ) {

            case "StringLiteral":
                return JSON.stringify(
                    node.value
                );

            case "NumberLiteral":
                return String(
                    node.value
                );

            case "Identifier":
                return node.name;

            default:

                throw new Error(
                    "Unsupported expression: " +
                    node.type
                );

        }

    }

}

/* =====================================================
   Helper
   ===================================================== */

function compileSTarAST(ast) {

    const compiler =
        new STarCompiler();

    return compiler.compile(ast);

}

function compileSTar(code) {

    const tokens =
        lexSTar(code);

    const ast =
        parseSTar(tokens);

    return compileSTarAST(ast);

}
