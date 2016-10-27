#! /usr/local/bin/node

var fs = require('fs');
var SVGO = require('svgo');

fs.readdirSync('./export').map(filename => {
  if (/\.svg$/.test(filename)) {

    var name = filename.slice(0,-4);

    var xml = fs.readFileSync('./export/' + filename, {encoding: 'utf-8'});

    var svgo = new SVGO({
      plugins: [
        {mergePaths: false},
        {addClassesToSVGElement: {classNames: ['fleuron', 'f'+name]}},
        {convertPathData: {
          floatPrecision: 1,
        }},
        {addFleuronAttributes: {
          type: 'full',
          active: true,
          fn: tree => {
            let svg = tree.content[0];

            if (svg.isElem('svg')) {
              svg.attrs.width = {
                name: 'width',
                prefix: '',
                value: '150',
                local: ''
              };

              svg.attrs.style = {
                name: 'style',
                prefix: '',
                value: 'opacity: 0.8; fill: currentColor; display: block; margin: 1rem auto;',
                local: ''
              };
            }

            return tree;
          }
        }},
      ]
    });

    svgo.optimize(xml, result => {
      fs.writeFileSync(filename, result.data);
    });

  }
});

