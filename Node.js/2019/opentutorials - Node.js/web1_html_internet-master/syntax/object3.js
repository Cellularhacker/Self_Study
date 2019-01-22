//Object Oriented Programming
var v1 = 'v1';
// 10000 lines of codes...
v1 = 'cellularhacker';
var v1 = 'v2';


var q = {
  v1:'v1',
  v2:'v2',
  f1:function(){
    console.log(this.v1);
  },
  f2:function (){
    console.log(this.v2);
  }
}

/*
function f1(){
  console.log(o.v1);
}

function f1(){

}

function f2(){
  console.log(o.v2);
}
*/

q.f1();
q.f2();
