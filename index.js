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
  // str like 'function(a,b){}' will throw error
  // see "https://github.com/jquery/esprima/issues/1701"
  try{
    try{
      astEsprima=esprima.parseScript(str)
    }catch(e){
      astEsprima=esprima.parseScript('let x='+str)
    }
  }catch(e){
    throw new Error('can not parse the parameters')
  }

  let node = astEsprima.body[0]
  let funcParams = []
  let newExpressParms = []

  // The if conditions below do not merge ,we need to check the handle process about each "SHAPE" of function

  // process        shape
  // 1->3->5->7   'x=class{ constructor(e,f){}; method(cc,dd){}}'
  // 1->3->6      'x=new Function ("a=5","b","console.log(a,b)")'
  // 1->3->7      'x=function(a,b){}'
  // 1->3->8      'x=e=>{}'
  // 1->6         'new Function ("a=5","b","console.log(a,b)")',
  // 1->8         'e=>{}'
  // 2->5->7      'let x=class{ constructor(a,b){}; method(cc,dd){}}'
  // 2->6         'let x=new Function ("a=5","b","console.log(a,b)")'
  // 2->7         'let x=function(aa,cc){}'
  // 2->8         'let x=(e=5,b)=>{}'
  // 4->7         'class x{ constructor(a,b){}; method(cc,dd){}}'
  // 9            'function x(a,b,c){}'

  // PS: 'function(a){}' will transform to `let x=function(a){}'，which process is 2->6

  // 1
  if (node.type === "ExpressionStatement") node = node.expression
  // 2
  if (node.type === "VariableDeclaration") node = node.declarations[0].init
  // 3
  if (node.type === "AssignmentExpression") node = node.right
  // 4
  if (node.type === "ClassDeclaration") {
    node = node.body.body
    for (let i = 0; i < node.length; i++)
      if (node[i].kind === "constructor") {
        node = node[i].value;
        break
      }
  }
  // 5
  if (node.type === "ClassExpression") {
    node = node.body.body
    for (let i = 0; i < node.length; i++)
      if (node[i].kind === "constructor") {
        node = node[i].value;
        break
      }
  }
  // 6
  if (node.type === "NewExpression") newExpressParms = node.arguments
  // 7
  if (node.type === "FunctionExpression") funcParams = node.params
  // 8
  if (node.type === "ArrowFunctionExpression") funcParams = node.params
  // 9
  if (node.type === "FunctionDeclaration") funcParams = node.params


  let validParam=[]
  function iterParam(funcParams){
    let validP=[]
    funcParams.forEach(o=>{
      while(o.type!=='Identifier'){
        if(Array.isArray(o) && o.length) return validP.push(iterParam(o))
        if(o.type==="ArrayPattern") o=o.elements
        else if(o.type==="ObjectPattern") o=o.properties
        else if(o.type==="RestElement"){
          o=o.argument
          o.name='...'+o.name
        } else{
          if(o.type==="Property")o=o.key
          else o=o.left
        }
      }
      validP.push(o.name)
    })
    return validP
  }

  if(funcParams.length){
    // console.log(funcParams)
    validParam=iterParam(funcParams)
  } else{
    newExpressParms.slice(0,-1).forEach(o=>{
      let param=o.value.replace(reComments,'')
      param=param.split('=')[0]
      if(param)validParam.push(param)
    })
  }
  // console.log(validParam)
  return validParam.filter(Boolean)
}
