const height = 570;
const bars = document.getElementById("bars");
const refreshButton = document.querySelector("#refresh");
const sizeSlider = document.getElementById("size-slider");
const timeoutSlider = document.getElementById("interval-slider");
const intervalText = document.getElementById("interval");
const sizeText = document.getElementById("size");
const swapsText = document.getElementById("swap-count");
const visitsText = document.getElementById("array-visits");
var interval = Number(timeoutSlider.value);
var size = Number(sizeSlider.value);
var sortingStatus = document.getElementById("curr-stats");
var timeTaken = document.getElementById("time-count");
var running = false;
var start;
var end;

const arr = [];

// colors
const RED = `linear-gradient(to top, rgba(255, 0, 0, 0.4) 10%, rgba(225, 0, 0, 0.9)`;
const GREEN = `linear-gradient(to top, rgba(0, 255, 0, 0.4) 10%, rgba(0, 225, 0, 0.9)`;
const BLUE = `linear-gradient(to top, rgba(0, 0, 255, 0.4) 10%, rgba(0, 0, 225, 0.9)`;
const DEFAULT = `linear-gradient(to top, #222, #ddd)`;

// starter

const createBars = (size) => {
  // to make it empty
  while (bars.firstChild) {
    bars.removeChild(bars.firstChild);
    arr.shift();
  }

  // create new bars of rnd height
  for (let i = 0; i < size; i++) {
    // generate random height
    const randHeight = Math.floor(Math.random() * (height - 11)) + 10;
    arr.push(randHeight);

    // create element on dom + appendChild
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${randHeight}px`;
    bar.style.backgroundColor = DEFAULT;
    bars.appendChild(bar);
  }
};

const drawBars = () => {
  const barss = Array.from(document.getElementsByClassName("bar"));
  for (let i = 0; i < size; i++) {
    const bar = barss[i];
    bar.style.height = `${arr[i]}px`;
  }
};

// size slider
createBars(size);
sizeText.innerText = `${size}`;
sizeSlider.oninput = () => {
  size = Number(sizeSlider.value);
  sizeText.innerText = `${size}`;

  if (!running) createBars(sizeSlider.value);
};
// interval slider
intervalText.innerText = `${interval}ms`;
timeoutSlider.oninput = () => {
  interval = Number(timeoutSlider.value);
  intervalText.innerText = `${interval}ms`;
};

// refersh array
refreshButton.addEventListener("click", () => {
  if (running) return;
  createBars(size);
  swapsText.innerText = `0`;
  visitsText.innerText = `0`;
});

// animation

const animateSorting = (animations) => {
  //mark as runninng = true;
  running = true;

  const barss = document.getElementsByClassName("bar");

  for (let k = 0; k < animations.length; k++) {
    const { comPair, changeHeight, addColor } = animations[k];
    animateStep(comPair, changeHeight, addColor, barss, interval * k);
  }

  animateSortComplete(interval * animations.length);

  setTimeout(() => {
    running = false;
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  }, interval * (animations.length + 1));
};

const animateStep = (
  comPair = null,
  changeHeight = null,
  addColor = null,
  barss,
  startTime
) => {
  if (!addColor) addColor = [];

  setTimeout(() => {
    if (comPair) {
      const { i, j, isSwap } = comPair;
      let color = isSwap ? RED : GREEN;
      if (isSwap) {
        swapheights(barss[i], barss[j]);
      }
      addColor.push({ idx: i, color: `${color}` });
      addColor.push({ idx: j, color: `${color}` });
    }
    if (changeHeight) {
      const { idx, height } = changeHeight;
      barss[idx].style.height = `${height}px`;
      addColor.push({ idx: idx, color: RED });
    }
    if (addColor) {
      addColor.forEach((bar) => {
        const { idx, color } = bar;
        barss[idx].style.background = `${color}`;
      });
    }
  }, startTime);

  setTimeout(() => {
    if (addColor) {
      addColor.forEach((bar) => {
        const { idx } = bar;
        barss[idx].style.background = DEFAULT;
      });
    }
  }, startTime + interval);
};

const swapheights = (bar1, bar2) => {
  let h1 = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = h1;
};

const animateSortComplete = (startTime) => {
  const barss = document.getElementsByClassName("bar");
  const gap = 1000 / size;

  for (let i = 0; i < barss.length; i++) {
    const bar_i = barss[i];

    setTimeout(() => {
      bar_i.style.background = RED;
    }, startTime + i * gap);

    setTimeout(() => {
      bar_i.style.background = GREEN;
    }, startTime + (i + 1) * gap);

    setTimeout(() => {
      bar_i.style.background = DEFAULT;
    }, startTime + barss.length * gap);
  }
};

const handleClick = (sort) => {
  if (running) return;

  let animations = [];
  start = window.performance.now();
  if (sort === "bubbleSort") animations = bubbleSort(arr);
  if (sort === "selectionSort") animations = selectionSort(arr);
  if (sort === "insertionSort") animations = insertionSort(arr);
  if (sort === "mergeSort") animations = mergeSortArr(arr);
  if (sort === "quickSort") animations = quickSortArr(arr);
  if (sort === "countingSort") animations = countingSortArr(arr);
  end = window.performance.now();

  const buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }

  animateSorting(animations);
};

// sorting algorithms

const bubbleSort = (arr) => {
  const animations = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      let isSwap = false;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        isSwap = true;
      }
      animations.push({ comPair: { i: j, j: j + 1, isSwap: isSwap } });
    }
  }
  return animations;
};

const selectionSort = (arr) => {
  const animations = [];
  for (let i = 0; i < arr.length; i++) {
    let min_idx = i;
    for (let j = i + 1; j < arr.length; j++) {
      let isSwap = false;
      if (arr[j] < arr[min_idx]) {
        [arr[j], arr[min_idx]] = [arr[min_idx], arr[j]];
        isSwap = true;
      }
      animations.push({ comPair: { i: min_idx, j: j, isSwap: isSwap } });
    }
  }
  return animations;
};

const insertionSort = (arr) => {
  let animations = [];
  for (let i = 1; i < size; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      animations.push({ comPair: { i: j + 1, j: j, isSwap: true } });
      j--;
    }
    arr[j + 1] = key;
    animations.push({ comPair: { i: i, j: i, isSwap: true } });
  }

  return animations;
};

const mergeSortArr = (arr) => {
  const animations = [];
  mergeSort(animations, arr, 0, arr.length - 1);

  return animations;
};

const mergeSort = (animations, arr, l, r) => {
  if (l >= r) {
    return;
  }

  let m = Math.floor((l + r) / 2);
  mergeSort(animations, arr, l, m);
  mergeSort(animations, arr, m + 1, r);
  const dupArr = arr.slice();
  merge(dupArr, arr, l, m, r, animations);
};

const merge = (dupArr, arr, l, m, r, animations) => {
  let i = l;
  let j = m + 1;
  let k = l;

  const heighChanged = [];
  while (i <= m && j <= r) {
    animations.push({
      visits: 2,
      addColor: [
        { idx: i, color: RED },
        { idx: j, color: RED },
        { idx: l, color: GREEN },
        { idx: r, color: GREEN },
        { idx: m, color: "#18bbe1" },
      ],
    });
    if (dupArr[i] <= dupArr[j]) {
      heighChanged.push({
        changeHeight: { idx: k, height: dupArr[i] },
      });
      arr[k++] = dupArr[i++];
    } else {
      heighChanged.push({
        changeHeight: { idx: k, height: dupArr[j] },
      });
      arr[k++] = dupArr[j++];
    }
  }
  while (i <= m) {
    heighChanged.push({
      changeHeight: { idx: k, height: dupArr[i] },
    });
    arr[k++] = dupArr[i++];
  }
  while (j <= r) {
    heighChanged.push({
      changeHeight: { idx: k, height: dupArr[j] },
    });
    arr[k++] = dupArr[j++];
  }

  while (heighChanged.length) {
    animations.push(heighChanged.shift());
  }
};

const quickSortArr = (arr) => {
  const animations = [];
  quickSort(arr, 0, arr.length - 1, animations);

  return animations;
};

const quickSort = (arr, start, end, animations) => {
  const p = Partition(arr, start, end, animations);
  if (p - 1 > start) quickSort(arr, start, p - 1, animations);
  if (p + 1 < end) quickSort(arr, p + 1, end, animations);
};

const Partition = (arr, start, end, animations) => {
  let randidx = Math.floor(Math.random() * (end - start + 1)) + start;
  [arr[end], arr[randidx]] = [arr[randidx], arr[end]];
  animations.push({ comPair: { i: end, j: randidx, isSwap: true } });

  let pivot = arr[end];
  let j = start - 1;

  for (let i = start; i < end; i++) {
    if (arr[i] < pivot) {
      j++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      animations.push({
        comPair: { i: i, j: j, isSwap: true },
        addColor: [{ idx: end, color: BLUE }],
      });
    }
  }

  [arr[j + 1], arr[end]] = [arr[end], arr[j + 1]];
  animations.push({
    comPair: { i: j + 1, j: end, isSwap: true },
    addColor: [{ idx: j + 1, color: BLUE }],
  });
  return j + 1;
};

const countingSortArr = (arr) => {
  const animations = [];
  countingSort(arr, animations);

  return animations;
};

const countingSort = (arr, animations) => {
  let i = 1;
  let j = 0;
  let count = Array(height + 1).fill(0);

  for (i = 0; i < arr.length; i++) {
    count[arr[i]] += 1;
    animations.push({ comPair: { i: i, j: i, isSwap: true } });
  }

  for (i = 10; i <= height; i++) {
    while (count[i] > 0) {
      arr[j] = i;
      animations.push({ changeHeight: { idx: j, height: i } });
      j++;
      count[i]--;
    }
  }
  return arr;
};

// testing
const equalArrays = (jsSortedArr, test) => {
  if (jsSortedArr.length != test.length) {
    console.log("length !!!");
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (test[i] != jsSortedArr[i]) {
      return false;
    }
  }

  return true;
};

const testQuickSort = () => {
  for (let i = 0; i < 1000; i++) {
    let testLen = Math.floor(Math.random() * 2000);
    let testArr = [];
    for (let i = 0; i < testLen; i++) {
      testArr.push(Math.floor(Math.random() * height + 1));
    }
    const jsSortedArr = testArr.slice().sort((a, b) => a - b);
    countingSortArr(testArr, 0, testLen - 1);
    if (equalArrays(testArr, jsSortedArr)) {
      console.log(true);
    } else {
      console.log(false);
    }
  }
};
