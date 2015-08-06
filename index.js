var escodegen = require('escodegen');
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");
var NullFactory = require("webpack/lib/NullFactory");

function ClosureExposerPlugin(localization, functionName, failOnMissing) {

}
module.exports = ClosureExposerPlugin;


function isModuleExports(expr) {
	if(expr.type === 'ExpressionStatement') {
		var expression = expr.expression;
		if(expression && expression.left && expression.left.object.name === 'module') {
			if(expression.left.property.name === 'exports') {
				return true;
			}
		}
	}
}


ClosureExposerPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation, params) {
		compilation.dependencyFactories.set(ConstDependency, new NullFactory());
		compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
	});

	compiler.parser.plugin("statement" , function(expr) {
		console.log(isModuleExports(expr))
		if(expr.type !== 'FunctionDeclaration') { return; }

		var jsExpr = escodegen.generate(expr);
		var prependString = 'exports.' + expr.id.name + ' = ';
		var exportedExpression = prependString + jsExpr;

		var dep = new ConstDependency(exportedExpression, expr.range)
		dep.loc = expr.loc;
		this.state.current.addDependency(dep);
		return true;
	});



};
