const maxAmountStr = (str) => {
  let map = {};
  let max = 0;
  let maxKey = "";
  for (let i = 0; i < str.length; i++) {
    const k = str[i];

    if (map[k]) {
      map[k] = map[k] + 1;
      //   map.set(str[i], map.get(str[i]) + 1);
    } else {
      map[k] = 1;
    }
    if (max < map[k]) {
      max = map[k];
      maxKey = k;
    }
  }

  return {
    max,
    maxKey,
  };
};

const str = "uuuiiiddddd";
console.log(maxAmountStr(str));
