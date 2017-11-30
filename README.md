<p align="center">
  <a href="https://codex.press/docs/fleurons">
    <img src="https://usercontent.codex.press/fleurons/chrysler.svg" width="300">
   </a>
</p>
<h1 align=center>Codex Fleurons</h1>

A fleuron is a page ornament with a [long history] in typography. The designs here are easily inserted into pages on the [Codex Press] publishing platform using an inline asset reference, such as { fleurons/chrysler.svg } for the example above. These SVG elements are then inserted inline into the page, where they can be styled in CSS. More information is available in the [Codex docs].

The designs here were created in Adobe Illustrator and exported using the "Save As..." Artboards option (raw export is available in the "export" folder). The newer "Export for screens" provides a more compact version of the SVG, but strips out ID information on groups, which is used here to create classes for the various paths and shapes in the designs as described in the [Codex docs]. The IDs are moved to classes using a custom plugin for the impressive [SVG Optimizer] in the `compile.js` script.

[long history]: https://en.wikipedia.org/wiki/Fleuron_(typography)
[Codex Press]: https://codex.press/
[Codex docs]: https://codex.press/docs/fleurons
[SVG Optimizer]: https://github.com/svg/svgo
