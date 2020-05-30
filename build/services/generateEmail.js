"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateEmail;

var _handlebars = require("handlebars");

var _mjml = _interopRequireDefault(require("mjml"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//user =>

/* 
{
  email: '',
  filterResults: [
    {name, results: []}
  ]
}
*/
function generateEmail(user) {
  var template = (0, _handlebars.compile)("\n  <mjml>\n  <mj-body>\n    <mj-section>\n      <mj-column>\n        <mj-text font-weight=\"bold\" align=\"center\" font-size=\"40px\" color=\"#9100ff\" font-family=\"helvetica\">Movie Newsletter</mj-text>\n      </mj-column>\n    </mj-section>\n    {{#each .}}\n    {{#if name}}\n      <mj-section>\n        <mj-column>\n          <mj-text font-size=\"24px\">\n          {{name}}\n          </mj-text>\n        </mj-column>\n      </mj-section>\n    {{/if}}\n      <mj-section>\n      {{#if movies}}\n        {{#movies}}\n          <mj-column>\n            <mj-image width=\"165px\" src={{imagePath}}></mj-image>\n            <mj-text font-weight=\"bold\" align=\"center\" font-size=\"16px\" color=\"#000\" font-family=\"helvetica\">{{title}}</mj-text>\n            <mj-text align=\"left\" font-size=\"13px\" color=\"#000\" font-family=\"helvetica\">{{tag}}</mj-text>\n          </mj-column>\n        {{/movies}}\n      {{/if}}\n    \n      {{#unless movies}}\n        <mj-column>\n          <mj-text font-weight=\"bold\" align=\"center\" font-size=\"16px\" color=\"#000\" font-family=\"helvetica\">No Movies Found</mj-text>\n        </mj-column>\n      {{/unless}}\n      </mj-section>\n    {{/each}}\n  </mj-body>\n  </mjml>");
  /* 
  [
  {
    filterName:
    movies: [
      {
        imagePath, title, tag
      }
    ]
  }
  ]
  */
  //movies ordered as 3 columns each row for the email template

  function transformUserToEmailContext(user) {
    var temp = [];
    var column = 1;
    var row = 0;

    for (var filterResult of user.filterResults) {
      //loop over filters of one user
      var name = filterResult.name;
      temp.push({
        name,
        movies: []
      });

      if (!filterResult.results) {
        row++;
        continue;
      }

      for (var result of filterResult.results) {
        //loop over recomended movies
        if (column > 3) {
          row++;
          temp.push({
            movies: []
          });
          temp[row].movies.push(result);
          column = 2;
        } else {
          temp[row].movies.push(result);
          column++;
        }
      }

      row++;
    }

    return temp;
  }

  function addBlankToShortRows(temp) {
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].movies.length === 1) {
        temp[i].movies.push([], []);
      }

      if (temp[i].movies.length === 2) {
        temp[i].movies.push([]);
      }
    }

    return temp;
  }

  var temp = transformUserToEmailContext(user);
  var context = addBlankToShortRows(temp);
  var mjml = template(context);
  var html = (0, _mjml.default)(mjml);
  var msg = {};
  msg.to = user.email;
  msg.from = process.env.testEmail;
  msg.subject = "Montly Movie Newsletter";
  msg.html = html.html;
  return msg;
}
//# sourceMappingURL=generateEmail.js.map