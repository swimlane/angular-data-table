import { GetVendorPrefixedName } from './vendorPrefixes';
import { CamelCase } from './utils';

// browser detection and prefixing tools
var transform = GetVendorPrefixedName('transform'),
    backfaceVisibility = GetVendorPrefixedName('backfaceVisibility'),
    hasCSSTransforms = !!GetVendorPrefixedName('transform'),
    hasCSS3DTransforms = !!GetVendorPrefixedName('perspective'),
    ua = window.navigator.userAgent,
    isSafari = (/Safari\//).test(ua) && !(/Chrome\//).test(ua);

export function TranslateXY(styles, x,y){
  if (hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      styles[transform] = `translate3d(${x}px, ${y}px, 0)`;
      styles[backfaceVisibility] = 'hidden';
    } else {
      styles[CamelCase(transform)] = `translate(${x}px, ${y}px)`;
    }
  } else {
    styles.top = y + 'px';
    styles.left = x + 'px';
  }
}
