// The BibleDiscern mark for transactional emails — a gilt cross (two hairline
// strokes, crossbar at 26% per the Brand Assets sheet) built from positioned
// rectangles, since mail clients strip SVG. Beside the name in a serif face.
// Designed for a centered navy header band: vellum name + gilt cross.
export const EMAIL_LOCKUP = `
  <span style="display:inline-block;position:relative;width:12px;height:18px;vertical-align:middle;margin-right:9px;">
    <span style="display:block;position:absolute;left:5px;top:0;width:2px;height:18px;background:#C8A45E;font-size:0;line-height:0;"></span>
    <span style="display:block;position:absolute;left:0;top:5px;width:12px;height:2px;background:#C8A45E;font-size:0;line-height:0;"></span>
  </span><span style="font-family:Georgia,serif;font-weight:700;font-size:1.15rem;color:#FDF6EC;vertical-align:middle;letter-spacing:.01em;">BibleDiscern</span>`;
