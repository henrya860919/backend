let players = [
  {
    name: "曼曼",
    level: 1,
    times: 0,
    status: 0,
  },
  {
    name: "姵君",
    level: 2,
    times: 0,
    status: 0,
  },
  {
    name: "達哥",
    level: 2,
    times: 0,
    status: 0,
  },
  {
    name: "振庭",
    level: 2,
    times: 0,
    status: 0,
  },
  {
    name: "品潔",
    level: 2,
    times: 0,
    status: 0,
  },
  {
    name: "宣妘",
    level: 3,
    times: 0,
    status: 0,
  },
  {
    name: "慶中",
    level: 3,
    times: 0,
    status: 0,
  },
  {
    name: "阿致",
    level: 3,
    times: 0,
    status: 0,
  },
  {
    name: "猴子",
    level: 3,
    times: 0,
    status: 0,
  },
  {
    name: "思翰",
    level: 4,
    times: 0,
    status: 0,
  },
  {
    name: "志銘",
    level: 4,
    times: 0,
    status: 0,
  },
  {
    name: "軒宏",
    level: 4,
    times: 0,
    status: 0,
  },
  {
    name: "傑哥",
    level: 5,
    times: 0,
    status: 0,
  },
  {
    name: "群哥",
    level: 5,
    times: 0,
    status: 0,
  },
];

let court1 = [];
let court2 = [];

async function action(list, players) {
  for (var i = 0; i < list.length; i++) {
    var courtObj = list[i];

    for (var j = 0; j < players.length; j++) {
      var playerObj = players[j];

      if (
        playerObj.name === courtObj.name &&
        playerObj.level === courtObj.level
      ) {
        players[j].status = 1;
      }
    }
  }
}
async function clearStatus(list, players) {
  for (var i = 0; i < list.length; i++) {
    var courtObj = list[i];

    for (var j = 0; j < players.length; j++) {
      var playerObj = players[j];

      if (
        playerObj.name === courtObj.name &&
        playerObj.level === courtObj.level
      ) {
        players[j].status = 0;
      }
    }
  }
}
async function addTimes(list, players) {
  for (var i = 0; i < list.length; i++) {
    var courtObj = list[i];

    for (var j = 0; j < players.length; j++) {
      var playerObj = players[j];
      if (playerObj.name === courtObj.name) {
        players[j].times += 1;
      }
    }
  }
}
async function getGroup(players, court) {
  // get two people
  await clearStatus(court1, players);
  court1 = [];
  var minTimesObjects = getMinTimesObjects(players, 2);
  for (let i = 0; i < minTimesObjects.length; i++) {
    court1.push(minTimesObjects[i]);
  }
  var remainingPlayers = players.filter(
    (player) => !minTimesObjects.includes(player)
  );
  // end

  //  get third person
  const third = getRandomObjects(remainingPlayers, 1);
  court1.push(third[0]);
  court1.sort((a, b) => {
    return a.level - b.level;
  });
  // end
  var remainingPlayers = players.filter(
    (player) => !minTimesObjects.includes(player)
  );

  // get forth person
  const forth = getRandomObjects(remainingPlayers, 1);
  court1.push(forth[0]);
  console.log("🚀 ~ court1:", court1);
  // end

  await addTimes(court1, players);
  await action(court1, players);
}

var minTimesObjects = getMinTimesObjects(players, 2);
for (let i = 0; i < minTimesObjects.length; i++) {
  court1.push(minTimesObjects[i]);
}
var remainingPlayers = players.filter(
  (player) => !minTimesObjects.includes(player)
);
var randomObjects = getRandomObjects(remainingPlayers, 2);
for (let i = 0; i < randomObjects.length; i++) {
  court1.push(randomObjects[i]);
}

function getRandomObjects(remainingPlayers, count) {
  let arr = remainingPlayers;

  // 排除 11 22 12 21 的機會
  const isValid = court1.some((item) => {
    const level = item.level;
    return (
      (level === 1 && court1.some((other) => other.level === 1)) ||
      (level === 2 && court1.some((other) => other.level === 2)) ||
      (level === 1 && court1.some((other) => other.level === 2)) ||
      (level === 2 && court1.some((other) => other.level === 1))
    );
  });
  if (isValid) {
    arr = arr.filter((player) => player.level > 2);
  }

  // 如果已經三個人的話 要篩選
  if (court1.length === 3) {
    court1.sort((a, b) => {
      return a.level - b.level;
    });
    // 找到最大值和最小值
    const levels = court1.map((obj) => obj.level);
    const maxLevel = Math.max(...levels);
    const minLevel = Math.min(...levels);
    // 計算結果
    const result = maxLevel + minLevel - levels[1];
    // 處理 result = 2 時就不要再出現1的了
    if (result <= 2) {
      const after = result + 1;
      arr = arr.filter((obj) => obj.level >= result && obj.level <= after);
    } else {
      const pre = result - 1;
      const after = result + 1;
      arr = arr.filter((obj) => obj.level >= pre && obj.level <= after);
    }
  }

  var randomIndexes = [];
  var randomObjects = [];

  while (randomIndexes.length < count) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex);
      randomObjects.push(arr[randomIndex]);
    }
  }
  return randomObjects;
}

function getMinTimesObjects(arr, count) {
  var sorted = arr.slice().sort((a, b) => a.times - b.times);
  return sorted.slice(0, count);
}
getGroup(players, 1);
