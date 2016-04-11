export function stopEventPropagation(ev) {
  if(ev.stopPropagation) {
    ev.stopPropagation();
  }
  if(ev.preventDefault) {
    ev.preventDefault();
  }
}
