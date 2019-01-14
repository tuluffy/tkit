import { configure } from 'enzyme';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';

// jest --env=jsdom
// if (typeof document === 'undefined') {
//   require('jsdom-global/register');
// }

// @ts-ignore
global.fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });
