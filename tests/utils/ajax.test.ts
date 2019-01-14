import * as qs from 'qs'; // stringify
import * as fetch from 'jest-fetch-mock'; // for typescript

import { ajax, EventCenter } from '@src/utils';

const Error401 = { status: 401 };
const OK200 = { status: 200 };
const OK203 = { status: 203 };
const TestData = { code: 0, data: { id: 2 } };
const Data401 = { code: 401, message: 'OK' };
const api = '/api/get';
const params = { a: 2, b: 1 };

describe('utils/WrappedFetch work ok', () => {
  const spyBase = jest.spyOn(ajax, 'base');
  const statusError = jest.fn();

  beforeAll(() => {
    EventCenter.on('common.user.status', statusError);
  });

  afterAll(() => {
    EventCenter.off('common.user.status', statusError);
  });

  beforeEach(() => {
    fetch.resetMocks();
    statusError.mockReset();
  });

  it('ensureGetUrl ok', () => {
    expect(ajax.ensureGetUrl(api, params)).toEqual(`${api}?${qs.stringify(params)}`);
    expect(ajax.ensureGetUrl(`${api}?me=2`, params)).toEqual(`${api}?me=2&${qs.stringify(params)}`);
  });

  it('get ok', async () => {
    fetch.mockResponses(
      [JSON.stringify(TestData), Error401],
      [JSON.stringify(TestData), OK200],
      [JSON.stringify(TestData), OK203]
    );
    let res = await ajax.get(api, params);
    expect(res).toMatchObject(Data401);
    expect(spyBase).toBeCalledWith(ajax.ensureGetUrl(api, params), ajax.getConfig, undefined);
    spyBase.mockClear();

    res = await ajax.get(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(ajax.ensureGetUrl(api, params), ajax.getConfig, undefined);

    res = await ajax.get(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(ajax.ensureGetUrl(api, params), ajax.getConfig, undefined);
    expect(statusError).toBeCalledWith(Data401);
  });

  it('postJSON ok', async () => {
    fetch.mockResponses(
      [JSON.stringify(TestData), Error401],
      [JSON.stringify(TestData), OK200],
      [JSON.stringify(TestData), OK203]
    );
    let res = await ajax.postJSON(api, params);
    const config = {
      ...ajax.postJSONConfig,
      ...ajax.ensureJSONData(params)
    };
    expect(res).toMatchObject(Data401);
    expect(spyBase).toBeCalledWith(api, config, undefined);
    spyBase.mockClear();

    res = await ajax.postJSON(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);

    res = await ajax.postJSON(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);
  });

  it('post ok', async () => {
    fetch.mockResponses(
      [JSON.stringify(TestData), Error401],
      [JSON.stringify(TestData), OK200],
      [JSON.stringify(TestData), OK203]
    );
    const config = {
      ...ajax.postConfig,
      ...ajax.ensureFormData(params)
    };
    let res = await ajax.post(api, params);
    expect(res).toMatchObject(Data401);
    expect(spyBase).toBeCalledWith(api, config, undefined);
    spyBase.mockClear();

    res = await ajax.post(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);

    res = await ajax.post(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);
  });

  it('putJSON ok', async () => {
    fetch.mockResponses(
      [JSON.stringify(TestData), Error401],
      [JSON.stringify(TestData), OK200],
      [JSON.stringify(TestData), OK203]
    );
    let res = await ajax.putJSON(api, params);
    const config = {
      ...ajax.putJSONConfig,
      ...ajax.ensureJSONData(params)
    };
    expect(res).toMatchObject(Data401);
    expect(spyBase).toBeCalledWith(api, config, undefined);
    spyBase.mockClear();

    res = await ajax.putJSON(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);

    res = await ajax.putJSON(api, params);
    expect(res).toMatchObject(TestData);
    expect(spyBase).toBeCalledWith(api, config, undefined);
  });
});
