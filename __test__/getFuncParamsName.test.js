const getFuncParamsName=require('../index.js')







let testListString=[
  'function(){}',
  'function(){function inner(a,b){}}',
  'function(a,b){}',
  'function d(){}',
  'function x(a,b,c){}',
  'function x(a /* = 1 */, b /* = true */) {}',
  'function fprintf(handle, fmt /*, {}*/) {}',
  'function x( a, b = 1, c ){}',
  'function x(a=4*(5/3), b) {}',
  'function x(a /* function() yes */, \n /* no, */b)/* omg! */{}',
  'function x( A, b \n,c ,d \n ) \n {}',
  'function $args(func) {}',
  'function Object() {}',
  'function Object(classParm) {}',
  'e=>{}',
  '(a,b)=>{}',
  '(a,b)=>{ let inner=(e,f)=>{}}',
  '(e)=>1',
  '(a=65,b=undefined)=>"string"',
  'let x=e=>{}',
  'const x=(e)=>{}',
  'let x=(e=5,b)=>{}',
  'var x=e=>5',
  'var x=e=>{function inner(a,b){}}',
  'const x=function(bb){}',
  'let x=function(aa,cc){}',
  'x=e=>{}',
  'x=function(a,b){}',
  `class x{
        constructor(a,b){}
        method(cc,dd){}
      }`,
  `class x2{
        method(cc,dd){}
      }`,
  `let x=class{
        constructor(a,b){}
        method(cc,dd){}
      }`,
  `let x=class{
        method(cc,dd){}
      }`,
  ` x=class{
    constructor(e,f){}
    method(cc,dd){}
  }`,
  `let funcName=function(a=function(b){}){}`,
  `function funcName(a=function(b){function inner(b){function inner(b){function inner(b){function inner(b){function inner(b){function inner(b){}}}}}}}){}`,
  `async function funcName(asy1,asy2){let x=1;await doSomeWork(x,y)}`,
  `let funcName=async function(asy1,asy2){let x=1;await doSomeWork(x,y)}`,
  `funcName=async function(asy1,asy2){let x=1;await doSomeWork(x,y)}`,
  `async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)}`,
  `let funcName=async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)}`,
  `funcName=async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)}`,
  `function *generator(gen1,gen2){yield "x1";yield "x2";}`,
  `let funcName=function *(gen1,gen2){yield "x1";yield "x2";}`,
  `funcName=function *(gen1,gen2){yield "x1";yield "x2";}`,
  `funcName=function(a=function *uu(d,c){},b=async function ww(e,f){}){}`,
  `new Function ()`,
  `new Function`,
  `new Function ("a=5","b",/* c=7 ,*//* d ,*/"e=function(x,y){}",\n"f=5","console.log(a,b)")`,
  `let x=new Function ("a=5","b",/* c=7 ,*//* d ,*/"e=function(x,y){}",\n"f=5","console.log(a,b)")`,
  `x=new Function ("a=5","b",/* c=7 ,*//* d ,*/"e=function(x,y){}",\n"f=5","console.log(a,b)")`,
  `function x(a=5,b="a",c=function(x=1,y){console.log(x=function(i=8,j){})},d={x:1,y:2,z:'x=6'},e=x=>7,f=['3=5','x.1','y,2',1],g=(x,y)=>{let z=(i,j=6)=>{}},h){}`,
  `function x([a,b]=[1,2],{c,d}={c:7,y:2}){}`,
  `function x(a=b=c=d=6){}`,
  'function x(...arg){}',
  'function x({a:[...args],b:{c:{d:{e:[...another]}}}}){}',
  'function x([a,[...b]]){}',
]


