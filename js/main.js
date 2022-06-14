function pager(n, m) {
  let page_num = 0;
  if (n % m == 0) {
    page_num = n / m;
  } else {
    page_num = parseInt(n / m) + 1;
  }
  return page_num;
}

let n = 109;
let m = 6;

// console.log(pager(n, m));

console.log(parseInt("10"));
