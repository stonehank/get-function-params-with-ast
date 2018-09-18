const esprima = require('esprima')

const reComments = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg

/**
 *
 * @param func
 * @returns {Array}
 */
module.exports = function getFuncParamsName(func) {
  let str
  if (typeof func === "function") str = func.toString()
  else if (typeof func === 'string') str = func
  else throw new Error('func type error!')
  let astEsprima
  try {
    // str like 'function(a,b){}' will throw error
    // see "https://github.com/jquery/esprima/issues/1701"
    try {
      astEsprima = esprima.parseScript(str)
    } catch (e) {
      try{
        astEsprima = esprima.parseScript('let x=' + str)
      }catch(e){
        // str like "(a){...}"' will throw error
        astEsprima = esprima.parseScript('let x=function ' + str)
      }
    }
  }catch(e){
    throw new Error('can not parse the parameters')
  }

  let node = astEsprima.body[0]
  let funcParams = []
  let newExpressParms = []

  // The if conditions below do not merge ,we need to check the handle process about each "SHAPE" of function.

  // process        shape
  // 1->3->4->6   'x=class{ constructor(e,f){}; method(cc,dd){}}'
  // 1->3->5      'x=new Function ("a=5","b","console.log(a,b)")'
  // 1->3->6      'x=function(a,b){}'
  // 1->3->7      'x=e=>{}'
  // 1->5         'new Function ("a=5","b","console.log(a,b)")',
  // 1->7         'e=>{}'
  // 2->4->6      'let x=class{ constructor(a,b){}; method(cc,dd){}}'
  // 2->5         'let x=new Function ("a=5","b","console.log(a,b)")'
  // 2->6         'let x=function(aa,cc){}'
  // 2->7         'let x=(e=5,b)=>{}'
  // 4->6         'class x{ constructor(a,b){}; method(cc,dd){}}'
  // 8            'function x(a,b,c){}'

  // PS: 'function(a){}' will transform to `let x=function(a){}'，which process is 2->6

  // 1
  if (node.type === "ExpressionStatement") node = node.expression
  // 2
  if (node.type === "VariableDeclaration") node = node.declarations[0].init
  // 3
  if (node.type === "AssignmentExpression") node = node.right
  // 4
  if (node.type === "ClassDeclaration" || node.type === "ClassExpression") {
    node = node.body.body
    for (let i = 0; i < node.length; i++)
      if (node[i].kind === "constructor") {
        node = node[i].value;
        break
      }
  }

  // 5
  if (node.type === "NewExpression"|| node.type==="CallExpression") newExpressParms = node.arguments
  // 6
  if (node.type === "FunctionExpression") funcParams = node.params
  // 7
  if (node.type === "ArrowFunctionExpression") funcParams = node.params
  // 8
  if (node.type === "FunctionDeclaration") funcParams = node.params


  let validParam=[]
  function iterParam(funcParams){
    let validP=[]
    funcParams.forEach(o=>{
      // loop to find 'Identifier'
      while(o.type!=='Identifier'){
        // if o is Array, break and start new loop
        if(Array.isArray(o) && o.length) return validP.push(iterParam(o))
        // like ([a,b]=[1,2])
        if(o.type==="ArrayPattern") o=o.elements
        // like ({x,y}={x:1,y:2})
        else if(o.type==="ObjectPattern") o=o.properties
        // like ([...params])
        else if(o.type==="RestElement"){
          o=o.argument
          o.name='...'+o.name
        // exist [a,b] or {x,y}, here first, then 'ArrayPattern' or 'ObjectPattern'
        } else if(o.type==="Property")o=o.key
        // like (x=a)
        else o=o.left
      }
      validP.push(o.name)
    })
    return validP
  }

  if(funcParams.length){
    validParam=iterParam(funcParams)
  } else{
    // 针对 new Function的参数，
    newExpressParms.slice(0,-1).forEach(o=>{
      let param=o.value.replace(reComments,'')
      param=param.split('=')[0]
      if(param)validParam.push(param)
    })
  }

  return validParam.filter(Boolean)
}