let testListFunc=[
  function(){},
  function(){function inner(a,b){}},
  function(a,b){},
  function d(){},
  function x(a,b,c){},
  function x(a /* = 1 */, b /* = true */) {},
  function fprintf(handle, fmt /*, {}*/) {},
  function x( a, b = 1, c ){},
  function x(a=4*(5/3), b) {},
  function x(a /* function() yes */,
             /* no, */b)/* omg! */{},
  function x( A, b
    ,c ,d  )
  {},
  function $args(func) {},
  function Object() {},
  function Object(classParm) {},
  e=>{},
  (a,b)=>{},
  (a,b)=>{ let inner=(e,f)=>{}},
  (e)=>1,
  (a=65,b=undefined)=>"string",
  e=>{},
  (e)=>{},
  (e=5,b)=>{},
  e=>5,
  e=>{function inner(a,b){}},
  function(bb){},
  function(aa,cc){},
  funcName=e=>{},
  funcName=function(a,b){},
  class x{
    constructor(a,b){}
    method(cc,dd){}
  },
  class x2{
    method(cc,dd){}
  },
  class{
    constructor(a,b){}
    method(cc,dd){}
  },
  class{
    method(cc,dd){}
  },
  funcName=class{
    constructor(e,f){}
    method(cc,dd){}
  },
  function(a=function(b){}){},
  function funcName(a=function(b){function inner(b){function inner(b){function inner(b){function inner(b){function inner(b){function inner(b){}}}}}}}){},
  async function funcName(asy1,asy2){let x=1;await doSomeWork(x,y)},
  funcName=async function(asy1,asy2){let x=1;await doSomeWork(x,y)},
  funcName=async function funcName(asy1,asy2){let x=1;await doSomeWork(x,y)},
  async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)},
  funcName=async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)},
  funcName=async(es6asy1,es6asy2)=>{let x=1;await doSomeWork(x,y)},
  function *generator(gen1,gen2){yield "x1";yield "x2";},
  funcName=function *(gen1,gen2){yield "x1";yield "x2";},
  funcName=function *generator(gen1,gen2){yield "x1";yield "x2";},
  funcName=function(a=function *uu(d,c){},b=async function ww(){}){},
  new Function (),
  new Function,
  // 对于使用括号,V8存在bug
  // 例如 new Function ("a=function(x,y){}","console.log(a,b)")
  // https://bugs.chromium.org/p/v8/issues/detail?id=4230
  new Function ("a=5","b",/* c=7 ,*//* d ,*/"e","f=5","console.log(a,b)"),
  x=new Function ("a=5","b",/* c=7 ,*//* d ,*/"e","f=5","console.log(a,b)"),
  x=new Function ("a=5","b",/* c=7 ,*//* d ,*/"e",
    "f=5","console.log(a,b)"),
  function x(a=5,b="a",c=function(x=1,y){console.log(x=function(i=8,j){})},d={x:1,y:2,z:'x=6'},e=x=>7,f=['3=5','x.1','y,2',1],g=(x,y)=>{let z=(i,j=6)=>{}},h){},
  function x([a,b]=[1,2],{c,d}={c:7,y:2}){},
  function x(a=b=c=d=6){},
  function x(...arg){},
  function x({a:[...args],b:{c:{d:{e:[...another]}}}}){},
  function x([a,[...b]]){},
]

let answer=[
  [],
  [],
  ["a","b"],
  [],
  [ "a", "b", "c" ],
  [ "a", "b" ],
  [ "handle", "fmt" ],
  [ "a", "b", "c" ],
  [ "a", "b" ],
  [ "a", "b" ],
  [ "A", "b", "c", "d" ],
  [ "func" ],
  [],
  ["classParm"],
  [ "e" ],
  [ "a", "b" ],
  [ "a", "b" ],
  [ "e" ],
  [ "a", "b" ],
  [ "e" ],
  [ "e" ],
  [ "e", "b" ],
  [ "e" ],
  ["e"],
  [ "bb" ],
  [ "aa", "cc" ],
  ["e"],
  ["a","b"],
  ["a","b"],
  [],
  ["a","b"],
  [],
  ["e","f"],
  ["a"],
  ["a"],
  ["asy1","asy2"],
  ["asy1","asy2"],
  ["asy1","asy2"],
  ["es6asy1","es6asy2"],
  ["es6asy1","es6asy2"],
  ["es6asy1","es6asy2"],
  ["gen1","gen2"],
  ["gen1","gen2"],
  ["gen1","gen2"],
  ["a","b"],
  [],
  [],
  ["a","b","e","f"],
  ["a","b","e","f"],
  ["a","b","e","f"],
  ["a","b","c","d","e","f","g","h"],
  [['a','b'],['c','d']],
  ["a"],
  ['...arg'],
  [['a','b']],
  [['a',['...b']]],
]


for(let i=0;i<testListString.length;i++){
  test(`get function(string) ${i} parameters' name`, () => {
    expect(getFuncParamsName(testListString[i])).toEqual(answer[i])
  });
}

for(let i=0;i<testListFunc.length;i++){
  test(`get function(string) ${i} parameters' name`, () => {
    expect(getFuncParamsName(testListFunc[i])).toEqual(answer[i])
  });
}
