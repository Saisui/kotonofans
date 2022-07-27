let x = 0;
keyboard$.subscribe(function(key) {
  if (key.mode === "global" && key.type === "Shift") {
    alert(x++);
    key.claim();
  }
})

