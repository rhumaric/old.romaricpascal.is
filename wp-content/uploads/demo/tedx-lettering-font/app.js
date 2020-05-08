var DARING_THINGS = [
{ title: "Disrupt", removeFlares: true, timing: 2500},
{ title: "Act", removeFlares: false, timing: 1250},
{ title: "Do", removeFlares: false, timing: 1250},
{ title: "Think", removeFlares: false, timing: 1250},
{ title: "Believe", removeFlares: true, timing: 1250},
{ title: "Dream", removeFlares: false, timing: 1250},
{ title: "Create", removeFlares: true, timing: 1250},
{ title: "Decide", removeFlares: true, timing: 1250},
];
var START_INDEX = 0;
var index = START_INDEX;
function nextThing() {
  index = (index + 1) % DARING_THINGS.length;
  return DARING_THINGS[index];
}

function updateSubhead(thing) {
  document.querySelector('.branding_subhead').textContent = thing.title;
  document.querySelector('.lettering').classList.toggle('withoutBottomWhiteFlares', thing.removeFlares);
}

function loopDaringThings() {
  var thing = nextThing();
  updateSubhead(thing);
  setTimeout(loopDaringThings,thing.timing);
}
setTimeout(loopDaringThings, DARING_THINGS[START_INDEX].timing);