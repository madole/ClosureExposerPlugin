var escodegen = require('escodegen');
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");
var NullFactory = require("webpack/lib/NullFactory");
var exports = [];

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


function getExportsString() {
  var exportsString = '';
  for(var i=0; i<exports.length; i++) {
    var ex = exports[i];
    exportsString += ex.id.name + ': ' + ex.id.name;
    if(i < exports.length - 1) {
      exportsString += ', '
    }
  }
  return exportsString;
}

ClosureExposerPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compilation", function(compilation, params) {
		compilation.dependencyFactories.set(ConstDependency, new NullFactory());
		compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
	});

	compiler.parser.plugin("statement" , function(expr) {
    /**
     * COMMONJS2 - Implementation -> module.exports = {funcName: funcName}
     */
    if(isModuleExports(expr)) {
      var exportsString = getExportsString();
      var moduleExportsString = 'module.exports = {' + exportsString + '};';
      var dep = new ConstDependency(moduleExportsString, expr.range);
      dep.loc = expr.loc;
      this.state.current.addDependency(dep);
      return true;
    }

		if(expr.type === 'FunctionDeclaration') {

    }
    exports.push(expr);

    /**
     * PURE COMMON JS - Implementation -> exports.funcName = function funcName() {}
     */
		//var jsExpr = escodegen.generate(expr);
		//var prependString = 'exports.' + expr.id.name + ' = ';
		//var exportedExpression = prependString + jsExpr;
    //
		//var dep = new ConstDependency(exportedExpression, expr.range)
		//dep.loc = expr.loc;
		//this.state.current.addDependency(dep);
		//return true;
	});




};
