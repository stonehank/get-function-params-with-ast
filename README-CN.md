[English](https://github.com/stonehank/get-function-params-with-ast/blob/master/README.md)


-----------

## 查找函数形参名称，兼容任意`function`样式

### 特性
* 支持ES6模式，参数默认值，扩展运算符，解构参数，`new Function`，箭头函数，async，generators，class等等
* 100+ tests
* 使用`AST`树，轻松扩展

------------

### 安装

`npm install get-function-params-with-ast`

---------

### 使用

`getFuncParamsName(func:<String|Function>):<Array>`

--------

### 测试

`npm run test`

--------

### 测试案例
```
function(){}                                      // []
function(a,b){}                                   // ['a','b']
function x(a=4*(5/3), b) {}                       // ['a','b']
e=>{}                                             // ['e']
(a,b)=>{}                                         // ['a','b']
class x{                                          // ['a','b']
    constructor(a,b){}
    method(cc,dd){}
  }     
async function name(asy1,asy2){await run(x,y)}    // ['asy1','asy2']
function *generator(gen1,gen2){yield "x1"}        // ['gen1','gen2']
new Function                                      // []
function x([a,b]=[1,2],{c,d}={c:7,y:2}){}         // [['a','b'],['c','d']]
function x(...arg){}                              // ['...arg']
```

* 复杂测试案例
```
new Function ("a=5","b",/* c=7 ,*//* d ,*/"e=function(x,y){}","f=5","console.log(a,b)")   
// ['a','b','e','f']
function funcName(a=function(a=b){function inner(b=c){function inner(c=a){function inner(d=b){function inner(b){function inner(d){function inner(a){}}}}}}}){}   
// ['a']
function x(a=5,b="a",c=function(x=1,y){console.log(x=function(i=8,j){})},d={x:1,y:2,z:'x=6'},e=x=>7,f=['3=5','x.1','y,2',1],g=(x,y)=>{let z=(i,j=6)=>{}},h){}   
// ['a','b','c','d','e','f','g','h']
function x({a:[...args],b:{c:{d:{e:[...another]}}}}){}  
 // [['a','b']]
```