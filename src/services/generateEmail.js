import { compile } from "handlebars";
import mjml2html from "mjml";
//user =>

/* 
{
  email: '',
  filterResults: [
    {name, results: []}
  ]
}
*/

export default function generateEmail(user) {
  const template = compile(`
  <mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-weight="bold" align="center" font-size="40px" color="#9100ff" font-family="helvetica">Movie Newsletter</mj-text>
      </mj-column>
    </mj-section>
    {{#each .}}
    {{#if name}}
      <mj-section>
        <mj-column>
          <mj-text font-size="24px">
          {{name}}
          </mj-text>
        </mj-column>
      </mj-section>
    {{/if}}
      <mj-section>
      {{#if movies}}
        {{#movies}}
          <mj-column>
            <mj-image width="165px" src={{imagePath}}></mj-image>
            <mj-text font-weight="bold" align="justify" font-size="16px" color="#000" font-family="helvetica">{{title}}</mj-text>
            <mj-text align="left" font-size="13px" color="#000" font-family="helvetica">{{tag}}</mj-text>
          </mj-column>
        {{/movies}}
      {{/if}}
    
      {{#unless movies}}
        <mj-column>
          <mj-text font-weight="bold" align="center" font-size="16px" color="#000" font-family="helvetica">No Movies Found</mj-text>
        </mj-column>
      {{/unless}}
      </mj-section>
    {{/each}}
  </mj-body>
  </mjml>`);

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
    const temp = [];
    let column = 1;
    let row = 0;
    for (const filterResult of user.filterResults) {
      //loop over filters of one user
      const name = filterResult.name;
      temp.push({ name, movies: [] });
      if (!filterResult.results) {
        row++;
        continue;
      }
      for (const result of filterResult.results) {
        //loop over recomended movies
        if (column > 3) {
          row++;
          temp.push({ movies: [] });
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
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].movies.length === 1) {
        temp[i].movies.push([], []);
      }
      if (temp[i].movies.length === 2) {
        temp[i].movies.push([]);
      }
    }
    return temp;
  }
  const temp = transformUserToEmailContext(user);
  const context = addBlankToShortRows(temp);
  console.log(context);
  const mjml = template(context);
  const html = mjml2html(mjml);
  let msg = {};
  msg.to = "amo719733@gmail.com";
  msg.from = process.env.testEmail;
  msg.subject = "Montly Movie Newsletter";
  msg.html = html.html;

  return msg;
}
