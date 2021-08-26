// const runner = new Promise((resolve, reject) => {
//   console.log("init");
//   let chain = Promise.resolve();

//   chain = chain.then(() => {
//     console.log("333");
//   });
//   chain = chain.then(() => {
//     console.log(44);
//     return Promise.resolve().then(() => "hh");
//   });
//   chain.then((res) => {
//     console.log(res);
//   });
// });
// const func = () => {
let i = 0;
while (true) {
  console.log("inner", i++);
  if (i > 5) {
    return "r";
  }
}
// };
// console.log(func());
