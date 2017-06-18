import { animate } from 'liquid-fire';

export default function(opts={}) {
  return animate(this.oldElement, { scale: [0.9, 1] }, opts)
    .then(() => animate(this.newElement, { scale: [1, 0.9] }, opts));
}
