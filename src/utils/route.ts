import * as pathToRegexp from 'path-to-regexp';

const tokens = pathToRegexp.parse('/ca/:username');

const tk = tokens[0];

type K = typeof tk;

const parse = <T extends string>(tmpl: string, ...arr: T[]) => {
  return {
    path: tmpl,
    params: arr.reduce(
      (mp, cur) => {
        mp[cur as string] = '';
        return mp;
      },
      {} as { [key in T]: string }
    )
  };
};

const a = {
  ...parse('/a/{}', 'username'),
  child: [
    {
      ...parse('{}', 'userid')
    },
    {
      ...parse('{}', 'age')
    }
  ]
};

type A = typeof a;

const c: A['child'][0]['params'] = { age: '' };

type AParams = typeof a;
