`bpr init` command creates directory `blueprinter-tpls` and `blueprinter-cli.conf.js` 

# blueprinter-cli.conf.js
```
{
  root: String, // default: 'src'
  entities: [
    {
      name: String,
      aliases: String[],
      newDir: boolean, // should the directory be created for the new entity
      files: [
        {
          name: entityName => `${entityName}.component.js`,
          tplName?: String, // if not provided - generated file will be empty
        },
      ]
    }

  ]
}
```  

# Template Parser
##### Available variables $NAME.camelCase, $NAME.capitalCamelCase, $NAME.kebabCase or functions camelCase($NAME), capitalCamelCase($NAME), kebabCase($NAME)
```
import { abc } from 'abc';

require('kebabCase($NAME).less');
require('kebabCase($NAME).html');

class capitalCamelCase($NAME) {
  constructor() {
  }

  render() {
    return (
      <div></div>
    );
  }
}
```

#Examples
1. bpr generate component abc-def  
1'. bpr generate component ../path/to/component/abc-def
2. bpr generate module abc-def  
2'. bpr generate module ../path/to/component/abc-def
...

Errors:
- Unknown entity 'component'. Please make sure that you have registered this entity in your blueprinter-cli.conf.js file.
- 