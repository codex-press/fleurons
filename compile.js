#! /usr/local/bin/node

var fs = require('fs');
var SVGO = require('svgo');
var JSAPI = require('svgo/lib/svgo/jsAPI');
var styles = require('./style.js');

fs.readdirSync('./export').map(filename => {
  var name = filename.slice(9,-4);
  var xml = fs.readFileSync('./export/' + filename, {encoding: 'utf-8'});

  var svgo = new SVGO({
    // js2svg: {pretty: true, indent: 2},
    plugins: [
      {mergePaths: false},
      {convertPathData: {floatPrecision: 1}},

      {addClassesToSVGElement: {classNames: ['fleuron', name]}},
      {addWidth: {
        type: 'full',
        active: true,
        fn: tree => {
          tree.content[0].attrs.width = {
            name: 'width',
            prefix: '',
            value: '150',
            local: ''
          };
          return tree;
        }
      }},


      {convertStyleToAttrs: false},
      {removeStyles: {
        type: 'perItem',
        active: true,
        fn: item => {
          item.removeAttr('style');
          return item;
        },
      }},

      // move all the IDs from groups into classes, lopping off the
      // _1_ that Illustrator uses to make them unique
      {collapseGroups: false},
      {cleanupIDs: false},
      {addGroupIDsToElemClasses: {
        type: 'perItem',
        active: true,
        fn: item => {

          if (item.isElem('g')) {
            let klass = '';
            if (item.hasAttr('id')) {
              let value = item.attr('id').value
              if (value.indexOf('_') >= 0)
                value = value.match(/(.*?)_/)[1]
              klass += ' ' + value;
            }
            if (item.hasAttr('class'))
              klass += ' ' + item.attr('class').value;

            if (klass) {
              item.content.forEach(inner => {
                if (inner.hasAttr('class'))
                  inner.attr('class').value += klass;
                else {
                  inner.addAttr({
                    name: 'class',
                    local: 'class',
                    prefix: '',
                    value: klass.trim(),
                  });
                }
              });
            }
          }

          return item;
        }
      }},


      // remove all groups
      {removeGroups: {
        type: 'perItemReverse',
        fn: item => {

          if (item.isElem() && !item.isEmpty()) {
            item.content = item.content.reduce((content, item) => {
              if (item.isElem('g'))
                content = content.concat(item.content);
              else
                content.push(item);
              return content;
            },[]);
          }

          return item;
        }
      }},

      {removeIDs: {
        type: 'perItem',
        fn: item => {
          item.removeAttr('id');
          return item;
        },
      }},


      {addStyles: {
        type: 'full',
        fn: tree => {

          if (!styles[name])
            return tree;

          let svg = tree.content[0];

          let styleElem = new JSAPI({
            elem: 'style',
            prefix: '',
            local: 'style',
            content: [],
          }, svg);

          let text = styles[name].replace(/\s+/g,' ');
          styleElem.content.push(new JSAPI({text}, styleElem));

          svg.content.unshift(styleElem);

          return tree;
        },
      }},

    ]
  });

  svgo.optimize(xml, result => {
    fs.writeFileSync(name + '.svg', result.data);
  });

});

